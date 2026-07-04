import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Play, BookOpen } from "lucide-react-native";
import { formatDuration } from "../../../lib/utils";
import { Theme } from "../../../lib/theme";
import { ProgressBar } from "../../ProgressBar";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

const SURFACE2 = Theme.colors.surfaceAlt;
const FONT_MEDIUM = Theme.typography.weights.medium;
const FONT_BOLD = Theme.typography.weights.bold;
const FONT_SEMIBOLD = Theme.typography.weights.semibold;

export function WatchHistoryItem({
  rawItem,
  mediaType,
}: {
  rawItem: any;
  mediaType: "anime" | "manga";
}) {
  const item = normalizeMediaItem(rawItem);
  const { id, title, imageUrl: img } = item;
  const ts = rawItem.timestampSec || 0;
  const dur = rawItem.durationSec || 0;
  const pct = dur > 0 ? Math.min(100, Math.max(0, (ts / dur) * 100)) : 0;

  const href = mediaType === "manga" ? `/manga/${id}` : `/anime/${id}`;
  const epLabel = mediaType === "manga" ? `CH ${item.episode}` : `EPS ${item.episode}`;
  const timeLeft =
    mediaType === "manga" ? `${dur - ts} hal tersisa` : `Tersisa ${formatDuration(dur - ts)}`;

  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: img }} style={styles.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(10,8,18,0.6)", "#0a0812"]}
            locations={[0, 0.6, 1]}
            style={styles.absoluteFillGradient}
          />
          <View style={styles.iconOverlay}>
            <View style={styles.iconCircle}>
              {mediaType === "manga" ? (
                <BookOpen size={12} color="#fff" />
              ) : (
                <Play size={12} color="#fff" style={{ marginLeft: 2 }} />
              )}
            </View>
          </View>
          <View style={styles.progressBarWrapper}>
            {dur > 0 && <ProgressBar progress={pct} height={3} />}
          </View>
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeText}>{epLabel}</Text>
          </View>
        </View>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.timeText}>{dur > 0 ? timeLeft : "..."}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { width: 140 },
  imageWrapper: {
    height: 78,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: SURFACE2,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  absoluteFill: { ...(StyleSheet.absoluteFill as any), width: "100%", height: "100%", zIndex: 1 },
  absoluteFillGradient: { ...(StyleSheet.absoluteFill as any), zIndex: 5 },
  iconOverlay: {
    ...(StyleSheet.absoluteFill as any),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 15 },
  badgeWrapper: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 15,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: FONT_BOLD },
  titleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: FONT_SEMIBOLD,
    marginBottom: 2,
    lineHeight: 16,
  },
  timeText: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: FONT_MEDIUM },
});
