import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { Theme } from "../../../lib/theme";

export function HomeBottomPill({
  activeTab,
  onTabChange,
  bottomInset,
  tabAnim,
}: any) {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const PADDING = 6;

  const activeTranslateX = tabAnim
    ? tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [PADDING, containerWidth / 2],
      })
    : PADDING;

  const inverseOpacity = tabAnim
    ? tabAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      })
    : 1;

  const pillWidth = containerWidth ? (containerWidth - PADDING * 2) / 2 : 0;

  return (
    <Animated.View
      style={[
        styles.bottomPillContainer,
        { bottom: Theme.layout.bottomPillBottom + bottomInset },
      ]}
    >
      <View style={styles.bottomPill} onLayout={onLayout}>
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.activeBackground,
              {
                width: pillWidth,
                transform: [{ translateX: activeTranslateX }],
              },
            ]}
          />
        )}
        <Pressable
          onPress={() => onTabChange("anime")}
          style={styles.bottomSegmentBtn}
        >
          {/* Invisible static text to measure correct width and prevent wrapping */}
          <Text style={[styles.bottomSegmentText, { opacity: 0 }]}>Nonton</Text>

          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                opacity: tabAnim || 0,
              },
            ]}
          >
            <Text style={styles.bottomSegmentText}>Nonton</Text>
          </Animated.View>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                opacity: inverseOpacity,
              },
            ]}
          >
            <Text
              style={[styles.bottomSegmentText, styles.bottomSegmentTextActive]}
            >
              Nonton
            </Text>
          </Animated.View>
        </Pressable>
        <Pressable
          onPress={() => onTabChange("manga")}
          style={styles.bottomSegmentBtn}
        >
          {/* Invisible static text to measure correct width and prevent wrapping */}
          <Text style={[styles.bottomSegmentText, { opacity: 0 }]}>Baca</Text>

          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                opacity: inverseOpacity,
              },
            ]}
          >
            <Text style={styles.bottomSegmentText}>Baca</Text>
          </Animated.View>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                opacity: tabAnim || 0,
              },
            ]}
          >
            <Text
              style={[styles.bottomSegmentText, styles.bottomSegmentTextActive]}
            >
              Baca
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomPillContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  bottomPill: {
    flexDirection: "row",
    backgroundColor: "rgba(31, 28, 41, 0.8)",
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  activeBackground: {
    position: "absolute",
    top: 6,
    bottom: 6,
    backgroundColor: Theme.colors.primary,
    borderRadius: 22,
  },
  bottomSegmentBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSegmentText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: Theme.typography.weights.bold,
  },
  bottomSegmentTextActive: { color: Theme.colors.text },
});
