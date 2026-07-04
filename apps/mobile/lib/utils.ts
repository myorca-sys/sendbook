import { API_URL } from "./config";
import { queryClient } from "./query-provider";
import { fetcher } from "./fetcher";

export const prefetchAnime = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ["mediaDetail", "v7", "anime", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/anime/${id}?_cb=7`),
  });
  queryClient.prefetchQuery({
    queryKey: ["anime", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/anime/${id}?_cb=5`),
  });
};

export const prefetchManga = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ["mediaDetail", "v7", "manga", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/manga/${id}?_cb=7`),
  });
};

export function formatViews(v: number | null | undefined): string {
  if (!v) return "0";
  if (v >= 1000000) return (v / 1000000).toFixed(1) + "M";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K";
  return v.toString();
}

export function formatDuration(sec: number): string {
  if (!sec) return "0m";
  const m = Math.floor(sec / 60);
  return `${m}m`;
}

export function hasEps(a: any): boolean {
  if (a?.status === "NOT_YET_RELEASED" || a?.status === "UPCOMING")
    return false;
  return true;
}

export function formatSynopsis(text: string): string {
  if (!text) return "Sinopsis tidak tersedia.";
  let clean = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .trim();
  const sourceIndex = clean.search(/\(?\[?(Sumber|Source|Written by)\s*:/i);
  if (sourceIndex !== -1) {
    clean = clean.substring(0, sourceIndex).trim();
  }
  clean = clean.replace(/\n{3,}/g, "\n\n");
  clean = clean.replace(/ {2,}/g, " ");
  return clean;
}
