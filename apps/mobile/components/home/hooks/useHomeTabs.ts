import { useRef } from "react";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";

export function useHomeTabs(
  activeTab: "anime" | "manga",
  setActiveTab: (tab: "anime" | "manga") => void,
) {
  const tabAnim = useRef(new Animated.Value(0)).current;
  const animeScrollY = useRef(new Animated.Value(0)).current;
  const mangaScrollY = useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab: "anime" | "manga") => {
    if (tab === activeTab) return;
    if (Haptics && typeof Haptics.impactAsync === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setActiveTab(tab);

    Animated.spring(tabAnim, {
      toValue: tab === "anime" ? 0 : 1,
      useNativeDriver: true,
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    }).start();
  };

  const activeScrollY = activeTab === "anime" ? animeScrollY : mangaScrollY;

  const getInterpolation = (inputRange: number[], outputRange: number[] | string[]) =>
    tabAnim.interpolate({ inputRange, outputRange });

  const animeOpacity = getInterpolation([0, 1], [1, 0]);
  const mangaOpacity = getInterpolation([0, 1], [0, 1]);

  const headerBg = activeScrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(10, 8, 18, 0)", "rgba(10, 8, 18, 0.96)"],
    extrapolate: "clamp",
  });

  return {
    tabAnim,
    animeScrollY,
    mangaScrollY,
    handleTabChange,
    animeOpacity,
    mangaOpacity,
    headerBg,
  };
}
