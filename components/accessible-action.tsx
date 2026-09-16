import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { haptic } from "@/lib/haptics";

interface AccessibleActionProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  label: string;
  icon?: IconSymbolName;
  variant?: "primary" | "secondary";
  buttonStyle?: StyleProp<ViewStyle>;
}

export function AccessibleAction({
  label,
  icon,
  variant = "primary",
  accessibilityLabel,
  disabled,
  buttonStyle,
  ...props
}: AccessibleActionProps) {
  const colors = useColors();
  const primary = variant === "primary";
  const handlePress: NonNullable<PressableProps["onPress"]> = (event) => {
    if (!disabled) haptic.light();
    props.onPress?.(event);
  };
  return (
    <Pressable
      {...props}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: primary ? colors.primary : colors.surface,
          borderColor: primary ? colors.primary : colors.border,
        },
        !primary && styles.secondary,
        disabled && styles.disabled,
        pressed && styles.pressed,
        buttonStyle,
      ]}
    >
      {icon && (
        <IconSymbol
          name={icon}
          size={18}
          color={primary ? "#FFF9F0" : colors.foreground}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: primary ? "#FFF9F0" : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  secondary: { backgroundColor: "transparent" },
  label: { fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});
