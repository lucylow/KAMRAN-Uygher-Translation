import { describe, expect, it } from "vitest";

import { filterPersistedTranslationEntries } from "../lib/translation-persistence";

type TranslationEntry = {
  id: string;
  source: string;
  result: string;
  direction: string;
  createdAt: number;
  isFavorite: boolean;
  persistenceScope?: "persistent" | "session";
};

function entry(overrides: Partial<TranslationEntry> = {}): TranslationEntry {
  return {
    id: "entry-1",
    source: "ياخشىمۇسىز",
    result: "你好",
    direction: "Uyghur → Chinese",
    createdAt: 1,
    isFavorite: false,
    ...overrides,
  };
}

describe("translation persistence scope", () => {
  it("excludes session-only entries while preserving persistent and legacy entries", () => {
    const persistent = entry({ id: "persistent", persistenceScope: "persistent" });
    const session = entry({ id: "session", persistenceScope: "session" });
    const legacy = entry({ id: "legacy" });

    expect(filterPersistedTranslationEntries([persistent, session, legacy])).toEqual([
      persistent,
      legacy,
    ]);
  });

  it("does not mutate the in-memory history entries or array", () => {
    const history = [
      entry({ id: "session", persistenceScope: "session" }),
      entry({ id: "persistent", persistenceScope: "persistent" }),
    ];

    const persisted = filterPersistedTranslationEntries(history);

    expect(persisted).not.toBe(history);
    expect(persisted[0]).not.toBe(history[1]);
    expect(history).toHaveLength(2);
    expect(history[0].persistenceScope).toBe("session");
  });
});
