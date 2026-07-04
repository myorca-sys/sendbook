import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Star } from "lucide-react-native";
import { prefetchAnime, prefetchManga } from "../../../lib/utils";
import { Theme } from "../../../lib/theme";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

const FONT_MEDIUM = Theme.typography.weights.medium;
const FONT_BOLD = Theme.typography.weights.bold;
const SURFACE = Theme.colors.surface;

export function VertRow({
  items,
  showRank,
  cw = 110,
  ch = 158,
  mediaType = "anime",
}: {
  items: any[];
  showRank?: boolean;
  cw?: number;
  ch?: number;
  mediaType?: "anime" | "manga";
}) {
  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    viewableItems.slice(0, 3).forEach(({ item: rawItem }: any) => {
      if (rawItem) {
        const item = normalizeMediaItem(rawItem);
        if (mediaType === "anime") {
          prefetchAnime(item.id);
        } else {
          prefetchManga(item.id);
        }
      }
    });
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 20,
  }).current;

  return (
    <FlatList
      data={items.slice(0, 15)}
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={(item, i) => `${item.anilistId || item.id || ""}-${i}`}
      renderItem={({ item: rawItem, index }) => {
        const item = normalizeMediaItem(rawItem);
        const { id, imageUrl: img, title, score, views, episode: ep } = item;
        const epsText = mediaType === "manga" ? `CH ${ep}` : `EP ${ep}`;
        return (
          <Link href={(mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`) as any} asChild>
            <Pressable
              style={{ width: cw, marginRight: 10 }}
              onPressIn={() => {
                if (mediaType === "anime") prefetchAnime(id);
                else prefetchManga(id);
              }}
            >
              <View
                style={{
                  height: ch,
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: SURFACE,
                  marginBottom: 8,
                }}
              >
                <Image
                  source={{ uri: img }}
                  style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}
                  contentFit="cover"
                  transition={300}
                />
                <LinearGradient
                  colors={["transparent", "rgba(10,8,18,0.6)", "#0a0812"]}
                  locations={[0, 0.6, 1]}
                  style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
                />
                {showRank && <Text style={styles.rankNum}>#{index + 1}</Text>}
                <View style={styles.epBadge}>
                  <Text style={styles.epBadgeText}>{epsText}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {score > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Star size={10} color="#FFD60A" fill="#FFD60A" />
                    <Text
                      style={{
                        color: "#FFD60A",
                        fontSize: 10,
                        fontWeight: FONT_BOLD,
                      }}
                    >
                      {(score / 10).toFixed(1)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  rankNum: {
    position: "absolute",
    top: 6,
    left: 8,
    color: "#fff",
    fontSize: 24,
    fontWeight: FONT_BOLD,
    opacity: 0.9,
    letterSpacing: -1,
  },
  epBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  epBadgeText: { color: "#fff", fontSize: 10, fontWeight: FONT_MEDIUM },
  cardTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: FONT_MEDIUM,
    lineHeight: 18,
    marginTop: 8,
    minHeight: 36,
  },
});
