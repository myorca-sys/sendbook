import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Skeleton } from "../../Skeleton";
import { Theme } from "../../../lib/theme";

interface MediaDetailLoadingProps {
  isColdStart: boolean;
}

export function MediaDetailLoading({ isColdStart }: MediaDetailLoadingProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {isColdStart && (
        <View style={styles.coldStartBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.coldStartText}>
            Menghidupkan server... (
            {Math.round(Date.now() / 1000) % 2 === 0 ? "15s" : "30s"})
          </Text>
        </View>
      )}
      <View style={styles.headerContainer}>
        <View style={styles.headerIconsRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color="white" size={24} />
          </Pressable>
        </View>
      </View>
      <View style={styles.heroLoading}>
        <Skeleton w="100%" h="100%" r={0} />
      </View>
      <View style={styles.contentLoading}>
        <Skeleton w={120} h={24} r={8} style={{ marginBottom: 12 }} />
        <Skeleton w="85%" h={36} r={12} style={{ marginBottom: 24 }} />

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            marginBottom: 32,
            alignItems: "center",
          }}
        >
          <Skeleton w={44} h={44} r={22} />
          <Skeleton w={44} h={44} r={22} />
          <Skeleton w={44} h={44} r={22} />
        </View>

        <Skeleton w={100} h={20} r={6} style={{ marginBottom: 16 }} />
        <Skeleton w="100%" h={14} r={4} style={{ marginBottom: 8 }} />
        <Skeleton w="100%" h={14} r={4} style={{ marginBottom: 8 }} />
        <Skeleton w="80%" h={14} r={4} style={{ marginBottom: 32 }} />

        <Skeleton w={140} h={20} r={6} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton w={60} h={40} r={12} />
          <Skeleton w={60} h={40} r={12} />
          <Skeleton w={60} h={40} r={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0812" },
  heroLoading: { width: "100%", height: 450, backgroundColor: "#0a0812" },
  contentLoading: { paddingHorizontal: 20, marginTop: -100 },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Theme.layout.paddingTopSafe + 10,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  coldStartBanner: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 200,
    backgroundColor: "rgba(255,149,0,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,149,0,0.3)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9500",
  },
  coldStartText: { color: "#FF9500", fontSize: 12, fontWeight: "bold" },
});
