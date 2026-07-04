import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { X } from "lucide-react-native";

interface CommentHeaderProps {
  count: number;
  sortBy: "top" | "newest";
  setSortBy: (v: "top" | "newest") => void;
  isFullscreen: boolean;
  onClose: () => void;
}

export function CommentHeader({
  count,
  sortBy,
  setSortBy,
  isFullscreen,
  onClose,
}: CommentHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>
          Komentar <Text style={styles.headerCount}>{count}</Text>
        </Text>
        <View style={styles.filterContainer}>
          <FilterButton
            active={sortBy === "top"}
            label="Populer"
            onPress={() => setSortBy("top")}
          />
          <FilterButton
            active={sortBy === "newest"}
            label="Terbaru"
            onPress={() => setSortBy("newest")}
          />
        </View>
      </View>
      {isFullscreen && (
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X color="#8e8e93" size={20} />
        </Pressable>
      )}
    </View>
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
  return (
    <Pressable onPress={onPress} style={[styles.filterButton, active && styles.filterButtonActive]}>
      <Text
        style={[styles.filterText, active ? styles.filterTextActive : styles.filterTextInactive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#0a0c10",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  headerCount: { color: "#8e8e93", fontWeight: "500", fontSize: 14 },
  filterContainer: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 4,
    borderRadius: 9999,
  },
  filterButton: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  filterButtonActive: { backgroundColor: "rgba(255,255,255,0.1)" },
  filterText: { fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: "white" },
  filterTextInactive: { color: "#8e8e93" },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
});
