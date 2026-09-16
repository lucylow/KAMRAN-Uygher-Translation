import type { SpeechProfile } from "./voice-settings";

export interface AvailableVoiceMetadata {
  identifier: string;
  language: string;
  name?: string;
  quality?: string;
}

export interface VoiceResolution {
  voiceIdentifier: string | null;
  matchedLanguage: string | null;
  usesFallback: boolean;
}

export function resolveVoiceIdentifier(profile: SpeechProfile, voices: AvailableVoiceMetadata[]): VoiceResolution {
  const normalizedLanguage = profile.language.toLowerCase();
  const exact = voices.find((voice) => voice.language.toLowerCase() === normalizedLanguage);
  const regional = voices.find((voice) => voice.language.toLowerCase().startsWith(`${normalizedLanguage}-`));
  const match = exact ?? regional;
  return {
    voiceIdentifier: match?.identifier ?? null,
    matchedLanguage: match?.language ?? null,
    usesFallback: profile.usesFallback || !match,
  };
}

export function getVoiceAvailabilityMessage(voiceCount: number, resolution: VoiceResolution): string {
  if (voiceCount === 0) return "Device voice list unavailable — using the system language fallback.";
  if (!resolution.voiceIdentifier) return "No matching device voice found — using the system language fallback.";
  return `Native voice ready · ${resolution.matchedLanguage}`;
}
