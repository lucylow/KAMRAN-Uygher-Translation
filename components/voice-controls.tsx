import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getVoiceAccessibilityLabel,
  getVoiceLifecycleMessage,
  type VoiceLifecycleState,
} from "@/lib/voice-lifecycle";
import { getVoiceRetryLabel } from "@/lib/voice-quality";
import type { VoiceQualityAssessment } from "@/lib/voice-quality";
import { getVoiceReviewActionLabel } from "@/lib/voice-review";

interface VoiceControlsProps {
  colors: ThemeColorPalette;
  pulse: Animated.Value;
  voiceActive: boolean;
  voiceState: VoiceLifecycleState;
  voiceQuality: VoiceQualityAssessment | null;
  voiceDuration: number;
  speaking: boolean;
  speechPaused: boolean;
  playbackElapsed: number;
  loading: boolean;
  hasResult: boolean;
  voiceReviewAcknowledged: boolean;
  onToggleVoice: () => void;
  onToggleSpeech: () => void;
  onRerecord: () => void;
  onConfirmReview: () => void;
  onRestartSpeech: () => void;
  onTogglePause: () => void;
}

export function VoiceControls({
  colors,
  pulse,
  voiceActive,
  voiceState,
  voiceQuality,
  voiceDuration,
  speaking,
  speechPaused,
  playbackElapsed,
  loading,
  hasResult,
  voiceReviewAcknowledged,
  onToggleVoice,
  onToggleSpeech,
  onRerecord,
  onConfirmReview,
  onRestartSpeech,
  onTogglePause,
}: VoiceControlsProps) {
  return (
    <>
      <View style={styles.controls}>
        <Pressable
          onPress={onToggleVoice}
          accessibilityLabel={getVoiceAccessibilityLabel(voiceState)}
          accessibilityHint={
            voiceState === "interrupted" || voiceState === "error"
              ? "Try again to restart voice input"
              : undefined
          }
          accessibilityState={{ selected: voiceActive, busy: voiceActive }}
          style={({ pressed }) => [
            styles.voiceButton,
            {
              borderColor: voiceActive ? colors.primary : colors.border,
              backgroundColor: voiceActive
                ? `${colors.primary}18`
                : colors.surface,
            },
            pressed && styles.pressed,
          ]}
        >
          <Animated.View
            style={{ transform: [{ scale: voiceActive ? pulse : 1 }] }}
          >
            <IconSymbol
              name="mic.fill"
              size={20}
              color={voiceActive ? colors.primary : colors.foreground}
            />
          </Animated.View>
          <Text
            style={[
              styles.controlText,
              { color: voiceActive ? colors.primary : colors.foreground },
            ]}
          >
            {voiceActive
              ? getVoiceLifecycleMessage(voiceState, voiceDuration)
              : voiceState === "complete"
                ? voiceQuality?.quality === "retry"
                  ? getVoiceRetryLabel(voiceQuality.quality)
                  : "Voice input ready"
                : voiceState === "interrupted" || voiceState === "error"
                  ? "Try voice input"
                  : "Voice input"}
          </Text>
        </Pressable>
        <Pressable
          onPress={onToggleSpeech}
          accessibilityLabel={
            speaking
              ? speechPaused
                ? "Resume playback"
                : "Stop playback"
              : "Play translation"
          }
          accessibilityHint={
            speaking
              ? speechPaused
                ? "Resume the spoken translation"
                : "Stop the spoken translation"
              : "Play the translated phrase aloud"
          }
          accessibilityState={{ selected: speaking, busy: speaking }}
          style={({ pressed }) => [
            styles.voiceButton,
            {
              borderColor: speaking ? colors.primary : colors.border,
              backgroundColor: speaking
                ? `${colors.primary}18`
                : colors.surface,
            },
            pressed && styles.pressed,
          ]}
        >
          <Animated.View
            style={{ transform: [{ scale: speaking ? pulse : 1 }] }}
          >
            <IconSymbol
              name="speaker.wave.2.fill"
              size={20}
              color={speaking ? colors.primary : colors.foreground}
            />
          </Animated.View>
          <Text
            style={[
              styles.controlText,
              { color: speaking ? colors.primary : colors.foreground },
            ]}
          >
            {speaking ? `Playing · ${playbackElapsed}s` : "Listen"}
          </Text>
        </Pressable>
      </View>
      {voiceQuality && !voiceActive ? (
        <View style={styles.playbackActions}>
          <Pressable
            onPress={onRerecord}
            accessibilityRole="button"
            accessibilityLabel={getVoiceReviewActionLabel(
              "rerecord",
              voiceQuality.quality,
            )}
            accessibilityHint="Record the phrase again"
            style={({ pressed }) => [
              styles.restartButton,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol name="mic.fill" size={15} color={colors.foreground} />
            <Text style={[styles.restartText, { color: colors.foreground }]}>
              {getVoiceReviewActionLabel("rerecord", voiceQuality.quality)}
            </Text>
          </Pressable>
          <Pressable
            onPress={onConfirmReview}
            accessibilityRole="button"
            accessibilityLabel={getVoiceReviewActionLabel(
              "confirm",
              voiceQuality.quality,
            )}
            accessibilityState={{ selected: voiceReviewAcknowledged }}
            style={({ pressed }) => [
              styles.pauseButton,
              {
                borderColor: voiceReviewAcknowledged
                  ? colors.success
                  : colors.border,
                backgroundColor: voiceReviewAcknowledged
                  ? `${colors.success}18`
                  : colors.surface,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.restartText,
                {
                  color: voiceReviewAcknowledged
                    ? colors.success
                    : colors.foreground,
                },
              ]}
            >
              {getVoiceReviewActionLabel("confirm", voiceQuality.quality)}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {hasResult ? (
        <View style={styles.playbackActions}>
          <Pressable
            onPress={onRestartSpeech}
            accessibilityRole="button"
            accessibilityLabel="Restart translation playback"
            accessibilityState={{ disabled: loading }}
            disabled={loading}
            style={({ pressed }) => [
              styles.restartButton,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && styles.pressed,
              loading && styles.disabled,
            ]}
          >
            <IconSymbol
              name="speaker.wave.2.fill"
              size={15}
              color={colors.foreground}
            />
            <Text style={[styles.restartText, { color: colors.foreground }]}>
              Restart audio
            </Text>
          </Pressable>
          {Platform.OS !== "android" ? (
            <Pressable
              onPress={onTogglePause}
              accessibilityRole="button"
              accessibilityLabel={
                speechPaused ? "Resume playback" : "Pause playback"
              }
              accessibilityState={{
                disabled: !speaking,
                selected: speechPaused,
              }}
              disabled={!speaking}
              style={({ pressed }) => [
                styles.pauseButton,
                {
                  borderColor: speaking ? colors.primary : colors.border,
                  backgroundColor: speechPaused
                    ? `${colors.primary}18`
                    : colors.surface,
                },
                pressed && styles.pressed,
                !speaking && styles.disabled,
              ]}
            >
              <Text
                style={[
                  styles.restartText,
                  { color: speaking ? colors.primary : colors.muted },
                ]}
              >
                {speechPaused ? "Resume" : "Pause"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  controls: { flexDirection: "row", gap: 10, marginTop: 14 },
  voiceButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  controlText: { fontSize: 13, fontWeight: "700" },
  playbackActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  restartButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  pauseButton: {
    minWidth: 78,
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  restartText: { fontSize: 12, fontWeight: "700" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.7 },
});
