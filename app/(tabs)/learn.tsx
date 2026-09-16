import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AsyncStatus } from "@/components/async-status";
import { CulturalDetailSheet } from "@/components/cultural-detail-sheet";
import { CulturalLearningCard } from "@/components/cultural-learning-card";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getCulturalLearningCards,
  type CulturalCategory,
} from "@/lib/cultural-content";
import {
  DEFAULT_LEARN_PROGRESS,
  LEARN_PROGRESS_KEY,
  getLearnProgressPersistenceMessage,
  parseLearnProgress,
  serializeLearnProgress,
} from "@/lib/learn-progress";
import {
  readStoredJsonWithStatus,
  writeStoredJson,
} from "@/lib/async-storage-json";
import { useTranslationStore } from "@/lib/translation-store";
import {
  getPracticeRouteParams,
  selectPracticeEntry,
} from "@/lib/learn-practice";

const vocabulary = [
  { ug: "سالام", zh: "你好", level: "Beginner", mastered: true },
  { ug: "رەھمەت", zh: "谢谢", level: "Beginner", mastered: true },
  { ug: "خوش كەلدىڭىز", zh: "欢迎", level: "Beginner", mastered: true },
  { ug: "ئۆيۈم", zh: "我的家", level: "Intermediate", mastered: false },
  { ug: "دوختۇر", zh: "医生", level: "Intermediate", mastered: false },
  { ug: "مەكتەپ", zh: "学校", level: "Beginner", mastered: false },
];

const phrases = [
  {
    category: "Travel · سەپەر",
    ug: "مېھمانخانا قەيەردە؟",
    zh: "酒店在哪里؟",
    count: "4 useful phrases",
  },
  {
    category: "Shopping · سودا",
    ug: "بۇ قانچىلىك تۇرىدۇ؟",
    zh: "这个多少钱？",
    count: "6 useful phrases",
  },
  {
    category: "Everyday · كۈندىلىك",
    ug: "بۈگۈن ھاۋا رايى قانداق؟",
    zh: "今天天气怎么样？",
    count: "8 useful phrases",
  },
];

type LearnTab = "vocabulary" | "phrases";

export default function LearnScreen() {
  const colors = useColors();
  const router = useRouter();
  const { history } = useTranslationStore();
  const [tab, setTab] = useState<LearnTab>("vocabulary");
  const [culturalCategory, setCulturalCategory] = useState<
    CulturalCategory | "all"
  >("all");
  const [selectedCulturalCard, setSelectedCulturalCard] = useState<
    (typeof culturalCards)[number] | null
  >(null);
  const [learnStatus, setLearnStatus] = useState("");
  const [learnPersistenceError, setLearnPersistenceError] = useState("");
  const [completedCulturalIds, setCompletedCulturalIds] = useState<string[]>(
    DEFAULT_LEARN_PROGRESS.completedCulturalIds,
  );
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const closeCulturalSheet = (message = "Cultural lesson closed") => {
    setSelectedCulturalCard(null);
    setLearnStatus(message);
  };
  useEffect(() => {
    let active = true;
    readStoredJsonWithStatus(
      LEARN_PROGRESS_KEY,
      parseLearnProgress,
      DEFAULT_LEARN_PROGRESS,
    ).then((readResult) => {
      if (!active) return;
      setCompletedCulturalIds(readResult.value.completedCulturalIds);
      setLearnPersistenceError(
        getLearnProgressPersistenceMessage(readResult.ok),
      );
    });
    return () => {
      active = false;
    };
  }, []);
  const markCulturalComplete = async (cardId: string, title: string) => {
    const next = Array.from(new Set([...completedCulturalIds, cardId]));
    setCompletedCulturalIds(next);
    const writeResult = await writeStoredJson(
      LEARN_PROGRESS_KEY,
      { completedCulturalIds: next },
      serializeLearnProgress,
    );
    if (!mountedRef.current) return;
    if (!writeResult.ok) {
      setLearnPersistenceError(getLearnProgressPersistenceMessage(false));
    }
    setLearnStatus(
      writeResult.ok
        ? `Completed ${title}`
        : `${title} marked complete for this session, but progress could not be saved on this device`,
    );
    setSelectedCulturalCard(null);
  };
  const masteredCount = useMemo(
    () => vocabulary.filter((item) => item.mastered).length,
    [],
  );
  const culturalCards = useMemo(
    () => getCulturalLearningCards(culturalCategory),
    [culturalCategory],
  );
  const allCulturalCards = useMemo(() => getCulturalLearningCards("all"), []);
  const practiceEntry = useMemo(() => selectPracticeEntry(history), [history]);
  const culturalCompletedCount = allCulturalCards.filter((card) =>
    completedCulturalIds.includes(card.id),
  ).length;
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReduceMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (active) setReduceMotion(enabled);
      },
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  const startPractice = () => {
    if (!practiceEntry) {
      setLearnStatus("No saved phrase yet — opening Translate to create one");
      router.push("/translate");
      return;
    }

    const params = getPracticeRouteParams(practiceEntry);
    if (!params) return;
    setLearnStatus(`Opening practice for ${practiceEntry.source}`);
    router.push({ pathname: "/translate", params });
  };

  useEffect(() => {
    const animation = Animated.timing(progressAnimation, {
      toValue: masteredCount / vocabulary.length,
      duration: reduceMotion ? 0 : 280,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [masteredCount, progressAnimation, reduceMotion]);
  return (
    <ScreenContainer className="px-5 pt-3" containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          Build confidence · ئۆگىنىش
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Learn as you go.
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Small phrases for real Uyghur–Chinese conversations.
        </Text>
        <AsyncStatus
          message={learnStatus}
          colors={colors}
          style={styles.learnStatus}
        />
        <AsyncStatus
          message={learnPersistenceError}
          colors={colors}
          tone="error"
          style={styles.learnPersistenceStatus}
        />

        <View
          style={[styles.progressCard, { backgroundColor: colors.primary }]}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressEyebrow}>
                TODAY’S PROGRESS · بۈگۈن
              </Text>
              <Text style={styles.progressTitle}>
                {masteredCount} / 6 complete
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={[styles.progressNumber, { color: colors.primary }]}>
                {Math.round((masteredCount / vocabulary.length) * 100)}%
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            {culturalCompletedCount} / {allCulturalCards.length} cultural
            lessons previewed · Keep one phrase ready for your next
            conversation.
          </Text>
        </View>

        <View
          style={[
            styles.segment,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <SegmentButton
            active={tab === "vocabulary"}
            label="Vocabulary · سۆزلەر"
            onPress={() => setTab("vocabulary")}
            colors={colors}
          />
          <SegmentButton
            active={tab === "phrases"}
            label="Phrases · ئىبارەلەر"
            onPress={() => setTab("phrases")}
            colors={colors}
          />
        </View>

        {tab === "vocabulary" ? (
          <View style={styles.list}>
            {vocabulary.map((item) => (
              <Pressable
                key={item.ug}
                accessibilityRole="button"
                accessibilityLabel={`${item.ug}, ${item.zh}`}
                style={({ pressed }) => [
                  styles.vocabCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.levelDot,
                    {
                      backgroundColor: item.mastered
                        ? colors.success
                        : colors.border,
                    },
                  ]}
                />
                <View style={styles.vocabCopy}>
                  <Text style={[styles.vocabUg, { color: colors.foreground }]}>
                    {item.ug}
                  </Text>
                  <Text style={[styles.vocabZh, { color: colors.muted }]}>
                    {item.zh}
                  </Text>
                </View>
                <View style={styles.vocabMeta}>
                  <Text
                    style={[
                      styles.level,
                      { color: item.mastered ? colors.success : colors.muted },
                    ]}
                  >
                    {item.level}
                  </Text>
                  <IconSymbol
                    name={
                      item.mastered ? "checkmark.circle.fill" : "chevron.right"
                    }
                    size={17}
                    color={item.mastered ? colors.success : colors.muted}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {phrases.map((item) => (
              <Pressable
                key={item.category}
                accessibilityRole="button"
                accessibilityLabel={`${item.category}, ${item.ug}, ${item.zh}`}
                style={({ pressed }) => [
                  styles.phraseCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.phraseIcon,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <IconSymbol
                    name="book.fill"
                    size={19}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.vocabCopy}>
                  <Text
                    style={[styles.phraseCategory, { color: colors.primary }]}
                  >
                    {item.category}
                  </Text>
                  <Text style={[styles.vocabUg, { color: colors.foreground }]}>
                    {item.ug}
                  </Text>
                  <Text style={[styles.vocabZh, { color: colors.muted }]}>
                    {item.zh} · {item.count}
                  </Text>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={17}
                  color={colors.muted}
                />
              </Pressable>
            ))}
          </View>
        )}

        <View style={[styles.cultureHeader, { borderColor: colors.border }]}>
          <View>
            <Text style={[styles.cultureEyebrow, { color: colors.primary }]}>
              CULTURE · مەدەنىيەت
            </Text>
            <Text style={[styles.cultureTitle, { color: colors.foreground }]}>
              Learn beyond the phrase.
            </Text>
          </View>
          <IconSymbol name="sparkles" size={18} color={colors.warning} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cultureRail}
        >
          <CultureCategoryButton
            label="All"
            active={culturalCategory === "all"}
            onPress={() => setCulturalCategory("all")}
            colors={colors}
          />
          <CultureCategoryButton
            label="Music"
            active={culturalCategory === "music"}
            onPress={() => setCulturalCategory("music")}
            colors={colors}
          />
          <CultureCategoryButton
            label="Poetry"
            active={culturalCategory === "poetry"}
            onPress={() => setCulturalCategory("poetry")}
            colors={colors}
          />
          <CultureCategoryButton
            label="Cuisine"
            active={culturalCategory === "cuisine"}
            onPress={() => setCulturalCategory("cuisine")}
            colors={colors}
          />
          <CultureCategoryButton
            label="Art"
            active={culturalCategory === "calligraphy"}
            onPress={() => setCulturalCategory("calligraphy")}
            colors={colors}
          />
        </ScrollView>
        <View style={styles.cultureList}>
          {culturalCards.map((card) => (
            <CulturalLearningCard
              key={card.id}
              card={card}
              completed={completedCulturalIds.includes(card.id)}
              colors={colors}
              onPress={() => {
                setSelectedCulturalCard(card);
                setLearnStatus(`Opened ${card.title}`);
              }}
            />
          ))}
        </View>
        <CulturalDetailSheet
          card={selectedCulturalCard}
          colors={colors}
          onClose={closeCulturalSheet}
          onComplete={(card) => markCulturalComplete(card.id, card.title)}
        />

        <View
          style={[
            styles.practice,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.practiceIcon,
              { backgroundColor: `${colors.warning}18` },
            ]}
          >
            <IconSymbol name="sparkles" size={20} color={colors.warning} />
          </View>
          <View style={styles.practiceCopy}>
            <Text style={[styles.practiceTitle, { color: colors.foreground }]}>
              Ready for a quick review?
            </Text>
            <Text style={[styles.practiceBody, { color: colors.muted }]}>
              Practice one saved phrase and keep your momentum.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              practiceEntry
                ? `Practice saved phrase ${practiceEntry.source}`
                : "Start a new translation practice"
            }
            accessibilityHint={
              practiceEntry
                ? "Opens Translate with a saved phrase ready to review"
                : "Opens Translate so you can create your first saved phrase"
            }
            onPress={startPractice}
            style={({ pressed }) => [
              styles.practiceButton,
              { backgroundColor: colors.primary },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.practiceButtonText}>
              {practiceEntry ? "Start" : "Create"}
            </Text>
            <IconSymbol name="chevron.right" size={15} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function CultureCategoryButton({
  active,
  label,
  onPress,
  colors,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.cultureCategory,
        {
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? `${colors.primary}12` : colors.surface,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.cultureCategoryText,
          { color: active ? colors.primary : colors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SegmentButton({
  active,
  label,
  onPress,
  colors,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.segmentButton,
        active && { backgroundColor: colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.segmentText,
          { color: active ? "#FFFFFF" : colors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingBottom: 32 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginTop: 3,
  },
  title: { fontSize: 32, fontWeight: "900", marginTop: -5 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: -7 },
  progressCard: { borderRadius: 23, padding: 18, marginTop: 4 },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressEyebrow: {
    color: "#DBEAFE",
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: "800",
  },
  progressTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 5,
  },
  progressCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  progressNumber: { fontSize: 14, fontWeight: "900" },
  progressTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor: "#FFFFFF35",
    marginTop: 17,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: "#FFFFFF" },
  progressHint: { color: "#DBEAFE", fontSize: 11, marginTop: 9 },
  segment: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
  },
  segmentText: { fontSize: 11, fontWeight: "800" },
  list: { gap: 9 },
  vocabCard: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  levelDot: { width: 9, height: 9, borderRadius: 5, marginRight: 11 },
  vocabCopy: { flex: 1, gap: 3 },
  vocabUg: { fontSize: 16, lineHeight: 23, fontWeight: "700" },
  vocabZh: { fontSize: 12, lineHeight: 18 },
  vocabMeta: { alignItems: "flex-end", gap: 5 },
  level: { fontSize: 10, fontWeight: "700" },
  phraseCard: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  phraseIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  phraseCategory: { fontSize: 11, fontWeight: "800" },
  practice: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  practiceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  practiceCopy: { flex: 1 },
  practiceTitle: { fontSize: 13, fontWeight: "800" },
  practiceBody: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  practiceButton: {
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  practiceButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  cultureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 2,
  },
  cultureEyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  learnStatus: { fontSize: 11, fontWeight: "800", marginTop: -7 },
  learnPersistenceStatus: { fontSize: 11, fontWeight: "800", marginTop: 2 },
  cultureTitle: { fontSize: 19, fontWeight: "900", marginTop: 4 },
  cultureRail: { gap: 8, paddingVertical: 2 },
  cultureCategory: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  cultureCategoryText: { fontSize: 11, fontWeight: "800" },
  cultureList: { gap: 9 },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0F172A66",
  },
  detailSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    marginBottom: 17,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
  },
  sheetTitle: { fontSize: 25, fontWeight: "900", marginTop: 14 },
  sheetNative: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  sheetMeta: { fontSize: 12, marginTop: 8 },
  sheetBody: { fontSize: 15, lineHeight: 23, marginTop: 18 },
  takeaway: { borderRadius: 16, borderWidth: 1, padding: 13, marginTop: 18 },
  takeawayLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  takeawayText: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  sheetButton: {
    minHeight: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  sheetButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.72 },
});
