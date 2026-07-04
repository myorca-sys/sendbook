import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Clock } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

const { width: W } = Dimensions.get("window");

const GENRES = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Fantasy" },
  { name: "Horror" },
  { name: "Isekai" },
  { name: "Magic" },
  { name: "Mecha" },
  { name: "Music" },
  { name: "Mystery" },
  { name: "Psychological" },
  { name: "Romance" },
  { name: "School" },
  { name: "Sci-Fi" },
  { name: "Seinen" },
  { name: "Shounen" },
  { name: "Slice of Life" },
  { name: "Sports" },
  { name: "Supernatural" },
  { name: "Thriller" },
];

export function ExploreDefault({
  history,
  handleHistoryTap,
  clearHistory,
  handleGenreSelect,
}: any) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Terakhir Dicari</Text>
            <Pressable onPress={clearHistory} hitSlop={10}>
              <Text style={styles.historyClearText}>Hapus Semua</Text>
            </Pressable>
          </View>
          <View style={styles.historyChips}>
            {history.map((term: string, i: number) => (
              <Pressable
                key={i}
                onPress={() => handleHistoryTap(term)}
                style={({ pressed }) => [
                  styles.historyChip,
                  pressed && styles.historyChipPressed,
                ]}
              >
                <Clock
                  size={12}
                  color="rgba(255,255,255,0.4)"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.historyChipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View>
        <Text style={styles.genreTitle}>Eksplorasi Genre</Text>
        <View style={styles.genreGrid}>
          {GENRES.map((g) => (
            <Pressable
              key={g.name}
              onPress={() => handleGenreSelect(g.name)}
              style={({ pressed }) => [
                styles.genreBadge,
                { width: Math.floor((W - 32 - 24) / 3) },
                pressed && styles.genreBadgePressed,
              ]}
            >
              <Text style={styles.genreText} numberOfLines={1}>
                {g.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  historySection: { marginBottom: 32 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  historyClearText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  historyChips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  historyChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  historyChipPressed: { backgroundColor: "rgba(255,255,255,0.1)" },
  historyChipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
  },
  genreTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  genreGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  genreBadge: {
    backgroundColor: Theme.colors.surface2,
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  genreBadgePressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  genreText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
