import { StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";

interface CulturalProgressSummaryProps {
  completed: number;
  total: number;
  colors: ThemeColorPalette;
}

export function CulturalProgressSummary({
  completed,
  total,
  colors,
}: CulturalProgressSummaryProps) {
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          LEARN PROGRESS · ئۆگىنىش
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {completed} / {total} cultural lessons
        </Text>
        <Text style={[styles.detail, { color: colors.muted }]}>
          Progress stays on this device and can be reset below.
        </Text>
      </View>
      <View style={[styles.circle, { borderColor: colors.primary }]}>
        <Text style={[styles.number, { color: colors.primary }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  copy: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { fontSize: 17, fontWeight: "800", marginTop: 6 },
  detail: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  number: { fontSize: 14, fontWeight: "900" },
});
