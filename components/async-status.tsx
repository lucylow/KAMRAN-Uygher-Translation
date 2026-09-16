import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import {
  getAsyncStatusAccessibilityRole,
  type AsyncStatusTone,
} from "@/lib/async-status-accessibility";

interface AsyncStatusProps {
  message?: string;
  colors: ThemeColorPalette;
  tone?: AsyncStatusTone;
  style?: StyleProp<TextStyle>;
}

export function AsyncStatus({
  message,
  colors,
  tone = "info",
  style,
}: AsyncStatusProps) {
  if (!message) return null;

  const color =
    tone === "success"
      ? colors.success
      : tone === "error"
        ? colors.error
        : colors.primary;

  return (
    <Text
      accessibilityRole={getAsyncStatusAccessibilityRole(tone)}
      accessibilityLiveRegion="polite"
      style={[styles.base, { color }, style]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { fontSize: 12, fontWeight: "700" },
});
