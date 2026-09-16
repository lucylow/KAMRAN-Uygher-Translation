import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { TranslationDirection } from "@/lib/mock-translation";
import {
  getSpeechProfiles,
  type SpeechRate,
  type VoiceProfileId,
} from "@/lib/voice-settings";

interface VoiceSettingsPanelProps {
  colors: ThemeColorPalette;
  direction: TranslationDirection;
  expanded: boolean;
  speechRate: SpeechRate;
  voiceProfileId: VoiceProfileId;
  selectedProfileLabel: string;
  selectedProfileUsesFallback: boolean;
  voiceAvailabilityMessage: string;
  onToggle: () => void;
  onSpeechRateChange: (rate: SpeechRate) => void;
  onVoiceProfileChange: (profileId: VoiceProfileId) => void;
  onReset: () => void;
}

export function VoiceSettingsPanel({
  colors,
  direction,
  expanded,
  speechRate,
  voiceProfileId,
  selectedProfileLabel,
  selectedProfileUsesFallback,
  voiceAvailabilityMessage,
  onToggle,
  onSpeechRateChange,
  onVoiceProfileChange,
  onReset,
}: VoiceSettingsPanelProps) {
  return (
    <>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        style={({ pressed }) => [
          styles.settingsToggle,
          { borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <IconSymbol name="gearshape.fill" size={16} color={colors.foreground} />
        <Text style={[styles.settingsToggleText, { color: colors.foreground }]}>
          Voice settings
        </Text>
      </Pressable>
      {expanded ? (
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.settingsLabel, { color: colors.muted }]}>
            SPEECH RATE
          </Text>
          <View style={styles.rateRow}>
            {([0.75, 0.9, 1.05] as SpeechRate[]).map((rate) => (
              <Pressable
                key={rate}
                onPress={() => onSpeechRateChange(rate)}
                accessibilityRole="button"
                accessibilityState={{ selected: speechRate === rate }}
                style={[
                  styles.rateChip,
                  {
                    borderColor:
                      speechRate === rate ? colors.primary : colors.border,
                    backgroundColor:
                      speechRate === rate
                        ? `${colors.primary}18`
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.rateText,
                    {
                      color:
                        speechRate === rate
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {rate}×
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.profileRow}>
            {getSpeechProfiles(direction).map((profile) => (
              <Pressable
                key={profile.id}
                onPress={() => onVoiceProfileChange(profile.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: voiceProfileId === profile.id }}
                style={[
                  styles.profileChip,
                  {
                    borderColor:
                      voiceProfileId === profile.id
                        ? colors.primary
                        : colors.border,
                    backgroundColor:
                      voiceProfileId === profile.id
                        ? `${colors.primary}18`
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.profileText,
                    {
                      color:
                        voiceProfileId === profile.id
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {profile.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={onReset}
            accessibilityRole="button"
            accessibilityLabel="Reset voice settings"
            style={({ pressed }) => [
              styles.resetSettings,
              { borderColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[styles.resetSettingsText, { color: colors.foreground }]}
            >
              Reset default
            </Text>
          </Pressable>
          <Text style={[styles.settingsHint, { color: colors.muted }]}>
            {selectedProfileLabel}
            {selectedProfileUsesFallback
              ? " · Uyghur playback uses an Arabic-script fallback voice."
              : ""}{" "}
            {voiceAvailabilityMessage}
          </Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  settingsToggle: {
    minHeight: 40,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 8,
  },
  settingsToggleText: { fontSize: 12, fontWeight: "700" },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    marginBottom: 8,
  },
  settingsLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  rateRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  rateChip: {
    minWidth: 62,
    minHeight: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rateText: { fontSize: 12, fontWeight: "800" },
  profileRow: { gap: 8, marginTop: 10 },
  profileChip: {
    minHeight: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  profileText: { fontSize: 11, fontWeight: "800" },
  resetSettings: {
    minHeight: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  resetSettingsText: { fontSize: 12, fontWeight: "700" },
  settingsHint: { fontSize: 11, lineHeight: 16, marginTop: 10 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
