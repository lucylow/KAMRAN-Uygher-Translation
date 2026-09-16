import { describe, expect, it } from "vitest";
import { getOCRConfidenceLabel, mockRecognizeText } from "../lib/mock-ocr";
import { mockTranslate } from "../lib/mock-translation";
import { MOCK_VOICE_ENGINE, mockCaptureVoice } from "../lib/mock-voice";
import {
  checkMockVoiceReadiness,
  getVoiceReadinessMessage,
} from "../lib/voice-readiness";
import { getSpeechProfile, getSpeechProfiles } from "../lib/voice-settings";
import {
  getVoiceAvailabilityMessage,
  resolveVoiceIdentifier,
} from "../lib/voice-availability";
import {
  getVoiceAccessibilityLabel,
  getVoiceLifecycleMessage,
  transitionVoiceLifecycle,
} from "../lib/voice-lifecycle";
import {
  getVoiceChannelMessage,
  requestVoiceChannel,
  resetVoiceChannel,
} from "../lib/voice-channel";
import {
  canStartVoiceCapture,
  getVoiceHandoffMessage,
  shouldInvalidatePlayback,
} from "../lib/voice-handoff";
import { assessVoiceQuality, getVoiceRetryLabel } from "../lib/voice-quality";
import {
  assessCaptureLevel,
  getVoiceReviewGuidance,
} from "../lib/voice-capture";
import {
  getVoiceReviewActionLabel,
  requiresVoiceReview,
} from "../lib/voice-review";
import {
  DEFAULT_VOICE_PREFERENCES,
  parseVoicePreferences,
  serializeVoicePreferences,
} from "../lib/voice-preferences";
import {
  getOCRInputOption,
  getOCRReadinessMessage,
  getOCRResultStatusMessage,
  getOCRReviewMetadata,
  getOCRSourcePreviewLabel,
  validateOCRText,
} from "../lib/ocr-input";
import { matchesHistoryQuery } from "../lib/history-search";
import {
  createAbortError,
  getErrorMessage,
  isAbortError,
  isLikelyOfflineError,
} from "../lib/error-utils";
import {
  getDefaultDialect,
  getDialectFallbackMessage,
  getDialectsForDirection,
} from "../lib/dialect-config";
import {
  beginLatestRequest,
  invalidateLatestRequest,
  isLatestRequest,
} from "../lib/request-guard";
import {
  formatTranslationResultStatus,
  getTranslationDirectionLabel,
} from "../lib/translation-presentation";

describe("KAMRAN translation presentation", () => {
  it("formats direction and result metadata consistently", () => {
    expect(getTranslationDirectionLabel("ug-zh")).toBe("Uyghur → Chinese");
    expect(getTranslationDirectionLabel("zh-ug")).toBe("Chinese → Uyghur");
    expect(
      formatTranslationResultStatus({
        translatedText: "你好",
        confidence: 0.98,
        engine: "KAMRAN AI (mock)",
        latencyMs: 42,
      }),
    ).toBe("KAMRAN AI (mock) · 42ms · 98% confidence");
  });
});

describe("KAMRAN request lifecycle guard", () => {
  it("accepts only the newest request and invalidates stale work", () => {
    const requestId = { current: 0 };
    const first = beginLatestRequest(requestId);
    const second = beginLatestRequest(requestId);

    expect(isLatestRequest(requestId, first)).toBe(false);
    expect(isLatestRequest(requestId, second)).toBe(true);

    invalidateLatestRequest(requestId);
    expect(isLatestRequest(requestId, second)).toBe(false);
  });
});

describe("KAMRAN dialect-aware language selection", () => {
  it("returns direction-aware defaults and deterministic options", () => {
    expect(getDefaultDialect("ug-zh").id).toBe("ug_urumqi");
    expect(getDefaultDialect("zh-ug").id).toBe("zh_mandarin");
    expect(getDialectsForDirection("ug-zh").map((item) => item.id)).toContain(
      "ug_kashgar",
    );
    expect(getDialectFallbackMessage(getDefaultDialect("zh-ug"))).toContain(
      "Mandarin Chinese",
    );
  });
});

describe("KAMRAN mock translation service", () => {
  it("translates a known Uyghur phrase with high confidence", async () => {
    const result = await mockTranslate("  ياخشىمۇسىز  ", "ug-zh");
    expect(result.translatedText).toBe("你好");
    expect(result.confidence).toBe(0.98);
    expect(result.engine).toBe("KAMRAN AI (mock)");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("returns a safe fallback for an unknown phrase", async () => {
    const result = await mockTranslate("unknown phrase", "zh-ug");
    expect(result.translatedText).toContain("ياخشىمۇسىز");
    expect(result.confidence).toBe(0.91);
  });
});

describe("KAMRAN voice readiness", () => {
  it("provides actionable readiness guidance", () => {
    expect(getVoiceReadinessMessage("checking")).toContain("Checking");
    expect(getVoiceReadinessMessage("ready", true)).toContain("permission");
    expect(getVoiceReadinessMessage("unavailable")).toContain("unavailable");
  });
});

describe("KAMRAN voice preferences", () => {
  it("round-trips supported speech rates and rejects corrupt state", () => {
    const serialized = serializeVoicePreferences({
      speechRate: 1.05,
      profileId: "clarity",
    });
    expect(parseVoicePreferences(serialized).speechRate).toBe(1.05);
    expect(parseVoicePreferences("not-json")).toEqual(
      DEFAULT_VOICE_PREFERENCES,
    );
    expect(
      parseVoicePreferences(JSON.stringify({ speechRate: 2 })).speechRate,
    ).toBe(DEFAULT_VOICE_PREFERENCES.speechRate);
  });
});

describe("KAMRAN mock voice service", () => {
  it("captures a direction-aware phrase with engine metadata", async () => {
    const result = await mockCaptureVoice("zh-ug");
    expect(result.text).toBe("你好");
    expect(result.engine).toBe(MOCK_VOICE_ENGINE.id);
    expect(result.state).toBe("complete");
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it("supports cancellation without resolving a stale capture", async () => {
    const controller = new AbortController();
    const capture = mockCaptureVoice("ug-zh", controller.signal);
    controller.abort();
    await expect(capture).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("KAMRAN voice readiness", () => {
  it("reports a ready offline-capable mock engine", async () => {
    const readiness = await checkMockVoiceReadiness();
    expect(readiness.state).toBe("ready");
    expect(readiness.engineName).toBe("KAMRAN Voice (mock)");
    expect(readiness.supportsUyghur).toBe(true);
    expect(readiness.requiresPermission).toBe(true);
  });
});

describe("KAMRAN speech profiles", () => {
  it("uses the native Chinese profile for Uyghur-to-Chinese playback", () => {
    expect(getSpeechProfile("ug-zh")).toMatchObject({
      language: "zh-CN",
      supported: true,
      usesFallback: false,
    });
  });

  it("uses an Arabic-script fallback profile for Uyghur playback", () => {
    expect(getSpeechProfile("zh-ug")).toMatchObject({
      language: "ar",
      supported: true,
      usesFallback: true,
    });
  });

  it("offers stable standard and clarity choices for each direction", () => {
    expect(getSpeechProfiles("ug-zh").map((profile) => profile.id)).toEqual([
      "standard",
      "clarity",
    ]);
    expect(getSpeechProfiles("zh-ug").map((profile) => profile.id)).toEqual([
      "standard",
      "clarity",
    ]);
    expect(getSpeechProfile("ug-zh", "clarity").label).toContain("clarity");
  });

  it("resolves exact and regional native voices, then explains fallback", () => {
    const profile = getSpeechProfile("ug-zh");
    expect(
      resolveVoiceIdentifier(profile, [
        { identifier: "zh-cn-1", language: "zh-CN" },
      ]),
    ).toMatchObject({
      voiceIdentifier: "zh-cn-1",
      matchedLanguage: "zh-CN",
      usesFallback: false,
    });
    expect(
      resolveVoiceIdentifier(profile, [
        { identifier: "zh-hk-1", language: "zh-HK" },
      ]).voiceIdentifier,
    ).toBeNull();
    expect(
      getVoiceAvailabilityMessage(0, {
        voiceIdentifier: null,
        matchedLanguage: null,
        usesFallback: true,
      }),
    ).toContain("unavailable");
  });

  it("keeps recording transitions deterministic and accessible", () => {
    expect(transitionVoiceLifecycle("idle", "prepare")).toBe("preparing");
    expect(transitionVoiceLifecycle("preparing", "ready")).toBe("listening");
    expect(transitionVoiceLifecycle("listening", "capture")).toBe("processing");
    expect(transitionVoiceLifecycle("processing", "complete")).toBe("complete");
    expect(transitionVoiceLifecycle("listening", "interrupt")).toBe(
      "interrupted",
    );
    expect(getVoiceLifecycleMessage("listening", 3)).toContain("3s");
    expect(getVoiceAccessibilityLabel("error")).toBe("Retry voice input");
  });

  it("coordinates input and playback without overlap", () => {
    expect(requestVoiceChannel("playback", "input")).toMatchObject({
      next: "input",
      stopPlayback: true,
    });
    expect(requestVoiceChannel("input", "playback")).toMatchObject({
      next: "playback",
      stopInput: true,
    });
    expect(resetVoiceChannel()).toEqual({
      next: "idle",
      stopInput: true,
      stopPlayback: true,
    });
    expect(getVoiceChannelMessage("idle")).toContain("ready");
  });

  it("keeps recorder readiness and playback invalidation deterministic", () => {
    expect(canStartVoiceCapture("ready")).toBe(true);
    expect(canStartVoiceCapture("permission-required")).toBe(false);
    expect(getVoiceHandoffMessage("handoff")).toContain("ready to translate");
    expect(shouldInvalidatePlayback("你好", "你好", "ug-zh", "ug-zh")).toBe(
      false,
    );
    expect(shouldInvalidatePlayback("你好", "你好", "ug-zh", "zh-ug")).toBe(
      true,
    );
  });

  it("classifies capture quality with actionable guidance", () => {
    expect(assessVoiceQuality(0.94).quality).toBe("clear");
    expect(assessVoiceQuality(0.82).guidance).toContain("Check");
    expect(assessVoiceQuality(0.62).quality).toBe("retry");
    expect(getVoiceRetryLabel("retry")).toBe("Try again");
  });

  it("classifies live capture levels and review guidance", () => {
    expect(assessCaptureLevel(0.1).level).toBe("quiet");
    expect(assessCaptureLevel(0.5).level).toBe("steady");
    expect(assessCaptureLevel(1.2).normalized).toBe(1);
    expect(getVoiceReviewGuidance(0.95)).toContain("translate now");
    expect(getVoiceReviewGuidance(0.7)).toContain("Try recording again");
  });

  it("keeps voice review actions deterministic", () => {
    expect(requiresVoiceReview("clear")).toBe(false);
    expect(requiresVoiceReview("review")).toBe(true);
    expect(getVoiceReviewActionLabel("rerecord", "retry")).toBe("Try again");
    expect(getVoiceReviewActionLabel("confirm", "review")).toContain("Confirm");
  });
});

describe("KAMRAN History search", () => {
  const entry = {
    id: "history-1",
    direction: "Uyghur → Chinese",
    source: "ياخشىمۇسىز",
    result: "你好",
    createdAt: 1,
    isFavorite: false,
  };

  it("matches source, result, direction, and empty queries", () => {
    expect(matchesHistoryQuery(entry, "ياخشى")).toBe(true);
    expect(matchesHistoryQuery(entry, "你好")).toBe(true);
    expect(matchesHistoryQuery(entry, "chinese")).toBe(true);
    expect(matchesHistoryQuery(entry, "  ")).toBe(true);
    expect(matchesHistoryQuery(entry, "missing phrase")).toBe(false);
  });
});

describe("KAMRAN OCR confidence", () => {
  it("classifies confidence into clear review labels", () => {
    expect(getOCRConfidenceLabel(0.94)).toBe("high");
    expect(getOCRConfidenceLabel(0.82)).toBe("medium");
    expect(getOCRConfidenceLabel(0.61)).toBe("low");
  });
});

describe("KAMRAN OCR input sources", () => {
  it("provides distinct camera and gallery guidance", () => {
    expect(getOCRInputOption("camera")).toMatchObject({
      label: "Use camera",
      requiresPermission: true,
    });
    expect(getOCRInputOption("gallery")).toMatchObject({
      label: "Choose image",
      requiresPermission: true,
    });
    expect(getOCRSourcePreviewLabel("camera")).toBe(
      "Live camera preview ready",
    );
    expect(getOCRSourcePreviewLabel("gallery")).toBe(
      "Gallery image preview ready",
    );
    expect(validateOCRText("  ")).toMatchObject({ valid: false });
    expect(validateOCRText("谢谢")).toMatchObject({ valid: true });
    expect(getOCRReviewMetadata("第一行\nSecond line")).toMatchObject({
      characterCount: 15,
      lineCount: 2,
      isMultiLine: true,
    });
    expect(getOCRReadinessMessage("camera")).toContain("Camera permission");
    expect(getOCRResultStatusMessage("copied")).toContain("copied");
    expect(getOCRResultStatusMessage("saved")).toContain("saved");
  });
});

describe("KAMRAN mock OCR service", () => {
  it("supports cancellation without resolving stale recognition", async () => {
    const controller = new AbortController();
    const recognition = mockRecognizeText(controller.signal);
    controller.abort();
    await expect(recognition).rejects.toMatchObject({ name: "AbortError" });
  });

  it("returns recognized text with preprocessing metadata", async () => {
    const result = await mockRecognizeText();
    expect(result.text).toBe("谢谢你的帮助");
    expect(result.engine).toBe("KAMRAN OCR (mock)");
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.preprocessing).toEqual([
      "Downsampled",
      "Contrast enhanced",
      "Arabic/Chinese script detection",
    ]);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

describe("KAMRAN error handling", () => {
  it("recognizes abort errors across browser and native-style shapes", () => {
    expect(isAbortError(createAbortError())).toBe(true);
    expect(isAbortError({ name: "AbortError" })).toBe(true);
    expect(isAbortError({ code: "ABORT_ERR" })).toBe(true);
    expect(isAbortError(new Error("ordinary failure"))).toBe(false);
  });

  it("returns safe messages for unknown failures and recognizes offline errors", () => {
    expect(getErrorMessage(new Error("Microphone unavailable"))).toBe(
      "Microphone unavailable",
    );
    expect(getErrorMessage({ message: "Network timeout" })).toBe(
      "Network timeout",
    );
    expect(getErrorMessage(null, "Try again later")).toBe("Try again later");
    expect(isLikelyOfflineError(new Error("Network request timed out"))).toBe(
      true,
    );
    expect(isLikelyOfflineError(new Error("Invalid translation input"))).toBe(
      false,
    );
  });

  it("cancels an in-flight translation without waiting for the service delay", async () => {
    const controller = new AbortController();
    const request = mockTranslate("你好", "zh-ug", controller.signal);
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
});

describe("KAMRAN native-operation cancellation", () => {
  it("rejects immediately when voice capture starts with an aborted signal", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      mockCaptureVoice("ug-zh", controller.signal),
    ).rejects.toMatchObject({
      name: "AbortError",
    });
  });

  it("rejects immediately when OCR starts with an aborted signal", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(mockRecognizeText(controller.signal)).rejects.toMatchObject({
      name: "AbortError",
    });
  });
});
