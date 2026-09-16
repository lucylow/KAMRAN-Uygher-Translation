import { describe, expect, it, vi } from "vitest";

import { getMockOCRFallback } from "../lib/mock-ocr";
import {
  getMockTranslationFallback,
  type TranslationDirection,
} from "../lib/mock-translation";
import { getMockVoiceFallback } from "../lib/mock-voice";
import {
  getRecoveryFallbackMessage,
  withRecoveryFallback,
} from "../lib/recovery-fallback";

const directions: TranslationDirection[] = ["ug-zh", "zh-ug"];

describe("recovery fallbacks", () => {
  it("keeps successful primary responses untouched and does not call fallback", async () => {
    const fallback = vi.fn(() => "fallback");

    await expect(
      withRecoveryFallback(async () => "primary", fallback),
    ).resolves.toEqual({
      value: "primary",
      usedFallback: false,
      reason: null,
    });
    expect(fallback).not.toHaveBeenCalled();
  });

  it("uses an offline fallback for network failures", async () => {
    await expect(
      withRecoveryFallback(
        async () => {
          throw new Error("request timed out");
        },
        () => "offline-result",
      ),
    ).resolves.toEqual({
      value: "offline-result",
      usedFallback: true,
      reason: "offline",
    });
  });

  it("uses a service fallback for non-network failures", async () => {
    await expect(
      withRecoveryFallback(
        async () => {
          throw new Error("service returned invalid data");
        },
        () => "service-result",
      ),
    ).resolves.toMatchObject({
      value: "service-result",
      usedFallback: true,
      reason: "service",
    });
  });

  it("does not convert cancellation into fallback content", async () => {
    const abort = new Error("cancelled");
    abort.name = "AbortError";
    const fallback = vi.fn(() => "should-not-run");

    await expect(
      withRecoveryFallback(
        async () => {
          throw abort;
        },
        fallback,
      ),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(fallback).not.toHaveBeenCalled();
  });

  it("provides explicit feature-specific fallback copy", () => {
    expect(getRecoveryFallbackMessage("translation", "offline")).toContain(
      "Offline fallback",
    );
    expect(getRecoveryFallbackMessage("voice", "service")).toContain(
      "voice input",
    );
    expect(getRecoveryFallbackMessage("ocr", "service")).toContain("OCR");
  });

  it("provides deterministic direction-aware fallback mock data", () => {
    for (const direction of directions) {
      expect(getMockTranslationFallback("unknown", direction)).toMatchObject({
        engine: "KAMRAN AI (fallback)",
        latencyMs: 0,
      });
      expect(getMockVoiceFallback(direction)).toMatchObject({
        usedFallback: true,
        state: "complete",
      });
    }
    expect(getMockOCRFallback()).toMatchObject({
      engine: "KAMRAN OCR (fallback)",
      text: "谢谢你的帮助",
    });
  });
});
