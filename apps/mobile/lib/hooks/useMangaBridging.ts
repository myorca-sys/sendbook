import { useState, useEffect } from "react";
import {
  normalizeMediaDetail,
  UnifiedMediaDetail,
} from "../adapters/mediaAdapter";
import { MangaEngine } from "../manga/engine";
import { getDynamicMangaSources } from "../manga/sources";

export function useMangaBridging(
  rawData: any,
  isLegacyManga: boolean,
  mediaType: "anime" | "manga",
) {
  const [bridgedData, setBridgedData] = useState<UnifiedMediaDetail | null>(
    null,
  );
  const [isBridging, setIsBridging] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runBridge = async () => {
      if (!isLegacyManga && mediaType === "manga" && rawData) {
        const normalized = normalizeMediaDetail(rawData);
        const hasLinks = normalized.episodes.some((ep: any) => ep.link || ep.url);
        
        if (normalized.episodes.length === 0 || !hasLinks) {
          setIsBridging(true);
          try {
            const sources = await getDynamicMangaSources();
            const detail = await MangaEngine.findAndGetDetail(
              sources,
              normalized.nativeTitle || normalized.title,
            );
            if (
              isMounted &&
              detail &&
              detail.chapters &&
              detail.chapters.length > 0
            ) {
              const bridgedEpisodes = detail.chapters.map((ep) => ({
                ...ep,
                id: `${detail.sourceId || "komikindo"}|${ep.id || ep.link}`,
              }));
              setBridgedData({ ...normalized, episodes: bridgedEpisodes });
            } else if (isMounted) setBridgedData(normalized);
          } catch (e) {
            console.warn("Manga bridging failed:", e);
            if (isMounted) setBridgedData(normalized);
          } finally {
            if (isMounted) setIsBridging(false);
          }
        } else setBridgedData(normalized);
      }
    };
    runBridge();
    return () => {
      isMounted = false;
    };
  }, [rawData, isLegacyManga, mediaType]);

  return { bridgedData, isBridging };
}
