import React from "react";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth";
import { useMangaReader } from "../../components/manga/hooks/useMangaReader";
import { MangaLayout } from "../../components/manga/ui/MangaLayout";
import { FEATURE_FLAGS } from "../../lib/config/features";

export default function MangaReaderScreen() {
  if (!FEATURE_FLAGS.ENABLE_MANGA) {
    return <Redirect href="/(tabs)" />;
  }

  const {
    link,
    sourceId,
    mangaId,
    title,
    img,
    chapter,
    nextChapterLink: paramNextLink,
    nextChapterNum,
    prevChapterLink: paramPrevLink,
    prevChapterNum,
  } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const mangaData = useMangaReader(
    String(link),
    String(sourceId),
    String(mangaId),
    String(title),
    String(img),
    String(chapter),
    user,
    paramNextLink as string,
    nextChapterNum as string,
    paramPrevLink as string,
    prevChapterNum as string,
  );

  const viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 500,
  }).current;

  return (
    <MangaLayout
      router={router}
      insets={insets}
      user={user}
      {...mangaData}
      viewabilityConfig={viewabilityConfig}
      sourceId={String(sourceId)}
      mangaId={String(mangaId)}
      title={String(title)}
      img={String(img)}
      chapter={String(chapter)}
    />
  );
}
