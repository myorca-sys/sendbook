import React from "react";
import { View, Pressable, StyleSheet, Alert } from "react-native";
import { Stack } from "expo-router";
import { Flag, Heart } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { WatchVideoContainer } from "./WatchVideoContainer";
import { WatchCommentsArea } from "./WatchCommentsArea";
import { SwarmResolver } from "../../swarm/SwarmResolver";

export function WatchLayout({
  insets,
  router,
  isFullscreen,
  setIsFullscreen,
  showComments,
  setShowComments,
  anime,
  id,
  episode,
  user,
  episodes,
  sources,
  combinedLoading,
  videoUrl,
  displayTitle,
  realViews,
  likesCount,
  isLiked,
  poster,
  nextEp,
  prevEp,
  handleToggleLike,
  handleShare,
  handleReport,
  handleEpisodeChange,
  getEpNumStr,
  forceSync,
  updateProgress,
  needSwarmResolution,
  swarmTargetUrl,
  provider,
  handleSwarmSuccess,
  handleSwarmError,
  swarmError,
}: any) {
  const handleDonate = () => {
    Alert.alert(
      "Dukung Project",
      "Dukungan Anda membantu menjaga server kami tetap gratis ($0 cost). Donasi fitur ini segera hadir!",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {needSwarmResolution && swarmTargetUrl && (
        <SwarmResolver
          url={swarmTargetUrl}
          provider={provider}
          endpoint="video_sources"
          onSuccess={handleSwarmSuccess}
          onError={handleSwarmError}
        />
      )}
      <WatchVideoContainer
        isFullscreen={isFullscreen}
        showComments={showComments}
        insets={insets}
        combinedLoading={combinedLoading}
        videoUrl={videoUrl}
        sources={sources}
        displayTitle={displayTitle}
        episode={episode}
        realViews={realViews}
        likesCount={likesCount}
        isLiked={isLiked}
        router={router}
        nextEp={nextEp}
        prevEp={prevEp}
        handleEpisodeChange={handleEpisodeChange}
        getEpNumStr={getEpNumStr}
        setIsFullscreen={setIsFullscreen}
        handleToggleLike={handleToggleLike}
        setShowComments={setShowComments}
        handleReport={handleReport}
        forceSync={forceSync}
        updateProgress={updateProgress}
        needSwarmResolution={needSwarmResolution}
        swarmTargetUrl={swarmTargetUrl}
        swarmProvider={provider}
        onSwarmSuccess={handleSwarmSuccess}
        onSwarmError={handleSwarmError}
        swarmError={swarmError}
      />
      <WatchCommentsArea
        anime={anime}
        id={id}
        episode={episode}
        user={user}
        setShowComments={setShowComments}
        displayTitle={displayTitle}
        poster={poster}
        realViews={realViews}
        likesCount={likesCount}
        isLiked={isLiked}
        episodes={episodes}
        handleShare={handleShare}
        handleToggleLike={handleToggleLike}
        handleReport={handleReport}
        handleEpisodeChange={handleEpisodeChange}
        isFullscreen={isFullscreen}
        showComments={showComments}
      />

      {!isFullscreen && (
        <>
          <Pressable
            onPress={handleDonate}
            style={({ pressed }) => [
              styles.floatingDonateBtn,
              pressed && styles.floatingDonateBtnPressed,
            ]}
          >
            <Heart color="#FF2D55" fill="#FF2D55" size={20} />
          </Pressable>
          <Pressable
            onPress={handleReport}
            style={({ pressed }) => [
              styles.floatingReportBtn,
              pressed && styles.floatingReportBtnPressed,
            ]}
          >
            <Flag color="white" size={20} />
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  floatingDonateBtn: {
    position: "absolute",
    bottom: 84,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 45, 85, 0.15)", // Translucent pink-red
    borderWidth: 1,
    borderColor: "rgba(255, 45, 85, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  floatingDonateBtnPressed: {
    backgroundColor: "rgba(255, 45, 85, 0.25)",
    transform: [{ scale: 0.95 }],
  },
  floatingReportBtn: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(31, 28, 41, 0.9)", // surface2
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  floatingReportBtnPressed: {
    backgroundColor: "rgba(10, 8, 18, 0.95)",
    transform: [{ scale: 0.95 }],
  },
});
