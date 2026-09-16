import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import {
  getProcessingStatusCopy,
  type ProcessingStatusKey,
} from "@/lib/processing-status";

interface ProcessingStatusProps {
  colors: ThemeColorPalette;
  status: ProcessingStatusKey;
  accessibilityLabel?: string;
}

export function ProcessingStatus({
  colors,
  status,
  accessibilityLabel,
}: ProcessingStatusProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const copy = getProcessingStatusCopy(status);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReduceMotion(enabled);
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (reduceMotion) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
      progress.stopAnimation();
    };
  }, [progress, reduceMotion, status]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1],
  });

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? copy.label}
      accessibilityLiveRegion="polite"
      style={styles.container}
    >
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <ActivityIndicator color={colors.primary} size="small" />
      </Animated.View>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: colors.foreground }]}>
          {copy.label}
        </Text>
        <Text style={[styles.detail, { color: colors.muted }]}>
          {copy.detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  copy: { flexShrink: 1, gap: 2 },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "800" },
  detail: { fontSize: 11, lineHeight: 16 },
});
