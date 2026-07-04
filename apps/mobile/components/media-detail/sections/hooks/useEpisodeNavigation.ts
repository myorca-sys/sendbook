import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useEpisodeNavigation({
  mediaId,
  mediaType,
  title,
  img,
  eps,
  epsSort,
  onEpisodePress,
}: {
  mediaId: string;
  mediaType: "anime" | "manga";
  title: string;
  img: string;
  eps: any[];
  epsSort: "desc" | "asc";
  onEpisodePress?: (epNum: string) => void;
}) {
  const router = useRouter();

  const handlePress = useCallback(
    (ep: any, index: number) => {
      const epNum = ep.chapterNumber ?? ep.episodeNumber ?? ep.number ?? ep.url?.split("episode=").pop() ?? "?";

      if (onEpisodePress) {
        onEpisodePress(String(epNum));
      } else if (mediaType === "manga") {
        let nextCh = null,
          prevCh = null;
        if (epsSort === "desc") {
          nextCh = index > 0 ? eps[index - 1] : null;
          prevCh = index < eps.length - 1 ? eps[index + 1] : null;
        } else {
          nextCh = index < eps.length - 1 ? eps[index + 1] : null;
          prevCh = index > 0 ? eps[index - 1] : null;
        }

        const actualSourceId =
          ep.id && ep.id.includes("|")
            ? ep.id.split("|")[0]
            : mediaId.includes("|")
              ? mediaId.split("|")[0]
              : "komikindo";
        const getNum = (e: any) =>
          e.chapterNumber ?? e.episodeNumber ?? e.number ?? e.url?.split("episode=").pop() ?? "?";
        const getLink = (e: any) => e.link || e.episodeUrl || e.url;

        router.push({
          pathname: "/manga/read",
          params: {
            link: getLink(ep),
            sourceId: actualSourceId,
            mangaId: mediaId,
            title,
            img,
            chapter: epNum,
            nextChapterLink: nextCh ? getLink(nextCh) : undefined,
            nextChapterNum: nextCh ? getNum(nextCh) : undefined,
            prevChapterLink: prevCh ? getLink(prevCh) : undefined,
            prevChapterNum: prevCh ? getNum(prevCh) : undefined,
          },
        } as any);
      } else {
        router.push(`/watch/${mediaId}/${epNum}` as any);
      }
    },
    [mediaId, mediaType, title, img, eps, epsSort, onEpisodePress, router],
  );

  return { handlePress };
}
