export type VoiceChannel = "idle" | "input" | "playback";

export interface VoiceChannelAction {
  next: VoiceChannel;
  stopInput: boolean;
  stopPlayback: boolean;
}

export function requestVoiceChannel(current: VoiceChannel, requested: Exclude<VoiceChannel, "idle">): VoiceChannelAction {
  if (requested === "input") {
    return { next: "input", stopInput: current === "input", stopPlayback: current === "playback" };
  }
  return { next: "playback", stopInput: current === "input", stopPlayback: current === "playback" };
}

export function resetVoiceChannel(): VoiceChannelAction {
  return { next: "idle", stopInput: true, stopPlayback: true };
}

export function getVoiceChannelMessage(channel: VoiceChannel): string {
  if (channel === "input") return "Voice input is active";
  if (channel === "playback") return "Translation playback is active";
  return "Voice controls are ready";
}
