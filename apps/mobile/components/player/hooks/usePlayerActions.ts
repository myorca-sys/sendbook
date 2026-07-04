import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { BackHandler, LayoutAnimation, Platform, UIManager } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function usePlayerActions(
  isFullscreen: boolean,
  setIsFullscreen: any,
  onFullscreenChange: any,
  isPlaying: boolean,
  setIsPlaying: any,
  onPause: any,
  controls: any,
  currentTimeRef: any,
  durationRef: any,
  playerRef: any,
  setCurrentTime: any,
  fallback: any,
  setShowSeekLeft: any,
  setShowSeekRight: any,
) {
  const handleToggleFullscreen = () => {
    try {
      if (isFullscreen) {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        ).catch(() => {});
        NavigationBar.setVisibilityAsync("visible").catch(() => {});
        
        // Eksekusi penyusutan layout secara instan (0ms) dengan animasi native
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFullscreen(false);
        if (onFullscreenChange) onFullscreenChange(false);
      } else {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        ).catch(() => {});
        NavigationBar.setVisibilityAsync("hidden").catch(() => {});
        
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFullscreen(true);
        if (onFullscreenChange) onFullscreenChange(true);
      }
    } catch (e) {
      console.warn("Fullscreen toggle error:", e);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (isFullscreen) {
        handleToggleFullscreen();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
      NavigationBar.setVisibilityAsync("visible").catch(() => {});
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying && onPause) onPause();
    controls.showControls();
  };

  const handleDoubleTapLeft = () => {
    const newTime = Math.max(0, currentTimeRef.current - 10);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
      fallback.setIsBuffering(true);
    }
    setShowSeekLeft(true);
    setTimeout(() => setShowSeekLeft(false), 500);
    controls.showControls();
  };

  const handleDoubleTapRight = () => {
    const newTime = Math.min(durationRef.current, currentTimeRef.current + 10);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
      fallback.setIsBuffering(true);
    }
    setShowSeekRight(true);
    setTimeout(() => setShowSeekRight(false), 500);
    controls.showControls();
  };

  return {
    handleToggleFullscreen,
    handlePlayPause,
    handleDoubleTapLeft,
    handleDoubleTapRight,
  };
}
