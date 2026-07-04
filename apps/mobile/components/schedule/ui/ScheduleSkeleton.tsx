import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "../../../components/Skeleton";
import { Theme } from "../../../lib/theme";

export function ScheduleSkeleton() {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={{ width: 64, height: 64 }}>
            <Skeleton w={64} h={64} r={14} />
          </View>
          <View style={styles.skeletonContent}>
            <Skeleton w="80%" h={16} r={6} style={{ marginBottom: 8 }} />
            <Skeleton w="50%" h={12} r={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { flex: 1, paddingHorizontal: 20 },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface2,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 12,
  },
  skeletonContent: { flex: 1, marginLeft: 16, justifyContent: "center" },
});
