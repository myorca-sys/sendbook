import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { ArrowDown, ArrowUp } from "lucide-react-native";

export function MediaEpisodesHeader({
  listLabel,
  countLabel,
  epsCount,
  epsSort,
  onToggleSort,
  eps,
  epChunkIndex,
  handleChunkPress,
}: any) {
  return (
    <View>
      <View style={styles.episodesHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
            {listLabel}
          </Text>
          <Text style={styles.episodesCountText}>
            {epsCount} {countLabel}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={onToggleSort}
            style={({ pressed }) => [
              styles.episodesToggleButton,
              pressed && styles.episodesToggleButtonPressed,
            ]}
          >
            {epsSort === "asc" ? (
              <ArrowUp size={16} color="#0A84FF" />
            ) : (
              <ArrowDown size={16} color="#0A84FF" />
            )}
          </Pressable>
        </View>
      </View>

      {epsCount > 6 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chunkScroll}
          contentContainerStyle={styles.chunkScrollContent}
        >
          {Array.from({ length: Math.ceil(epsCount / 6) }).map((_, i) => {
            const chunk = eps.slice(i * 6, (i + 1) * 6);
            if (chunk.length === 0) return null;

            const getNum = (e: any) =>
              e.chapterNumber ?? e.episodeNumber ??
              e.number ??
              e.url?.split("episode=").pop() ??
              "?";
            const firstNum = getNum(chunk[0]);
            const lastNum = getNum(chunk[chunk.length - 1]);

            const label =
              epsSort === "asc"
                ? `${countLabel} ${firstNum} - ${lastNum}`
                : `${countLabel} ${lastNum} - ${firstNum}`;
            const isActive = epChunkIndex === i;

            return (
              <Pressable
                key={i}
                onPress={() => handleChunkPress(i)}
                style={[
                  styles.chunkButton,
                  isActive
                    ? styles.chunkButtonActive
                    : styles.chunkButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.chunkButtonText,
                    isActive
                      ? styles.chunkTextActive
                      : styles.chunkTextInactive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  episodesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "white",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  episodesCountText: { color: "#8e8e93", fontSize: 13, fontWeight: "600" },
  episodesToggleButton: {
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  episodesToggleButtonPressed: { backgroundColor: "rgba(10, 132, 255, 0.2)" },
  chunkScroll: { marginBottom: 16, marginHorizontal: -20 },
  chunkScrollContent: { paddingHorizontal: 20, gap: 8 },
  chunkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 8,
  },
  chunkButtonActive: { backgroundColor: "white" },
  chunkButtonInactive: { backgroundColor: "rgba(255,255,255,0.08)" },
  chunkButtonText: { fontWeight: "bold", fontSize: 13 },
  chunkTextActive: { color: "black" },
  chunkTextInactive: { color: "#8e8e93" },
});
