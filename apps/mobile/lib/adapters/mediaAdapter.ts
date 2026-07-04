import { UnifiedMediaItem, UnifiedMediaDetail } from "./mediaAdapterTypes";
import { getTitle, getSubTitle, getImageUrl, getEpisodeLabel } from "./adapterHelpers";

export { UnifiedMediaItem, UnifiedMediaDetail };

export function normalizeMediaItem(item: any): UnifiedMediaItem {
  if (!item)
    return {
      id: "",
      title: "Unknown",
      imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg",
      episode: "?",
      score: 0,
      views: 0,
      genres: [],
    };

  let id = String(item.anilistId || item.id || "");
  if (id.startsWith("manga|")) id = id.replace("manga|", "");

  const title = getTitle(item);
  const subTitle = getSubTitle(item);
  const imageUrl = getImageUrl(item);
  const episode = getEpisodeLabel(item, id);

  return {
    id,
    title,
    subTitle,
    nativeTitle: item.nativeTitle || item.title?.native || "",
    imageUrl,
    bannerUrl: item.banner_image || item.bannerImage || item.banner || "",
    episode,
    score: item.score || item.rating || item.averageScore || 0,
    views: item.views || item.popularity || 0,
    genres: Array.isArray(item.genres) ? item.genres : [],
    status: String(item.status || "").toUpperCase(),
    format: String(item.format || "").toUpperCase(),
    color: item.color || item.coverImage?.color || null,
    mediaType: (item.mediaType || item.media_type || "ANIME").toLowerCase() as any,
  };
}

export function normalizeMediaDetail(item: any): UnifiedMediaDetail {
  const base = normalizeMediaItem(item);
  const episodes = Array.isArray(item.episodes)
    ? item.episodes
    : item.episodes?.data || Array.isArray(item.chapters)
      ? item.chapters
      : [];

  // Hitung max episode/chapter number sebagai fallback resilient
  const maxEp = episodes.reduce((max: number, ep: any) => {
    const num = Number(ep.episodeNumber || ep.number || 0);
    return num > max ? num : max;
  }, 0);

  return {
    ...base,
    synopsis: item.synopsis || item.description || "Sinopsis tidak tersedia.",
    author: item.author || item.staff?.nodes?.[0]?.name?.full || "Unknown Author",
    studios: Array.isArray(item.studios)
      ? item.studios
      : item.studios?.nodes?.map((s: any) => s.name) || [],
    season: item.season || null,
    seasonYear: item.seasonYear || null,
    totalEpisodes: item.totalEpisodes || maxEp || 0,
    nextAiringEpisode: item.nextAiringEpisode || null,
    relations: Array.isArray(item.relations) ? item.relations : item.relations?.nodes || [],
    episodes,
  };
}
