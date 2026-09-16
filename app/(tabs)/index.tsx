import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getHomeSettingsRoute } from "@/lib/home-navigation";

const sampleTranslations = [
  {
    source: "ياخشىمۇسىز",
    result: "你好",
    meta: "Uyghur → Chinese · 2 min ago",
  },
  {
    source: "谢谢你的帮助",
    result: "ياردىمىڭىزگە رەھمەت",
    meta: "Chinese → Uyghur · Yesterday",
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [source, setSource] = useState("");
  const [translated, setTranslated] = useState("");
  const [direction, setDirection] = useState<
    "Uyghur → Chinese" | "Chinese → Uyghur"
  >("Uyghur → Chinese");
  const [notice, setNotice] = useState("Ready when you are");
  const recent = useMemo(() => sampleTranslations[0], []);

  const translate = () => {
    const value = source.trim();
    if (!value) {
      setNotice("Write something to translate first");
      return;
    }
    setTranslated(
      direction === "Uyghur → Chinese"
        ? "你好，很高兴认识你"
        : "ياخشىمۇسىز، سىز بىلەن تونۇشقانلىقىمدىن خۇشالمەن",
    );
    setNotice("Translation ready");
  };

  const swap = () => {
    setDirection((current) =>
      current === "Uyghur → Chinese" ? "Chinese → Uyghur" : "Uyghur → Chinese",
    );
    setSource(translated);
    setTranslated(source);
    setNotice("Languages swapped");
  };

  return (
    <ScreenContainer className="px-5 pt-3" containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.brand, { color: colors.primary }]}>
              KAMRAN
            </Text>
            <Text style={[styles.eyebrow, { color: colors.muted }]}>
              AI-powered Uyghur–Chinese translator
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => router.push(getHomeSettingsRoute())}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol
              name="gearshape.fill"
              size={20}
              color={colors.foreground}
            />
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroKicker}>خەيرلىك ئەتىگەن</Text>
              <Text style={styles.heroTitle}>Good morning</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                K
              </Text>
            </View>
          </View>
          <Text style={styles.heroHint}>
            Translate a phrase to get started · مەتىن كىرگۈزۈڭ
          </Text>
          <Pressable
            onPress={() => router.push("/translate")}
            accessibilityRole="button"
            accessibilityLabel="Open text translation"
            style={({ pressed }) => [
              styles.heroSearch,
              pressed && styles.primaryPressed,
            ]}
          >
            <IconSymbol name="sparkles" size={18} color={colors.primary} />
            <Text style={styles.heroSearchText}>Input text to translate…</Text>
            <Text style={styles.heroSearchRtl}>مەتىن</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: `${colors.success}18` },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: colors.success }]}
          />
          <Text style={[styles.statusText, { color: colors.success }]}>
            Offline mode ready · توركەلمىسىز ھالەت تەييار
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick actions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Choose your way to communicate
          </Text>
        </View>
        <View style={styles.actionGrid}>
          <QuickAction
            icon="sparkles"
            title="Text"
            subtitle="مەتىن · Translate"
            color={colors.primary}
            onPress={() => router.push("/translate")}
          />
          <QuickAction
            icon="mic.fill"
            title="Voice"
            subtitle="ئاۋاز · Speak"
            color={colors.success}
            onPress={() => router.push("/translate")}
          />
          <QuickAction
            icon="camera.fill"
            title="Camera"
            subtitle="رەسىم · Scan"
            color={colors.warning}
            onPress={() => router.push("/ocr")}
          />
        </View>

        <View style={styles.sectionHeading}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent translations
            </Text>
            <Pressable
              onPress={() => router.push("/history")}
              accessibilityRole="button"
              accessibilityLabel="View all translation history"
            >
              <Text style={[styles.link, { color: colors.primary }]}>
                View all
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Your latest phrases
          </Text>
        </View>
        <View
          style={[
            styles.recentCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.recentTop}>
            <IconSymbol name="clock.fill" size={15} color={colors.muted} />
            <Text style={[styles.recentMeta, { color: colors.muted }]}>
              {recent.meta}
            </Text>
          </View>
          <Text style={[styles.recentSource, { color: colors.foreground }]}>
            {recent.source}
          </Text>
          <Text style={[styles.recentResult, { color: colors.primary }]}>
            {recent.result}
          </Text>
        </View>

        <View
          style={[
            styles.compactTranslate,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardTopRow}>
            <Pressable
              onPress={() =>
                setDirection(
                  direction === "Uyghur → Chinese"
                    ? "Chinese → Uyghur"
                    : "Uyghur → Chinese",
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Choose translation direction"
              style={({ pressed }) => [
                styles.languageButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.languageText, { color: colors.primary }]}>
                {direction}
              </Text>
              <IconSymbol
                name="chevron.down"
                size={15}
                color={colors.primary}
              />
            </Pressable>
            <Pressable
              onPress={swap}
              accessibilityRole="button"
              accessibilityLabel="Swap languages"
              style={({ pressed }) => [
                styles.swapButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <IconSymbol
                name="arrow.left.arrow.right"
                size={16}
                color={colors.foreground}
              />
            </Pressable>
          </View>
          <TextInput
            value={source}
            onChangeText={setSource}
            placeholder={
              direction === "Uyghur → Chinese" ? "Type in Uyghur…" : "输入中文…"
            }
            placeholderTextColor={colors.muted}
            multiline
            style={[styles.input, { color: colors.foreground }]}
            accessibilityLabel="Text to translate"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text
            style={[
              styles.resultLabel,
              { color: translated ? colors.foreground : colors.muted },
            ]}
          >
            {translated || "Your translation will appear here"}
          </Text>
          <Pressable
            onPress={translate}
            accessibilityRole="button"
            accessibilityLabel="Translate phrase"
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary },
              pressed && styles.primaryPressed,
            ]}
          >
            <IconSymbol name="sparkles" size={17} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Translate · تەرجىمە</Text>
          </Pressable>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.notice, { color: colors.muted }]}
          >
            {notice}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: "sparkles" | "mic.fill" | "camera.fill";
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: `${color}10`, borderColor: `${color}35` },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${color}1A` }]}>
        <IconSymbol name={icon} size={21} color={color} />
      </View>
      <Text style={[styles.actionTitle, { color: "#0F172A" }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: "#64748B" }]}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32, gap: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  eyebrow: { fontSize: 11, marginTop: 4 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { borderRadius: 24, padding: 18, marginTop: 4 },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroKicker: {
    color: "#DBEAFE",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "left",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 3,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 17, fontWeight: "900" },
  heroHint: { color: "#DBEAFE", fontSize: 11, marginTop: 16 },
  heroSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 13,
    minHeight: 48,
    marginTop: 9,
  },
  heroSearchText: { flex: 1, color: "#64748B", fontSize: 13 },
  heroSearchRtl: { color: "#94A3B8", fontSize: 12 },
  statusPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: "600" },
  sectionHeading: { gap: 3, marginTop: 4 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionSubtitle: { fontSize: 12 },
  link: { fontSize: 12, fontWeight: "700" },
  actionGrid: { flexDirection: "row", gap: 9 },
  actionCard: {
    flex: 1,
    minHeight: 124,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  actionIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: { fontSize: 14, fontWeight: "800", marginTop: 13 },
  actionSubtitle: { fontSize: 10, marginTop: 4 },
  recentCard: { borderRadius: 19, borderWidth: 1, padding: 15 },
  recentTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  recentMeta: { fontSize: 11, fontWeight: "600" },
  recentSource: { fontSize: 19, lineHeight: 28, marginTop: 11 },
  recentResult: { fontSize: 18, lineHeight: 27, marginTop: 2 },
  compactTranslate: { borderRadius: 20, borderWidth: 1, padding: 16 },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
  },
  languageText: { fontSize: 12, fontWeight: "700" },
  swapButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 68,
    fontSize: 19,
    lineHeight: 28,
    paddingTop: 16,
    paddingBottom: 10,
  },
  divider: { height: 1 },
  resultLabel: { minHeight: 64, fontSize: 16, lineHeight: 24, paddingTop: 14 },
  primaryButton: {
    height: 50,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  primaryPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  notice: { textAlign: "center", fontSize: 11, marginTop: 9 },
  pressed: { opacity: 0.72 },
});
