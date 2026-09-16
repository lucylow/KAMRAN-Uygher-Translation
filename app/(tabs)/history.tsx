import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AsyncStatus } from "@/components/async-status";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  useTranslationStore,
  type TranslationEntry,
} from "@/lib/translation-store";
import { haptic } from "@/lib/haptics";
import { matchesHistoryQuery } from "@/lib/history-search";
import { sortHistoryEntries } from "@/lib/history-display";
import { getTranslationOriginMessage } from "@/lib/translation-provenance";

type Filter = "all" | "favorites" | "recent";

export default function HistoryScreen() {
  const colors = useColors();
  const {
    history,
    hydrated,
    persistenceStatus,
    persistenceError,
    toggleFavorite,
    removeTranslation,
  } = useTranslationStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [actionStatus, setActionStatus] = useState("Ready");
  const entries = useMemo(() => {
    const source = sortHistoryEntries(history);
    const filtered =
      filter === "favorites"
        ? source.filter((item) => item.isFavorite)
        : filter === "recent"
          ? source.slice(0, 5)
          : source;
    return filtered.filter((item) => matchesHistoryQuery(item, query));
  }, [filter, history, query]);
  const emptyCopy =
    filter === "favorites"
      ? {
          title: "No favorites yet",
          body: "Tap the heart on a phrase to keep it close.",
        }
      : filter === "recent"
        ? {
            title: "No recent phrases",
            body: "Translate a phrase and it will appear here.",
          }
        : {
            title: "Your phrasebook is empty",
            body: "Translate a phrase to start building your history.",
          };
  const emptyState = query.trim()
    ? {
        title: "No matching phrases",
        body: "Try another word, language direction, or clear the search.",
      }
    : emptyCopy;

  return (
    <ScreenContainer className="px-5 pt-3" containerClassName="bg-background">
      <Text className="text-sm font-medium text-muted">Your phrasebook</Text>
      <Text className="mt-1 text-3xl font-bold text-foreground">History</Text>
      <Text className="mt-2 text-sm text-muted">
        {!hydrated
          ? "Restoring your saved phrases…"
          : persistenceStatus === "saving"
            ? "Saving your latest phrasebook changes…"
            : persistenceStatus === "degraded"
              ? "Available for this session; device storage needs attention."
              : "Saved on this device, ready whenever you need it."}
      </Text>
      <AsyncStatus
        message={persistenceError}
        colors={colors}
        tone="error"
        style={styles.status}
      />
      <View
        style={[
          styles.searchRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setActionStatus(
              value ? `Searching for ${value}` : "Search cleared",
            );
          }}
          placeholder="Search phrases"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Search translation history"
          returnKeyType="search"
          style={[styles.searchInput, { color: colors.foreground }]}
        />
        {query ? (
          <Pressable
            onPress={() => {
              setQuery("");
              setActionStatus("Search cleared");
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear history search"
            hitSlop={10}
          >
            <Text style={[styles.clearSearch, { color: colors.primary }]}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View
        style={[
          styles.filters,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <FilterButton
          active={filter === "all"}
          label="All"
          onPress={() => {
            setFilter("all");
            setActionStatus("Showing all phrases");
          }}
        />
        <FilterButton
          active={filter === "recent"}
          label="Recent"
          onPress={() => {
            setFilter("recent");
            setActionStatus("Showing your five most recent phrases");
          }}
        />
        <FilterButton
          active={filter === "favorites"}
          label="Favorites"
          onPress={() => {
            setFilter("favorites");
            setActionStatus("Showing favorite phrases");
          }}
        />
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.status, { color: colors.muted }]}
      >
        {actionStatus}
      </Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSymbol
              name={filter === "favorites" ? "heart.fill" : "clock.fill"}
              size={26}
              color={colors.muted}
            />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {emptyState.title}
            </Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>
              {emptyState.body}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            colors={colors}
            onFavorite={() => {
              haptic.light();
              toggleFavorite(item.id);
              setActionStatus(
                item.isFavorite
                  ? "Removed from favorites"
                  : "Saved to favorites",
              );
            }}
            onDelete={() =>
              Alert.alert(
                "Delete phrase?",
                "This removes the translation from this device.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      haptic.medium();
                      removeTranslation(item.id);
                      setActionStatus("Phrase deleted");
                    },
                  },
                ],
              )
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

function FilterButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.filterButton,
        active && { backgroundColor: colors.foreground },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          { color: active ? colors.background : colors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function HistoryCard({
  item,
  colors,
  onFavorite,
  onDelete,
}: {
  item: TranslationEntry;
  colors: ReturnType<typeof useColors>;
  onFavorite: () => void;
  onDelete: () => void;
}) {
  const isSample = item.id.startsWith("sample-");
  return (
    <Pressable
      onLongPress={isSample ? undefined : onDelete}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.direction, { color: colors.primary }]}>
          {item.direction}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={onFavorite}
            accessibilityLabel={
              item.isFavorite ? "Remove favorite" : "Save favorite"
            }
            hitSlop={10}
          >
            <IconSymbol
              name="heart.fill"
              size={20}
              color={item.isFavorite ? colors.primary : colors.muted}
            />
          </Pressable>
          {!isSample && (
            <Pressable
              onPress={onDelete}
              accessibilityLabel="Delete translation"
              hitSlop={10}
            >
              <IconSymbol name="trash.fill" size={19} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>
      <Text style={[styles.source, { color: colors.foreground }]}>
        {item.source}
      </Text>
      <Text style={[styles.result, { color: colors.foreground }]}>
        {item.result}
      </Text>
      <Text style={[styles.time, { color: colors.muted }]}>
        {isSample ? "Sample phrase" : formatTime(item.createdAt)}
      </Text>
      {getTranslationOriginMessage(item.origin) ? (
        <Text
          accessibilityLabel={getTranslationOriginMessage(item.origin)}
          style={[styles.origin, { color: colors.warning }]}
        >
          {getTranslationOriginMessage(item.origin)}
        </Text>
      ) : null}
    </Pressable>
  );
}

function formatTime(timestamp: number) {
  const age = Date.now() - timestamp;
  if (age < 86400000) return "Today";
  if (age < 172800000) return "Yesterday";
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginTop: 18,
  },
  searchInput: { flex: 1, minHeight: 44, fontSize: 15 },
  clearSearch: { fontSize: 12, fontWeight: "700", paddingVertical: 10 },
  filters: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    marginTop: 20,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterText: { fontSize: 12, fontWeight: "700" },
  list: { gap: 12, paddingTop: 16, paddingBottom: 28, flexGrow: 1 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 18 },
  direction: { fontSize: 12, fontWeight: "700" },
  source: { fontSize: 18, lineHeight: 27, marginTop: 14 },
  result: { fontSize: 17, lineHeight: 26, marginTop: 2 },
  time: { fontSize: 11, marginTop: 12 },
  origin: { fontSize: 11, fontWeight: "700", marginTop: 6 },
  status: { fontSize: 12, marginTop: 8, minHeight: 18 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", marginTop: 8 },
  emptyBody: { fontSize: 13, textAlign: "center" },
  pressed: { opacity: 0.72 },
});
