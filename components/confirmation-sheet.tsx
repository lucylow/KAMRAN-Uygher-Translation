import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";

interface ConfirmationSheetProps {
  visible: boolean;
  eyebrow: string;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  colors: ThemeColorPalette;
  confirmColor?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationSheet({
  visible,
  eyebrow,
  title,
  body,
  cancelLabel,
  confirmLabel,
  colors,
  confirmColor = colors.warning,
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmationSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onCancel}
          accessibilityLabel={cancelLabel}
        />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.eyebrow, { color: colors.warning }]}>
            {eyebrow}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.body, { color: colors.muted }]}>{body}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={busy ? undefined : onCancel}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              style={({ pressed }) => [
                styles.cancel,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.foreground }]}>
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={busy ? undefined : onConfirm}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              style={({ pressed }) => [
                styles.confirm,
                { backgroundColor: confirmColor },
                busy && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>
                {busy ? "Working…" : confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", padding: 22 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "#0F172A66" },
  card: { borderRadius: 22, borderWidth: 1, padding: 20 },
  eyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { fontSize: 22, fontWeight: "900", marginTop: 7 },
  body: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  actions: { flexDirection: "row", gap: 10, marginTop: 18 },
  cancel: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 13, fontWeight: "800" },
  confirm: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  disabled: { opacity: 0.62 },
  pressed: { opacity: 0.68 },
});
