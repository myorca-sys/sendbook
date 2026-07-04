import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { WatchHistoryItem } from "./WatchHistoryItem";

const FONT_BOLD = Theme.typography.weights.bold;
const FONT_SEMIBOLD = Theme.typography.weights.semibold;

export function WatchHistoryRow({
  items,
  mediaType = "anime",
}: {
  items: any[];
  mediaType?: "anime" | "manga";
}) {
  const router = useRouter();
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Terakhir Dilihat</Text>
        <Pressable onPress={() => router.push("/history")} style={styles.moreButton}>
          <Text style={styles.moreText}>Selengkapnya</Text>
          <ChevronRight size={14} color="#0A84FF" />
        </Pressable>
      </View>
      <FlatList<any>
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.listContent}
        data={items.slice(0, 8)}
        keyExtractor={(item: any, index: number) =>
          String(item.anilistId || item.id || "") + "-" + String(item.episode || "") + "-" + index
        }
        renderItem={({ item }) => <WatchHistoryItem rawItem={item} mediaType={mediaType} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: FONT_SEMIBOLD, letterSpacing: -0.2 },
  moreButton: { flexDirection: "row", alignItems: "center" },
  moreText: { color: "#0A84FF", fontSize: 12, fontWeight: FONT_BOLD, marginRight: 2 },
  listContent: { paddingHorizontal: 16, gap: 12 },
});
