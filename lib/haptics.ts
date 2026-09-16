import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

function runSafely(action: () => Promise<unknown>) {
  if (Platform.OS !== "web") void action().catch(() => undefined);
}

export const haptic = {
  light: () => {
    runSafely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },
  medium: () => {
    runSafely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  },
  success: () => {
    runSafely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    );
  },
  error: () => {
    runSafely(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    );
  },
};
