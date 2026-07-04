import { MangaSourceRule, MangaItem, MangaDetail } from "./types";
import { getHomeList, getSearchList } from "./helpers/listHelpers";
import {
  getDetail,
  getChapterImages,
  findAndGetDetail,
} from "./helpers/detailHelpers";

export class MangaEngine {
  static async getHomeList(source: MangaSourceRule): Promise<MangaItem[]> {
    return getHomeList(source);
  }

  static async getSearchList(
    source: MangaSourceRule,
    keyword: string,
  ): Promise<MangaItem[]> {
    return getSearchList(source, keyword);
  }

  static async getDetail(
    source: MangaSourceRule,
    mangaUrl: string,
  ): Promise<MangaDetail> {
    return getDetail(source, mangaUrl);
  }

  static async getChapterImages(
    source: MangaSourceRule,
    chapterUrl: string,
  ): Promise<string[]> {
    return getChapterImages(source, chapterUrl);
  }

  static async findAndGetDetail(
    sources: MangaSourceRule[],
    title: string,
  ): Promise<MangaDetail | null> {
    return findAndGetDetail(sources, title);
  }
}
