export const SETTINGS_KEY = "kamran-settings-v1";

export type LocalSettings = {
  darkMode: boolean;
  autoDetect: boolean;
  rtlLayout: boolean;
  saveHistory: boolean;
  offlineMode: boolean;
  demoMode: boolean;
};

export const SETTINGS_STORAGE_WARNING =
  "Settings are available for this session, but device storage needs attention";
export const SETTINGS_RETRY_LABEL = "Retry saving settings";
export const SETTINGS_RETRYING_LABEL = "Retrying settings save…";
export const SETTINGS_SAVED_MESSAGE = "Settings saved on this device";
export const SETTINGS_SESSION_ONLY_MESSAGE =
  "Setting is still available for this session, but could not be saved";

export function getSettingsPersistenceMessage(ok: boolean): string {
  return ok ? "" : SETTINGS_STORAGE_WARNING;
}

export function getSettingsRetryLabel(retrying: boolean): string {
  return retrying ? SETTINGS_RETRYING_LABEL : SETTINGS_RETRY_LABEL;
}

export function getSettingsSaveFeedback(ok: boolean): {
  message: string;
  tone: "success" | "error";
} {
  return ok
    ? { message: SETTINGS_SAVED_MESSAGE, tone: "success" }
    : { message: SETTINGS_SESSION_ONLY_MESSAGE, tone: "error" };
}

export type TranslationPersistenceScope = "persistent" | "session";

export function getTranslationPersistenceScope(
  saveHistory: boolean,
): TranslationPersistenceScope {
  return saveHistory ? "persistent" : "session";
}

export function shouldPersistTranslationHistory(saveHistory: boolean): boolean {
  return getTranslationPersistenceScope(saveHistory) === "persistent";
}

export function getHistoryPersistenceModeMessage(
  saveHistory: boolean,
): string {
  return saveHistory
    ? ""
    : "Session only · New translations will not be saved to History";
}

export const DEFAULT_SETTINGS: LocalSettings = {
  darkMode: false,
  autoDetect: false,
  rtlLayout: true,
  saveHistory: true,
  offlineMode: true,
  demoMode: false,
};

export function parseLocalSettings(value: string | null): LocalSettings {
  if (!value) return DEFAULT_SETTINGS;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return DEFAULT_SETTINGS;
    const candidate = parsed as Partial<LocalSettings>;
    return {
      darkMode:
        typeof candidate.darkMode === "boolean"
          ? candidate.darkMode
          : DEFAULT_SETTINGS.darkMode,
      autoDetect:
        typeof candidate.autoDetect === "boolean"
          ? candidate.autoDetect
          : DEFAULT_SETTINGS.autoDetect,
      rtlLayout:
        typeof candidate.rtlLayout === "boolean"
          ? candidate.rtlLayout
          : DEFAULT_SETTINGS.rtlLayout,
      saveHistory:
        typeof candidate.saveHistory === "boolean"
          ? candidate.saveHistory
          : DEFAULT_SETTINGS.saveHistory,
      offlineMode:
        typeof candidate.offlineMode === "boolean"
          ? candidate.offlineMode
          : DEFAULT_SETTINGS.offlineMode,
      demoMode:
        typeof candidate.demoMode === "boolean"
          ? candidate.demoMode
          : DEFAULT_SETTINGS.demoMode,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function serializeLocalSettings(settings: LocalSettings): string {
  return JSON.stringify(settings);
}
