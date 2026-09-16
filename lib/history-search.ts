import type { TranslationEntry } from "./translation-store";

export function matchesHistoryQuery(entry: TranslationEntry, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  return [entry.source, entry.result, entry.direction]
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
}
