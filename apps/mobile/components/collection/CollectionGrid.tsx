import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bookmark } from "lucide-react-native";
import { MediaCard } from "../MediaCard";
import type { CollectionItem } from "@shared/types/api";

export const CollectionGrid = React.memo(
  ({ items, itemWidth }: { items: CollectionItem[]; itemWidth: number }) => {
    if (items.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.iconCircleDim}>
            <Bookmark size={32} color="rgba(255,255,255,0.3)" />
          </View>
          <Text style={styles.emptyTitle}>Koleksi Kosong</Text>
          <Text style={styles.emptyDesc}>Anda belum menyimpan item apa pun ke dalam koleksi.</Text>
        </View>
      );
    }

    return (
      <View style={styles.gridList}>
        {items.map((item, idx) => {
          const pct =
            item.totalEps > 0
              ? Math.min(100, Math.max(0, ((item.progress || 0) / item.totalEps) * 100))
              : 0;
          const isComp = item.status === "COMPLETED";
          const isManga = item.id.startsWith("manga|");
          const displayId = isManga ? item.id.replace("manga|", "") : item.id;

          return (
            <View key={`${item.id}-${idx}`} style={{ width: itemWidth }}>
              <MediaCard
                id={displayId}
                title={item.title}
                img={item.img}
                totalEps={item.totalEps}
                epId={item.progress ? String(item.progress) : undefined}
                progressPercent={pct}
                isCompleted={isComp}
                variant="vertical"
                mediaType={isManga ? "manga" : "anime"}
              />
            </View>
          );
        })}
      </View>
    );
  },
);

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
  gridList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
