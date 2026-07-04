import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../../lib/theme";
import { useAuth } from "../../../lib/auth";
import { useWatchProgress } from "../../../lib/hooks/useWatchProgress";
import { useWatchData } from "../../../components/watch/hooks/useWatchData";
import { useWatchNavigation } from "../../../components/watch/hooks/useWatchNavigation";
import { WatchLayout } from "../../../components/watch/ui/WatchLayout";

export default function WatchScreen() {
  const { id, episode } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const watchData = useWatchData(String(id), String(episode), user);
  const userId = user?.id || user?.email;
  const { updateProgress, forceSync } = useWatchProgress(
    userId,
    String(id),
    String(episode),
    watchData.videoUrl,
  );
  const { getEpNumStr, nextEp, prevEp } = useWatchNavigation(watchData.episodes, String(episode));
  const poster = watchData.poster || watchData.anime?.poster || watchData.anime?.coverImage || watchData.anime?.cover_image || "";

  return (
    <View style={styles.container}>
      <WatchLayout
        insets={insets}
        router={router}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        showComments={showComments}
        setShowComments={setShowComments}
        id={id}
        episode={episode}
        user={user}
        nextEp={nextEp}
        prevEp={prevEp}
        getEpNumStr={getEpNumStr}
        forceSync={forceSync}
        updateProgress={updateProgress}
        {...watchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
});
