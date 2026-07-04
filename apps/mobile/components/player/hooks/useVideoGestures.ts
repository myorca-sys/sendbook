import { useRef, useState } from "react";
import {
  PanResponder,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

export function useVideoGestures({
  durationRef,
  currentTimeRef,
  setCurrentTime,
  playerRef,
  showControls,
  hideTimeout,
}: any) {
  const isDragging = useRef(false),
    progressBarWidth = useRef(0),
    progressBarPageX = useRef(0),
    lastTapRef = useRef({ time: 0 });
  const [previewTime, setPreviewTime] = useState<number | null>(null);

  const calculateTime = (e: GestureResponderEvent) => {
    if (durationRef.current <= 0) return 0;
    const barWidth = progressBarWidth.current || Dimensions.get("window").width;
    progressBarPageX.current = (Dimensions.get("window").width - barWidth) / 2;
    const pct = Math.max(
      0,
      Math.min(1, (e.nativeEvent.pageX - progressBarPageX.current) / barWidth),
    );
    return pct * durationRef.current;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        isDragging.current = true;
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        const newTime = calculateTime(e);
        setPreviewTime(newTime);
        setCurrentTime(newTime);
      },
      onPanResponderMove: (e) => {
        const newTime = calculateTime(e);
        setPreviewTime(newTime);
        setCurrentTime(newTime);
      },
      onPanResponderRelease: (e) => {
        isDragging.current = false;
        const newTime = calculateTime(e);
        setPreviewTime(null);
        setCurrentTime(newTime);
        if (playerRef.current) playerRef.current.seekTo(newTime);
        showControls();
      },
    }),
  ).current;

  return {
    isDragging,
    progressBarWidth,
    lastTapRef,
    previewTime,
    panResponder,
  };
}
