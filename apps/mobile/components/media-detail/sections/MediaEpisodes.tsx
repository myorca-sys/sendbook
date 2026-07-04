import React, { useRef, useCallback } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { MediaEpisodesHeader } from "./ui/MediaEpisodesHeader";
import { MediaEpisodeItem } from "./ui/MediaEpisodeItem";
import { EpisodesList } from "./ui/EpisodesList";
import { useEpisodeNavigation } from "./hooks/useEpisodeNavigation";
import { useMediaEpisodesLogic } from "./hooks/useMediaEpisodesLogic";

export const MediaEpisodes = React.memo(
  ({
    mediaId,
    mediaType,
    rawEps,
    isBridging,
    title = "",
    img = "",
    activeEpisode,
    onEpisodePress,
  }: any) => {
    const flatListRef = useRef<FlatList>(null);
    const isManualScrolling = useRef(false);
    const viewabilityConfig = useRef({
      viewAreaCoveragePercentThreshold: 50,
      minimumViewTime: 100,
    }).current;

    const { isReady, epChunkIndex, setEpChunkIndex, epsSort, eps, handleToggleSort } =
      useMediaEpisodesLogic(rawEps);

    const { handlePress } = useEpisodeNavigation({
      mediaId,
      mediaType,
      title,
      img,
      eps,
      epsSort,
      onEpisodePress,
    });

    const handleChunkPress = useCallback(
      (index: number) => {
        setEpChunkIndex(index);
        isManualScrolling.current = true;
        const targetIndex = index * 6;
        if (flatListRef.current && eps.length > targetIndex) {
          try {
            flatListRef.current.scrollToOffset({
              offset: targetIndex * 66,
              animated: true,
            });
          } catch (e) {}
        }
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 500);
      },
      [eps, setEpChunkIndex],
    );

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
      if (!isManualScrolling.current && viewableItems && viewableItems.length > 0) {
        const firstVisible = viewableItems[0].index;
        if (firstVisible !== null && firstVisible !== undefined) {
          const newChunk = Math.floor(firstVisible / 6);
          if (newChunk >= 0) setEpChunkIndex(newChunk);
        }
      }
    }).current;

    const renderItem = useCallback(
      ({ item: ep, index }: { item: any; index: number }) => {
        const epNum = ep.chapterNumber ?? ep.episodeNumber ?? ep.number ?? ep.url?.split("episode=").pop() ?? "?";
        return (
          <MediaEpisodeItem
            epNum={epNum}
            isActive={activeEpisode === String(epNum)}
            handlePress={() => handlePress(ep, index)}
          />
        );
      },
      [activeEpisode, handlePress]
    );

    if (!isReady) {
      return (
        <View
          style={[
            styles.episodesSection,
            { alignItems: "center", justifyContent: "center", height: 200 },
          ]}
        >
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      );
    }

    const listLabel = mediaType === "manga" ? "Daftar Chapter" : "Daftar Episode";
    const countLabel = mediaType === "manga" ? "Chap" : "Eps";

    if (!eps || eps.length === 0) {
      return (
        <View style={styles.episodesSection}>
          <Text style={styles.sectionTitle}>{listLabel}</Text>
          <View style={styles.emptyEpisodes}>
            <Text style={styles.emptyEpisodesText}>
              Belum ada {mediaType === "manga" ? "chapter" : "episode"} tersedia.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.episodesSection}>
        <MediaEpisodesHeader
          listLabel={listLabel}
          countLabel={countLabel}
          epsCount={eps.length}
          epsSort={epsSort}
          onToggleSort={() => handleToggleSort(flatListRef)}
          eps={eps}
          epChunkIndex={epChunkIndex}
          handleChunkPress={handleChunkPress}
        />
        <View>
          <EpisodesList
            flatListRef={flatListRef}
            eps={eps}
            isBridging={isBridging}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            listLabel={listLabel}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  episodesSection: { marginBottom: 32 },
  sectionTitle: {
    color: "white",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  emptyEpisodes: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
  },
  emptyEpisodesText: { color: "#8e8e93", fontSize: 14, fontWeight: "500" },
});
