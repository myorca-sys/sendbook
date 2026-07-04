export function mapAndFilterSources(
  swarmSources: any[],
  clientSources: any[],
  aggregatedSources: any[],
  provider: string,
) {
  // 1. Map Primary Swarm sources
  const primarySources = (swarmSources || []).map((s: any) => {
    let url = s.url || s.src || s.dl || s.links || "";
    if (url && url.includes("<iframe") && url.includes("src=")) {
      const match = url.match(/src=["']([^"']+)["']/);
      if (match) url = match[1];
    }
    if (url.includes("pixeldrain.com/u/") || url.includes("pixeldrain.com/api/file/")) {
      const parts = url.replace("https://", "").replace("http://", "").split("/");
      const fileId = parts[2]?.split("?")[0];
      if (fileId) url = `https://pixeldrain.com/api/file/${fileId}`;
    }
    const isDirect =
      url.includes(".mp4") ||
      url.includes(".m3u8") ||
      url.includes("pixeldrain") ||
      url.includes("kuroplayer") ||
      url.includes("animeku") ||
      url.includes("majorplay.net") ||
      url.includes("googlevideo");
    return {
      url: url,
      quality: s.quality || s.label || "Auto",
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      type: isDirect ? "direct" : "iframe",
    };
  });

  // 2. Map Aggregated sources
  const normalizedAggregated = (aggregatedSources || []).map((s: any) => {
    let url = s.url || s.src || "";
    if (url.includes("pixeldrain.com/u/") || url.includes("pixeldrain.com/api/file/")) {
      const parts = url.replace("https://", "").replace("http://", "").split("/");
      const fileId = parts[2]?.split("?")[0];
      if (fileId) url = `https://pixeldrain.com/api/file/${fileId}`;
    }
    const isDirect =
      url.includes(".mp4") ||
      url.includes(".m3u8") ||
      url.includes("pixeldrain") ||
      url.includes("kuroplayer") ||
      url.includes("animeku") ||
      url.includes("majorplay.net") ||
      url.includes("googlevideo");
    return {
      ...s,
      url: url,
      type: s.type || (isDirect ? "direct" : "iframe"),
    };
  });

  // 3. Combine all sources
  let allRawSources = [
    ...primarySources,
    ...clientSources,
    ...normalizedAggregated,
  ];

  // 4. Filter duplicates and non-playable links
  const filtered = allRawSources.filter((v, i, a) => {
    const isFirst = a.findIndex((t) => t.url === v.url) === i;
    if (!isFirst) return false;
    if (!v.url) return false;

    const urlLower = v.url.toLowerCase();
    // STRIKT FILTER: Hanya izinkan yang sudah ter-resolve menjadi file media atau server terpercaya
    const isPlayable =
      urlLower.includes(".mp4") ||
      urlLower.includes(".m3u8") ||
      urlLower.includes("pixeldrain.com/api/file/") ||
      urlLower.includes("pixeldrain.com/u/") ||
      urlLower.includes("googlevideo.com/videoplayback") ||
      urlLower.includes("kuroplayer.xyz") ||
      urlLower.includes("animeku.org") ||
      urlLower.includes("majorplay.net") ||
      urlLower.includes("mp4upload.com");

    return isPlayable;
  });

  // 5. Sort: HLS (.m3u8 / kuroplayer) first, then high quality
  return filtered.sort((a, b) => {
    const aUrl = a.url.toLowerCase();
    const bUrl = b.url.toLowerCase();
    const aIsHls =
      aUrl.includes(".m3u8") ||
      aUrl.includes("kuroplayer") ||
      aUrl.includes("animeku") ||
      aUrl.includes("majorplay.net");
    const bIsHls =
      bUrl.includes(".m3u8") ||
      bUrl.includes("kuroplayer") ||
      bUrl.includes("animeku") ||
      bUrl.includes("majorplay.net");
    if (aIsHls && !bIsHls) return -1;
    if (!aIsHls && bIsHls) return 1;

    const resOrder = ["1080p", "720p", "480p", "360p"];
    const aIdx = resOrder.findIndex((r) => a.quality.includes(r));
    const bIdx = resOrder.findIndex((r) => b.quality.includes(r));
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    return 0;
  });
}
