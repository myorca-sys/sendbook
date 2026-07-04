import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeContent } from "../../components/home/HomeContent";
import { HomeHeader } from "../../components/home/ui/HomeHeader";
import { HomeBottomPill } from "../../components/home/ui/HomeBottomPill";
import { useHomeTabs } from "../../components/home/hooks/useHomeTabs";
import { Theme } from "../../lib/theme";
import { FEATURE_FLAGS } from "../../lib/config/features";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"anime" | "manga">("anime");

  const {
    tabAnim,
    animeScrollY,
    mangaScrollY,
    handleTabChange,
    animeOpacity,
    mangaOpacity,
    headerBg,
  } = useHomeTabs(activeTab, setActiveTab);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeHeader
        headerBg={headerBg}
        onSearchPress={() => router.push(`/explore?mediaType=${activeTab}` as any)}
        onBellPress={() => router.push("/notifications" as any)}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.absoluteFill,
            { opacity: animeOpacity, zIndex: activeTab === "anime" ? 10 : 0 },
          ]}
          pointerEvents={activeTab === "anime" ? "auto" : "none"}
        >
          <HomeContent scrollY={animeScrollY} mediaType="anime" />
        </Animated.View>

        {FEATURE_FLAGS.ENABLE_MANGA && (
          <Animated.View
            style={[
              styles.absoluteFill,
              { opacity: mangaOpacity, zIndex: activeTab === "manga" ? 10 : 0 },
            ]}
            pointerEvents={activeTab === "manga" ? "auto" : "none"}
          >
            <HomeContent scrollY={mangaScrollY} mediaType="manga" />
          </Animated.View>
        )}
      </View>

      {FEATURE_FLAGS.ENABLE_MANGA && (
        <HomeBottomPill
          activeTab={activeTab}
          onTabChange={handleTabChange}
          bottomInset={insets.bottom > 0 ? insets.bottom / 3 : 0}
          tabAnim={tabAnim}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { flex: 1 },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
});
