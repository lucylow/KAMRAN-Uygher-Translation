import { describe, expect, it } from "vitest";

import {
  getPracticeRouteParams,
  selectPracticeEntry,
} from "../lib/learn-practice";
import type { TranslationEntry } from "../lib/translation-store";

function entry(overrides: Partial<TranslationEntry> = {}): TranslationEntry {
  return {
    id: "entry-1",
    source: "سالام",
    result: "你好",
    direction: "ug-zh",
    createdAt: 1,
    isFavorite: false,
    ...overrides,
  };
}

describe("learn practice flow", () => {
  it("prefers a favorite over the newest non-favorite entry", () => {
    const newest = entry({ id: "newest", source: "رەھمەت" });
    const favorite = entry({
      id: "favorite",
      source: "خوش كەلدىڭىز",
      isFavorite: true,
    });

    expect(selectPracticeEntry([newest, favorite])).toEqual(favorite);
  });

  it("falls back to the newest entry when no favorite exists", () => {
    const newest = entry({ id: "newest" });
    const older = entry({ id: "older", createdAt: 0 });

    expect(selectPracticeEntry([newest, older])).toEqual(newest);
  });

  it("returns no route payload for an empty phrasebook", () => {
    expect(selectPracticeEntry([])).toBeNull();
    expect(getPracticeRouteParams(null)).toBeNull();
  });

  it("normalizes saved directions and preserves the source phrase", () => {
    expect(
      getPracticeRouteParams(
        entry({ source: "你好", direction: "zh-ug" }),
      ),
    ).toEqual({
      practiceSource: "你好",
      practiceDirection: "zh-ug",
    });

    expect(
      getPracticeRouteParams(entry({ direction: "unexpected-direction" })),
    ).toEqual({
      practiceSource: "سالام",
      practiceDirection: "ug-zh",
    });
  });
});
