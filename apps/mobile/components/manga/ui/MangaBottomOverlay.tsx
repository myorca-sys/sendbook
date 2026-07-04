import React from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

interface MangaBottomOverlayProps {
  insetsBottom: number;
  fadeAnim: Animated.Value;
  controlsVisible: boolean;
  onPrev: () => void;
  hasPrev: boolean;
  onNext: () => void;
  hasNext: boolean;
  onOpenComments: () => void;
}

export function MangaBottomOverlay({
  insetsBottom,
  fadeAnim,
  controlsVisible,
  onPrev,
  hasPrev,
  onNext,
  hasNext,
  onOpenComments,
}: MangaBottomOverlayProps) {
  return (
    <Animated.View
      style={[
        styles.bottomOverlay,
        { paddingBottom: insetsBottom + 10, opacity: fadeAnim },
      ]}
      pointerEvents={controlsVisible ? "auto" : "none"}
    >
      <View style={styles.bottomNavRow}>
        <Pressable
          onPress={onPrev}
          style={[styles.navBtn, !hasPrev && { opacity: 0.3 }]}
          disabled={!hasPrev}
        >
          <ChevronLeft color="white" size={24} />
          <Text style={styles.navBtnText}>Prev</Text>
        </Pressable>

        <Pressable onPress={onOpenComments} style={styles.commentBtn}>
          <MessageSquare color="white" size={22} />
        </Pressable>

        <Pressable
          onPress={onNext}
          style={[styles.navBtn, !hasNext && { opacity: 0.3 }]}
          disabled={!hasNext}
        >
          <Text style={styles.navBtnText}>Next</Text>
          <ChevronRight color="white" size={24} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 10,
    paddingTop: 12,
  },
  bottomNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  navBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
