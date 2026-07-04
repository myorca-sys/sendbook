import React from "react";
import { View } from "react-native";
import { LatestGrid } from "../../LatestGrid";
import { HeroCard } from "../sections/HeroCard";
import { SpotlightRow } from "../sections/SpotlightRow";
import { WideRow } from "../sections/WideRow";
import { VertRow } from "../sections/VertRow";
import { WatchHistoryRow } from "../sections/WatchHistoryRow";
import { SwarmRow } from "../sections/SwarmRow";
import { SecHeader } from "../../ui/SecHeader";

export function HomeDataSections({
  mappedData,
  historyItems,
  mediaType,
  samehadakuData,
  sLoading,
  kuronimeData,
  kLoading,
}: any) {
  return (
    <>
      {mappedData.hero && (
        <View style={{ marginBottom: 16 }}>
          <HeroCard item={mappedData.hero} mediaType={mediaType} />
        </View>
      )}

      <WatchHistoryRow items={historyItems} mediaType={mediaType} />

      {mappedData.ongoing.length > 0 && (
        <LatestGrid
          title=""
          items={mappedData.ongoing}
          badge={mediaType === "manga" ? "UPDATE" : "NEW"}
          mediaType={mediaType}
        />
      )}

      {mappedData.trending.length >= 3 && (
        <View style={{ marginBottom: 32 }}>
          <SecHeader label={mediaType === "manga" ? "Sedang Hangat" : "Trending & Populer"} />
          <SpotlightRow items={mappedData.trending} mediaType={mediaType} />
        </View>
      )}

      {mappedData.vRow1.items.length > 0 && (
        <View style={{ marginBottom: 32 }}>
          <SecHeader label={mappedData.vRow1.label} />
          <VertRow items={mappedData.vRow1.items} cw={120} ch={172} mediaType={mediaType} />
        </View>
      )}

      {mappedData.wRow.items.length > 0 && (
        <View style={{ marginBottom: 32 }}>
          <SecHeader label={mappedData.wRow.label} />
          <WideRow items={mappedData.wRow.items} mediaType={mediaType} />
        </View>
      )}

      {mappedData.vRow2.items.length > 0 && (
        <View style={{ marginBottom: 32 }}>
          <SecHeader label={mappedData.vRow2.label} />
          <VertRow items={mappedData.vRow2.items} cw={100} ch={144} mediaType={mediaType} />
        </View>
      )}

      {mediaType === "anime" && (
        <>
          <SwarmRow
            title="⚡ Live: Samehadaku (Swarm)"
            data={samehadakuData}
            isLoading={sLoading}
          />
          <SwarmRow title="⚡ Live: Kuronime (Swarm)" data={kuronimeData} isLoading={kLoading} />
        </>
      )}
    </>
  );
}
