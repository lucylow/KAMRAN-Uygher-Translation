import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Speech from "expo-speech";
import { useLocalSearchParams } from "expo-router";
import { AsyncStatus } from "@/components/async-status";
import { ScreenContainer } from "@/components/screen-container";
import { TranslationCard } from "@/components/translation-card";
import { VoiceControls } from "@/components/voice-controls";
import { VoiceStatusMetadata } from "@/components/voice-status-metadata";
import { VoiceSettingsPanel } from "@/components/voice-settings-panel";
import { TranslationActionBar } from "@/components/translation-action-bar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getHistoryPersistenceModeMessage } from "@/lib/app-settings";
import {
  getMockTranslationFallback,
  mockTranslate,
  type TranslationDirection,
} from "@/lib/mock-translation";
import {
  formatTranslationResultStatus,
  getTranslationDirectionLabel,
} from "@/lib/translation-presentation";
import {
  getMockVoiceFallback,
  mockCaptureVoice,
} from "@/lib/mock-voice";
import {
  checkMockVoiceReadiness,
  getVoiceReadinessMessage,
  type VoiceReadiness,
} from "@/lib/voice-readiness";
import {
  getSpeechProfile,
  type SpeechRate,
  type VoiceProfileId,
} from "@/lib/voice-settings";
import {
  getVoiceAvailabilityMessage,
  resolveVoiceIdentifier,
  type AvailableVoiceMetadata,
} from "@/lib/voice-availability";
import {
  transitionVoiceLifecycle,
  type VoiceLifecycleState,
} from "@/lib/voice-lifecycle";
import { requestVoiceChannel, type VoiceChannel } from "@/lib/voice-channel";
import {
  canStartVoiceCapture,
  getVoiceHandoffMessage,
  shouldInvalidatePlayback,
  type VoiceHandoffState,
} from "@/lib/voice-handoff";
import {
  assessVoiceQuality,
  type VoiceQualityAssessment,
} from "@/lib/voice-quality";
import {
  assessCaptureLevel,
  getVoiceReviewGuidance,
  type CaptureLevelMetadata,
} from "@/lib/voice-capture";
import { requiresVoiceReview } from "@/lib/voice-review";
import {
  DEFAULT_VOICE_PREFERENCES,
  getVoicePreferencesPersistenceMessage,
  parseVoicePreferences,
  serializeVoicePreferences,
  VOICE_PREFERENCES_KEY,
} from "@/lib/voice-preferences";
import { useTranslationStore } from "@/lib/translation-store";
import {
  readStoredJsonWithStatus,
  writeStoredJson,
} from "@/lib/async-storage-json";
import {
  beginLatestRequest,
  invalidateLatestRequest,
  isLatestRequest,
} from "@/lib/request-guard";
import { haptic } from "@/lib/haptics";
import { isAbortError } from "@/lib/error-utils";
import {
  getRecoveryFallbackMessage,
  withRecoveryFallback,
} from "@/lib/recovery-fallback";
import {
  getDefaultDialect,
  getDialectById,
  getDialectFallbackMessage,
  getDialectsForDirection,
} from "@/lib/dialect-config";
import { getDialectPhraseSuggestions } from "../../lib/dialect-phrases";
import type { TranslationOrigin } from "@/lib/translation-provenance";

export default function TranslateScreen() {
  const colors = useColors();
  const { practiceSource, practiceDirection } = useLocalSearchParams<{
    practiceSource?: string | string[];
    practiceDirection?: string | string[];
  }>();
  const { addTranslation, saveHistoryEnabled } = useTranslationStore();
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [translationOrigin, setTranslationOrigin] =
    useState<TranslationOrigin>("primary");
  const [direction, setDirection] = useState<TranslationDirection>("ug-zh");
  const [dialectId, setDialectId] = useState(
    () => getDefaultDialect("ug-zh").id,
  );
  const [showDialectOptions, setShowDialectOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceLifecycleState>("idle");
  const [voiceChannel, setVoiceChannel] = useState<VoiceChannel>("idle");
  const [voiceHandoff, setVoiceHandoff] = useState<VoiceHandoffState>("ready");
  const [voiceQuality, setVoiceQuality] =
    useState<VoiceQualityAssessment | null>(null);
  const [captureLevel, setCaptureLevel] = useState<CaptureLevelMetadata>(() =>
    assessCaptureLevel(0),
  );
  const [voiceReviewRequired, setVoiceReviewRequired] = useState(false);
  const [voiceReviewAcknowledged, setVoiceReviewAcknowledged] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [status, setStatus] = useState("Ready when you are");
  const [voiceReadiness, setVoiceReadiness] =
    useState<VoiceReadiness>("checking");
  const [voiceEngine, setVoiceEngine] = useState(
    "Checking microphone readiness…",
  );
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [speechRate, setSpeechRate] = useState<SpeechRate>(
    DEFAULT_VOICE_PREFERENCES.speechRate,
  );
  const [voiceProfileId, setVoiceProfileId] = useState<VoiceProfileId>(
    DEFAULT_VOICE_PREFERENCES.profileId,
  );
  const [preferencesHydrated, setPreferencesHydrated] = useState(false);
  const [voicePreferencesPersistenceError, setVoicePreferencesPersistenceError] =
    useState("");
  const [playbackElapsed, setPlaybackElapsed] = useState(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  const [nativeVoices, setNativeVoices] = useState<AvailableVoiceMetadata[]>(
    [],
  );
  const pulse = useRef(new Animated.Value(1)).current;
  const voiceController = useRef<AbortController | null>(null);
  const translationController = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const preferenceWriteId = useRef(0);
  const playbackId = useRef(0);
  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackInput = useRef({ text: "", direction });
  const mountedRef = useRef(true);
  const practiceParamsApplied = useRef(false);

  useEffect(() => {
    if (practiceParamsApplied.current) return;
    const sourceParam = Array.isArray(practiceSource)
      ? practiceSource[0]
      : practiceSource;
    if (!sourceParam?.trim()) return;

    practiceParamsApplied.current = true;
    const nextDirection =
      (Array.isArray(practiceDirection)
        ? practiceDirection[0]
        : practiceDirection) === "zh-ug"
        ? "zh-ug"
        : "ug-zh";
    setDirection(nextDirection);
    setDialectId(getDefaultDialect(nextDirection).id);
    setSource(sourceParam);
    setResult("");
    setTranslationOrigin("primary");
    setStatus("Saved phrase loaded for practice");
  }, [practiceDirection, practiceSource]);

  useEffect(() => {
    let mounted = true;
    checkMockVoiceReadiness()
      .then((readiness) => {
        if (!mounted) return;
        setVoiceReadiness(readiness.state);
        setVoiceEngine(readiness.engineName);
      })
      .catch(() => {
        if (!mounted) return;
        setVoiceReadiness("unavailable");
        setVoiceEngine("Microphone readiness unavailable");
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        if (!mounted) return;
        setNativeVoices(
          voices.map((voice) => ({
            identifier: voice.identifier,
            language: voice.language,
            name: voice.name,
            quality: String(voice.quality),
          })),
        );
      })
      .catch(() => {
        if (mounted) setNativeVoices([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    readStoredJsonWithStatus(
      VOICE_PREFERENCES_KEY,
      parseVoicePreferences,
      DEFAULT_VOICE_PREFERENCES,
    ).then((readResult) => {
      if (!mounted) return;
      setSpeechRate(readResult.value.speechRate);
      setVoiceProfileId(readResult.value.profileId);
      setVoicePreferencesPersistenceError(
        getVoicePreferencesPersistenceMessage(readResult.ok),
      );
      setPreferencesHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!preferencesHydrated) return;
    let mounted = true;
    const activeWrite = ++preferenceWriteId.current;
    void writeStoredJson(
      VOICE_PREFERENCES_KEY,
      { speechRate, profileId: voiceProfileId },
      serializeVoicePreferences,
    ).then((writeResult) => {
      if (!mounted || activeWrite !== preferenceWriteId.current) return;
      setVoicePreferencesPersistenceError(
        getVoicePreferencesPersistenceMessage(writeResult.ok),
      );
      if (!writeResult.ok) {
        setStatus(
          "Voice preferences changed for this session, but could not be saved",
        );
      }
    });
    return () => {
      mounted = false;
    };
  }, [preferencesHydrated, speechRate, voiceProfileId]);

  useEffect(() => {
    if (!voiceActive) {
      setVoiceDuration(0);
      return;
    }
    let mounted = true;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      if (!mounted) return;
      setVoiceDuration(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [voiceActive]);

  useEffect(() => {
    if (!speaking) {
      setPlaybackElapsed(0);
      return;
    }
    let mounted = true;
    const startedAt = Date.now();
    const interval = setInterval(() => {
      if (!mounted) return;
      setPlaybackElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [speaking]);

  useEffect(() => {
    if (
      speaking &&
      shouldInvalidatePlayback(
        playbackInput.current.text,
        source,
        playbackInput.current.direction,
        direction,
      )
    ) {
      playbackId.current += 1;
      void Speech.stop().catch(() => undefined);
      setSpeaking(false);
      setSpeechPaused(false);
      setVoiceChannel("idle");
      setStatus("Playback stopped because the translation changed");
    }
    playbackInput.current = { text: source, direction };
  }, [direction, source, speaking]);

  useEffect(() => {
    if (!voiceActive && !speaking) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, speaking, voiceActive]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      invalidateLatestRequest(requestId);
      playbackId.current += 1;
      if (restartTimer.current) clearTimeout(restartTimer.current);
      voiceController.current?.abort();
      translationController.current?.abort();
      void Speech.stop().catch(() => undefined);
    };
  }, []);

  const translate = async () => {
    Keyboard.dismiss();
    if (!source.trim() || loading) {
      if (!source.trim()) setStatus("Write something to translate first");
      return;
    }
    if (
      requiresVoiceReview(voiceQuality?.quality ?? null) &&
      voiceReviewRequired &&
      !voiceReviewAcknowledged
    ) {
      setVoiceReviewAcknowledged(true);
      setStatus(
        `${getVoiceReviewGuidance(voiceQuality?.quality === "clear" ? 0.94 : voiceQuality?.quality === "review" ? 0.82 : 0.62)} Review the source phrase, then tap Translate again.`,
      );
      return;
    }
    setLoading(true);
    setStatus("KAMRAN AI is thinking…");
    const activeRequest = beginLatestRequest(requestId);
    const controller = new AbortController();
    translationController.current?.abort();
    translationController.current = controller;
    try {
      const recovery = await withRecoveryFallback(
        () => mockTranslate(source, direction, controller.signal),
        () => getMockTranslationFallback(source, direction),
      );
      const response = recovery.value;
      if (!isLatestRequest(requestId, activeRequest)) return;
      setResult(response.translatedText);
      setTranslationOrigin(recovery.usedFallback ? "fallback" : "primary");
      setVoiceReviewRequired(false);
      setVoiceReviewAcknowledged(false);
      haptic.success();
      setStatus(
        recovery.usedFallback && recovery.reason
          ? `${getRecoveryFallbackMessage("translation", recovery.reason)} ${formatTranslationResultStatus(response)}`
          : formatTranslationResultStatus(response),
      );
      addTranslation({
        source: source.trim(),
        result: response.translatedText,
        direction: getTranslationDirectionLabel(direction),
        origin: recovery.usedFallback ? "fallback" : "primary",
      });
    } catch (error) {
      if (isAbortError(error)) return;
      if (isLatestRequest(requestId, activeRequest)) {
        haptic.error();
        setStatus("Translation failed — please try again");
      }
    } finally {
      if (translationController.current === controller)
        translationController.current = null;
      if (isLatestRequest(requestId, activeRequest)) setLoading(false);
    }
  };

  const toggleDirection = () => {
    const nextDirection = direction === "ug-zh" ? "zh-ug" : "ug-zh";
    setDirection(nextDirection);
    setDialectId(getDefaultDialect(nextDirection).id);
    setSource(result);
    setResult(source);
    setStatus("Languages swapped");
  };

  const finishVoiceCapture = useCallback(
    (
      nextState: VoiceLifecycleState,
      nextHandoff: VoiceHandoffState,
      message = getVoiceHandoffMessage("retry"),
    ) => {
      if (!mountedRef.current) return;
      setVoiceActive(false);
      setVoiceChannel("idle");
      setVoiceHandoff(nextHandoff);
      setVoiceState(nextState);
      setStatus(message);
    },
    [],
  );

  const resetTranslation = () => {
    requestId.current += 1;
    playbackId.current += 1;
    voiceController.current?.abort();
    voiceController.current = null;
    translationController.current?.abort();
    translationController.current = null;
    if (restartTimer.current) clearTimeout(restartTimer.current);
    void Speech.stop().catch(() => undefined);
    setSource("");
    setResult("");
    setTranslationOrigin("primary");
    setLoading(false);
    setVoiceActive(false);
    setSpeaking(false);
    setSpeechPaused(false);
    setVoiceChannel("idle");
    setVoiceState("idle");
    setVoiceHandoff("ready");
    setVoiceQuality(null);
    setVoiceReviewRequired(false);
    setVoiceReviewAcknowledged(false);
    setStatus("Translation cleared");
    haptic.light();
  };

  const toggleVoice = async () => {
    haptic.light();
    if (voiceReadiness === "checking") {
      setVoiceHandoff("preparing");
      setStatus("Checking microphone readiness…");
      return;
    }
    if (!canStartVoiceCapture(voiceReadiness)) {
      haptic.error();
      setVoiceHandoff("blocked");
      setVoiceState("error");
      setStatus(getVoiceReadinessMessage(voiceReadiness));
      return;
    }
    if (voiceActive) {
      voiceController.current?.abort();
      voiceController.current = null;
      finishVoiceCapture(
        transitionVoiceLifecycle(voiceState, "cancel"),
        "retry",
      );
      return;
    }
    const channelAction = requestVoiceChannel(voiceChannel, "input");
    if (channelAction.stopPlayback) {
      playbackId.current += 1;
      void Speech.stop().catch(() => undefined);
      setSpeaking(false);
      setSpeechPaused(false);
    }
    setVoiceChannel(channelAction.next);
    setVoiceHandoff("preparing");
    setStatus(getVoiceHandoffMessage("preparing"));
    const controller = new AbortController();
    voiceController.current = controller;
    setVoiceState((current) => transitionVoiceLifecycle(current, "prepare"));
    setVoiceActive(true);
    setVoiceDuration(0);
    setVoiceState("listening");
    setVoiceQuality(null);
    setVoiceReviewRequired(false);
    setVoiceReviewAcknowledged(false);
    setCaptureLevel(assessCaptureLevel(0.5));
    setVoiceHandoff("capturing");
    setStatus(getVoiceHandoffMessage("capturing"));
    try {
      const recovery = await withRecoveryFallback(
        () => mockCaptureVoice(direction, controller.signal),
        () => getMockVoiceFallback(direction),
      );
      const capture = recovery.value;
      if (controller.signal.aborted) {
        finishVoiceCapture("cancelled", "retry");
        return;
      }
      setVoiceState((current) => transitionVoiceLifecycle(current, "capture"));
      setVoiceHandoff("processing");
      setStatus(getVoiceHandoffMessage("processing"));
      const quality = assessVoiceQuality(capture.confidence);
      setVoiceQuality(quality);
      setVoiceReviewRequired(quality.quality !== "clear");
      setVoiceReviewAcknowledged(false);
      setSource(capture.text);
      finishVoiceCapture(
        "complete",
        quality.quality === "retry" ? "retry" : "handoff",
        `${recovery.usedFallback && recovery.reason ? `${getRecoveryFallbackMessage("voice", recovery.reason)} ` : ""}${quality.label} · ${quality.guidance} · ${capture.engine} · ${capture.latencyMs}ms · ${Math.round(capture.confidence * 100)}% confidence`,
      );
    } catch (error) {
      if (isAbortError(error)) {
        finishVoiceCapture("cancelled", "retry");
        return;
      }
      finishVoiceCapture("error", "retry");
      haptic.error();
    } finally {
      if (voiceController.current === controller)
        voiceController.current = null;
    }
  };

  const finishSpeechPlayback = useCallback((message: string) => {
    if (!mountedRef.current) return;
    setSpeaking(false);
    setSpeechPaused(false);
    setVoiceChannel("idle");
    setStatus(message);
  }, []);

  const stopSpeechPlayback = useCallback((message?: string) => {
    playbackId.current += 1;
    void Speech.stop().catch(() => undefined);
    setSpeaking(false);
    setSpeechPaused(false);
    setVoiceChannel("idle");
    if (message) setStatus(message);
  }, []);

  const playSpeech = () => {
    if (!result) {
      setStatus("Translate a phrase before playing it");
      return;
    }
    const profile = getSpeechProfile(direction, voiceProfileId);
    const resolution = resolveVoiceIdentifier(profile, nativeVoices);
    if (!profile.supported) {
      haptic.error();
      setStatus(
        `No voice is available for ${targetLabel}. Try the fallback profile.`,
      );
      return;
    }
    const channelAction = requestVoiceChannel(voiceChannel, "playback");
    if (channelAction.stopInput) {
      voiceController.current?.abort();
      voiceController.current = null;
      setVoiceActive(false);
      setVoiceState("cancelled");
    }
    setVoiceChannel(channelAction.next);
    const activePlayback = ++playbackId.current;
    setSpeaking(true);
    setSpeechPaused(false);
    setPlaybackElapsed(0);
    setStatus(
      profile.usesFallback
        ? `Playing with ${profile.label}…`
        : "Playing pronunciation…",
    );
    try {
      Speech.speak(result, {
        language: profile.language,
        rate: speechRate,
        ...(resolution.voiceIdentifier
          ? { voice: resolution.voiceIdentifier }
          : {}),
        onDone: () => {
          if (activePlayback !== playbackId.current) return;
          finishSpeechPlayback("Playback complete");
        },
        onStopped: () => {
          if (activePlayback !== playbackId.current) return;
          finishSpeechPlayback("Playback stopped");
        },
        onPause: () => {
          if (activePlayback === playbackId.current && mountedRef.current) {
            setSpeechPaused(true);
            setStatus("Playback paused");
          }
        },
        onResume: () => {
          if (activePlayback === playbackId.current && mountedRef.current) {
            setSpeechPaused(false);
            setStatus("Playback resumed");
          }
        },
        onError: () => {
          if (activePlayback !== playbackId.current) return;
          finishSpeechPlayback("Playback unavailable on this device");
          haptic.error();
        },
      });
    } catch {
      if (activePlayback !== playbackId.current || !mountedRef.current) return;
      finishSpeechPlayback("Playback unavailable on this device");
      haptic.error();
    }
  };

  const toggleSpeech = () => {
    haptic.light();
    if (speaking) {
      stopSpeechPlayback("Playback stopped");
      return;
    }
    playSpeech();
  };

  const restartSpeech = () => {
    haptic.light();
    if (!result) {
      setStatus("Translate a phrase before restarting playback");
      return;
    }
    stopSpeechPlayback("Restarting playback…");
    if (restartTimer.current) clearTimeout(restartTimer.current);
    restartTimer.current = setTimeout(() => {
      restartTimer.current = null;
      if (!mountedRef.current) return;
      playSpeech();
    }, 80);
  };

  const rerecordVoice = () => {
    stopSpeechPlayback();
    setVoiceQuality(null);
    setVoiceReviewRequired(false);
    setVoiceReviewAcknowledged(false);
    setStatus("Ready to record again");
    void toggleVoice();
  };

  const confirmVoiceReview = () => {
    setVoiceReviewAcknowledged(true);
    setStatus("Recognized phrase confirmed — tap Translate when ready");
  };

  const selectedProfile = getSpeechProfile(direction, voiceProfileId);
  const voiceResolution = resolveVoiceIdentifier(selectedProfile, nativeVoices);

  const togglePause = () => {
    if (!speaking || Platform.OS === "android") return;
    haptic.light();
    const activePlayback = playbackId.current;
    if (speechPaused) {
      void Speech.resume().catch(() => {
        if (mountedRef.current && activePlayback === playbackId.current) {
          setStatus("Resume is unavailable on this device");
        }
      });
    } else {
      void Speech.pause().catch(() => {
        if (mountedRef.current && activePlayback === playbackId.current) {
          setStatus("Pause is unavailable on this device");
        }
      });
    }
  };

  const sourceLabel = direction === "ug-zh" ? "Uyghur" : "中文";
  const targetLabel = direction === "ug-zh" ? "中文" : "Uyghur";
  const dialectOptions = getDialectsForDirection(direction);
  const selectedDialect =
    getDialectById(dialectId) ?? getDefaultDialect(direction);
  const dialectPhrases = getDialectPhraseSuggestions(selectedDialect.id);

  return (
    <ScreenContainer className="px-5 pt-3" containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View>
            <Text className="text-sm font-medium text-muted">
              Translation desk
            </Text>
            <Text className="mt-1 text-3xl font-bold text-foreground">
              Find the right words.
            </Text>
          </View>
          <View
            style={[styles.badge, { backgroundColor: `${colors.primary}18` }]}
          >
            <IconSymbol name="sparkles" size={17} color={colors.primary} />
          </View>
        </View>
        <View
          style={[
            styles.selector,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.languagePill,
              { backgroundColor: `${colors.primary}12` },
            ]}
          >
            <View
              style={[styles.languageDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.selectorLabel, { color: colors.primary }]}>
              {sourceLabel}
            </Text>
          </View>
          <Pressable
            onPress={toggleDirection}
            accessibilityRole="button"
            accessibilityLabel="Swap translation languages"
            style={({ pressed }) => [
              styles.swap,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol
              name="arrow.left.arrow.right"
              size={17}
              color={colors.foreground}
            />
          </Pressable>
          <View
            style={[
              styles.languagePill,
              { backgroundColor: `${colors.success}12` },
            ]}
          >
            <View
              style={[styles.languageDot, { backgroundColor: colors.success }]}
            />
            <Text style={[styles.selectorLabel, { color: colors.foreground }]}>
              {targetLabel}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setShowDialectOptions((visible) => !visible)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showDialectOptions }}
          style={({ pressed }) => [
            styles.dialectToggle,
            { borderColor: colors.border, backgroundColor: colors.surface },
            pressed && styles.pressed,
          ]}
        >
          <View>
            <Text
              style={[styles.dialectToggleTitle, { color: colors.foreground }]}
            >
              Language variant
            </Text>
            <Text style={[styles.dialectToggleDetail, { color: colors.muted }]}>
              {selectedDialect.name} · {selectedDialect.region}
            </Text>
          </View>
          <IconSymbol name="chevron.down" size={17} color={colors.muted} />
        </Pressable>
        {showDialectOptions ? (
          <View
            style={[
              styles.dialectCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.dialectHint, { color: colors.muted }]}>
              {getDialectFallbackMessage(selectedDialect)}
            </Text>
            <View style={styles.dialectList}>
              {dialectOptions.map((dialect) => (
                <Pressable
                  key={dialect.id}
                  onPress={() => {
                    haptic.light();
                    setDialectId(dialect.id);
                    setStatus(getDialectFallbackMessage(dialect));
                  }}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selectedDialect.id === dialect.id,
                  }}
                  style={[
                    styles.dialectChip,
                    {
                      borderColor:
                        selectedDialect.id === dialect.id
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        selectedDialect.id === dialect.id
                          ? `${colors.primary}12`
                          : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dialectChipName,
                      {
                        color:
                          selectedDialect.id === dialect.id
                            ? colors.primary
                            : colors.foreground,
                      },
                    ]}
                  >
                    {dialect.nativeName}
                  </Text>
                  <Text
                    style={[styles.dialectChipMeta, { color: colors.muted }]}
                  >
                    {dialect.region}
                  </Text>
                </Pressable>
              ))}
            </View>
            {dialectPhrases.length ? (
              <View style={styles.phraseSuggestions}>
                <Text style={[styles.dialectHint, { color: colors.muted }]}>
                  Try a phrase
                </Text>
                {dialectPhrases.map((phrase) => (
                  <Pressable
                    key={phrase.id}
                    onPress={() => {
                      haptic.light();
                      setSource(phrase.source);
                      setStatus(`Loaded ${phrase.category} phrase`);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Use phrase ${phrase.source}`}
                    style={({ pressed }) => [
                      styles.phraseChip,
                      { borderColor: colors.border },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.phraseChipSource,
                        { color: colors.foreground },
                      ]}
                    >
                      {phrase.source}
                    </Text>
                    <Text
                      style={[styles.phraseChipResult, { color: colors.muted }]}
                    >
                      {phrase.translation}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
        <TranslationCard
          colors={colors}
          source={source}
          result={result}
          direction={direction}
          origin={translationOrigin}
          sourceLabel={sourceLabel}
          targetLabel={targetLabel}
          dialectRegion={selectedDialect.region}
          loading={loading}
          voiceReviewRequired={voiceReviewRequired}
          onChangeSource={(text) => {
            setSource(text);
            if (voiceReviewRequired) setVoiceReviewAcknowledged(true);
          }}
          onSubmit={translate}
        />

        <AsyncStatus
          message={getHistoryPersistenceModeMessage(saveHistoryEnabled)}
          colors={colors}
          style={styles.historyModeStatus}
        />
        <VoiceControls
          colors={colors}
          pulse={pulse}
          voiceActive={voiceActive}
          voiceState={voiceState}
          voiceQuality={voiceQuality}
          voiceDuration={voiceDuration}
          speaking={speaking}
          speechPaused={speechPaused}
          playbackElapsed={playbackElapsed}
          loading={loading}
          hasResult={Boolean(result)}
          voiceReviewAcknowledged={voiceReviewAcknowledged}
          onToggleVoice={toggleVoice}
          onToggleSpeech={toggleSpeech}
          onRerecord={rerecordVoice}
          onConfirmReview={confirmVoiceReview}
          onRestartSpeech={restartSpeech}
          onTogglePause={togglePause}
        />
        <VoiceStatusMetadata
          colors={colors}
          voiceReadiness={voiceReadiness}
          voiceEngine={voiceEngine}
          voiceState={voiceState}
          voiceDuration={voiceDuration}
          voiceChannel={voiceChannel}
          voiceHandoff={voiceHandoff}
          voiceQuality={voiceQuality}
          voiceActive={voiceActive}
          captureLevel={captureLevel}
          voiceReviewRequired={voiceReviewRequired}
        />
        <VoiceSettingsPanel
          colors={colors}
          direction={direction}
          expanded={showVoiceSettings}
          speechRate={speechRate}
          voiceProfileId={voiceProfileId}
          selectedProfileLabel={selectedProfile.label}
          selectedProfileUsesFallback={selectedProfile.usesFallback}
          voiceAvailabilityMessage={getVoiceAvailabilityMessage(
            nativeVoices.length,
            voiceResolution,
          )}
          onToggle={() => setShowVoiceSettings((visible) => !visible)}
          onSpeechRateChange={(rate) => {
            haptic.light();
            setSpeechRate(rate);
          }}
          onVoiceProfileChange={(profileId) => {
            haptic.light();
            setVoiceProfileId(profileId);
          }}
          onReset={() => {
            haptic.light();
            setSpeechRate(DEFAULT_VOICE_PREFERENCES.speechRate);
            setVoiceProfileId(DEFAULT_VOICE_PREFERENCES.profileId);
          }}
        />
        <AsyncStatus
          message={voicePreferencesPersistenceError}
          colors={colors}
          tone="error"
          style={styles.preferenceStatus}
        />
        <TranslationActionBar
          colors={colors}
          hasContent={Boolean(source || result)}
          loading={loading}
          reviewRequired={voiceReviewRequired}
          reviewAcknowledged={voiceReviewAcknowledged}
          status={status}
          onClear={resetTranslation}
          onTranslate={translate}
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  selector: {
    minHeight: 60,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  dialectToggle: {
    minHeight: 53,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dialectToggleTitle: { fontSize: 12, fontWeight: "800" },
  dialectToggleDetail: { fontSize: 11, marginTop: 3 },
  dialectCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  dialectHint: { fontSize: 11, lineHeight: 16 },
  dialectList: { gap: 8, marginTop: 10 },
  dialectChip: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  dialectChipName: { fontSize: 12, fontWeight: "800" },
  dialectChipMeta: { fontSize: 10, marginTop: 2 },
  phraseSuggestions: { gap: 8, marginTop: 12 },
  phraseChip: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  phraseChipSource: { fontSize: 13, fontWeight: "800" },
  phraseChipResult: { fontSize: 10, marginTop: 3 },
  languagePill: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  languageDot: { width: 7, height: 7, borderRadius: 4 },
  selectorLabel: { fontSize: 12, fontWeight: "800" },
  swap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: { flexDirection: "row", gap: 10, marginTop: 14 },
  voiceButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  controlText: { fontSize: 13, fontWeight: "700" },
  button: {
    height: 54,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  buttonText: { color: "#FFF9F0", fontWeight: "800", fontSize: 16 },
  voiceMeta: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  playbackActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  restartButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  pauseButton: {
    minWidth: 78,
    minHeight: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  restartText: { fontSize: 12, fontWeight: "700" },
  status: { textAlign: "center", fontSize: 12, marginTop: 10 },
  preferenceStatus: { textAlign: "center", fontSize: 11, marginTop: 8 },
  historyModeStatus: { textAlign: "center", fontSize: 11, marginTop: 8 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.7 },
});
