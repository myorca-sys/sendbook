import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Maximize, Minimize } from "lucide-react-native";
import { VideoProgressBar } from "./VideoProgressBar";
import { VideoSocialBar } from "./VideoSocialBar";
import { styles } from "../CustomVideoPlayer.styles";

export function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600),
    m = Math.floor((seconds % 3600) / 60),
    s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface VideoBottomBarProps {
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  progressPct: number;
  gestures: any;
  views?: number;
  likes?: number;
  isLiked?: boolean;
  currentTimeRef?: React.MutableRefObject<number>;
  handleToggleFullscreen: () => void;
  onLike?: (id: number, liked: boolean) => void;
  onShowComments?: () => void;
  onReport?: () => void;
}

export function VideoBottomBar({
  isFullscreen,
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
}: VideoBottomBarProps) {
  return (
    <View
      style={[styles.bottomBarContentWrapper, isFullscreen && { paddingHorizontal: 60 }]}
      pointerEvents="box-none"
    >
      <View style={styles.timeRow} pointerEvents="box-none">
        <Text style={styles.timeText}>
          {formatTime(currentTime)}{" "}
          <Text style={{ color: "rgba(255,255,255,0.5)" }}>/ {formatTime(duration)}</Text>
        </Text>
        <View style={styles.bottomRightControls} pointerEvents="auto">
          <Pressable onPress={handleToggleFullscreen} style={styles.iconButton}>
            {isFullscreen ? (
              <Minimize color="white" size={24} />
            ) : (
              <Maximize color="white" size={24} />
            )}
          </Pressable>
        </View>
      </View>
      <VideoProgressBar
        progressPct={progressPct}
        panHandlers={gestures.panResponder.panHandlers}
        onLayout={(e: any) => {
          gestures.progressBarWidth.current = e.nativeEvent.layout.width;
        }}
      />
      {isFullscreen && (
        <VideoSocialBar
          views={views}
          likes={likes}
          isLiked={isLiked}
          onLike={onLike}
          onShowComments={onShowComments}
          onReport={onReport}
          currentTimeRef={currentTimeRef!}
        />
      )}
    </View>
  );
}
