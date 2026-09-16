import { StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";

interface OnboardingLanguageBridgeProps {
  colors: ThemeColorPalette;
}

export function OnboardingLanguageBridge({
  colors,
}: OnboardingLanguageBridgeProps) {
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: `${colors.primary}35`,
          backgroundColor: `${colors.primary}08`,
        },
      ]}
      accessibilityLabel="Uyghur and Chinese language bridge"
    >
      <Text style={[styles.language, { color: colors.foreground }]}>
        ئۇيغۇرچە
      </Text>
      <Text style={[styles.arrow, { color: colors.primary }]}>↔</Text>
      <Text style={[styles.language, { color: colors.foreground }]}>中文</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 28,
  },
  language: { fontSize: 13, fontWeight: "800" },
  arrow: { fontSize: 18, fontWeight: "700" },
});
