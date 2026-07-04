import { useState, useRef, useCallback, useEffect } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { useMangaStore } from "../../../lib/store/mangaStore";
import { useMangaSync } from "./useMangaSync";
import { useMangaPrefetch } from "./useMangaPrefetch";

export function useMangaReader(
  link: string,
  sourceId: string,
  mangaId: string,
  title: string,
  img: string,
  chapter: string,
  user: any,
  nextChLink?: string,
  nextChNum?: string,
  prevChLink?: string,
  prevChNum?: string,
) {
  const router = useRouter();
  const {
    images,
    isLoading: loading,
    error,
    fetchImages,
    clearImages,
  } = useMangaStore();

  const [controlsVisible, setControlsVisible] = useState(true);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  let nextChapterLink: string | null = nextChLink || null;
  let nextChapterNum: string | null = nextChNum || null;
  let prevChapterLink: string | null = prevChLink || null;
  let prevChapterNum: string | null = prevChNum || null;

  useEffect(() => {
    if (link && sourceId) fetchImages(String(sourceId), String(link));
    hideTimeout.current = setTimeout(() => toggleControls(false), 3000);
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      clearImages();
    };
  }, [link, sourceId, fetchImages, clearImages]);

  useMangaPrefetch(nextChapterLink, sourceId, images.length);
  const { onViewableItemsChanged } = useMangaSync(
    user,
    images.length,
    mangaId,
    chapter,
    title,
    img,
  );

  const toggleControls = useCallback(
    (forceState?: boolean) => {
      setControlsVisible((prev) => {
        const newState = forceState !== undefined ? forceState : !prev;
        if (newState) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
          if (hideTimeout.current) clearTimeout(hideTimeout.current);
          hideTimeout.current = setTimeout(
            () =>
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }).start(() => setControlsVisible(false)),
            3000,
          );
        } else {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }
        return newState;
      });
    },
    [fadeAnim],
  );

  const handleNextChapter = () => {
    if (nextChapterLink)
      router.replace(
        `/manga/read?link=${encodeURIComponent(String(nextChapterLink))}&sourceId=${sourceId}&mangaId=${mangaId}&title=${encodeURIComponent(String(title))}&chapter=${encodeURIComponent(String(nextChapterNum))}` as any,
      );
  };

  const handlePrevChapter = () => {
    if (prevChapterLink)
      router.replace(
        `/manga/read?link=${encodeURIComponent(String(prevChapterLink))}&sourceId=${sourceId}&mangaId=${mangaId}&title=${encodeURIComponent(String(title))}&chapter=${encodeURIComponent(String(prevChapterNum))}` as any,
      );
  };

  return {
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
    episodes: [],
  };
}
