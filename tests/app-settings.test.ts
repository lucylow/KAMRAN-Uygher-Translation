import { describe, expect, it } from "vitest";

import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_WARNING,
  getHistoryPersistenceModeMessage,
  getSettingsPersistenceMessage,
  getSettingsRetryLabel,
  getSettingsSaveFeedback,
  getTranslationPersistenceScope,
  parseLocalSettings,
  serializeLocalSettings,
  shouldPersistTranslationHistory,
} from "../lib/app-settings";

describe("local app settings", () => {
  it("uses safe defaults for missing or malformed settings", () => {
    expect(parseLocalSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseLocalSettings("not-json")).toEqual(DEFAULT_SETTINGS);
    expect(parseLocalSettings(JSON.stringify({ saveHistory: "yes" }))).toEqual(
      DEFAULT_SETTINGS,
    );
  });

  it("normalizes valid boolean settings and preserves supported values", () => {
    expect(
      parseLocalSettings(
        JSON.stringify({
          darkMode: true,
          autoDetect: true,
          rtlLayout: false,
          saveHistory: false,
          offlineMode: false,
          demoMode: true,
        }),
      ),
    ).toEqual({
      darkMode: true,
      autoDetect: true,
      rtlLayout: false,
      saveHistory: false,
      offlineMode: false,
      demoMode: true,
    });
  });

  it("serializes settings deterministically", () => {
    expect(serializeLocalSettings(DEFAULT_SETTINGS)).toBe(
      JSON.stringify(DEFAULT_SETTINGS),
    );
  });

  it("only persists new translations when history saving is enabled", () => {
    expect(shouldPersistTranslationHistory(true)).toBe(true);
    expect(shouldPersistTranslationHistory(false)).toBe(false);
    expect(getTranslationPersistenceScope(true)).toBe("persistent");
    expect(getTranslationPersistenceScope(false)).toBe("session");
  });

  it("returns an accessible warning only for degraded settings persistence", () => {
    expect(getSettingsPersistenceMessage(true)).toBe("");
    expect(getSettingsPersistenceMessage(false)).toBe(SETTINGS_STORAGE_WARNING);
  });

  it("shows session-only history mode only when history saving is disabled", () => {
    expect(getHistoryPersistenceModeMessage(true)).toBe("");
    expect(getHistoryPersistenceModeMessage(false)).toBe(
      "Session only · New translations will not be saved to History",
    );
  });

  it("uses distinct labels while retrying and when ready to retry", () => {
    expect(getSettingsRetryLabel(false)).toBe("Retry saving settings");
    expect(getSettingsRetryLabel(true)).toBe("Retrying settings save…");
  });

  it("keeps save feedback explicit for success and session-only recovery", () => {
    expect(getSettingsSaveFeedback(true)).toEqual({
      message: "Settings saved on this device",
      tone: "success",
    });
    expect(getSettingsSaveFeedback(false)).toEqual({
      message: "Setting is still available for this session, but could not be saved",
      tone: "error",
    });
  });
});
