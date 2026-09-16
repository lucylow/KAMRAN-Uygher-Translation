import { StyleSheet, Text } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import {
  getVoiceReadinessMessage,
  type VoiceReadiness,
} from "@/lib/voice-readiness";
import {
  getVoiceLifecycleMessage,
  type VoiceLifecycleState,
} from "@/lib/voice-lifecycle";
import { getVoiceChannelMessage, type VoiceChannel } from "@/lib/voice-channel";
import {
  getVoiceHandoffMessage,
  type VoiceHandoffState,
} from "@/lib/voice-handoff";
import type { VoiceQualityAssessment } from "@/lib/voice-quality";
import type { CaptureLevelMetadata } from "@/lib/voice-capture";
import { ProcessingStatus } from "@/components/processing-status";

interface VoiceStatusMetadataProps {
  colors: ThemeColorPalette;
  voiceReadiness: VoiceReadiness;
  voiceEngine: string;
  voiceState: VoiceLifecycleState;
  voiceDuration: number;
  voiceChannel: VoiceChannel;
  voiceHandoff: VoiceHandoffState;
  voiceQuality: VoiceQualityAssessment | null;
  voiceActive: boolean;
  captureLevel: CaptureLevelMetadata;
  voiceReviewRequired: boolean;
}

export function VoiceStatusMetadata({
  colors,
  voiceReadiness,
  voiceEngine,
  voiceState,
  voiceDuration,
  voiceChannel,
  voiceHandoff,
  voiceQuality,
  voiceActive,
  captureLevel,
  voiceReviewRequired,
}: VoiceStatusMetadataProps) {
  const processingStatus =
    voiceActive && voiceState === "preparing"
      ? "voice-preparing"
      : voiceActive && voiceState === "listening"
        ? "voice-capturing"
        : voiceActive && voiceState === "processing"
          ? "voice-processing"
          : null;

  return (
    <>
      {processingStatus ? (
        <ProcessingStatus
          colors={colors}
          status={processingStatus}
          accessibilityLabel={getVoiceLifecycleMessage(
            voiceState,
            voiceDuration,
          )}
        />
      ) : null}
      <Text
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[
          styles.voiceMeta,
          {
            color: voiceReadiness === "ready" ? colors.success : colors.muted,
          },
        ]}
      >
        {voiceReadiness === "ready"
          ? `${voiceEngine} · ${getVoiceReadinessMessage(voiceReadiness)}`
          : voiceEngine}{" "}
        · {getVoiceLifecycleMessage(voiceState, voiceDuration)} ·{" "}
        {getVoiceChannelMessage(voiceChannel)} ·{" "}
        {getVoiceHandoffMessage(voiceHandoff)}
        {voiceQuality ? ` · ${voiceQuality.label}` : ""}
        {voiceActive
          ? ` · ${captureLevel.label}: ${captureLevel.guidance}`
          : ""}
        {voiceReviewRequired
          ? " · Review recognized text before translating"
          : ""}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  voiceMeta: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 8,
  },
});
