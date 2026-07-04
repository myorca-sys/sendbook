import { MangaSourceRule, MangaItem } from "../types";
import { fetchHtml } from "../../network";
import { generateId, getHighResImageUrl } from "./domHelpers";
import OrcaNativeCore from "../../../modules/orca-native-core/src";

function processExtractedList(
  source: MangaSourceRule,
  extractedList: any[],
): MangaItem[] {
  return extractedList
    .map((item) => {
      let { link, cover, score } = item;
      if (link?.startsWith("/")) link = `${source.domain}${link}`;
      if (cover?.startsWith("/")) cover = `${source.domain}${cover}`;
      const parsedScore = score ? parseFloat(score) : undefined;
      return item.title && link
        ? {
            id: generateId(source.id, link),
            sourceId: source.id,
            title: item.title,
            link,
            img: getHighResImageUrl(cover || ""),
            latestChapter: item.chapter,
            score: isNaN(parsedScore as number) ? undefined : parsedScore,
          }
        : null;
    })
    .filter((i) => i !== null) as MangaItem[];
}

export async function getHomeList(
  source: MangaSourceRule,
): Promise<MangaItem[]> {
  const html = await fetchHtml(source.domain, source.headers);
  const { list, title, cover, link, chapter, score } = source.selectors.home;
  const extractRules: Record<string, string> = { title, link, cover };
  if (chapter) extractRules.chapter = chapter;
  if (score) extractRules.score = score;
  const extractedList =
    OrcaNativeCore?.parseDomList(html, list, extractRules, 30) ?? [];
  const results = processExtractedList(source, extractedList);
  if (results.length === 0)
    throw new Error(
      `Situs ${source.name} sedang memblokir akses atau strukturnya berubah.`,
    );
  return results;
}

export async function getSearchList(
  source: MangaSourceRule,
  keyword: string,
): Promise<MangaItem[]> {
  const url = source.selectors.search.url.replace(
    "{{key}}",
    encodeURIComponent(keyword),
  );
  const html = await fetchHtml(url, source.headers);
  const { list, title, cover, link, chapter, score } = source.selectors.search;
  const extractRules: Record<string, string> = { title, link, cover };
  if (chapter) extractRules.chapter = chapter;
  if (score) extractRules.score = score;
  const extractedList =
    OrcaNativeCore?.parseDomList(html, list, extractRules, 30) ?? [];
  return processExtractedList(source, extractedList);
}
