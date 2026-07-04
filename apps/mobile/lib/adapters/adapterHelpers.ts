export function getTitle(item: any): string {
  return (
    item.title_english ||
    item.titleEnglish ||
    item.title?.english ||
    item.title_romaji ||
    item.titleRomaji ||
    item.cleanTitle ||
    item.title?.romaji ||
    item.title?.userPreferred ||
    (typeof item.title === "string" ? item.title : "") ||
    "Unknown Title"
  );
}

export function getSubTitle(item: any): string {
  const english = item.title_english || item.titleEnglish || item.title?.english;
  const romaji =
    item.title_romaji ||
    item.titleRomaji ||
    item.cleanTitle ||
    item.title?.romaji ||
    item.title?.userPreferred ||
    (typeof item.title === "string" ? item.title : "");

  if (english && romaji && english !== romaji) {
    return romaji;
  }
  return "";
}

export function getImageUrl(item: any): string {
  const fallback = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg";
  let imageUrl =
    item.cover_image ||
    item.coverImage ||
    item.poster ||
    item.img ||
    item.coverImage?.extraLarge ||
    item.coverImage?.large ||
    item.coverImage?.medium ||
    (typeof item.coverImage === "string" ? item.coverImage : "") ||
    item.image ||
    "";
  if (!imageUrl && (item.bannerImage || item.banner_image))
    imageUrl = item.bannerImage || item.banner_image;
  return imageUrl || fallback;
}

export function getEpisodeLabel(item: any, id: string): string {
  return String(
    item.latestEpisode ||
      item.latestChapter ||
      item.episodeNumber ||
      item.number ||
      item.progress ||
      item.totalEpisodes ||
      item.episodes ||
      item.chapters?.length ||
      item.episode ||
      (id.includes("|") ? "?" : "0"),
  );
}
