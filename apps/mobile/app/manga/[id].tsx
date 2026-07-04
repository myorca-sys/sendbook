import React from "react";
import { useLocalSearchParams, Redirect } from "expo-router";
import { MediaDetailTemplate } from "../../components/media-detail/MediaDetailTemplate";
import { FEATURE_FLAGS } from "../../lib/config/features";

export default function MangaDetailScreen() {
  const { id } = useLocalSearchParams();

  if (!FEATURE_FLAGS.ENABLE_MANGA) {
    return <Redirect href="/(tabs)" />;
  }

  return <MediaDetailTemplate id={id as string} mediaType="manga" />;
}
