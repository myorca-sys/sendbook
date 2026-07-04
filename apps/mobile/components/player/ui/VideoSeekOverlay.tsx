import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SkipBack, SkipForward } from "lucide-react-native";
import { styles } from "../CustomVideoPlayer.styles";

interface VideoSeekOverlayProps {
  showSeekLeft: boolean;
  showSeekRight: boolean;
}

export const VideoSeekOverlay = React.memo(function VideoSeekOverlay({
  showSeekLeft,
  showSeekRight,
}: VideoSeekOverlayProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.seekOverlay]} pointerEvents="box-none">
      {showSeekLeft && (
        <View style={[styles.seekArea, { alignItems: "center" }]}>
          <View style={styles.seekIndicator}>
            <SkipBack color="white" size={24} />
            <Text style={styles.seekIndicatorText}>10s</Text>
          </View>
        </View>
      )}
      <View style={{ flex: 1 }} />
      {showSeekRight && (
        <View style={[styles.seekArea, { alignItems: "center" }]}>
          <View style={styles.seekIndicator}>
            <SkipForward color="white" size={24} />
            <Text style={styles.seekIndicatorText}>10s</Text>
          </View>
        </View>
      )}
    </View>
  );
});
