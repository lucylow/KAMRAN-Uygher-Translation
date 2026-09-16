import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  readStoredJson,
  readStoredJsonWithStatus,
  writeStoredJson,
} from "@/lib/async-storage-json";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  getTranslationPersistenceScope,
  parseLocalSettings,
  type TranslationPersistenceScope,
} from "@/lib/app-settings";
import { filterPersistedTranslationEntries } from "@/lib/translation-persistence";
import type { TranslationOrigin } from "@/lib/translation-provenance";

export { filterPersistedTranslationEntries } from "@/lib/translation-persistence";

export interface TranslationEntry {
  id: string;
  source: string;
  result: string;
  direction: string;
  createdAt: number;
  isFavorite: boolean;
  persistenceScope?: TranslationPersistenceScope;
  origin?: TranslationOrigin;
}

type StoredTranslationEntry = Omit<
  TranslationEntry,
  "persistenceScope" | "origin"
> & {
  persistenceScope?: TranslationPersistenceScope;
  origin?: TranslationOrigin;
};

type PersistenceStatus = "restoring" | "saving" | "ready" | "degraded";

interface TranslationStoreValue {
  history: TranslationEntry[];
  hydrated: boolean;
  persistenceStatus: PersistenceStatus;
  persistenceError: string;
  saveHistoryEnabled: boolean;
  setSaveHistoryEnabled: (enabled: boolean) => void;
  addTranslation: (
    entry: Omit<TranslationEntry, "id" | "createdAt" | "isFavorite">,
  ) => void;
  toggleFavorite: (id: string) => void;
  removeTranslation: (id: string) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = "kamran.translation-state.v1";
const PERSISTENCE_ERROR =
  "Changes are kept for this session, but could not be saved on this device.";
const TranslationStoreContext = createContext<TranslationStoreValue | null>(
  null,
);

function isTranslationEntry(value: unknown): value is StoredTranslationEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<StoredTranslationEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.source === "string" &&
    typeof entry.result === "string" &&
    typeof entry.direction === "string" &&
    typeof entry.createdAt === "number" &&
    typeof entry.isFavorite === "boolean" &&
    (entry.persistenceScope === undefined ||
      entry.persistenceScope === "persistent") &&
    (entry.origin === undefined ||
      entry.origin === "primary" ||
      entry.origin === "fallback")
  );
}

export function TranslationStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [persistenceStatus, setPersistenceStatus] =
    useState<PersistenceStatus>("restoring");
  const [persistenceError, setPersistenceError] = useState("");
  const [saveHistoryEnabled, setSaveHistoryEnabled] = useState(
    DEFAULT_SETTINGS.saveHistory,
  );
  const persistenceWriteId = useRef(0);
  const persistenceQueue = useRef(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    void readStoredJson(SETTINGS_KEY, parseLocalSettings, DEFAULT_SETTINGS).then(
      (settings) => {
        if (mounted) setSaveHistoryEnabled(settings.saveHistory);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    readStoredJsonWithStatus<TranslationEntry[]>(
      STORAGE_KEY,
      (stored) => {
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed)
          ? parsed
              .filter(isTranslationEntry)
              .map((entry) => ({
                ...entry,
                persistenceScope: "persistent" as const,
                origin: entry.origin ?? "primary",
              }))
              .slice(0, 100)
          : [];
      },
      [],
    ).then((readResult) => {
      if (!mounted) return;
      setHistory(readResult.value);
      setHydrated(true);
      setPersistenceStatus(readResult.ok ? "ready" : "degraded");
      setPersistenceError(readResult.ok ? "" : PERSISTENCE_ERROR);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    const writeId = ++persistenceWriteId.current;
    setPersistenceStatus("saving");

    const queuedWrite = persistenceQueue.current.then(() =>
      writeStoredJson(STORAGE_KEY, filterPersistedTranslationEntries(history)),
    );
    persistenceQueue.current = queuedWrite.then(
      () => undefined,
      () => undefined,
    );

    void queuedWrite.then((writeResult) => {
      if (!active || writeId !== persistenceWriteId.current) return;
      if (writeResult.ok) {
        setPersistenceStatus("ready");
        setPersistenceError("");
      } else {
        setPersistenceStatus("degraded");
        setPersistenceError(PERSISTENCE_ERROR);
      }
    });
    return () => {
      active = false;
    };
  }, [history, hydrated]);

  const addTranslation = useCallback(
    (
      entry: Omit<
        TranslationEntry,
        "id" | "createdAt" | "isFavorite" | "persistenceScope"
      >,
    ) => {
      setHistory((current) => {
        const duplicate = current.find(
          (item) =>
            item.source === entry.source &&
            item.result === entry.result &&
            item.direction === entry.direction,
        );
        if (duplicate && Date.now() - duplicate.createdAt < 30000)
          return current;
        return [
          {
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: Date.now(),
            isFavorite: false,
            persistenceScope: getTranslationPersistenceScope(saveHistoryEnabled),
            origin: entry.origin ?? "primary",
          },
          ...current,
        ].slice(0, 100);
      });
    },
    [saveHistoryEnabled],
  );

  const toggleFavorite = useCallback((id: string) => {
    setHistory((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry,
      ),
    );
  }, []);

  const removeTranslation = useCallback((id: string) => {
    setHistory((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo(
    () => ({
      history,
      hydrated,
      persistenceStatus,
      persistenceError,
      saveHistoryEnabled,
      setSaveHistoryEnabled,
      addTranslation,
      toggleFavorite,
      removeTranslation,
      clearHistory,
    }),
    [
      history,
      hydrated,
      persistenceStatus,
      persistenceError,
      saveHistoryEnabled,
      setSaveHistoryEnabled,
      addTranslation,
      toggleFavorite,
      removeTranslation,
      clearHistory,
    ],
  );
  return (
    <TranslationStoreContext.Provider value={value}>
      {children}
    </TranslationStoreContext.Provider>
  );
}

export function useTranslationStore() {
  const value = useContext(TranslationStoreContext);
  if (!value)
    throw new Error(
      "useTranslationStore must be used inside TranslationStoreProvider",
    );
  return value;
}
