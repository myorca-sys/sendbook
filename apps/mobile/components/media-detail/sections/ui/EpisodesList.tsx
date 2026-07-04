import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";

export const EpisodesList = React.memo(function EpisodesList({
  flatListRef,
  eps,
  isBridging,
  renderItem,
  onViewableItemsChanged,
  viewabilityConfig,
  listLabel,
}: {
  flatListRef: React.RefObject<any>;
  eps: any[];
  isBridging: boolean;
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  onViewableItemsChanged: any;
  viewabilityConfig: any;
  listLabel: string;
}) {
  if (isBridging) {
    return (
      <View style={styles.emptyEpisodes}>
        <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 12 }} />
        <Text style={styles.emptyEpisodesText}>Mencari sumber chapter...</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.episodesScroll}
      contentContainerStyle={styles.episodesScrollContent}
      data={eps}
      keyExtractor={(item, index) =>
        `${item.id || item.chapterNumber || item.episodeNumber || item.number || "ep"}-${index}`
      }
      renderItem={renderItem as any}
      getItemLayout={(data, index) => ({
        length: 66,
        offset: 66 * index,
        index,
      })}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: true,
          });
        }, 100);
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      ListEmptyComponent={
        <View style={styles.emptyEpisodes}>
          <Text style={styles.emptyEpisodesText}>Belum ada {listLabel.toLowerCase()} tersedia</Text>
        </View>
      }
    />
  );
});

const styles = StyleSheet.create({
  emptyEpisodes: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
  },
  emptyEpisodesText: { color: "#8e8e93", fontSize: 14, fontWeight: "500" },
  episodesScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  episodesScrollContent: { paddingRight: 40, gap: 10 },
});
