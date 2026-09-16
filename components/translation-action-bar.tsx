import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface TranslationActionBarProps {
  colors: ThemeColorPalette;
  hasContent: boolean;
  loading: boolean;
  reviewRequired: boolean;
  reviewAcknowledged: boolean;
  status: string;
  onClear: () => void;
  onTranslate: () => void;
}

export function TranslationActionBar({
  colors,
  hasContent,
  loading,
  reviewRequired,
  reviewAcknowledged,
  status,
  onClear,
  onTranslate,
}: TranslationActionBarProps) {
  return (
    <>
      {hasContent ? (
        <View style={styles.playbackActions}>
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear translation"
            accessibilityHint="Remove the source and translated text and stop voice activity"
            style={({ pressed }) => [
              styles.restartButton,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol name="xmark" size={15} color={colors.foreground} />
            <Text style={[styles.restartText, { color: colors.foreground }]}>
              Clear
            </Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable
        onPress={onTranslate}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={
          loading
            ? "Translation in progress"
            : reviewRequired && !reviewAcknowledged
              ? "Review recognized text before translating"
              : "Translate phrase"
        }
        accessibilityHint={
          reviewRequired && !reviewAcknowledged
            ? "Read or edit the source phrase, then tap this button again"
            : undefined
        }
        accessibilityState={{ disabled: loading, busy: loading }}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
          loading && styles.disabled,
        ]}
      >
        <IconSymbol name="sparkles" size={18} color="#FFF9F0" />
        <Text style={styles.buttonText}>
          {loading ? "Translating…" : "Translate phrase"}
        </Text>
      </Pressable>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.status, { color: colors.muted }]}
      >
        {status}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
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
  restartText: { fontSize: 12, fontWeight: "700" },
  button: {
    height: 54,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  buttonText: { color: "#FFF9F0", fontWeight: "800", fontSize: 16 },
  status: { textAlign: "center", fontSize: 12, marginTop: 10 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.7 },
});
