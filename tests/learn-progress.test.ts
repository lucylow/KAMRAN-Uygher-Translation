import { describe, expect, it } from "vitest";

import {
  DEFAULT_LEARN_PROGRESS,
  LEARN_PROGRESS_STORAGE_WARNING,
  getLearnProgressPersistenceMessage,
  parseLearnProgress,
  serializeLearnProgress,
} from "../lib/learn-progress";

describe("learn progress persistence", () => {
  it("uses the empty progress fallback for missing or malformed data", () => {
    expect(parseLearnProgress(null)).toEqual(DEFAULT_LEARN_PROGRESS);
    expect(parseLearnProgress("not-json")).toEqual(DEFAULT_LEARN_PROGRESS);
  });

  it("deduplicates and filters persisted cultural lesson ids", () => {
    expect(
      parseLearnProgress(
        JSON.stringify({
          completedCulturalIds: ["music", "music", 12, "cuisine"],
        }),
      ),
    ).toEqual({ completedCulturalIds: ["music", "cuisine"] });
  });

  it("serializes normalized progress for stable local storage", () => {
    expect(
      serializeLearnProgress({
        completedCulturalIds: ["music", "music", "cuisine"],
      }),
    ).toBe(JSON.stringify({ completedCulturalIds: ["music", "cuisine"] }));
  });

  it("returns an accessible warning only for degraded persistence", () => {
    expect(getLearnProgressPersistenceMessage(true)).toBe("");
    expect(getLearnProgressPersistenceMessage(false)).toBe(
      LEARN_PROGRESS_STORAGE_WARNING,
    );
  });
});
