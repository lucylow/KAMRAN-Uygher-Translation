import type { VoiceProfileId, SpeechRate } from "./voice-settings";

export const VOICE_PREFERENCES_KEY = "kamran.voice-preferences.v1";

export interface VoicePreferences {
  speechRate: SpeechRate;
  profileId: VoiceProfileId;
}

export const DEFAULT_VOICE_PREFERENCES: VoicePreferences = { speechRate: 0.9, profileId: "standard" };
export const VOICE_PREFERENCES_STORAGE_WARNING =
  "Voice settings are available for this session, but device storage needs attention";

export function getVoicePreferencesPersistenceMessage(ok: boolean): string {
  return ok ? "" : VOICE_PREFERENCES_STORAGE_WARNING;
}

export function parseVoicePreferences(value: string | null): VoicePreferences {
  if (!value) return DEFAULT_VOICE_PREFERENCES;
  try {
    const parsed = JSON.parse(value) as Partial<VoicePreferences>;
    const speechRate = parsed.speechRate;
    const profileId = parsed.profileId;
    return {
      speechRate: speechRate === 0.75 || speechRate === 0.9 || speechRate === 1.05 ? speechRate : DEFAULT_VOICE_PREFERENCES.speechRate,
      profileId: profileId === "standard" || profileId === "clarity" ? profileId : DEFAULT_VOICE_PREFERENCES.profileId,
    };
  } catch {
    return DEFAULT_VOICE_PREFERENCES;
  }
}

export function serializeVoicePreferences(preferences: VoicePreferences): string {
  return JSON.stringify(preferences);
}
