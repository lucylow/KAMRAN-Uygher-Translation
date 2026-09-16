export const LEARN_PROGRESS_KEY = "kamran.learn-progress.v1";

export interface LearnProgress {
  completedCulturalIds: string[];
}

export const DEFAULT_LEARN_PROGRESS: LearnProgress = { completedCulturalIds: [] };
export const LEARN_PROGRESS_STORAGE_WARNING =
  "Progress is available for this session, but device storage needs attention";

export function getLearnProgressPersistenceMessage(ok: boolean): string {
  return ok ? "" : LEARN_PROGRESS_STORAGE_WARNING;
}

export function parseLearnProgress(value: string | null): LearnProgress {
  if (!value) return DEFAULT_LEARN_PROGRESS;
  try {
    const parsed = JSON.parse(value) as Partial<LearnProgress>;
    const ids = Array.isArray(parsed.completedCulturalIds)
      ? parsed.completedCulturalIds.filter((id): id is string => typeof id === "string")
      : [];
    return { completedCulturalIds: Array.from(new Set(ids)) };
  } catch {
    return DEFAULT_LEARN_PROGRESS;
  }
}

export function serializeLearnProgress(progress: LearnProgress): string {
  return JSON.stringify({ completedCulturalIds: Array.from(new Set(progress.completedCulturalIds)) });
}
