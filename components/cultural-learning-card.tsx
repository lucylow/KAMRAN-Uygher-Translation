import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import type { CulturalLearningCard as CulturalLearningCardData } from "@/lib/cultural-content";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface CulturalLearningCardProps {
  card: CulturalLearningCardData;
  completed: boolean;
  colors: ThemeColorPalette;
  onPress: () => void;
}

export function CulturalLearningCard({
  card,
  completed,
  colors,
  onPress,
}: CulturalLearningCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${card.title}, ${card.nativeTitle}, ${card.lessonLabel}`}
      accessibilityHint="Open the bilingual cultural lesson preview"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: `${colors.warning}18` }]}>
        <IconSymbol name={card.icon} size={19} color={colors.warning} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {card.title}
        </Text>
        <Text style={[styles.native, { color: colors.primary }]}>
          {card.nativeTitle}
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          {card.description}
        </Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {card.region} · {card.lessonLabel}
        </Text>
      </View>
      <IconSymbol
        name={completed ? "checkmark.circle.fill" : "chevron.right"}
        size={completed ? 18 : 16}
        color={completed ? colors.success : colors.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1 },
  title: { fontSize: 14, fontWeight: "900" },
  native: { fontSize: 12, fontWeight: "800", marginTop: 3 },
  body: { fontSize: 12, lineHeight: 18, marginTop: 7 },
  meta: { fontSize: 10, marginTop: 8 },
  pressed: { opacity: 0.7 },
});
