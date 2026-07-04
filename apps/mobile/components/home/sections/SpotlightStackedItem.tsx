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

const SMALL_W = W * 0.35;

export function SpotlightStackedItem({
  chunk,
  mediaType,
}: {
  chunk: any;
  mediaType: "anime" | "manga";
}) {
  return (
    <View
      style={{ width: SMALL_W, height: 230, marginRight: 10, flexDirection: "column", gap: 10 }}
    >
      {chunk.items?.map((rawItem: any, i: number) => {
        const item = normalizeMediaItem(rawItem);
        const { id, imageUrl: img, title, score, views } = item;
        return (
          <Link
            key={id}
            href={(mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`) as any}
            asChild
          >
            <Pressable
              style={styles.spotSmall}
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
              <View style={styles.spotSmallBadge}>
                <Text style={styles.spotSmallBadgeText}>#{(chunk.startRank || 0) + i}</Text>
              </View>
              <Text style={styles.spotSmallTitle} numberOfLines={2}>
                {title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                  zIndex: 10,
                }}
              >
                {score > 0 && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Star size={9} color="#FFD60A" fill="#FFD60A" />
                    <Text style={{ color: "#FFD60A", fontSize: 9, fontWeight: FONT_BOLD }}>
                      {(score / 10).toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  spotSmall: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Theme.colors.surface,
    justifyContent: "flex-end",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  spotSmallBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  spotSmallBadgeText: { color: "#fff", fontSize: 9, fontWeight: FONT_BOLD },
  spotSmallTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: FONT_MEDIUM,
    lineHeight: 16,
    zIndex: 10,
  },
});
