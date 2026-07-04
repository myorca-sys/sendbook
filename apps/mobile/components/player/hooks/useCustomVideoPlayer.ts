import { useState, useEffect, useRef } from "react";
import { useVideoFallback } from "./useVideoFallback";
import { useVideoControls } from "./useVideoControls";
import { useVideoGestures } from "./useVideoGestures";
import { usePlayerStore } from "../../../lib/store/playerStore";
import { usePlayerActions } from "./usePlayerActions";

export function useCustomVideoPlayer(
  initialVideoUrl: string | null,
  sources: any[],
  onFullscreenChange?: (f: boolean) => void,
  onPause?: () => void,
) {
  const playerRef = useRef<any>(null);
  const { requestedSeekTime, seekTo, setCurrentTimeRef } = usePlayerStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSeekLeft, setShowSeekLeft] = useState(false);
  const [showSeekRight, setShowSeekRight] = useState(false);

  const durationRef = useRef(duration);
  const currentTimeRef = useRef(currentTime);

  useEffect(() => {
    setCurrentTimeRef(currentTimeRef);
    return () => setCurrentTimeRef(null);
  }, []);

  const fallback = useVideoFallback(initialVideoUrl, sources);
  const controls = useVideoControls(isPlaying);
  const gestures = useVideoGestures({
    durationRef,
    currentTimeRef,
    setCurrentTime,
    playerRef,
    showControls: controls.showControls,
    hideTimeout: controls.hideTimeout,
  });

  useEffect(() => {
    if (
      fallback.activeUrl &&
      fallback.activeUrl !== fallback.previousUrlRef.current
    ) {
      fallback.previousUrlRef.current = fallback.activeUrl;
      fallback.setIsBuffering(true);
      const savedTime = currentTimeRef.current;
      if (savedTime > 0)
        setTimeout(() => playerRef.current?.seekTo(savedTime), 500);
    }
  }, [fallback.activeUrl, fallback.previousUrlRef, fallback.setIsBuffering]);

  useEffect(() => {
    durationRef.current = duration;
    currentTimeRef.current = currentTime;
  }, [duration, currentTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gestures.isDragging.current) fallback.handleWatchdogTick(isPlaying);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, fallback.handleWatchdogTick]);

  useEffect(() => {
    fallback.setIsBuffering(true);
  }, [fallback.activeUrl, fallback.setIsBuffering]);

  useEffect(() => {
    if (requestedSeekTime !== null && playerRef.current) {
      playerRef.current.seekTo(requestedSeekTime);
      setCurrentTime(requestedSeekTime);
      fallback.setIsBuffering(true);
      setIsPlaying(true);
      seekTo(null as any);
    }
  }, [requestedSeekTime, seekTo]);

  const actions = usePlayerActions(
    isFullscreen,
    setIsFullscreen,
    onFullscreenChange,
    isPlaying,
    setIsPlaying,
    onPause,
    controls,
    currentTimeRef,
    durationRef,
    playerRef,
    setCurrentTime,
    fallback,
    setShowSeekLeft,
    setShowSeekRight,
  );

  return {
    playerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isFullscreen,
    setIsFullscreen,
    showSettings,
    setShowSettings,
    showSeekLeft,
    setShowSeekLeft,
    showSeekRight,
    setShowSeekRight,
    durationRef,
    currentTimeRef,
    fallback,
    controls,
    gestures,
    ...actions,
  };
}
