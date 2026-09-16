import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

export function HapticTab({
  children,
  accessibilityLabel,
  accessibilityState,
  accessibilityValue,
  testID,
  onPress,
  onLongPress,
  delayLongPress,
  disabled,
  hitSlop,
  pressRetentionOffset,
  android_ripple,
  style,
  onPressIn,
  onPressOut,
}: BottomTabBarButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      accessibilityValue={accessibilityValue}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      pressRetentionOffset={pressRetentionOffset}
      android_ripple={android_ripple}
      style={style}
      onPressIn={(event) => {
        if (process.env.EXPO_OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(event);
      }}
      onPressOut={onPressOut}
    >
      {children}
    </Pressable>
  );
}
