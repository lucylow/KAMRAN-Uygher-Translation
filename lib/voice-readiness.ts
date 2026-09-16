export type VoiceReadiness = "checking" | "ready" | "permission-required" | "unavailable";

export interface VoiceReadinessResult {
  state: Exclude<VoiceReadiness, "checking">;
  engineName: string;
  supportsUyghur: boolean;
  supportsChinese: boolean;
  requiresPermission: boolean;
}

export function getVoiceReadinessMessage(readiness: VoiceReadiness, requiresPermission = true): string {
  if (readiness === "checking") return "Checking microphone readiness…";
  if (readiness === "ready" && requiresPermission) return "Microphone permission will be requested on the first native recording.";
  if (readiness === "ready") return "Microphone ready.";
  return "Microphone unavailable. Check device permissions and try again.";
}

export async function checkMockVoiceReadiness(): Promise<VoiceReadinessResult> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return {
    state: "ready",
    engineName: "KAMRAN Voice (mock)",
    supportsUyghur: true,
    supportsChinese: true,
    requiresPermission: true,
  };
}
