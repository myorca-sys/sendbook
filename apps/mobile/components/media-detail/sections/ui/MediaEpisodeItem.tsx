import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

export function MediaEpisodeItem({ epNum, isActive, handlePress }: any) {
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.scrollEpisodeItem,
        isActive ? styles.episodeItemActive : styles.episodeItemInactive,
        pressed && !isActive && styles.episodeItemPressed,
      ]}
    >
      <Text
        style={[
          styles.scrollEpisodeText,
          isActive ? styles.episodeTextActive : styles.episodeTextInactive,
        ]}
      >
        {epNum}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollEpisodeItem: {
    height: 40,
    width: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  episodeItemActive: { backgroundColor: "white", borderColor: "white" },
  episodeItemInactive: {
    backgroundColor: "#1f1c29",
    borderColor: "transparent",
  },
  episodeItemPressed: { backgroundColor: "rgba(255,255,255,0.1)" },
  scrollEpisodeText: { fontWeight: "bold", fontSize: 14 },
  episodeTextActive: { color: "black" },
  episodeTextInactive: { color: "#8e8e93" },
});
