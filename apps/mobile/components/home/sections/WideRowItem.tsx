import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import { prefetchAnime, prefetchManga } from "../../../lib/utils";
import { Theme } from "../../../lib/theme";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

const BG = Theme.colors.background;
const SURFACE2 = Theme.colors.surfaceAlt;
const FONT_MEDIUM = Theme.typography.weights.medium;
const FONT_BOLD = Theme.typography.weights.bold;
const FONT_SEMIBOLD = Theme.typography.weights.semibold;

export function WideRowItem({
  rawItem,
  mediaType,
  i,
}: {
  rawItem: any;
  mediaType: "anime" | "manga";
  i: number;
}) {
  const item = normalizeMediaItem(rawItem);
  const { id, imageUrl: img, title, score, views, genres } = item;
  const firstGenre = genres.length > 0 ? genres[0] : "";

  return (
    <View key={`${id}-${i}`} style={styles.container}>
      <Link href={(mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`) as any} asChild>
        <Pressable
          style={styles.pressable}
          onPressIn={() => {
            if (mediaType === "anime") prefetchAnime(id);
            else prefetchManga(id);
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: img }}
              style={styles.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["transparent", "rgba(10,8,18,0.6)", "#0a0812"]}
              style={styles.absoluteFillGradient}
            />
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["transparent", "rgba(10,8,18,0.6)", "#0a0812"]}
              locations={[0, 0.6, 1]}
              style={styles.absoluteFillGradient}
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            <View style={styles.statsRow}>
              {score > 0 ? (
                <View style={styles.statGroup}>
                  <Star size={11} color="#FFD60A" fill="#FFD60A" />
                  <Text style={styles.scoreText}>{(score / 10).toFixed(1)}</Text>
                </View>
              ) : null}

              {firstGenre ? (
                <>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.genreText}>{firstGenre}</Text>
                </>
              ) : null}
            </View>

            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText}>LIHAT DETAIL</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: 130 },
  pressable: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: SURFACE2,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  imageContainer: { width: 100, height: "100%", backgroundColor: BG },
  absoluteFill: { ...(StyleSheet.absoluteFill as any), width: "100%", height: "100%", zIndex: 1 },
  absoluteFillGradient: { ...(StyleSheet.absoluteFill as any), zIndex: 5 },
  detailsContainer: { flex: 1, padding: 14, justifyContent: "center", paddingLeft: 4 },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: FONT_SEMIBOLD,
    marginBottom: 6,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  statGroup: { flexDirection: "row", alignItems: "center", gap: 3 },
  scoreText: { color: "#FFD60A", fontSize: 11, fontWeight: FONT_BOLD },
  dotSeparator: { color: "rgba(255,255,255,0.2)", fontSize: 10 },
  genreText: { color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: FONT_MEDIUM },
  detailButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailButtonText: { color: "#fff", fontSize: 10, fontWeight: FONT_BOLD, letterSpacing: 0.5 },
});
