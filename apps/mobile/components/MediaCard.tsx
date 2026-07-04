import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { queryClient } from "../lib/query-provider";
import { fetcher } from "../lib/fetcher";
import { ProgressBar } from "./ProgressBar";

import { API_URL } from "../lib/config";
import { normalizeMediaItem } from "../lib/adapters/mediaAdapter";
import { MediaCardBadges } from "./media-card/ui/MediaCardBadges";
import { MediaCardStats } from "./media-card/ui/MediaCardStats";

interface Props {
  item?: any;
  id?: string;
  title?: string;
  img?: string | null;
  banner?: string | null;
  score?: number | null;
  color?: string | null;
  epId?: string;
  rank?: number;
  variant?: "vertical" | "horizontal";
  isNew?: boolean;
  badge?: "NEW" | "BEST" | "MOVIE" | "UPDATE";
  totalEps?: number | null;
  views?: number | null;
  progressPercent?: number;
  isCompleted?: boolean;
  mediaType?: "anime" | "manga";
}

function MediaCardInner({
  item: rawItem,
  id: manualId,
  title: manualTitle,
  img: manualImg,
  banner: manualBanner,
  score: manualScore,
  color: manualColor,
  epId: manualEpId,
  rank,
  variant = "vertical",
  isNew,
  badge,
  totalEps,
  views: manualViews,
  progressPercent = 0,
  isCompleted = false,
  mediaType = "anime",
}: Props) {
  const item = rawItem ? normalizeMediaItem(rawItem) : null;

  const id = manualId || item?.id || "";
  const title = manualTitle || item?.title || "";
  const img = manualImg || item?.imageUrl || null;
  const banner = manualBanner || item?.bannerUrl || null;
  const score = manualScore ?? item?.score ?? null;
  const color = manualColor || item?.color || null;
  const epId = manualEpId || item?.episode || undefined;
  const views = manualViews ?? item?.views ?? null;

  const accent = color || "#0A84FF";
  const href = mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`;

  const imageSrc = variant === "horizontal" ? banner || img : img;
  const currentBadge = badge || (isNew ? "NEW" : null);
  const chPrefix = mediaType === "manga" ? "CH" : "EPS";

  const handlePrefetch = () => {
    if (mediaType === "anime") {
      queryClient.prefetchQuery({
        queryKey: ["anime", id],
        queryFn: () => fetcher(`${API_URL}/api/v2/anime/${id}?_cb=5`),
      });
    }
  };

  return (
    <Link href={href as any} asChild>
      <Pressable
        onPressIn={handlePrefetch}
        style={({ pressed }) => [
          styles.cardContainer,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.85 },
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            variant === "horizontal" ? styles.aspectHorizontal : styles.aspectVertical,
          ]}
        >
          <Image
            source={{
              uri:
                typeof imageSrc === "string" && imageSrc.trim() !== ""
                  ? imageSrc
                  : "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
            }}
            style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(10,8,18,0.6)", "#0a0812"]}
            locations={[0, 0.6, 1]}
            style={[StyleSheet.absoluteFill, styles.gradient]}
          />

          <MediaCardBadges
            rank={rank}
            currentBadge={currentBadge}
            totalEps={totalEps}
            epId={epId}
            chPrefix={chPrefix}
          />
          <MediaCardStats score={score} views={views} isCompleted={isCompleted} />

          {progressPercent > 0 && (
            <ProgressBar
              progress={progressPercent}
              color={accent}
              style={styles.progressContainer}
              trackColor="rgba(255,255,255,0.2)"
            />
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  cardContainer: { flexDirection: "column", width: "100%", marginBottom: 16 },
  imageContainer: {
    width: "100%",
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#1f1c29",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  aspectVertical: { aspectRatio: 2 / 3 },
  aspectHorizontal: { aspectRatio: 16 / 9 },
  gradient: { zIndex: 10 },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    zIndex: 30,
  },
  title: {
    color: "#f2f2f7",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 16,
    paddingHorizontal: 2,
  },
});

export const MediaCard = memo(MediaCardInner);
