import React from "react";
import { View, Pressable, Dimensions, ActivityIndicator, StyleSheet, Platform } from "react-native";
import NativeVideoPlayer from "../modules/native-video-player/src/index";
import { StatusBar } from "expo-status-bar";

import { useCustomVideoPlayer } from "./player/hooks/useCustomVideoPlayer";
import { VideoSeekOverlay } from "./player/ui/VideoSeekOverlay";
import { VideoControlsLayout } from "./player/ui/VideoControlsLayout";
import { VideoSettingsSheet } from "./player/ui/VideoSettingsSheet";
import { styles } from "./player/CustomVideoPlayer.styles";

export function CustomVideoPlayer({
  videoUrl,
  sources = [],
  title,
  headers,
  onNext,
  onPrevious,
  isLoading,
  onFullscreenChange,
  views,
  likes,
  isLiked,
  onLike,
  onShowComments,
  onReport,
  onProgressUpdate,
  onEnd,
  onBack,
  onPause,
}: any) {
  const {
    playerRef,
    isPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isFullscreen,
    showSettings,
    setShowSettings,
    showSeekLeft,
    showSeekRight,
    currentTimeRef,
    fallback,
    controls,
    gestures,
    handleToggleFullscreen,
    handlePlayPause,
    handleDoubleTapLeft,
    handleDoubleTapRight,
  } = useCustomVideoPlayer(videoUrl, sources, onFullscreenChange, onPause);

  let progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  if (isNaN(progressPct) || !isFinite(progressPct)) progressPct = 0;
  progressPct = Number(Math.max(0, Math.min(100, progressPct)).toFixed(2));

  const activeHeaders = {
    "User-Agent":
      Platform.OS === "android"
        ? "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
        : "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
    ...headers,
  };
  if (fallback.activeUrl) {
    const activeSource = sources.find((s: any) => s.url === fallback.activeUrl);
    const activeProvider = activeSource?.provider ? activeSource.provider.toLowerCase() : null;

    if (fallback.activeUrl.includes("mp4upload.com")) {
      activeHeaders["Referer"] = "https://www.mp4upload.com/";
    } else if (
      fallback.activeUrl.includes("kuroplayer") ||
      fallback.activeUrl.includes("blogger.com") ||
      fallback.activeUrl.includes("googleusercontent") ||
      fallback.activeUrl.includes("wibufile")
    ) {
      if (activeProvider === "samehadaku") {
        activeHeaders["Referer"] = "https://v2.samehadaku.how/";
        activeHeaders["Origin"] = "https://v2.samehadaku.how";
      } else {
        activeHeaders["Referer"] = "https://kuronime.sbs/";
        activeHeaders["Origin"] = "https://kuronime.sbs";
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={isFullscreen} animated={true} style="light" />
      {fallback.activeUrl ? (
        <NativeVideoPlayer
          // @ts-ignore
          ref={playerRef}
          videoUrl={fallback.activeUrl}
          headers={activeHeaders}
          isPlaying={isPlaying}
          style={StyleSheet.absoluteFill}
          onProgress={({ nativeEvent }: any) => {
            if (!gestures.isDragging.current) {
              fallback.handleProgressReceived();
              const { currentTime: cur, duration: dur } = nativeEvent;
              setCurrentTime(cur);
              setDuration(dur);
              if (onProgressUpdate) onProgressUpdate(cur, dur);
            }
          }}
          onPlaybackEnd={() => {
            if (onEnd) onEnd();
            else if (onNext) onNext();
          }}
        />
      ) : (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      )}
      {(isLoading || fallback.isBuffering) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      )}

      <VideoSeekOverlay showSeekLeft={showSeekLeft} showSeekRight={showSeekRight} />

      <Pressable
        style={styles.interactionLayer}
        onPress={(e) => {
          const now = Date.now(),
            DOUBLE_PRESS_DELAY = 300,
            { pageX } = e.nativeEvent,
            screenWidth = Dimensions.get("window").width;
          if (now - gestures.lastTapRef.current.time < DOUBLE_PRESS_DELAY) {
            if (pageX < screenWidth / 3) handleDoubleTapLeft();
            else if (pageX > (screenWidth * 2) / 3) handleDoubleTapRight();
            else handlePlayPause();
            gestures.lastTapRef.current.time = 0;
          } else {
            gestures.lastTapRef.current.time = now;
            controls.toggleControls();
          }
        }}
      />

      <VideoControlsLayout
        controlsVisible={controls.controlsVisible}
        fadeAnim={controls.fadeAnim}
        title={title}
        isFullscreen={isFullscreen}
        onBack={onBack}
        setShowSettings={setShowSettings}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        sources={sources}
        onNext={onNext}
        onPrevious={onPrevious}
        handleDoubleTapLeft={handleDoubleTapLeft}
        handleDoubleTapRight={handleDoubleTapRight}
        currentTime={currentTime}
        duration={duration}
        progressPct={progressPct}
        gestures={gestures}
        views={views}
        likes={likes}
        isLiked={isLiked}
        currentTimeRef={currentTimeRef}
        handleToggleFullscreen={handleToggleFullscreen}
        onLike={onLike}
        onShowComments={onShowComments}
        onReport={onReport}
      />

      {showSettings && (
        <VideoSettingsSheet
          isFullscreen={isFullscreen}
          availableQualities={fallback.availableQualities}
          activeQuality={fallback.activeQuality}
          onClose={() => setShowSettings(false)}
          onQualitySelect={(quality: string) => {
            fallback.changeQuality(quality);
            setShowSettings(false);
            if (!isPlaying) handlePlayPause();
          }}
        />
      )}
    </View>
  );
}
