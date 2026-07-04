import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Forward, Heart, Flag } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

interface WatchActionBarProps {
  id: string;
  poster: string | null | undefined;
  realViews: number;
  likesCount: number;
  isLiked: boolean;
  onShare: () => void;
  onToggleLike: () => void;
  onReport: () => void;
}

export function WatchActionBar({
  id,
  poster,
  realViews,
  likesCount,
  isLiked,
  onShare,
  onToggleLike,
  onReport,
}: WatchActionBarProps) {
  return (
    <View style={styles.actionBarWrapper}>
      <View style={styles.actionBarContent}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBarWrapper: {
    marginBottom: 24,
    marginHorizontal: -16,
  },
  actionBarContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  avatarPressable: {
    marginRight: 4,
  },
  pressedState: {
    transform: [{ scale: 0.95 }],
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  viewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
  viewBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionButtonDark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
  actionButtonDarkPressed: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  actionButtonDarkText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
