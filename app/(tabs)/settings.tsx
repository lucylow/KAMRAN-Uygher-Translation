import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { AsyncStatus } from "@/components/async-status";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { CulturalProgressSummary } from "@/components/cultural-progress-summary";
import { SettingRow, SettingsSection } from "@/components/settings-primitives";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslationStore } from "@/lib/translation-store";
import { haptic } from "@/lib/haptics";
import {
  DEFAULT_LEARN_PROGRESS,
  LEARN_PROGRESS_KEY,
  parseLearnProgress,
} from "@/lib/learn-progress";
import { getCulturalLearningCards } from "@/lib/cultural-content";
import { DEMO_TRANSLATIONS } from "@/lib/demo-data";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  getSettingsPersistenceMessage,
  getSettingsSaveFeedback,
  parseLocalSettings,
  getSettingsRetryLabel,
  serializeLocalSettings,
  type LocalSettings,
} from "@/lib/app-settings";
import {
  readStoredJsonWithStatus,
  removeStoredValue,
  writeStoredJson,
} from "@/lib/async-storage-json";

const CULTURAL_LESSON_TOTAL = getCulturalLearningCards("all").length;

export default function SettingsScreen() {
  const colors = useColors();
  const {
    addTranslation,
    clearHistory,
    history,
    persistenceError,
    setSaveHistoryEnabled,
  } = useTranslationStore();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [progressStatus, setProgressStatus] = useState("");
  const [settingsPersistenceError, setSettingsPersistenceError] = useState("");
  const [progressStatusTone, setProgressStatusTone] = useState<
    "info" | "success" | "error"
  >("info");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resettingProgress, setResettingProgress] = useState(false);
  const [retryingSettingsSave, setRetryingSettingsSave] = useState(false);
  const [completedCulturalCount, setCompletedCulturalCount] = useState(0);
  const [progressRefreshToken, setProgressRefreshToken] = useState(0);
  const mountedRef = useRef(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    readStoredJsonWithStatus(
      SETTINGS_KEY,
      parseLocalSettings,
      DEFAULT_SETTINGS,
    ).then((readResult) => {
      if (!active) return;
      setSettings(readResult.value);
      setSaveHistoryEnabled(readResult.value.saveHistory);
      setSettingsPersistenceError(
        getSettingsPersistenceMessage(readResult.ok),
      );
    });
    return () => {
      active = false;
    };
  }, [setSaveHistoryEnabled]);

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

  useEffect(() => {
    let active = true;
    readStoredJsonWithStatus(
      LEARN_PROGRESS_KEY,
      parseLearnProgress,
      DEFAULT_LEARN_PROGRESS,
    ).then((progressResult) => {
      if (active)
        setCompletedCulturalCount(progressResult.value.completedCulturalIds.length);
    });
    return () => {
      active = false;
    };
  }, [progressRefreshToken]);

  useEffect(() => {
    if (!persistenceError) return;
    setProgressStatus(persistenceError);
    setProgressStatusTone("error");
  }, [persistenceError]);

  const updateSetting = async <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K],
  ) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (key === "saveHistory") setSaveHistoryEnabled(Boolean(value));
    const result = await writeStoredJson(
      SETTINGS_KEY,
      next,
      serializeLocalSettings,
    );
    if (!mountedRef.current) return;
    setSettingsPersistenceError(getSettingsPersistenceMessage(result.ok));
    const feedback = getSettingsSaveFeedback(result.ok);
    setProgressStatus(feedback.message);
    setProgressStatusTone(feedback.tone);
    haptic.light();
  };

  const retrySettingsSave = async () => {
    if (retryingSettingsSave) return;
    setRetryingSettingsSave(true);
    setProgressStatus("Retrying settings save…");
    setProgressStatusTone("info");
    const result = await writeStoredJson(
      SETTINGS_KEY,
      settings,
      serializeLocalSettings,
    );
    if (!mountedRef.current) return;
    const feedback = getSettingsSaveFeedback(result.ok);
    setSettingsPersistenceError(getSettingsPersistenceMessage(result.ok));
    setProgressStatus(feedback.message);
    setProgressStatusTone(feedback.tone);
    setRetryingSettingsSave(false);
    haptic.light();
  };

  return (
    <ScreenContainer className="px-5 pt-3" containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          KAMRAN AI · كامران
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Make KAMRAN feel right for your conversations.
        </Text>

        <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.profileMark}>
            <Text style={[styles.profileLetter, { color: colors.primary }]}>
              K
            </Text>
          </View>
          <View>
            <Text style={styles.profileTitle}>KAMRAN Translate</Text>
            <Text style={styles.profileCaption}>
              Uyghur · Chinese · Offline ready
            </Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>MVP</Text>
          </View>
        </View>

        <CulturalProgressSummary
          completed={completedCulturalCount}
          total={CULTURAL_LESSON_TOTAL}
          colors={colors}
        />

        <SettingsSection
          title="Language & translation"
          subtitle="تىل ۋە تەرجىمە"
          colors={colors}
        >
          <SettingRow
            label="Interface language"
            detail="English · 中文 · ئۇيغۇرچە"
            colors={colors}
          />
          <SettingRow
            label="Default direction"
            detail="Uyghur → Chinese"
            colors={colors}
          />
          <SettingRow
            label="Auto-detect language"
            detail="Use the selected direction for now"
            colors={colors}
            control={
              <Switch
                value={settings.autoDetect}
                onValueChange={(value) => updateSetting("autoDetect", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
          <SettingRow
            label="RTL layout"
            detail="Right-to-left Uyghur text"
            colors={colors}
            control={
              <Switch
                value={settings.rtlLayout}
                onValueChange={(value) => updateSetting("rtlLayout", value)}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={colors.surface}
              />
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Voice & accessibility"
          subtitle="ئاۋاز ۋە قولايلىق"
          colors={colors}
        >
          <SettingRow
            label="Speech speed"
            detail="Normal · Configure in Translate"
            colors={colors}
          />
          <SettingRow
            label="Large touch targets"
            detail="Enabled for primary actions"
            colors={colors}
          />
          <SettingRow
            label="Reduce motion"
            detail={
              reduceMotion
                ? "Enabled by system accessibility"
                : "Standard transitions are active"
            }
            colors={colors}
            control={
              <IconSymbol
                name={reduceMotion ? "checkmark.circle.fill" : "chevron.right"}
                size={18}
                color={reduceMotion ? colors.success : colors.muted}
              />
            }
          />
          <SettingRow
            label="Dark mode"
            detail="System appearance is respected"
            colors={colors}
            control={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSetting("darkMode", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
              />
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Privacy & offline"
          subtitle="مەخپىيەتلىك ۋە توركەلمىسىز ھالەت"
          colors={colors}
        >
          <SettingRow
            label="Save translation history"
            detail={
              settings.saveHistory
                ? "Stored locally on this device"
                : "New phrases stay in this session"
            }
            colors={colors}
            control={
              <Switch
                value={settings.saveHistory}
                onValueChange={(value) => updateSetting("saveHistory", value)}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={colors.surface}
              />
            }
          />
          <SettingRow
            label="Offline mode"
            detail={
              settings.offlineMode
                ? "Mock language packs are ready"
                : "Online translation fallback is available"
            }
            colors={colors}
            control={
              <Switch
                value={settings.offlineMode}
                onValueChange={(value) => updateSetting("offlineMode", value)}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={colors.surface}
              />
            }
          />
          <SettingRow
            label="Demo mode"
            detail={
              settings.demoMode
                ? "Sample phrases are loaded locally"
                : "Try KAMRAN with sample phrases"
            }
            colors={colors}
            control={
              <Switch
                value={settings.demoMode}
                onValueChange={(value) => {
                  if (value && history.length === 0) {
                    DEMO_TRANSLATIONS.forEach(addTranslation);
                  }
                  void updateSetting("demoMode", value);
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                accessibilityLabel="Enable demo mode"
              />
            }
          />
          <Pressable
            onPress={() => {
              clearHistory();
              setProgressStatus("History cleared for this session; saving…");
              setProgressStatusTone("info");
              haptic.medium();
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear local translation history"
            style={({ pressed }) => [
              styles.destructiveRow,
              { borderTopColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol name="trash.fill" size={17} color={colors.error} />
            <View style={styles.rowCopy}>
              <Text style={[styles.destructiveTitle, { color: colors.error }]}>
                Clear translation history
              </Text>
              <Text style={[styles.rowDetail, { color: colors.muted }]}>
                Remove saved phrases from this device
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setConfirmReset(true)}
            accessibilityRole="button"
            accessibilityLabel="Reset cultural learning progress"
            style={({ pressed }) => [
              styles.destructiveRow,
              { borderTopColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol
              name="arrow.counterclockwise"
              size={17}
              color={colors.warning}
            />
            <View style={styles.rowCopy}>
              <Text style={[styles.resetTitle, { color: colors.warning }]}>
                Reset cultural progress
              </Text>
              <Text style={[styles.rowDetail, { color: colors.muted }]}>
                Clear completed cultural lessons only
              </Text>
            </View>
          </Pressable>
                      <AsyncStatus
              message={progressStatus}
              colors={colors}
              tone={progressStatusTone}
              style={styles.progressStatus}
            />
            <AsyncStatus
              message={settingsPersistenceError}
              colors={colors}
              tone="error"
              style={styles.progressStatus}
            />
            {settingsPersistenceError ? (
              <Pressable
                onPress={() => void retrySettingsSave()}
                disabled={retryingSettingsSave}
                accessibilityRole="button"
                accessibilityLabel={getSettingsRetryLabel(retryingSettingsSave)}
                accessibilityState={{
                  busy: retryingSettingsSave,
                  disabled: retryingSettingsSave,
                }}
                style={({ pressed }) => [
                  styles.retryRow,
                  { borderColor: colors.border },
                  pressed && !retryingSettingsSave && styles.pressed,
                  retryingSettingsSave && styles.disabled,
                ]}
              >
                <IconSymbol
                  name="arrow.counterclockwise"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.retryText, { color: colors.primary }]}>
                  {getSettingsRetryLabel(retryingSettingsSave)}
                </Text>
              </Pressable>
            ) : null}

        </SettingsSection>

        <Text style={[styles.version, { color: colors.muted }]}>
          KAMRAN v2.2 · كامران · 卡姆兰
        </Text>
      </ScrollView>
      <ConfirmationSheet
        visible={confirmReset}
        eyebrow="RESET · قايتا تەڭشەش"
        title="Reset cultural progress?"
        body="This clears completed cultural lessons only. Your translation history and voice preferences stay safe."
        cancelLabel="Cancel"
        confirmLabel="Reset"
        colors={colors}
        onCancel={() => setConfirmReset(false)}
        busy={resettingProgress}
        onConfirm={() => {
          if (resettingProgress) return;
          setResettingProgress(true);
          void removeStoredValue(LEARN_PROGRESS_KEY)
            .then((result) => {
              if (!mountedRef.current) return;
              if (result.ok) {
                haptic.medium();
                setProgressStatus("Cultural progress reset");
                setProgressStatusTone("success");
                setProgressRefreshToken((value) => value + 1);
                setConfirmReset(false);
              } else {
                setProgressStatus("Unable to reset cultural progress");
                setProgressStatusTone("error");
              }
            })
            .finally(() => {
              if (mountedRef.current) setResettingProgress(false);
            });
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 34, gap: 16 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 3,
  },
  title: { fontSize: 32, fontWeight: "900", marginTop: 3 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: -8 },
  profileCard: {
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  profileMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileLetter: { fontSize: 20, fontWeight: "900" },
  profileTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  profileCaption: { color: "#DBEAFE", fontSize: 11, marginTop: 3 },
  proBadge: {
    marginLeft: "auto",
    backgroundColor: "#FFFFFF30",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  proText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  rowCopy: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 14, fontWeight: "700" },
  rowDetail: { fontSize: 11, marginTop: 3, lineHeight: 16 },
  destructiveRow: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  destructiveTitle: { fontSize: 14, fontWeight: "700" },
  resetTitle: { fontSize: 14, fontWeight: "700" },
  progressStatus: {
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  retryRow: {
    minHeight: 42,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  retryText: { fontSize: 12, fontWeight: "800" },
  version: { textAlign: "center", fontSize: 11, marginTop: 2 },
  confirmRoot: { flex: 1, justifyContent: "center", padding: 22 },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0F172A66",
  },
  confirmCard: { borderRadius: 22, borderWidth: 1, padding: 20 },
  confirmEyebrow: { fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  confirmTitle: { fontSize: 22, fontWeight: "900", marginTop: 7 },
  confirmBody: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  confirmActions: { flexDirection: "row", gap: 10, marginTop: 18 },
  confirmCancel: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCancelText: { fontSize: 13, fontWeight: "800" },
  confirmReset: {
    flex: 1,
    minHeight: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmResetText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  pressed: { opacity: 0.68 },
  disabled: { opacity: 0.55 },
});
