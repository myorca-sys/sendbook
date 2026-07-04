import React from "react";
import { View, StyleSheet } from "react-native";

interface VideoProgressBarProps {
  progressPct: number;
  panHandlers: any;
  onLayout: (e: any) => void;
}

export function VideoProgressBar({
  progressPct,
  panHandlers,
  onLayout,
}: VideoProgressBarProps) {
  return (
    <View
      style={styles.progressContainer}
      pointerEvents="auto"
      onLayout={onLayout}
      {...panHandlers}
    >
      <View style={styles.progressBarHitbox} pointerEvents="none">
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progressPct}%` }]}
          />
          <View style={[styles.progressThumb, { left: `${progressPct}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    height: 24,
    width: "100%",
    justifyContent: "flex-end",
    position: "relative",
    zIndex: 10,
  },
  progressBarHitbox: {
    height: 24,
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  progressBarTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 1,
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0A84FF",
    borderRadius: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressThumb: {
    position: "absolute",
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginLeft: -5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
