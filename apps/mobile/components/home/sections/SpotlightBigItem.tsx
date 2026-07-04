import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import { prefetchAnime, prefetchManga } from "../../../lib/utils";
import { Theme } from "../../../lib/theme";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

const { width: W } = Dimensions.get("window");
const FONT_MEDIUM = Theme.typography.weights.medium;
const FONT_BOLD = Theme.typography.weights.bold;
const FONT_SEMIBOLD = Theme.typography.weights.semibold;

const BIG_W = W * 0.55;

export function SpotlightBigItem({
  chunk,
  mediaType,
}: {
  chunk: any;
  mediaType: "anime" | "manga";
}) {
  const item = normalizeMediaItem(chunk.item);
  const { id, imageUrl: img, title, score, views } = item;

  return (
    <View style={{ width: BIG_W, height: 230, marginRight: 10 }}>
      <Link
        key={id}
        href={(mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`) as any}
        asChild
      >
        <Pressable
          style={styles.spotBig}
          onPressIn={() => {
            if (mediaType === "anime") prefetchAnime(id);
            else prefetchManga(id);
          }}
        >
          {typeof img === "string" && img.trim() !== "" ? (
            <Image
              source={{ uri: img }}
              style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#2a2a2a" }]} />
          )}
          <LinearGradient
            colors={["transparent", "rgba(10,8,18,0.8)", "#0a0812"]}
            locations={[0, 0.5, 1]}
            style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
          />
          <View style={styles.spotBigBadge}>
            <Text style={styles.spotBigBadgeText}>#{chunk.rank} TRENDING</Text>
          </View>
          <Text style={styles.spotBigTitle} numberOfLines={2}>
            {title}
          </Text>

          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, zIndex: 10 }}
          >
            {score > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Star size={11} color="#FFD60A" fill="#FFD60A" />
                <Text style={{ color: "#FFD60A", fontSize: 11, fontWeight: FONT_BOLD }}>
                  {(score / 10).toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  spotBig: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Theme.colors.surface,
    justifyContent: "flex-end",
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  spotBigBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF9F0A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  spotBigBadgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: FONT_BOLD,
    letterSpacing: 0.5,
  },
  spotBigTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: FONT_SEMIBOLD,
    lineHeight: 20,
    zIndex: 10,
  },
});
