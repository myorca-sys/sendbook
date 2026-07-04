import React from "react";
import { View } from "react-native";
import { WideRowItem } from "./WideRowItem";

export function WideRow({
  items,
  mediaType = "anime",
}: {
  items: any[];
  mediaType?: "anime" | "manga";
}) {
  return (
    <View style={{ paddingHorizontal: 16, gap: 16 }}>
      {items.slice(0, 5).map((rawItem, i) => (
        <WideRowItem
          key={`${rawItem.id || i}-${i}`}
          rawItem={rawItem}
          mediaType={mediaType}
          i={i}
        />
      ))}
    </View>
  );
}
