import React, { useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Bookmark, Forward, BookOpen } from "lucide-react-native";
import { useRouter } from "expo-router";
import { AbstractBadge } from "../../AbstractBadge";
import { UnifiedMediaDetail } from "../../../lib/adapters/mediaAdapter";
import { styles } from "./DetailHeroStyles";

interface DetailHeroProps {
  media: UnifiedMediaDetail;
  mediaType: "anime" | "manga";
  isSaved: boolean;
  isToggling: boolean;
  onToggleCollection: () => void;
  onShare: () => void;
  lastWatchedEp?: string;
}

export const DetailHero = React.memo(
  ({
    media,
    mediaType,
    isSaved,
    isToggling,
    onToggleCollection,
    onShare,
    lastWatchedEp,
  }: DetailHeroProps) => {
    const router = useRouter();
    const isFinished = media.status === "FINISHED";

    const scheduleDay = useMemo(() => {
      if (mediaType === "manga") return "";
      if ((media as any).airSchedule) return (media as any).airSchedule;
      if (media.nextAiringEpisode?.airingAt) {
        const utc =
          media.nextAiringEpisode.airingAt * 1000 + new Date().getTimezoneOffset() * 60000;
        const dt = new Date(utc + 7 * 3600000);
        const daysArr = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return daysArr[dt.getDay()];
      }
      return "";
    }, [media, mediaType]);

    const epToPlay = lastWatchedEp || (media.episodes?.[0]?.chapterNumber ?? media.episodes?.[0]?.episodeNumber ?? "1");
    const title = media.title;
    const img = media.imageUrl;
    const subTitle = media.subTitle || "";
    const hasDiffTitle = !!subTitle;

    const playHref = useMemo(() => {
      if (mediaType === "manga") {
        const firstChapter = media.episodes?.[0];
        if (!firstChapter) return null;
        const sourceId =
          firstChapter.id && firstChapter.id.includes("|")
            ? firstChapter.id.split("|")[0]
            : media.id.includes("|")
              ? media.id.split("|")[0]
              : "komikindo";
        return {
          pathname: "/manga/read",
          params: {
            link: firstChapter.link || firstChapter.episodeUrl || firstChapter.url,
            sourceId,
            mangaId: media.id,
            title: media.title,
            img: media.imageUrl,
            chapter: firstChapter.number || firstChapter.chapterNumber || firstChapter.episodeNumber || "1",
          },
        };
      }
      return `/watch/${media.id}/${epToPlay}`;
    }, [media, mediaType, epToPlay]);

    const badgeText =
      media.status === "NOT_YET_RELEASED" || media.status === "UPCOMING"
        ? "Belum Rilis"
        : media.format === "MOVIE"
          ? "Movie"
          : isFinished
            ? "Tamat"
            : scheduleDay
              ? `Tiap ${scheduleDay}`
              : "Sedang Rilis";
    const badgeColor = isFinished ? "#30D158" : scheduleDay ? "#FFD60A" : "#0A84FF";

    return (
      <View style={styles.heroSection}>
        <Image
          source={{ uri: img }}
          style={[styles.heroImage, { zIndex: 1 }]}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["rgba(10,8,18,0.4)", "transparent", "rgba(10,8,18,0.7)", "#0a0812"]}
          locations={[0, 0.3, 0.7, 1]}
          style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
        />
        <View style={[styles.heroBottom, { zIndex: 10 }]}>
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <AbstractBadge text={badgeText} color={badgeColor} />
              <Text
                style={[styles.title, { marginBottom: hasDiffTitle ? 4 : 8 }]}
                numberOfLines={2}
              >
                {title}
              </Text>
              {hasDiffTitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subTitle}
                </Text>
              )}
            </View>
            <View style={styles.heroRight}>
              <Pressable
                onPress={onShare}
                style={({ pressed }) => [styles.bookmarkCircle, pressed && styles.pressedState]}
              >
                <Forward color="white" size={16} />
              </Pressable>
              <Pressable
                onPress={onToggleCollection}
                disabled={isToggling}
                style={({ pressed }) => [
                  styles.bookmarkCircle,
                  isToggling && styles.togglingState,
                  pressed && !isToggling && styles.pressedState,
                ]}
              >
                {isToggling ? (
                  <ActivityIndicator size="small" color="#e5e5ea" />
                ) : isSaved ? (
                  <Bookmark color="#0A84FF" fill="#0A84FF" size={16} />
                ) : (
                  <Bookmark color="#e5e5ea" size={16} />
                )}
              </Pressable>
              {media.episodes.length > 0 && playHref && (
                <Pressable onPress={() => router.push(playHref as any)} style={styles.heroPlayBtn}>
                  {mediaType === "manga" ? (
                    <BookOpen size={16} color="#fff" />
                  ) : (
                    <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                  )}
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);
