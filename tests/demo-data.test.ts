import { describe, expect, it } from "vitest";
import { DEMO_TRANSLATIONS } from "../lib/demo-data";

describe("KAMRAN demo data", () => {
  it("contains stable, non-empty sample phrases for both directions", () => {
    expect(DEMO_TRANSLATIONS).toHaveLength(3);
    expect(new Set(DEMO_TRANSLATIONS.map((entry) => entry.direction))).toEqual(
      new Set(["Uyghur → Chinese", "Chinese → Uyghur"]),
    );
    expect(
      DEMO_TRANSLATIONS.every(
        (entry) =>
          entry.source.trim().length > 0 && entry.result.trim().length > 0,
      ),
    ).toBe(true);
  });
});
