import { useState, useCallback } from "react";
import { ClientResolver } from "../anime/clientResolver";
import { storage } from "../storage";

const EDGE_API_URL =
  process.env.EXPO_PUBLIC_EDGE_URL ||
  "https://orcanime-api-edge.moehamadhkl.workers.dev";

export function useSwarmScraper(provider: string, endpoint: string) {
  const cacheKey = `swarm_cache_${provider}_${endpoint}`;

  const [data, setData] = useState<any[]>(() => {
    if (endpoint === "latest_episodes") {
      try {
        const cached = storage.getString(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.data)) {
            return parsed.data;
          }
        }
      } catch (e) {}
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needSwarmResolution, setNeedSwarmResolution] = useState(false);
  const [swarmTargetUrl, setSwarmTargetUrl] = useState("");
  const [currentScrapedUrl, setCurrentScrapedUrl] = useState<string | null>(
    null,
  );

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setNeedSwarmResolution(false);
    setSwarmTargetUrl("");
    setCurrentScrapedUrl(null);
  }, []);

  const fetchWithSwarmFallback = useCallback(
    async (targetUrl?: string, forceRefresh = false) => {
      const urlHash = targetUrl ? targetUrl.replace(/[^a-zA-Z0-9]/g, "_").slice(-60) : "default";
      const targetCacheKey = endpoint === "latest_episodes" 
        ? cacheKey 
        : `${cacheKey}_${urlHash}`;

      // 1. Cek Local Cache MMKV
      if (!forceRefresh) {
        try {
          const cached = storage.getString(targetCacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            // latest_episodes valid 10 menit (600.000 ms), video_sources valid 2 jam (7.200.000 ms)
            const ttl = endpoint === "latest_episodes" ? 600000 : 7200000;
            
            // Validasi data: Jika data mengandung data_post atau req_id mentah (tanpa url), anggap cache tidak valid
            const isStaleCache = endpoint === "video_sources" && 
              Array.isArray(parsed.data) && 
              parsed.data.some((item: any) => (item.data_post || item.req_id) && !item.url);

            if (
              parsed &&
              !isStaleCache &&
              Date.now() - parsed.timestamp < ttl &&
              Array.isArray(parsed.data) &&
              parsed.data.length > 0
            ) {
              console.log(`[useSwarmScraper] Serving ${endpoint} dari client local cache (Instant).`);
              setData(parsed.data);
              if (targetUrl) setCurrentScrapedUrl(targetUrl);
              return;
            }
          }
        } catch (e) {}
      }

      setLoading(true);
      setError(null);
      setNeedSwarmResolution(false);
      try {
        // 2. Ask Edge API First
        const url = `${EDGE_API_URL}/api/edge-scrape/${provider}/${endpoint}${targetUrl ? `?url=${encodeURIComponent(targetUrl)}` : ""}`;
        const edgeRes = await fetch(url);
        const edgeJson = await edgeRes.json();

        if (edgeRes.ok && edgeJson.success) {
          const isStaleEdgeData = endpoint === "video_sources" && 
            Array.isArray(edgeJson.data) && 
            edgeJson.data.some((item: any) => (item.data_post || item.req_id) && !item.url);

          if (!isStaleEdgeData) {
            const resolvedData = await ClientResolver.resolve(
              provider,
              edgeJson.data || [],
            );
            setData(resolvedData);
            if (targetUrl) setCurrentScrapedUrl(targetUrl);

            // Tulis cache local
            try {
              storage.set(
                targetCacheKey,
                JSON.stringify({
                  timestamp: Date.now(),
                  data: resolvedData,
                }),
              );
            } catch (e) {}
            return;
          }
          
          console.log(`[useSwarmScraper] Edge cache kotor (data_post mentah). Memicu resolusi Swarm...`);
          if (targetUrl) {
            setSwarmTargetUrl(targetUrl);
            setNeedSwarmResolution(true);
            return;
          }
        }

        // 3. If Edge needs Swarm help (Anti-bot triggered & Cache empty)
        if (edgeJson.need_swarm) {
          console.log(
            `[Swarm Hook] Edge failed due to Anti-Bot. Triggering UI Swarm Resolution for ${provider}...`,
          );
          const actualUrl = targetUrl || edgeJson.meta?.target_url;
          if (!actualUrl)
            throw new Error("Target URL is missing for Swarm resolution");

          setSwarmTargetUrl(actualUrl);
          setNeedSwarmResolution(true);
        } else {
          throw new Error(edgeJson.error || "Edge scraping failed");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [provider, endpoint, cacheKey],
  );

  // Method to call after SwarmResolver successfully posts to Edge
  const handleSwarmSuccess = useCallback(async (localData?: any[]) => {
    setNeedSwarmResolution(false);
    setLoading(true);

    if (localData && localData.length > 0) {
      console.log(`[Swarm Hook] Resolution successful. Resolving locally from extracted data (Instant bypass)...`);
      try {
        const resolvedData = await ClientResolver.resolve(
          provider,
          localData
        );
        setData(resolvedData);
        if (swarmTargetUrl) setCurrentScrapedUrl(swarmTargetUrl);

        // Update cache local on swarm success
        const urlHash = swarmTargetUrl ? swarmTargetUrl.replace(/[^a-zA-Z0-9]/g, "_").slice(-60) : "default";
        const targetCacheKey = endpoint === "latest_episodes" 
          ? cacheKey 
          : `${cacheKey}_${urlHash}`;

        try {
          storage.set(
            targetCacheKey,
            JSON.stringify({
              timestamp: Date.now(),
              data: resolvedData,
            }),
          );
        } catch (e) {}
        setLoading(false);
        return;
      } catch (err: any) {
        console.warn(`[Swarm Hook] Local instant resolution failed: ${err.message}. Falling back to Edge refetch...`);
      }
    }

    console.log(`[Swarm Hook] Resolution successful. Refetching from Edge...`);
    try {
      const url = `${EDGE_API_URL}/api/edge-scrape/${provider}/${endpoint}${swarmTargetUrl ? `?url=${encodeURIComponent(swarmTargetUrl)}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) {
        const resolvedData = await ClientResolver.resolve(
          provider,
          json.data || [],
        );
        setData(resolvedData);
        if (swarmTargetUrl) setCurrentScrapedUrl(swarmTargetUrl);

        // Update cache local on swarm success
        const urlHash = swarmTargetUrl ? swarmTargetUrl.replace(/[^a-zA-Z0-9]/g, "_").slice(-60) : "default";
        const targetCacheKey = endpoint === "latest_episodes" 
          ? cacheKey 
          : `${cacheKey}_${urlHash}`;

        try {
          storage.set(
            targetCacheKey,
            JSON.stringify({
              timestamp: Date.now(),
              data: resolvedData,
            }),
          );
        } catch (e) {}
      } else {
        throw new Error(json.error || "Failed to refetch after swarm");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [provider, endpoint, swarmTargetUrl, cacheKey]);

  const handleSwarmError = useCallback((msg: string) => {
    setNeedSwarmResolution(false);
    setError(msg);
  }, []);

  return {
    data,
    loading,
    error,
    needSwarmResolution,
    swarmTargetUrl,
    currentScrapedUrl,
    fetchWithSwarmFallback,
    handleSwarmSuccess,
    handleSwarmError,
    clearData,
  };
}
