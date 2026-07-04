import { useMemo } from "react";

export function useWatchNavigation(episodes: any[], currentEpisode: string) {
  const getEpNumStr = (ep: any) =>
    String(ep.episodeNumber ?? ep.number ?? (ep.url ? ep.url.split("episode=").pop() : "?"));

  const { nextEp, prevEp } = useMemo(() => {
    const sortedEpisodes = [...episodes].sort(
      (a, b) => (parseInt(getEpNumStr(a)) || 0) - (parseInt(getEpNumStr(b)) || 0),
    );
    const currentIndex = sortedEpisodes.findIndex(
      (ep: any) => String(getEpNumStr(ep)) === String(currentEpisode),
    );
    const nextEp =
      currentIndex > -1 && currentIndex < sortedEpisodes.length - 1
        ? sortedEpisodes[currentIndex + 1]
        : null;
    const prevEp = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;

    return { nextEp, prevEp };
  }, [episodes, currentEpisode]);

  return { getEpNumStr, nextEp, prevEp };
}
