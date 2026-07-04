import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ProgressBar } from "../ProgressBar";
import { formatDuration } from "../../lib/utils";
import { formatHistoryDate } from "../../lib/utils/dateUtils";
import type { HistoryItemType } from "@shared/types/api";

export const HistoryItem = React.memo(
  ({ item, isLast }: { item: HistoryItemType; isLast: boolean }) => {
    const router = useRouter();

    const rawId = String(item.anilistId || item.anilist_id || item.animeSlug || "");
    const isManga = rawId.startsWith("manga|");
    const id = isManga ? rawId.replace("manga|", "") : rawId;

    const title = item.title || item.cleanTitle || item.nativeTitle || `Anime #${id}`;
    const img =
      item.img ||
      item.coverImage ||
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg";
    const ep = item.episode || "?";
    const ts = item.timestampSec || 0;
    const dur = item.durationSec || 0;
    const pct = dur > 0 ? Math.min(100, Math.max(0, (ts / dur) * 100)) : 0;
    const updatedAt = item.updatedAt;

    const href = isManga ? `/manga/${id}` : `/anime/${id}`;
    const epLabel = isManga ? `Chapter ${ep}` : `Episode ${ep}`;
    const durLabel = isManga
      ? `${dur - ts} hal tersisa`
      : `${formatDuration(ts)} / ${formatDuration(dur)} ditonton`;

    return (
      <Pressable onPress={() => router.push(href as any)} style={styles.historyItemRow}>
        {/* Timeline Column */}
        <View style={styles.timelineCol}>
          <View style={styles.timelineDot} />
          {!isLast && <View style={styles.timelineLine} />}
        </View>

        {/* Content Column */}
        <View style={styles.historyContent}>
          <View style={styles.historyTimeRow}>
            <Text style={styles.historyTimeText}>
              {updatedAt ? formatHistoryDate(updatedAt) : "Baru saja"}
            </Text>
          </View>
          <View style={styles.historyCard}>
            <Image source={{ uri: img }} style={styles.historyImg} contentFit="cover" />
            <View style={styles.historyDetails}>
              <Text style={styles.historyTitle} numberOfLines={2}>
                {title}
              </Text>
              <Text style={styles.historyEp}>{epLabel}</Text>

              {dur > 0 && (
                <>
                  <ProgressBar
                    progress={pct}
                    style={styles.historyProgBarBg}
                    trackColor="rgba(255,255,255,0.1)"
                    borderRadius={2}
                  />
                  <Text style={styles.historyProgText}>{durLabel}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  historyItemRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  timelineCol: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0A84FF",
    marginTop: 6,
    borderWidth: 2,
    borderColor: "#0a0812",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
    paddingBottom: 24,
  },
  historyTimeRow: {
    marginBottom: 8,
  },
  historyTimeText: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "600",
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#1a1825",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  historyImg: {
    width: 48,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#0a0812",
  },
  historyDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    lineHeight: 18,
  },
  historyEp: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
    fontWeight: "500",
  },
  historyProgBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    width: "80%",
    marginBottom: 4,
    overflow: "hidden",
  },
  historyProgText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "500",
  },
});
