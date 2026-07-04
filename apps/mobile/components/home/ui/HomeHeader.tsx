import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Search, Bell } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function HomeHeader({ headerBg, onSearchPress, onBellPress }: any) {
  return (
    <Animated.View style={[styles.header, { backgroundColor: headerBg }]}>
      <View style={styles.headerTopRow}>
        <Text style={styles.logo}>orca</Text>
        <Pressable onPress={onSearchPress} style={styles.search}>
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <Text style={styles.searchText} numberOfLines={1}>
            Cari...
          </Text>
        </Pressable>
        <Pressable onPress={onBellPress} style={styles.bellBtn}>
          <Bell size={20} color="rgba(255,255,255,0.8)" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "column",
    paddingHorizontal: Theme.layout.headerPaddingHorizontal,
    paddingTop: Theme.layout.paddingTopSafe + Theme.layout.headerPaddingTop,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    marginHorizontal: 12,
  },
  searchText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: "400",
    flex: 1,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});
