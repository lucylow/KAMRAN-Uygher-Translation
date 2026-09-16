import { describe, expect, it } from "vitest";

import {
  DEFAULT_VOICE_PREFERENCES,
  VOICE_PREFERENCES_STORAGE_WARNING,
  getVoicePreferencesPersistenceMessage,
  parseVoicePreferences,
  serializeVoicePreferences,
} from "../lib/voice-preferences";

describe("voice preference persistence", () => {
  it("uses defaults for missing or malformed persisted preferences", () => {
    expect(parseVoicePreferences(null)).toEqual(DEFAULT_VOICE_PREFERENCES);
    expect(parseVoicePreferences("not-json")).toEqual(DEFAULT_VOICE_PREFERENCES);
  });

  it("normalizes unsupported speech rates and profiles", () => {
    expect(
      parseVoicePreferences(
        JSON.stringify({ speechRate: 4, profileId: "unknown" }),
      ),
    ).toEqual(DEFAULT_VOICE_PREFERENCES);
  });

  it("serializes selected voice preferences without changing their values", () => {
    expect(
      serializeVoicePreferences({ speechRate: 1.05, profileId: "clarity" }),
    ).toBe(JSON.stringify({ speechRate: 1.05, profileId: "clarity" }));
  });

  it("returns an accessible warning only when persistence is degraded", () => {
    expect(getVoicePreferencesPersistenceMessage(true)).toBe("");
    expect(getVoicePreferencesPersistenceMessage(false)).toBe(
      VOICE_PREFERENCES_STORAGE_WARNING,
    );
  });
});
