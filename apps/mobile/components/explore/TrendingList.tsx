import React from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { MediaCard } from "../MediaCard";
import { Theme } from "../../lib/theme";

const { width: W } = Dimensions.get("window");
const BG = Theme.colors.background;

export function TrendingList({ results, loading }: { results: any[]; loading: boolean }) {
  const CARD_WIDTH = (W - 32 - 16) / 3;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => String(item.anilistId || item.id)}
      numColumns={3}
      contentContainerStyle={{ padding: 16 }}
      columnWrapperStyle={{ gap: 8, marginBottom: 16 }}
      renderItem={({ item, index }) => (
        <View style={{ width: CARD_WIDTH }}>
          <View
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              zIndex: 10,
              backgroundColor: index < 3 ? Theme.colors.dangerAlt : "rgba(0,0,0,0.6)",
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: BG,
            }}
          >
            <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{index + 1}</Text>
          </View>
          <MediaCard item={item} variant="vertical" />
        </View>
      )}
      ListEmptyComponent={
        <View style={{ padding: 40, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Data trending belum tersedia saat ini.
          </Text>
        </View>
      }
    />
  );
}
