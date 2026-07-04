const EDGE_API_URL = "https://orcanime-api-edge.moehamadhkl.workers.dev";

const parseJson = async (res: Response) => {
  const text = await res.text();
  if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
    throw new Error(`Non-JSON response: ${text.substring(0, 50)}`);
  }
  return JSON.parse(text);
};

export const fetchProviderSources = async (provider: string, titles: string[], episode: string) => {
  try {
    const searchPromises = titles.map((t) => {
      const url = `https://${provider === "samehadaku" ? "v2.samehadaku.how" : "kuronime.sbs"}/?s=${encodeURIComponent(t)}`;
      return fetch(
        `${EDGE_API_URL}/api/edge-scrape/${provider}/search_results?url=${encodeURIComponent(url)}`,
      ).then(parseJson);
    });
    const searchResults = await Promise.allSettled(searchPromises);
    const allMatches = searchResults
      .filter((r) => r.status === "fulfilled")
      .flatMap((r: any) => (r.value?.success ? r.value.data : []));
    if (!allMatches.length) return [];

    const match =
      allMatches.find(
        (m: any) =>
          !m.title.toLowerCase().includes("episode") ||
          !/\d/.test(m.title.toLowerCase().split("episode")[1] || ""),
      ) || allMatches[0];
    const seriesUrl = match.link || match.url || match.href;

    const listRes = await fetch(
      `${EDGE_API_URL}/api/edge-scrape/${provider}/episode_list?url=${encodeURIComponent(seriesUrl)}`,
    );
    const listJson = await parseJson(listRes);

    if (!listJson.success || !listJson.data.length) {
      if (seriesUrl.includes("episode") && seriesUrl.includes(String(episode))) {
        const streamRes = await fetch(
          `${EDGE_API_URL}/api/edge-scrape/${provider}/video_sources?url=${encodeURIComponent(seriesUrl)}`,
        );
        const streamJson = await parseJson(streamRes);
        if (streamJson.success)
          return streamJson.data.map((s: any) => ({
            ...s,
            provider: `Aggregated (${provider})`,
            url: s.src || s.dl || s.links,
          }));
      }
      return [];
    }

    const targetEpNum = parseFloat(episode);
    const epMatch = listJson.data.find(
      (e: any) =>
        parseFloat(
          String(e.ep_num || e.number || e.episodeNumber || e.title).match(/[\d.]+/)?.[0] || "0",
        ) === targetEpNum,
    );
    if (!epMatch) return [];

    const targetEpUrl = epMatch.link || epMatch.url || epMatch.href;
    const streamRes = await fetch(
      `${EDGE_API_URL}/api/edge-scrape/${provider}/video_sources?url=${encodeURIComponent(targetEpUrl)}`,
    );
    const streamJson = await parseJson(streamRes);

    if (streamJson.success) {
      return streamJson.data
        .filter((s: any) => {
          const url = s.src || s.dl || s.links;
          return url && !url.toLowerCase().includes("blogger.com");
        })
        .map((s: any) => ({
          ...s,
          provider: `Aggregated (${provider})`,
          url: s.src || s.dl || s.links,
        }));
    }
  } catch (e: any) {
    console.warn(`[Aggregator] ❌ Error ${provider}:`, e.message);
  }
  return [];
};
