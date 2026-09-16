import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { ThemeColorPalette } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { TranslationDirection } from "@/lib/mock-translation";
import { getTranslationOriginMessage } from "@/lib/translation-provenance";
import type { TranslationOrigin } from "@/lib/translation-provenance";

interface TranslationCardProps {
  colors: ThemeColorPalette;
  source: string;
  result: string;
  direction: TranslationDirection;
  sourceLabel: string;
  targetLabel: string;
  dialectRegion: string;
  origin?: TranslationOrigin;
  loading: boolean;
  voiceReviewRequired: boolean;
  onChangeSource: (text: string) => void;
  onSubmit: () => void;
}

export function TranslationCard({
  colors,
  source,
  result,
  direction,
  sourceLabel,
  targetLabel,
  dialectRegion,
  origin,
  loading,
  voiceReviewRequired,
  onChangeSource,
  onSubmit,
}: TranslationCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.overline, { color: colors.muted }]}>SOURCE</Text>
      <TextInput
        value={source}
        onChangeText={onChangeSource}
        multiline
        placeholder={direction === "ug-zh" ? "Type in Uyghur…" : "输入中文…"}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.foreground }]}
        accessibilityLabel={
          voiceReviewRequired
            ? "Recognized source text. Review before translating."
            : "Source text"
        }
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={onSubmit}
      />
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
      <Text style={[styles.overline, { color: colors.muted }]}>
        TRANSLATION
      </Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.primary }]}>
            Generating a thoughtful translation…
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.result,
            { color: result ? colors.foreground : colors.muted },
          ]}
        >
          {result || "Your result will appear here"}
        </Text>
      )}
      {result ? (
        <>
          <View style={styles.resultMeta}>
          <View style={styles.resultMetaLeft}>
            <IconSymbol name="sparkles" size={14} color={colors.primary} />
            <Text style={[styles.resultMetaText, { color: colors.primary }]}>
              KAMRAN AI
            </Text>
          </View>
          <Text style={[styles.resultMetaText, { color: colors.muted }]}>
            {sourceLabel} → {targetLabel} · {dialectRegion}
          </Text>
          </View>
          {getTranslationOriginMessage(origin) ? (
            <Text
              accessibilityLabel={getTranslationOriginMessage(origin)}
              style={[styles.fallbackNotice, { color: colors.warning }]}
            >
              {getTranslationOriginMessage(origin)}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    minHeight: 300,
  },
  overline: { fontSize: 11, letterSpacing: 1.2, fontWeight: "700" },
  input: { minHeight: 100, fontSize: 20, lineHeight: 28, paddingVertical: 12 },
  rule: {
    height: 1,
    marginVertical: 10,
  },
  loading: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: { fontSize: 13, fontWeight: "600" },
  result: { minHeight: 100, fontSize: 18, lineHeight: 27, paddingTop: 12 },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
    marginTop: 6,
  },
  resultMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultMetaText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  fallbackNotice: { fontSize: 11, fontWeight: "700", marginTop: 8 },
});
