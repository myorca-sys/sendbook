import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MediaEpisodes } from "../../media-detail/sections/MediaEpisodes";

interface WatchListHeaderProps {
  id: string;
  episode: string;
  displayTitle: string;
  poster: string;
  realViews: number;
  likesCount: number;
  isLiked: boolean;
  episodes: any[];
  handleShare: () => void;
  handleToggleLike: () => void;
  handleReport: () => void;
  handleEpisodeChange: (ep: any) => void;
}

export function WatchListHeader({
  id,
  episode,
  displayTitle,
  poster,
  realViews,
  likesCount,
  isLiked,
  episodes,
  handleShare,
  handleToggleLike,
  handleReport,
  handleEpisodeChange,
}: WatchListHeaderProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <View style={styles.titleSection}>
        <Text style={styles.titleText}>
          {displayTitle} <Text style={styles.episodeText}>· Eps {episode}</Text>
        </Text>
      </View>
      <MediaEpisodes
        mediaId={id}
        mediaType="anime"
        rawEps={episodes}
        activeEpisode={episode}
        onEpisodePress={handleEpisodeChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleSection: { marginBottom: 8 },
  titleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 22,
  },
  episodeText: {
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    fontSize: 16,
  },
});
