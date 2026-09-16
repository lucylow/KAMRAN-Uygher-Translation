import { describe, expect, it } from "vitest";

import { getTranslationOriginMessage } from "../lib/translation-provenance";

describe("translation provenance", () => {
  it("labels recovered results for review before sharing", () => {
    expect(getTranslationOriginMessage("fallback")).toBe(
      "Fallback result · Review before sharing",
    );
  });

  it("keeps primary and legacy entries visually neutral", () => {
    expect(getTranslationOriginMessage("primary")).toBe("");
    expect(getTranslationOriginMessage()).toBe("");
  });
});
