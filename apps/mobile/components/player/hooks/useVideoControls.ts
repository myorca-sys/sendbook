import { useState, useRef, useCallback, useEffect } from "react";
import { Animated } from "react-native";

export function useVideoControls(isPlaying: boolean) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const showControls = useCallback(
    (isDragging: boolean = false) => {
      setControlsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      if (hideTimeout.current) clearTimeout(hideTimeout.current);

      if (isPlaying && !isDragging) {
        hideTimeout.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setControlsVisible(false));
        }, 3000);
      }
    },
    [fadeAnim, isPlaying],
  );

  const toggleControls = useCallback(() => {
    if (controlsVisible) {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setControlsVisible(false));
    } else {
      showControls();
    }
  }, [controlsVisible, fadeAnim, showControls]);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [isPlaying, showControls]);

  return {
    controlsVisible,
    fadeAnim,
    showControls,
    toggleControls,
    hideTimeout,
  };
}
