import React from "react";
import { View, Animated, RefreshControl } from "react-native";
import { LoadingState } from "../ui/LoadingState";
import { FEATURE_FLAGS } from "../../lib/config/features";
import { useMediaHistory } from "../../lib/hooks/useMediaHistory";
import { Theme } from "../../lib/theme";
import { useHomeContent } from "../../lib/hooks/useHomeContent";
import { HomeErrorState } from "./HomeErrorState";
import { HomeColdState } from "./HomeColdState";
import { useHomeSwarm } from "./hooks/useHomeSwarm";
import { HomeSwarmResolvers } from "./ui/HomeSwarmResolvers";
import { HomeColdStartBanner } from "./ui/HomeColdStartBanner";
import { HomeDataSections } from "./ui/HomeDataSections";

interface HomeContentProps {
  scrollY: Animated.Value;
  mediaType: "anime" | "manga";
}

export function HomeContent({ scrollY, mediaType }: HomeContentProps) {
  const { animeHistory, mangaHistory } = useMediaHistory();
  const historyItems = mediaType === "anime" ? animeHistory : mangaHistory;

  const { mappedData, isLoading, isValidating, isError, isColdStart, hasData, mutate } =
    useHomeContent(mediaType);

  const swarmProps = useHomeSwarm(mediaType);

  const renderSwarmResolvers = () => {
    if (!FEATURE_FLAGS.ENABLE_SWARM_SYNC) return null;
    return <HomeSwarmResolvers {...swarmProps} />;
  };

  if ((isLoading || isValidating) && !hasData) {
    return (
      <View style={{ flex: 1 }}>
        {renderSwarmResolvers()}
        <LoadingState />
      </View>
    );
  }

  if (isColdStart && !hasData) {
    return <HomeColdState renderSwarmResolvers={renderSwarmResolvers} />;
  }

  if (isError && !hasData) {
    return <HomeErrorState onRetry={() => mutate()} renderSwarmResolvers={renderSwarmResolvers} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {renderSwarmResolvers()}
      {isColdStart && <HomeColdStartBanner />}

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Theme.layout.listPaddingBottom,
          paddingTop: isColdStart && hasData ? 20 : 0,
        }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isValidating && hasData}
            onRefresh={() => mutate()}
            tintColor="#fff"
            colors={[Theme.colors.primary]}
            progressViewOffset={Theme.layout.paddingTopSafe + 60}
          />
        }
      >
        <HomeDataSections
          mappedData={mappedData}
          historyItems={historyItems}
          mediaType={mediaType}
          samehadakuData={swarmProps.samehadakuData}
          sLoading={swarmProps.sLoading}
          kuronimeData={swarmProps.kuronimeData}
          kLoading={swarmProps.kLoading}
        />
      </Animated.ScrollView>
    </View>
  );
}
