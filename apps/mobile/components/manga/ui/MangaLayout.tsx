import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MangaTopOverlay } from "./MangaTopOverlay";
import { MangaBottomOverlay } from "./MangaBottomOverlay";
import { MangaModals } from "./MangaModals";
import { MangaReaderContent } from "./MangaReaderContent";

export function MangaLayout({
  router,
  insets,
  user,
  images,
  loading,
  error,
  controlsVisible,
  isCommentsVisible,
  setIsCommentsVisible,
  isListVisible,
  setIsListVisible,
  fadeAnim,
  toggleControls,
  onViewableItemsChanged,
  handleNextChapter,
  handlePrevChapter,
  nextChapterLink,
  prevChapterLink,
  episodes,
  viewabilityConfig,
  sourceId,
  mangaId,
  title,
  img,
  chapter,
}: any) {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, navigationBarColor: "black" }} />
      <StatusBar hidden={!controlsVisible} style="light" />

      <MangaReaderContent
        loading={loading}
        error={error}
        images={images}
        controlsVisible={controlsVisible}
        toggleControls={toggleControls}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <MangaTopOverlay
        insetsTop={insets.top}
        fadeAnim={fadeAnim}
        controlsVisible={controlsVisible}
        title={title}
        chapter={chapter}
        imagesCount={images.length}
        onBack={() => router.back()}
        onOpenList={() => setIsListVisible(true)}
      />

      <MangaBottomOverlay
        insetsBottom={insets.bottom}
        fadeAnim={fadeAnim}
        controlsVisible={controlsVisible}
        onPrev={handlePrevChapter}
        hasPrev={!!prevChapterLink}
        onNext={handleNextChapter}
        hasNext={!!nextChapterLink}
        onOpenComments={() => setIsCommentsVisible(true)}
      />

      <MangaModals
        user={user}
        mangaId={mangaId}
        sourceId={sourceId}
        title={title}
        img={img}
        chapter={chapter}
        episodes={episodes}
        insetsBottom={insets.bottom}
        isListVisible={isListVisible}
        setIsListVisible={setIsListVisible}
        isCommentsVisible={isCommentsVisible}
        setIsCommentsVisible={setIsCommentsVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
});
