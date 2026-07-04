import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { CustomVideoPlayer } from "../../../components/CustomVideoPlayer";
import { Theme } from "../../../lib/theme";

export function WatchVideoContainer({
  isFullscreen,
  showComments,
  insets,
  combinedLoading,
  videoUrl,
  sources,
  displayTitle,
  episode,
  realViews,
  likesCount,
  isLiked,
  router,
  nextEp,
  prevEp,
  handleEpisodeChange,
  getEpNumStr,
  setIsFullscreen,
  handleToggleLike,
  setShowComments,
  handleReport,
  forceSync,
  updateProgress,
  needSwarmResolution,
  swarmTargetUrl,
  swarmProvider,
  onSwarmSuccess,
  onSwarmError,
  swarmError,
}: any) {
  return (
    <View
      style={[
        isFullscreen
          ? styles.fullscreenVideoContainer
          : [styles.videoContainer, { marginTop: Math.max(insets.top, 0) }],
        isFullscreen && showComments && { right: 320 },
      ]}
    >
      {combinedLoading || needSwarmResolution ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>
            {needSwarmResolution
              ? "Menembus Keamanan Cloudflare..."
              : "Menyiapkan tayangan..."}
          </Text>
        </View>
      ) : swarmError ? (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>{swarmError}</Text>
        </View>
      ) : videoUrl ? (
        <CustomVideoPlayer
          videoUrl={videoUrl}
          sources={sources}
          title={`${displayTitle} - Eps ${episode}`}
          onBack={() => router.back()}
          onNext={
            nextEp
              ? () => handleEpisodeChange(String(getEpNumStr(nextEp)))
              : undefined
          }
          onPrevious={
            prevEp
              ? () => handleEpisodeChange(String(getEpNumStr(prevEp)))
              : undefined
          }
          isLoading={combinedLoading}
          onFullscreenChange={setIsFullscreen}
          views={realViews}
          likes={likesCount}
          isLiked={isLiked}
          onLike={handleToggleLike}
          onShowComments={() => setShowComments(true)}
          onReport={handleReport}
          onPause={forceSync}
          onProgressUpdate={(time: number, dur: number) => {
            updateProgress(time, dur);
          }}
          onEnd={() => {
            if (nextEp) handleEpisodeChange(String(getEpNumStr(nextEp)));
          }}
        />
      ) : (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>
            Tayangan tidak tersedia saat ini.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenVideoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "black",
    elevation: 100,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "black",
    position: "relative",
    justifyContent: "center",
    zIndex: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: Theme.colors.textDim,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
  },
  unavailableContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.surface2,
  },
  unavailableText: { color: Theme.colors.textDim, fontWeight: "500" },
});
