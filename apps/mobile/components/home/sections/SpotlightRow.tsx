import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { SpotlightBigItem } from "./SpotlightBigItem";
import { SpotlightStackedItem } from "./SpotlightStackedItem";
import { prefetchAnime, prefetchManga } from "../../../lib/utils";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

export function SpotlightRow({
  items,
  mediaType = "anime",
}: {
  items: any[];
  mediaType?: "anime" | "manga";
}) {
  const uniqueItems = useMemo(() => {
    const seen = new Set();
    return items.filter((item) => {
      const id = String(item.anilistId || item.id || "");
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [items]);

  if (uniqueItems.length === 0) return null;

  const listData = [];
  if (uniqueItems.length > 0) {
    listData.push({ type: "big", item: uniqueItems[0], rank: 1 });
  }
  for (let i = 1; i < uniqueItems.length; i += 2) {
    if (uniqueItems[i]) {
      listData.push({
        type: "stacked",
        items: uniqueItems.slice(i, i + 2),
        startRank: i + 1,
      });
    }
  }

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    viewableItems.slice(0, 2).forEach(({ item: chunk }: any) => {
      if (!chunk) return;
      const itemsToPrefetch = chunk.type === "big" ? [chunk.item] : (chunk.items || []);
      itemsToPrefetch.forEach((rawItem: any) => {
        if (rawItem) {
          const item = normalizeMediaItem(rawItem);
          if (mediaType === "anime") {
            prefetchAnime(item.id);
          } else {
            prefetchManga(item.id);
          }
        }
      });
    });
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 20,
  }).current;

  return (
    <FlatList
      data={listData}
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      decelerationRate="fast"
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 6 }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item: chunk }) => {
        if (chunk.type === "big") {
          return <SpotlightBigItem chunk={chunk} mediaType={mediaType} />;
        }
        if (chunk.type === "stacked") {
          return <SpotlightStackedItem chunk={chunk} mediaType={mediaType} />;
        }
        return null;
      }}
    />
  );
}
