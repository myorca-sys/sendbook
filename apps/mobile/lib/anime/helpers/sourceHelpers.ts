import { AnimeSource } from "../types";

export function getBestSource(
  sources: AnimeSource[],
  preferredResolution: string = "720p",
): AnimeSource | null {
  if (!sources || sources.length === 0) return null;

  const pureDirectSources = sources.filter((s: any) => s.type !== "iframe");
  const fallbackSources = sources.filter((s: any) => s.type === "iframe");

  // Daftar urutan resolusi untuk graceful degradation
  const resOrder = ["1080p", "720p", "480p", "360p"];
  const startIndex = Math.max(0, resOrder.indexOf(preferredResolution));

  // Susun prioritas: mulai dari preferred, turun ke bawah, lalu baru naik jika tidak ada pilihan
  const priorityList = [
    ...resOrder.slice(startIndex),
    ...resOrder.slice(0, startIndex).reverse(),
  ];

  for (const res of priorityList) {
    const found = pureDirectSources.find((s: any) => s.quality === res);
    if (found) return found;
  }

  if (pureDirectSources.length > 0) return pureDirectSources[0];

  for (const res of priorityList) {
    const found = fallbackSources.find((s: any) => s.quality === res);
    if (found) return found;
  }

  return fallbackSources.length > 0 ? fallbackSources[0] : null;
}
