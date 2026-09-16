export type TranslationPersistenceScoped = {
  persistenceScope?: "persistent" | "session";
};

export function filterPersistedTranslationEntries<
  T extends TranslationPersistenceScoped,
>(entries: T[]): T[] {
  return entries
    .filter((entry) => entry.persistenceScope !== "session")
    .map((entry) => ({ ...entry }));
}
