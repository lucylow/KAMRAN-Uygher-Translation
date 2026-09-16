import type { ReactNode } from "react";
import { Text, View } from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface SettingsSectionProps {
  title: string;
  subtitle: string;
  colors: ThemeColorPalette;
  children: ReactNode;
}

export function SettingsSection({
  title,
  subtitle,
  colors,
  children,
}: SettingsSectionProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <View
        style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}
      >
        <Text
          style={{ color: colors.foreground, fontSize: 16, fontWeight: "900" }}
        >
          {title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3 }}>
          {subtitle}
        </Text>
      </View>
      {children}
    </View>
  );
}

interface SettingRowProps {
  label: string;
  detail: string;
  colors: ThemeColorPalette;
  control?: ReactNode;
}

export function SettingRow({
  label,
  detail,
  colors,
  control,
}: SettingRowProps) {
  return (
    <View
      style={{
        borderTopColor: colors.border,
        borderTopWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.foreground, fontSize: 14, fontWeight: "800" }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            lineHeight: 18,
            marginTop: 2,
          }}
        >
          {detail}
        </Text>
      </View>
      {control ?? (
        <IconSymbol name="chevron.right" size={17} color={colors.muted} />
      )}
    </View>
  );
}
