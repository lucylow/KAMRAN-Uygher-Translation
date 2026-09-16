import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import type { CulturalLearningCard } from "@/lib/cultural-content";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface CulturalDetailSheetProps {
  card: CulturalLearningCard | null;
  colors: ThemeColorPalette;
  onClose: () => void;
  onComplete: (card: CulturalLearningCard) => void;
}

export function CulturalDetailSheet({
  card,
  colors,
  onClose,
  onComplete,
}: CulturalDetailSheetProps) {
  return (
    <Modal
      visible={Boolean(card)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close cultural lesson preview"
        />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {card ? (
            <>
              <View style={styles.handle} />
              <View style={styles.header}>
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: `${colors.warning}18` },
                  ]}
                >
                  <IconSymbol
                    name={card.icon}
                    size={20}
                    color={colors.warning}
                  />
                </View>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close cultural lesson preview"
                  style={styles.close}
                >
                  <IconSymbol
                    name="xmark"
                    size={18}
                    color={colors.foreground}
                  />
                </Pressable>
              </View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                {card.title}
              </Text>
              <Text style={[styles.native, { color: colors.primary }]}>
                {card.nativeTitle}
              </Text>
              <Text style={[styles.meta, { color: colors.muted }]}>
                {card.region} · {card.lessonLabel}
              </Text>
              <Text style={[styles.body, { color: colors.foreground }]}>
                {card.detailBody}
              </Text>
              <View
                style={[
                  styles.takeaway,
                  {
                    backgroundColor: `${colors.primary}12`,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.takeawayLabel, { color: colors.primary }]}>
                  TAKEAWAY
                </Text>
                <Text
                  style={[styles.takeawayText, { color: colors.foreground }]}
                >
                  {card.takeaway}
                </Text>
              </View>
              <Pressable
                onPress={() => onComplete(card)}
                accessibilityRole="button"
                accessibilityLabel={`Complete ${card.title} preview`}
                style={({ pressed }) => [
                  styles.done,
                  { backgroundColor: colors.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#0F172A66" },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "900", marginTop: 18 },
  native: { fontSize: 14, fontWeight: "800", marginTop: 4 },
  meta: { fontSize: 11, marginTop: 7 },
  body: { fontSize: 14, lineHeight: 22, marginTop: 18 },
  takeaway: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 18 },
  takeawayLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  takeawayText: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  done: {
    minHeight: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  doneText: { color: "#FFF9F0", fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.78 },
});
