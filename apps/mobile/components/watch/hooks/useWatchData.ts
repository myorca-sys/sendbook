import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { API_URL, HF_API_URL } from "../../../lib/config";
import { fetcher } from "../../../lib/fetcher";
import { AnimeEngine } from "../../../lib/anime/engine";
import { usePlayerStore } from "../../../lib/store/playerStore";
import { useWatchSocial } from "./useWatchSocial";
import { useSwarmScraper } from "../../../lib/hooks/useSwarmScraper";
import { useSourceAggregator } from "../../../lib/hooks/useSourceAggregator";
import { mapAndFilterSources } from "../helpers/sourceMapper";
import { normalizeMediaItem } from "../../../lib/adapters/mediaAdapter";

export function useWatchData(id: string, episode: string, user: any) {
  const router = useRouter();
  const { clientSources, isClientScraping, fetchSources, clearSources } = usePlayerStore();

  const { data: animeData } = useQuery({
    queryKey: ["anime", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/anime/${id}?_cb=5`),
  });

  const animeRaw = animeData?.data;
  const animeNormalized = useMemo(() => {
    return animeRaw ? normalizeMediaItem(animeRaw) : null;
  }, [animeRaw]);

  const anime = animeRaw;
  const episodes = useMemo(() => {
    let rawEps = animeRaw?.episodes || [];
    const seen = new Set();
    return rawEps.filter((item: any) => {
      const num = String(item.chapterNumber ?? item.episodeNumber ?? item.number ?? "?");
      if (seen.has(num)) return false;
      seen.add(num);
      return true;
    });
  }, [animeRaw?.episodes]);

  const displayTitle = animeNormalized?.title || "Anime";

  const titleVariants = useMemo(() => {
    const list = new Set<string>();
    if (animeNormalized?.title) list.add(animeNormalized.title);
    if (animeNormalized?.subTitle) list.add(animeNormalized.subTitle);
    if (animeNormalized?.nativeTitle) list.add(animeNormalized.nativeTitle);
    if (animeRaw?.title_main) list.add(animeRaw.title_main);
    if (animeRaw?.title_romaji) list.add(animeRaw.title_romaji);
    if (animeRaw?.title_english) list.add(animeRaw.title_english);
    return Array.from(list).filter((t) => t && t.length > 2);
  }, [animeNormalized, animeRaw]);


  const currentEpData = useMemo(
    () => episodes.find((e: any) => String(e.episodeNumber || e.number) === String(episode)),
    [episodes, episode],
  );
  const epUrl = currentEpData?.url || currentEpData?.link || currentEpData?.episodeUrl;

  const provider = useMemo(() => {
    if (!epUrl) return "samehadaku";
    if (epUrl.includes("idlixku")) return "idlix";
    if (epUrl.includes("kuronime")) return "kuronime";
    return "samehadaku";
  }, [epUrl]);

  const {
    data: swarmSources,
    loading: swarmLoading,
    fetchWithSwarmFallback,
    needSwarmResolution,
    swarmTargetUrl,
    currentScrapedUrl,
    handleSwarmSuccess,
    handleSwarmError,
    error: swarmError,
    clearData: clearSwarmData,
  } = useSwarmScraper(provider, "video_sources");

  const { aggregatedSources, isAggregating } = useSourceAggregator(
    titleVariants,
    String(episode),
    provider,
  );

  useEffect(() => {
    console.log("==========================================");
    console.log(`[useWatchData] Memuat Episode: ${episode}`);
    console.log(`[useWatchData] Provider Terdeteksi: ${provider}`);
    console.log(`[useWatchData] URL Episode (epUrl):`, epUrl || "KOSONG/NULL");
    console.log("==========================================");

    clearSources();
    clearSwarmData();
    if (epUrl) {
      if (provider === "idlix") {
        console.log(`[useWatchData] Menjalankan fetchSources untuk Idlix: ${epUrl}`);
        fetchSources(epUrl);
      } else {
        console.log(`[useWatchData] Menjalankan SwarmFallback secara langsung untuk: ${epUrl}`);
        fetchWithSwarmFallback(epUrl);
      }
    } else {
      console.log(`[useWatchData] WARNING: epUrl kosong, tidak ada fetching yang dijalankan.`);
    }
    return () => {
      clearSources();
      clearSwarmData();
    };
  }, [epUrl, fetchSources, clearSources, fetchWithSwarmFallback, clearSwarmData, episode, provider]);


  const sources = useMemo(() => {
    const validSwarmSources = currentScrapedUrl === epUrl ? swarmSources : [];
    return mapAndFilterSources(validSwarmSources, clientSources, aggregatedSources, provider);
  }, [clientSources, swarmSources, currentScrapedUrl, epUrl, provider, aggregatedSources, episode]);

  useEffect(() => {
    if (sources.length > 0) {
      console.log(
        `[useWatchData] Found ${sources.length} unique playable sources for episode ${episode}`,
      );
      sources.forEach((s, idx) => {
        console.log(`  [${idx + 1}] ${s.quality} - ${s.provider} -> ${s.url?.substring(0, 50)}...`);
      });
    }
  }, [sources, episode]);

  const combinedLoading =
    !(sources.length > 0) && (isClientScraping || swarmLoading || isAggregating);
  const videoUrl = AnimeEngine.getBestSource(sources)?.url || null;

  const { realViews, likesCount, isLiked, handleToggleLike, handleShare, handleReport } =
    useWatchSocial(id, episode, user, animeData, videoUrl);

  const handleEpisodeChange = (newEp: string) => router.setParams({ episode: newEp });

  return {
    anime,
    poster: animeNormalized?.imageUrl || "",
    episodes,
    sources,
    combinedLoading,
    videoUrl,
    displayTitle,
    realViews,
    likesCount,
    isLiked,
    handleToggleLike,
    handleShare,
    handleReport,
    handleEpisodeChange,
    needSwarmResolution,
    swarmTargetUrl,
    provider,
    handleSwarmSuccess,
    handleSwarmError,
    swarmError,
  };
}
