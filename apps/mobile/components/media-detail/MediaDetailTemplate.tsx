import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, Search, Bell } from "lucide-react-native";

import { useAuth } from "../../lib/auth";
import { Theme } from "../../lib/theme";
import { useMediaDetailData } from "./hooks/useMediaDetailData";

import { DetailHero } from "./sections/DetailHero";
import { DetailMetadata } from "./sections/DetailMetadata";
import { DetailSynopsis } from "./sections/DetailSynopsis";
import { DetailRecommendations } from "./sections/DetailRecommendations";
import { MediaEpisodes } from "./sections/MediaEpisodes";
import { MediaDetailLoading } from "./ui/MediaDetailLoading";
import { MediaDetailError } from "./ui/MediaDetailError";

interface MediaDetailTemplateProps {
  id: string;
  mediaType: "anime" | "manga";
}

export function MediaDetailTemplate({ id, mediaType }: MediaDetailTemplateProps) {
  const router = useRouter();
  const { user } = useAuth();

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const {
    d,
    isLoading,
    isBridging,
    error,
    mutate,
    isToggling,
    isSaved,
    lastEp,
    toggleCollection,
    isColdStart,
  } = useMediaDetailData(id, mediaType, user);

  React.useEffect(() => {
    if (isColdStart) {
      const timer = setTimeout(() => mutate(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isColdStart, mutate]);

  if (isLoading || isColdStart) return <MediaDetailLoading isColdStart={isColdStart} />;
  if (error || !d) return <MediaDetailError />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]} />
        <View style={styles.headerIconsRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color="white" size={24} />
          </Pressable>
          <Pressable onPress={() => router.push("/explore" as any)} style={styles.search}>
            <Search size={16} color="rgba(255,255,255,0.4)" />
            <Text style={styles.searchText}>Cari...</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/notifications" as any)} style={styles.bellBtn}>
            <Bell size={21} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        <DetailHero
          media={d}
          mediaType={mediaType}
          isSaved={isSaved}
          isToggling={isToggling}
          onToggleCollection={toggleCollection}
          onShare={() => {}}
          lastWatchedEp={lastEp}
        />
        <View style={styles.contentSection}>
          <DetailMetadata media={d} />
          <DetailSynopsis synopsis={d.synopsis} />
          <MediaEpisodes
            mediaId={id}
            mediaType={mediaType}
            rawEps={d.episodes}
            isBridging={isBridging}
            title={d.title}
            img={d.imageUrl}
          />
          <DetailRecommendations relations={d.relations} mediaType={mediaType} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0812" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerContainer: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 },
  headerBackground: { ...StyleSheet.absoluteFill, backgroundColor: "#0a0812" },
  headerIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Theme.layout.paddingTopSafe + 10,
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  searchText: { color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: "400" },
  contentSection: { paddingHorizontal: 20, marginTop: 0, position: "relative", zIndex: 10 },
});
