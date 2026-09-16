import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { ProcessingStatus } from "@/components/processing-status";
import { AccessibleAction } from "@/components/accessible-action";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getMockOCRFallback,
  getOCRConfidenceLabel,
  mockRecognizeText,
} from "@/lib/mock-ocr";
import {
  getOCRInputOption,
  getOCRReadinessMessage,
  getOCRResultStatusMessage,
  getOCRReviewMetadata,
  getOCRSourcePreviewLabel,
  validateOCRText,
  type OCRInputSource,
  type OCRResultStatus,
} from "@/lib/ocr-input";
import {
  getMockTranslationFallback,
  mockTranslate,
} from "@/lib/mock-translation";
import { useTranslationStore } from "@/lib/translation-store";
import { haptic } from "@/lib/haptics";
import { isAbortError } from "@/lib/error-utils";
import {
  getRecoveryFallbackMessage,
  withRecoveryFallback,
} from "@/lib/recovery-fallback";
import {
  getTranslationOriginMessage,
  type TranslationOrigin,
} from "@/lib/translation-provenance";
import type { ProcessingStatusKey } from "@/lib/processing-status";

type Stage = "scan" | "review" | "translating" | "result" | "error";

export default function OCRScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addTranslation } = useTranslationStore();
  const [stage, setStage] = useState<Stage>("scan");
  const [recognizedText, setRecognizedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationOrigin, setTranslationOrigin] =
    useState<TranslationOrigin>("primary");
  const [metadata, setMetadata] = useState("Ready to scan");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [preprocessing, setPreprocessing] = useState<string[]>([]);
  const [showPreprocessing, setShowPreprocessing] = useState(false);
  const [inputSource, setInputSource] = useState<OCRInputSource>("camera");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatusKey>("ocr-preparing");
  const [resultStatus, setResultStatus] = useState<OCRResultStatus>("idle");
  const scanPulse = useRef(new Animated.Value(1)).current;
  const controller = useRef<AbortController | null>(null);
  const scanInFlight = useRef(false);
  const scanAttemptId = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controller.current?.abort();
      controller.current = null;
      scanInFlight.current = false;
      scanPulse.stopAnimation();
    };
  }, [scanPulse]);

  const stopWork = () => {
    scanAttemptId.current += 1;
    controller.current?.abort();
    controller.current = null;
    scanInFlight.current = false;
    setStage("scan");
    setMetadata("Ready to scan");
    setErrorMessage("");
  };

  const scan = async () => {
    if (stage === "translating" || scanInFlight.current) return;
    scanInFlight.current = true;
    const activeScanAttempt = ++scanAttemptId.current;
    if (inputSource === "camera") {
      try {
        if (!cameraPermission?.granted) {
          const permission = await requestCameraPermission();
          if (
            !mountedRef.current ||
            activeScanAttempt !== scanAttemptId.current
          ) {
            if (activeScanAttempt === scanAttemptId.current) {
              scanInFlight.current = false;
            }
            return;
          }
          if (!permission?.granted) {
            setErrorMessage(
              "Camera access is needed to scan text. You can use the gallery source instead.",
            );
            setMetadata("Camera permission required");
            setStage("error");
            haptic.error();
            scanInFlight.current = false;
            return;
          }
          setMetadata("Camera ready. Tap scan again to capture a frame.");
          scanInFlight.current = false;
          return;
        }
        const photo = await cameraRef.current?.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });
        if (
          !mountedRef.current ||
          activeScanAttempt !== scanAttemptId.current
        ) {
          if (activeScanAttempt === scanAttemptId.current) {
            scanInFlight.current = false;
          }
          return;
        }
        if (!photo) {
          setErrorMessage(
            "KAMRAN could not capture the camera frame. Try again or use the gallery source.",
          );
          setMetadata("Camera capture unavailable");
          setStage("error");
          haptic.error();
          scanInFlight.current = false;
          return;
        }
      } catch (error) {
        if (
          isAbortError(error) ||
          !mountedRef.current ||
          activeScanAttempt !== scanAttemptId.current
        ) {
          if (activeScanAttempt === scanAttemptId.current) {
            scanInFlight.current = false;
          }
          return;
        }
        setErrorMessage(
          "KAMRAN could not access the camera. Check permission or use the gallery source.",
        );
        setMetadata("Camera unavailable");
        setStage("error");
        haptic.error();
        scanInFlight.current = false;
        return;
      }
    }
    const nextController = new AbortController();
    controller.current = nextController;
    setStage("translating");
    setErrorMessage("");
    setProcessingStatus("ocr-preparing");
    setMetadata(
      `${getOCRInputOption(inputSource).label} · enhancing image and reading text…`,
    );
    Animated.sequence([
      Animated.timing(scanPulse, {
        toValue: 1.03,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scanPulse, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    try {
      setProcessingStatus("ocr-recognizing");
      const recovery = await withRecoveryFallback(
        () => mockRecognizeText(nextController.signal),
        () => getMockOCRFallback(),
      );
      const result = recovery.value;
      if (
        nextController.signal.aborted ||
        !mountedRef.current ||
        activeScanAttempt !== scanAttemptId.current
      )
        return;
      setRecognizedText(result.text);
      setConfidence(result.confidence);
      setPreprocessing(result.preprocessing);
      setMetadata(
        `${recovery.usedFallback && recovery.reason ? `${getRecoveryFallbackMessage("ocr", recovery.reason)} · ` : ""}${result.engine} · ${result.latencyMs}ms · ${Math.round(result.confidence * 100)}% confidence`,
      );
      setStage("review");
      haptic.success();
    } catch (error) {
      if (
        isAbortError(error) ||
        !mountedRef.current ||
        activeScanAttempt !== scanAttemptId.current
      )
        return;
      setErrorMessage(
        "KAMRAN could not read the image. Try better lighting or scan again.",
      );
      setMetadata("OCR unavailable");
      setStage("error");
      haptic.error();
    } finally {
      if (controller.current === nextController) controller.current = null;
      if (activeScanAttempt === scanAttemptId.current) {
        scanInFlight.current = false;
      }
    }
  };

  const translate = async () => {
    if (controller.current || stage === "translating") return;
    Keyboard.dismiss();
    const validation = validateOCRText(recognizedText);
    if (!validation.valid) {
      setErrorMessage(validation.message);
      setMetadata("Review required");
      setStage("error");
      return;
    }
    const nextController = new AbortController();
    controller.current = nextController;
    setStage("translating");
    setErrorMessage("");
    setProcessingStatus("ocr-translating");
    setMetadata("Translating reviewed text…");
    try {
      const recovery = await withRecoveryFallback(
        () =>
          mockTranslate(
            recognizedText.trim(),
            "zh-ug",
            nextController.signal,
          ),
        () => getMockTranslationFallback(recognizedText.trim(), "zh-ug"),
      );
      const result = recovery.value;
      if (nextController.signal.aborted || !mountedRef.current) return;
      setTranslatedText(result.translatedText);
      setTranslationOrigin(recovery.usedFallback ? "fallback" : "primary");
      setMetadata(
        `${recovery.usedFallback && recovery.reason ? `${getRecoveryFallbackMessage("translation", recovery.reason)} · ` : ""}${result.engine} · ${result.latencyMs}ms · ${Math.round(result.confidence * 100)}% confidence`,
      );
      addTranslation({
        source: recognizedText.trim(),
        result: result.translatedText,
        direction: "Chinese → Uyghur",
        origin: recovery.usedFallback ? "fallback" : "primary",
      });
      setSaved(true);
      setResultStatus("saved");
      setStage("result");
      haptic.success();
    } catch (error) {
      if (isAbortError(error) || !mountedRef.current) return;
      setErrorMessage(
        "Translation failed. Keep the reviewed text and try again.",
      );
      setMetadata("Translation unavailable");
      setStage("error");
      haptic.error();
    } finally {
      if (controller.current === nextController) controller.current = null;
    }
  };

  const saveResult = () => {
    if (!translatedText || saved) return;
    addTranslation({
      source: recognizedText.trim(),
      result: translatedText,
      direction: "Chinese → Uyghur",
      origin: translationOrigin,
    });
    setSaved(true);
    setResultStatus("saved");
    setMetadata("Translation saved to history");
    haptic.success();
  };

  const copyResult = async () => {
    if (!translatedText) return;
    try {
      await Clipboard.setStringAsync(translatedText);
      setCopied(true);
      setResultStatus("copied");
      setMetadata("Translation copied to clipboard");
      haptic.light();
    } catch {
      setMetadata("Copy unavailable on this device");
      haptic.error();
    }
  };

  const reset = () => {
    controller.current?.abort();
    controller.current = null;
    setStage("scan");
    setRecognizedText("");
    setTranslatedText("");
    setTranslationOrigin("primary");
    setConfidence(0);
    setPreprocessing([]);
    setShowPreprocessing(false);
    setSaved(false);
    setMetadata("Ready to scan");
    setErrorMessage("");
    setCopied(false);
    setResultStatus("idle");
  };

  const isBusy = stage === "translating";
  const displayText = stage === "result" ? translatedText : recognizedText;

  return (
    <ScreenContainer
      edges={["top", "bottom", "left", "right"]}
      className="px-5 pt-3"
      containerClassName="bg-background"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            style={styles.backButton}
          >
            <IconSymbol
              name="chevron.left"
              size={25}
              color={colors.foreground}
            />
          </Pressable>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              CAMERA TRANSLATION
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Read the world.
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Choose a scan source, then review what KAMRAN detects before
          translating.
        </Text>

        <Animated.View
          style={[
            styles.scanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ scale: isBusy ? scanPulse : 1 }],
            },
          ]}
        >
          <View
            style={[
              styles.corner,
              styles.topLeft,
              { borderColor: colors.primary },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.topRight,
              { borderColor: colors.primary },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.bottomLeft,
              { borderColor: colors.primary },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.bottomRight,
              { borderColor: colors.primary },
            ]}
          />
          {stage === "scan" &&
          inputSource === "camera" &&
          cameraPermission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={styles.cameraPreview}
              facing="back"
            />
          ) : stage === "scan" ? (
            <View style={styles.scanHint}>
              <View
                style={[
                  styles.cameraIcon,
                  { backgroundColor: `${colors.primary}18` },
                ]}
              >
                <IconSymbol
                  name="camera.fill"
                  size={30}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.scanTitle, { color: colors.foreground }]}>
                {getOCRInputOption(inputSource).label}
              </Text>
              <Text style={[styles.scanBody, { color: colors.muted }]}>
                {getOCRInputOption(inputSource).guidance}
              </Text>
            </View>
          ) : null}
          {isBusy && (
            <View style={styles.scanHint}>
              <ProcessingStatus
                colors={colors}
                status={processingStatus}
                accessibilityLabel={`${metadata} in progress`}
              />
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.scanBody, { color: colors.muted }]}
              >
                {metadata}
              </Text>
            </View>
          )}
          {stage === "error" && (
            <View style={styles.scanHint}>
              <View
                style={[
                  styles.cameraIcon,
                  { backgroundColor: `${colors.error}18` },
                ]}
              >
                <IconSymbol
                  name="exclamationmark.triangle.fill"
                  size={30}
                  color={colors.error}
                />
              </View>
              <Text style={[styles.scanTitle, { color: colors.foreground }]}>
                Let’s try that again
              </Text>
              <Text style={[styles.scanBody, { color: colors.muted }]}>
                {errorMessage}
              </Text>
            </View>
          )}
          {(stage === "review" || stage === "result") && (
            <View style={styles.detected}>
              <Text style={[styles.detectedLabel, { color: colors.muted }]}>
                {stage === "review" ? "REVIEW DETECTED TEXT" : "TRANSLATION"}
              </Text>
              <Text style={[styles.detectedText, { color: colors.foreground }]}>
                {displayText}
              </Text>
              {stage === "result" && getTranslationOriginMessage(translationOrigin) ? (
                <Text
                  accessibilityLabel={getTranslationOriginMessage(translationOrigin)}
                  style={[styles.fallbackNotice, { color: colors.warning }]}
                >
                  {getTranslationOriginMessage(translationOrigin)}
                </Text>
              ) : null}
            </View>
          )}
        </Animated.View>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.metadata, { color: colors.muted }]}
        >
          {metadata}
        </Text>

        {stage === "scan" && (
          <>
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.sourcePreview, { color: colors.muted }]}
            >
              {getOCRSourcePreviewLabel(inputSource)}
            </Text>
            <Text style={[styles.readinessHint, { color: colors.muted }]}>
              {getOCRReadinessMessage(inputSource)}
            </Text>
            <View style={styles.sourceRow}>
              {(["camera", "gallery"] as OCRInputSource[]).map((source) => (
                <Pressable
                  key={source}
                  onPress={() => {
                    haptic.light();
                    setInputSource(source);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={getOCRInputOption(source).label}
                  accessibilityState={{ selected: inputSource === source }}
                  style={[
                    styles.sourceChip,
                    {
                      borderColor:
                        inputSource === source ? colors.primary : colors.border,
                      backgroundColor:
                        inputSource === source
                          ? `${colors.primary}18`
                          : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sourceChipText,
                      {
                        color:
                          inputSource === source
                            ? colors.primary
                            : colors.foreground,
                      },
                    ]}
                  >
                    {getOCRInputOption(source).label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {stage === "review" && (
          <View
            style={[
              styles.confidenceCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.confidenceHeader}>
              <Text style={[styles.reviewLabel, { color: colors.muted }]}>
                OCR CONFIDENCE
              </Text>
              <Text
                style={[
                  styles.confidenceValue,
                  {
                    color: confidence >= 0.9 ? colors.success : colors.warning,
                  },
                ]}
              >
                {Math.round(confidence * 100)}% ·{" "}
                {getOCRConfidenceLabel(confidence)}
              </Text>
            </View>
            <Text style={[styles.reviewHint, { color: colors.muted }]}>
              {confidence >= 0.9
                ? "The detected text looks reliable."
                : "Review the detected text carefully before translating."}
            </Text>
            <Pressable
              onPress={() => setShowPreprocessing((visible) => !visible)}
              accessibilityRole="button"
              accessibilityState={{ expanded: showPreprocessing }}
            >
              <Text
                style={[styles.preprocessingToggle, { color: colors.primary }]}
              >
                {showPreprocessing
                  ? "Hide processing details"
                  : "Show processing details"}
              </Text>
            </Pressable>
            {showPreprocessing && (
              <View style={styles.preprocessingList}>
                {preprocessing.map((item) => (
                  <Text
                    key={item}
                    style={[styles.preprocessingItem, { color: colors.muted }]}
                  >
                    • {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
        {stage === "review" && (
          <View
            style={[
              styles.reviewCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.reviewLabel, { color: colors.muted }]}>
              EDIT BEFORE TRANSLATING
            </Text>
            <TextInput
              value={recognizedText}
              onChangeText={setRecognizedText}
              multiline
              returnKeyType="default"
              accessibilityLabel="Detected text to review"
              style={[styles.reviewInput, { color: colors.foreground }]}
              placeholder="Review detected text"
              placeholderTextColor={colors.muted}
            />
            <View style={styles.reviewMeta}>
              <Text style={[styles.reviewHint, { color: colors.muted }]}>
                {getOCRReviewMetadata(recognizedText).characterCount} characters
                · {getOCRReviewMetadata(recognizedText).lineCount}{" "}
                {getOCRReviewMetadata(recognizedText).lineCount === 1
                  ? "line"
                  : "lines"}
              </Text>
              <Text style={[styles.reviewHint, { color: colors.muted }]}>
                {getOCRReviewMetadata(recognizedText).isMultiLine
                  ? "Multiline review"
                  : "Single-line review"}
              </Text>
            </View>
            <Text style={[styles.reviewHint, { color: colors.muted }]}>
              {recognizedText.trim()
                ? "You can correct OCR mistakes before continuing."
                : "No text was detected. Enter text manually or scan again."}
            </Text>
          </View>
        )}
        {stage === "result" && (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.resultStatus,
              {
                color: resultStatus === "idle" ? colors.muted : colors.success,
              },
            ]}
          >
            {getOCRResultStatusMessage(resultStatus)}
          </Text>
        )}
        {stage === "result" && (
          <View style={styles.resultActions}>
            <Pressable
              onPress={copyResult}
              accessibilityRole="button"
              accessibilityLabel="Copy OCR translation"
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <IconSymbol
                name="doc.on.doc"
                size={16}
                color={colors.foreground}
              />
              <Text
                style={[styles.secondaryText, { color: colors.foreground }]}
              >
                {copied ? "Copied" : "Copy"}
              </Text>
            </Pressable>
            <Pressable
              onPress={saveResult}
              disabled={saved}
              accessibilityRole="button"
              accessibilityState={{ disabled: saved }}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
                saved && styles.disabled,
              ]}
            >
              <IconSymbol
                name="bookmark.fill"
                size={16}
                color={colors.foreground}
              />
              <Text
                style={[styles.secondaryText, { color: colors.foreground }]}
              >
                {saved ? "Saved" : "Save"}
              </Text>
            </Pressable>
            <Pressable
              onPress={reset}
              accessibilityRole="button"
              accessibilityLabel="Scan another image"
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.secondaryText, { color: colors.foreground }]}
              >
                Scan another
              </Text>
            </Pressable>
          </View>
        )}
        {isBusy && (
          <Pressable
            onPress={stopWork}
            accessibilityRole="button"
            accessibilityLabel="Cancel OCR work"
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: colors.border },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.cancelText, { color: colors.foreground }]}>
              Cancel
            </Text>
          </Pressable>
        )}
        {(stage === "scan" || stage === "error") && (
          <AccessibleAction
            onPress={scan}
            label={stage === "error" ? "Try scan again" : "Scan text"}
            icon="camera.fill"
            buttonStyle={styles.button}
          />
        )}
        {stage === "review" && (
          <View style={styles.actions}>
            <Pressable
              onPress={reset}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.secondaryText, { color: colors.foreground }]}
              >
                Scan again
              </Text>
            </Pressable>
            <AccessibleAction
              onPress={translate}
              label="Translate reviewed text"
              icon="sparkles"
              buttonStyle={{ ...styles.button, flex: 1, marginTop: 0 }}
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 22 },
  readinessHint: {
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 4,
  },
  resultStatus: { fontSize: 12, textAlign: "center", marginTop: 12 },
  sourcePreview: { fontSize: 11, textAlign: "center", marginTop: 10 },
  sourceRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  sourceChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceChipText: { fontSize: 13, fontWeight: "800" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { minWidth: 32, minHeight: 32, justifyContent: "center" },
  headerSpacer: { width: 32 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 16,
  },
  cameraPreview: {
    flex: 1,
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  scanner: {
    height: 320,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 24,
    position: "relative",
    overflow: "hidden",
  },
  corner: { position: "absolute", width: 34, height: 34, borderWidth: 3 },
  topLeft: { top: 20, left: 20, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 20, right: 20, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 20, left: 20, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 20, right: 20, borderLeftWidth: 0, borderTopWidth: 0 },
  scanHint: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },
  cameraIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  scanTitle: { fontSize: 17, fontWeight: "800", textAlign: "center" },
  scanBody: { fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 7 },
  detected: { flex: 1, justifyContent: "center", padding: 36 },
  detectedLabel: { fontSize: 10, letterSpacing: 1.2, fontWeight: "800" },
  detectedText: {
    fontSize: 18,
    lineHeight: 27,
    marginTop: 12,
    textAlign: "center",
  },
  fallbackNotice: { fontSize: 11, fontWeight: "700", marginTop: 10 },
  metadata: { fontSize: 12, textAlign: "center", marginTop: 12 },
  reviewCard: { borderRadius: 18, borderWidth: 1, padding: 14, marginTop: 16 },
  reviewLabel: { fontSize: 10, letterSpacing: 1.1, fontWeight: "800" },
  reviewInput: {
    minHeight: 76,
    fontSize: 21,
    lineHeight: 31,
    paddingVertical: 10,
  },
  reviewMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewHint: { fontSize: 11, lineHeight: 16 },
  cancelButton: {
    alignSelf: "center",
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 12,
  },
  cancelText: { fontSize: 13, fontWeight: "700" },
  button: {
    height: 54,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  resultActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  secondaryButton: {
    minHeight: 50,
    flex: 1,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondaryText: { fontSize: 14, fontWeight: "800" },
  confidenceCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginTop: 16,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confidenceValue: { fontSize: 12, fontWeight: "800" },
  preprocessingToggle: { fontSize: 12, fontWeight: "800", marginTop: 10 },
  preprocessingList: { gap: 4, marginTop: 8 },
  preprocessingItem: { fontSize: 11, lineHeight: 16 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
});
