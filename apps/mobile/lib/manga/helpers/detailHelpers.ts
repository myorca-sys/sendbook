import { MangaSourceRule, MangaDetail, MangaChapter } from "../types";
import { fetchHtml } from "../../network";
import {
  getText,
  getTextAdvanced,
  generateId,
  getHighResImageUrl,
  stringSimilarity,
} from "./domHelpers";
import { getSearchList } from "./listHelpers";
import OrcaNativeCore from "../../../modules/orca-native-core/src";

function extractCover(html: string, selector: string, domain: string) {
  const rules = {
    src: "@src",
    dataSrc: "@data-src",
    lazySrc: "@data-lazy-src",
    zoomSrc: "@data-zoom-src",
  };
  const ext =
    OrcaNativeCore?.parseDomList(html, selector.split("@")[0], rules, 1) ?? [];
  let cover =
    ext.length > 0
      ? ext[0].src || ext[0].dataSrc || ext[0].lazySrc || ext[0].zoomSrc
      : getText(html, selector);
  if (cover?.startsWith("/")) cover = `${domain}${cover}`;
  return getHighResImageUrl(cover || "");
}

export async function getDetail(
  source: MangaSourceRule,
  mangaUrl: string,
): Promise<MangaDetail> {
  const html = await fetchHtml(mangaUrl, source.headers),
    s = source.selectors.detail;
  const title = getText(html, s.title),
    cover = extractCover(html, s.cover, source.domain);
  let author = "Unknown",
    status = "Unknown";
  if (s.author)
    for (const sel of s.author.split(",")) {
      const v = getTextAdvanced(html, sel.trim());
      if (v && v !== "Unknown") {
        author = v;
        break;
      }
    }
  if (s.status)
    for (const sel of s.status.split(",")) {
      const v = getTextAdvanced(html, sel.trim());
      if (v && v !== "Unknown") {
        status = v;
        break;
      }
    }
  const genres = s.genres
    ? (OrcaNativeCore?.parseDomTextArray(html, s.genres) ?? [])
    : [];
  const rules = {
    chapterNumber: s.chapterNumber,
    chapterLink: s.chapterLink,
    chapterDate: s.chapterDate || "",
  };
  let extCh: any[] = [];
  for (const sel of s.chapterList.split(",")) {
    extCh = OrcaNativeCore?.parseDomList(html, sel.trim(), rules, 500) ?? [];
    if (extCh.length > 0) break;
  }
  const chapters = extCh
    .map((el) => {
      let link = el.chapterLink;
      if (link?.startsWith("/")) link = `${source.domain}${link}`;
      return link
        ? {
            id: generateId(source.id, link),
            number: el.chapterNumber || `Chapter ${extCh.indexOf(el) + 1}`,
            link,
            date: el.chapterDate,
          }
        : null;
    })
    .filter((c) => c !== null) as MangaChapter[];
  return {
    id: generateId(source.id, mangaUrl),
    sourceId: source.id,
    title,
    img: cover,
    link: mangaUrl,
    synopsis: getText(html, s.synopsis),
    author,
    status,
    genres,
    chapters,
  };
}

export async function getChapterImages(
  source: MangaSourceRule,
  chapterUrl: string,
): Promise<string[]> {
  const html = await fetchHtml(chapterUrl, source.headers),
    rules = { src: "@src", dataSrc: "@data-src", lazySrc: "@data-lazy-src" };
  return (
    OrcaNativeCore?.parseDomList(
      html,
      source.selectors.chapter.images,
      rules,
      100,
    ) ?? []
  )
    .map((el) => {
      let img = el.src;
      if (!img || img.includes("data:image") || img.includes("blank"))
        img = el.dataSrc || el.lazySrc || img;
      return img ? img.trim() : null;
    })
    .filter((u): u is string => u !== null).filter((v, i, a) => a.indexOf(v) === i);
}

export async function findAndGetDetail(
  sources: MangaSourceRule[],
  title: string,
): Promise<MangaDetail | null> {
  const clean = title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const perms = [title, clean, clean.split(" ").slice(0, 3).join(" ")].filter(
    (v, i, a) => v && a.indexOf(v) === i,
  );
  for (const source of sources)
    for (const t of perms) {
      try {
        const res = await getSearchList(source, t);
        if (res.length > 0) {
          let best = res[0],
            bestS = -1;
          for (const r of res) {
            const s = stringSimilarity(title, r.title);
            if (s > bestS) {
              bestS = s;
              best = r;
            }
          }
          return await getDetail(source, best.link);
        }
      } catch (e) {}
    }
  return null;
}
