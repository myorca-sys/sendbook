import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { VideoTopBar } from "./VideoTopBar";
import { VideoCenterControls } from "./VideoCenterControls";
import { VideoBottomBar } from "./VideoBottomBar";
import { styles } from "../CustomVideoPlayer.styles";

function VideoControlsLayoutComponent({
  controlsVisible,
  fadeAnim,
  title,
  isFullscreen,
  onBack,
  setShowSettings,
  isPlaying,
  handlePlayPause,
  sources,
  onNext,
  onPrevious,
  handleDoubleTapLeft,
  handleDoubleTapRight,
  currentTime,
  duration,
  progressPct,
  gestures,
  views,
  likes,
  isLiked,
  currentTimeRef,
  handleToggleFullscreen,
  onLike,
  onShowComments,
  onReport,
}: any) {
  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 30, elevation: 30 }]}
      pointerEvents={controlsVisible ? "box-none" : "none"}
    >
      <Animated.View
        style={[styles.controlsContainer, { opacity: fadeAnim }]}
        pointerEvents="box-none"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.topGradient}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        <VideoTopBar
          title={title}
          isFullscreen={isFullscreen}
          onBack={onBack}
          onSettingsPress={() => {
            setShowSettings(true);
            if (isPlaying) handlePlayPause();
          }}
          showSettings={sources.length > 0}
        />
        <VideoCenterControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onDoubleTapLeft={handleDoubleTapLeft}
          onDoubleTapRight={handleDoubleTapRight}
        />

        <VideoBottomBar
          isFullscreen={isFullscreen}
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
      </Animated.View>
    </View>
  );
}

export const VideoControlsLayout = React.memo(
  VideoControlsLayoutComponent,
  (prevProps: any, nextProps: any) => {
    // 1. Jika visibilitas berubah, wajib render ulang agar controls muncul/hilang
    if (prevProps.controlsVisible !== nextProps.controlsVisible) {
      return false;
    }

    // 2. Jika kontrol saat ini dan nanti sama-sama TERSEMBUNYI,
    // kita abai terhadap perubahan waktu putar (currentTime, duration, progressPct)
    // agar menghemat CPU & GPU rendering loop.
    if (!nextProps.controlsVisible) {
      return (
        prevProps.isFullscreen === nextProps.isFullscreen &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.title === nextProps.title &&
        prevProps.sources === nextProps.sources &&
        prevProps.views === nextProps.views &&
        prevProps.likes === nextProps.likes &&
        prevProps.isLiked === nextProps.isLiked
      );
    }

    // 3. Jika kontrol sedang TERLIHAT, render ulang jika ada perubahan prop visual penting
    return (
      prevProps.currentTime === nextProps.currentTime &&
      prevProps.duration === nextProps.duration &&
      prevProps.progressPct === nextProps.progressPct &&
      prevProps.isFullscreen === nextProps.isFullscreen &&
      prevProps.isPlaying === nextProps.isPlaying &&
      prevProps.title === nextProps.title &&
      prevProps.views === nextProps.views &&
      prevProps.likes === nextProps.likes &&
      prevProps.isLiked === nextProps.isLiked
    );
  }
);
