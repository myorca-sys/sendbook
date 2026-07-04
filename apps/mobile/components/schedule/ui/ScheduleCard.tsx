import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bookmark, Star } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import type { AnimeBase } from "@shared/types/api";
import { useScheduleCard } from "../hooks/useScheduleCard";

const absoluteFill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

interface ScheduleCardProps {
  item: AnimeBase & { airingTime?: string };
  idx: number;
  isToday: boolean;
  isPast: boolean;
  user: any;
}

export const ScheduleCard = memo(({ item, idx, isToday, isPast, user }: ScheduleCardProps) => {
  const router = useRouter();
  const { id, img, title, score, airingTime, statusText, statusColor, isSaved, handleSaveCollection } =
    useScheduleCard(item, isToday, isPast, user);

  if (!id || id === "undefined") return null;

  return (
    <Pressable onPress={() => router.push(`/anime/${id}` as any)} style={styles.itemRow}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: img }} style={absoluteFill} contentFit="cover" />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.itemStats}>
          {!!airingTime && (
            <View style={styles.statGroup}>
              <View style={styles.airingTimeBadge}>
                <Text style={styles.airingTimeText}>{airingTime}</Text>
              </View>
              <Text style={styles.dotSeparator}>●</Text>
            </View>
          )}
          <Text style={[styles.epText, { color: statusColor }]}>{statusText}</Text>
          {!!score && score > 0 ? (
            <View style={styles.statGroup}>
              <Text style={[styles.dotSeparator, { marginLeft: 4 }]}>●</Text>
              <View style={[styles.statGroup, { gap: 4, marginLeft: 4 }]}>
                <Star color={Theme.colors.warning} fill={Theme.colors.warning} size={10} />
                <Text style={styles.scoreText}>{(score / 10).toFixed(1)}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <Pressable
        onPress={handleSaveCollection}
        style={[
          styles.saveButton,
          isSaved && { backgroundColor: "rgba(10,132,255,0.12)" },
        ]}
      >
        <Bookmark
          color={isSaved ? "#0A84FF" : "white"}
          fill={isSaved ? "#0A84FF" : "transparent"}
          size={16}
        />
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 12,
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Theme.colors.surface2,
  },
  itemDetails: { flex: 1, marginLeft: 16, justifyContent: "center" },
  itemTitle: { color: "white", fontSize: 15, fontWeight: "700", marginBottom: 6 },
  itemStats: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 },
  statGroup: { flexDirection: "row", alignItems: "center" },
  airingTimeBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  airingTimeText: { color: "white", fontSize: 10, fontWeight: "700" },
  dotSeparator: { color: "rgba(255,255,255,0.3)", fontSize: 8, marginHorizontal: 4 },
  epText: { fontSize: 12, fontWeight: "600" },
  scoreText: { color: Theme.colors.warning, fontSize: 11, fontWeight: "bold" },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
});
