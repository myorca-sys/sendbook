import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Skeleton } from "../../../components/Skeleton";

export function CollectionSkeleton({ itemWidth }: { itemWidth: number }) {
  return (
    <View style={styles.scrollContent}>
      <View style={styles.gridContainer}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={{ width: itemWidth, marginBottom: 16 }}>
            <Skeleton w="100%" h={itemWidth * 1.5} r={16} style={{ marginBottom: 8 }} />
            <Skeleton w="90%" h={14} r={6} style={{ marginBottom: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    paddingTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  scrollContent: { flex: 1, paddingHorizontal: 20 },
});
