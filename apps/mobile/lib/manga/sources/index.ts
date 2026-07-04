import { MangaSourceRule } from "../types";
import { HF_API_URL } from "../../config";

// Ultimate fallbacks in case the device is completely offline on first launch
import { KomikindoRule } from "./komikindo";
import { BacakomikRule } from "./bacakomik";

let cachedSources: MangaSourceRule[] | null = null;

export async function getDynamicMangaSources(): Promise<MangaSourceRule[]> {
  if (cachedSources) return cachedSources;

  const targetUrl = HF_API_URL.endsWith("/")
    ? `${HF_API_URL}api/v2/config/app`
    : `${HF_API_URL}/api/v2/config/app`;

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    if (data && data.scraper_rules && data.scraper_rules.manga) {
      const mangaRulesMap = data.scraper_rules.manga;
      cachedSources = Object.values(mangaRulesMap) as MangaSourceRule[];
      return cachedSources;
    }
  } catch (e) {
    console.warn("Failed to fetch dynamic manga sources", e);
  }

  return [KomikindoRule, BacakomikRule];
}

export async function getMangaSourceById(
  id: string,
): Promise<MangaSourceRule | undefined> {
  const sources = await getDynamicMangaSources();
  return sources.find((source) => source.id === id);
}
