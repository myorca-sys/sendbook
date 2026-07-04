import { MangaSourceRule } from "../types";

import { MANGA_DOMAINS } from "@shared/config/domains";

export const KomikindoRule: MangaSourceRule = {
  id: "komikindo",
  name: "Komikindo",
  domain: MANGA_DOMAINS.komikindo,
  selectors: {
    home: {
      list: ".animepost",
      title: ".tt h3",
      cover: "img@src",
      link: "a@href",
      chapter: ".lsch a",
      score: ".score",
    },
    search: {
      url: `${MANGA_DOMAINS.komikindo}/?s={{key}}`,
      list: ".animepost",
      title: ".tt h3",
      cover: "img@src",
      link: "a@href",
      chapter: ".lsch a",
    },
    detail: {
      title: "h1.entry-title, .thumb h1",
      cover: ".thumb img@src",
      synopsis: ".entry-content",
      author: '.spe span:contains("Pengarang") i',
      status: '.spe span:contains("Status")',
      genres: ".genre-info a",
      chapterList: "#chapter_list .lchx a",
      chapterNumber: "@text", // Returns the text of the <a> tag
      chapterLink: "@href",
      chapterDate: ".date@text",
    },
    chapter: {
      images: "#chimg-auh img",
    },
  },
};
