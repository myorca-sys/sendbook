import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { HistoryItem } from "./HistoryItem";
import type { HistoryItemType } from "@shared/types/api";

export const HistoryList = React.memo(({ items }: { items: HistoryItemType[] }) => {
  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.iconCircleDim}>
          <Clock size={32} color="rgba(255,255,255,0.3)" />
        </View>
        <Text style={styles.emptyTitle}>Riwayat Kosong</Text>
        <Text style={styles.emptyDesc}>Anda belum menonton anime apa pun.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 40 }}>
      {items.map((item, idx) => (
        <HistoryItem
          key={`${item.anilistId || item.anilist_id || item.animeSlug || ""}-${item.episode || ""}-${idx}`}
          item={item}
          isLast={idx === items.length - 1}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  emptyState: {
    paddingVertical: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleDim: {
    width: 64,
    height: 64,
    backgroundColor: "#1f1c29",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptyDesc: {
    color: "#8e8e93",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 20,
  },
});
