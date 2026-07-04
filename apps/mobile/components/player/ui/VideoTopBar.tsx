import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Settings, ArrowLeft } from "lucide-react-native";

interface VideoTopBarProps {
  title?: string;
  isFullscreen: boolean;
  onBack?: () => void;
  onSettingsPress?: () => void;
  showSettings: boolean;
}

export const VideoTopBar = React.memo(function VideoTopBar({
  title,
  isFullscreen,
  onBack,
  onSettingsPress,
  showSettings,
}: VideoTopBarProps) {
  return (
    <View style={styles.topBarContentWrapper} pointerEvents="box-none">
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {!isFullscreen && onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeft color="white" size={24} />
          </Pressable>
        ) : isFullscreen && title ? (
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {showSettings && onSettingsPress && (
        <Pressable
          onPress={onSettingsPress}
          style={[styles.iconButton, { marginLeft: 16 }]}
        >
          <Settings color="white" size={24} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  topBarContentWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    flex: 1,
  },
  iconButton: {
    padding: 4,
  },
});
