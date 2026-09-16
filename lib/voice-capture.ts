export type CaptureLevel = "quiet" | "steady" | "strong";

export interface CaptureLevelMetadata {
  level: CaptureLevel;
  normalized: number;
  label: string;
  guidance: string;
}

export function assessCaptureLevel(amplitude: number): CaptureLevelMetadata {
  const normalized = Math.max(0, Math.min(1, amplitude));
  if (normalized < 0.25) return { level: "quiet", normalized, label: "Quiet signal", guidance: "Move closer to the microphone or speak a little louder." };
  if (normalized < 0.75) return { level: "steady", normalized, label: "Steady signal", guidance: "Your voice level looks good." };
  return { level: "strong", normalized, label: "Strong signal", guidance: "Keep a little distance from the microphone." };
}

export function getVoiceReviewGuidance(confidence: number): string {
  if (confidence >= 0.9) return "Recognized clearly. You can translate now.";
  if (confidence >= 0.78) return "Please review the recognized phrase before translating.";
  return "Recognition is uncertain. Try recording again before translating.";
}
