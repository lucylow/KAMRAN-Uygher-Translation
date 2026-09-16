import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AsyncStatus } from "@/components/async-status";
import { OnboardingLanguageBridge } from "@/components/onboarding-language-bridge";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { writeStoredJson } from "@/lib/async-storage-json";

const ONBOARDING_KEY = "kamran.onboarding-complete";
const slides = [
  {
    icon: "sparkles" as const,
    eyebrow: "WELCOME TO KAMRAN",
    title: "Speak freely.",
    body: "A focused translation companion for Uyghur and Chinese conversations.",
    caption: "A calm bridge between two languages.",
  },
  {
    icon: "mic.fill" as const,
    eyebrow: "SPEAK NATURALLY",
    title: "Use your voice.",
    body: "Capture a phrase with voice input, then listen back to the translation at a comfortable pace.",
    caption: "Voice input and playback are ready when you are.",
  },
  {
    icon: "camera.fill" as const,
    eyebrow: "READ THE WORLD",
    title: "Translate what you see.",
    body: "Text, voice, and camera entry points are designed to keep real conversations moving.",
    caption: "Camera translation is designed for the moment.",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState("");
  const mountedRef = useRef(true);
  const slide = useMemo(() => slides[index], [index]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const finish = async () => {
    if (finishing) return;
    setFinishing(true);
    setFinishError("");
    const result = await writeStoredJson(ONBOARDING_KEY, "true");
    if (!mountedRef.current) return;
    if (!result.ok) {
      setFinishing(false);
      setFinishError(
        "Could not save onboarding on this device. You can try again.",
      );
      return;
    }
    try {
      router.replace("/(tabs)");
    } catch {
      if (!mountedRef.current) return;
      setFinishing(false);
      setFinishError(
        "Onboarding was saved, but navigation failed. Please try again.",
      );
    }
  };

  return (
    <ScreenContainer
      edges={["top", "bottom", "left", "right"]}
      className="px-6 pt-4"
      containerClassName="bg-background"
    >
      <View style={styles.top}>
        <Text style={[styles.brand, { color: colors.primary }]}>KAMRAN</Text>
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          accessibilityHint="Finish onboarding and open the translation screen"
          accessibilityState={{ disabled: finishing, busy: finishing }}
          disabled={finishing}
          hitSlop={10}
        >
          <Text style={[styles.skip, { color: colors.muted }]}>Skip</Text>
        </Pressable>
      </View>
      <View style={styles.center}>
        <View
          style={[styles.iconHalo, { backgroundColor: `${colors.primary}15` }]}
        >
          <View
            style={[styles.iconCircle, { backgroundColor: colors.primary }]}
          >
            <IconSymbol name={slide.icon} size={44} color="#FFF9F0" />
          </View>
        </View>
        <OnboardingLanguageBridge colors={colors} />
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          {slide.eyebrow}
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {slide.title}
        </Text>
        <Text style={[styles.body, { color: colors.muted }]}>{slide.body}</Text>
      </View>
      <View>
        <AsyncStatus
          message={finishError || (finishing ? "Saving your preferences…" : "")}
          colors={colors}
          tone={finishError ? "error" : "info"}
          style={styles.status}
        />
        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityLabel="Onboarding progress"
          accessibilityValue={{
            min: 1,
            max: slides.length,
            now: index + 1,
            text: `Step ${index + 1} of ${slides.length}`,
          }}
        >
          {slides.map((item, itemIndex) => (
            <View
              key={item.eyebrow}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    itemIndex === index ? colors.primary : colors.border,
                  width: itemIndex === index ? 30 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Pressable
          onPress={
            index === slides.length - 1
              ? finish
              : () => setIndex((current) => current + 1)
          }
          accessibilityRole="button"
          accessibilityLabel={
            index === slides.length - 1 ? "Start translating" : "Continue"
          }
          accessibilityHint={
            index === slides.length - 1
              ? "Save your onboarding preferences and open translation"
              : `Go to step ${index + 2} of ${slides.length}`
          }
          accessibilityState={{ disabled: finishing, busy: finishing }}
          disabled={finishing}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            finishing && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {index === slides.length - 1 ? "Start translating" : "Continue"}
          </Text>
          <IconSymbol name="chevron.right" size={18} color="#FFF9F0" />
        </Pressable>
        <Text style={[styles.caption, { color: colors.muted }]}>
          {slide.caption}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  skip: { fontSize: 14, fontWeight: "600" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  iconHalo: {
    width: 190,
    height: 190,
    borderRadius: 95,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 42,
  },
  iconCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "900",
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    maxWidth: 310,
    marginTop: 14,
  },
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
  },
  dot: { height: 8, borderRadius: 4 },
  button: {
    minHeight: 56,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { color: "#FFF9F0", fontSize: 16, fontWeight: "800" },
  caption: { fontSize: 11, textAlign: "center", marginTop: 12 },
  status: { textAlign: "center", minHeight: 18, marginBottom: 8 },
  disabled: { opacity: 0.62 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
