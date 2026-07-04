import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, RotateCw } from "lucide-react-native";

interface VideoCenterControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onDoubleTapLeft: () => void;
  onDoubleTapRight: () => void;
}

export const VideoCenterControls = React.memo(function VideoCenterControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onDoubleTapLeft,
  onDoubleTapRight,
}: VideoCenterControlsProps) {
  return (
    <View style={styles.centerControls} pointerEvents="box-none">
      <View style={styles.centerRow} pointerEvents="box-none">
        {onPrevious ? (
          <Pressable onPress={onPrevious} style={styles.controlButton}>
            <SkipBack color="white" size={28} fill="white" />
          </Pressable>
        ) : (
          <View style={{ width: 48 }} />
        )}

        <Pressable onPress={onDoubleTapLeft} style={styles.controlButton}>
          <RotateCcw color="white" size={32} />
        </Pressable>

        <Pressable onPress={onPlayPause} style={[styles.controlButton, styles.playButton]}>
          {isPlaying ? (
            <Pause color="white" size={40} fill="white" />
          ) : (
            <Play color="white" size={40} fill="white" style={{ marginLeft: 4 }} />
          )}
        </Pressable>

        <Pressable onPress={onDoubleTapRight} style={styles.controlButton}>
          <RotateCw color="white" size={32} />
        </Pressable>

        {onNext ? (
          <Pressable onPress={onNext} style={styles.controlButton}>
            <SkipForward color="white" size={28} fill="white" />
          </Pressable>
        ) : (
          <View style={{ width: 48 }} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  centerControls: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
