import type { TranslationEntry } from "@/lib/translation-store";

export type PracticeRouteParams = {
  practiceSource: string;
  practiceDirection: "ug-zh" | "zh-ug";
};

/**
 * Prefer a saved favorite for quick review, then fall back to the newest entry.
 * Returns null when the phrasebook is empty so callers can choose a truthful
 * first-translation experience instead of inventing sample data.
 */
export function selectPracticeEntry(
  history: TranslationEntry[],
): TranslationEntry | null {
  return history.find((entry) => entry.isFavorite) ?? history[0] ?? null;
}

export function getPracticeRouteParams(
  entry: TranslationEntry | null,
): PracticeRouteParams | null {
  if (!entry) return null;

  return {
    practiceSource: entry.source,
    practiceDirection: entry.direction === "zh-ug" ? "zh-ug" : "ug-zh",
  };
}
