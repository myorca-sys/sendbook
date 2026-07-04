import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Skeleton } from "../../../components/Skeleton";

export function WatchSkeleton() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.skeletonContainer}>
        <Skeleton w="80%" h={28} r={8} style={styles.skeletonTitle} />
        <Skeleton w="50%" h={16} r={6} style={styles.skeletonSubtitle} />
        <View style={styles.skeletonActions}>
          <Skeleton w={50} h={50} r={25} />
          <Skeleton w={50} h={50} r={25} />
          <Skeleton w={50} h={50} r={25} />
          <Skeleton w={50} h={50} r={25} />
        </View>
        <Skeleton w={120} h={20} r={8} style={styles.skeletonSectionTitle} />
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} w={70} h={40} r={12} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  skeletonTitle: {
    marginBottom: 12,
  },
  skeletonSubtitle: {
    marginBottom: 24,
  },
  skeletonActions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  skeletonSectionTitle: {
    marginBottom: 16,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
