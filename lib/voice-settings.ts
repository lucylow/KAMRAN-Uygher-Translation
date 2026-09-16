import type { TranslationDirection } from "./mock-translation";

export type SpeechRate = 0.75 | 0.9 | 1.05;
export type VoiceProfileId = "standard" | "clarity";

export interface SpeechProfile {
  id: VoiceProfileId;
  language: string;
  label: string;
  supported: boolean;
  usesFallback: boolean;
}

export function getSpeechProfiles(direction: TranslationDirection): SpeechProfile[] {
  if (direction === "ug-zh") {
    return [
      { id: "standard", language: "zh-CN", label: "Chinese standard voice", supported: true, usesFallback: false },
      { id: "clarity", language: "zh-CN", label: "Chinese clarity voice", supported: true, usesFallback: false },
    ];
  }
  return [
    { id: "standard", language: "ar", label: "Arabic-script fallback voice", supported: true, usesFallback: true },
    { id: "clarity", language: "ar", label: "Arabic-script clarity voice", supported: true, usesFallback: true },
  ];
}

export function getSpeechProfile(direction: TranslationDirection, profileId: VoiceProfileId = "standard"): SpeechProfile {
  return getSpeechProfiles(direction).find((profile) => profile.id === profileId) ?? getSpeechProfiles(direction)[0];
}
