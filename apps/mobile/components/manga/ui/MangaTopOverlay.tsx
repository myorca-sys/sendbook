import React from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { ArrowLeft, List } from "lucide-react-native";

interface MangaTopOverlayProps {
  insetsTop: number;
  fadeAnim: Animated.Value;
  controlsVisible: boolean;
  title: string;
  chapter: string;
  imagesCount: number;
  onBack: () => void;
  onOpenList: () => void;
}

export function MangaTopOverlay({
  insetsTop,
  fadeAnim,
  controlsVisible,
  title,
  chapter,
  imagesCount,
  onBack,
  onOpenList,
}: MangaTopOverlayProps) {
  return (
    <Animated.View
      style={[
        styles.headerOverlay,
        { paddingTop: insetsTop + 10, opacity: fadeAnim },
      ]}
      pointerEvents={controlsVisible ? "auto" : "none"}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.iconBtn}>
          <ArrowLeft color="white" size={24} />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title || "Membaca Komik"}
          </Text>
          <Text style={styles.chapterText}>
            {chapter || ""}
            {imagesCount > 0 ? `  •  ${imagesCount} Halaman` : ""}
          </Text>
        </View>
        <Pressable onPress={onOpenList} style={styles.iconBtn}>
          <List color="white" size={24} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 10,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  titleText: { color: "white", fontSize: 16, fontWeight: "bold" },
  chapterText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "500",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
