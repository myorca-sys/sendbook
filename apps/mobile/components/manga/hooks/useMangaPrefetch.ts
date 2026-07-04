import { useEffect } from "react";
import { Image } from "expo-image";
import { getMangaSourceById } from "../../../lib/manga/sources";
import { MangaEngine } from "../../../lib/manga/engine";

export function useMangaPrefetch(
  nextChapterLink: string | null,
  sourceId: string,
  imagesLength: number,
) {
  useEffect(() => {
    let isMounted = true;
    const prefetchNextChapter = async () => {
      if (nextChapterLink && sourceId && imagesLength > 0) {
        try {
          const rules = await getMangaSourceById(String(sourceId));
          if (rules) {
            const targetLink = decodeURIComponent(String(nextChapterLink));
            const imgs = await MangaEngine.getChapterImages(rules, targetLink);
            if (isMounted && imgs && imgs.length > 0)
              Image.prefetch(imgs.slice(0, 5));
          }
        } catch (e) {
          console.warn("Silent prefetch failed", e);
        }
      }
    };

    const timer = setTimeout(() => prefetchNextChapter(), 3000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [nextChapterLink, sourceId, imagesLength]);
}
