import { useState, useEffect, useCallback, useMemo } from "react";
import { storage } from "../../../../lib/storage";

export function useMediaEpisodesLogic(rawEps: any[]) {
  const [isReady, setIsReady] = useState(false);
  const [epChunkIndex, setEpChunkIndex] = useState(0);
  const [epsSort, setEpsSort] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const sort = storage.getString("mediaDetailSort");
    if (sort === "desc" || sort === "asc") setEpsSort(sort);
    setIsReady(true);
  }, []);

  const eps = useMemo(() => {
    let raw = [...(rawEps || [])];
    
    // Defensive deduplication to handle stale offline caches
    const seen = new Set();
    raw = raw.filter((item: any) => {
      const num = String(item.chapterNumber ?? item.episodeNumber ?? item.number ?? item.url?.split("episode=").pop() ?? "?");
      if (seen.has(num)) return false;
      seen.add(num);
      return true;
    });

    const sorted = raw;
    sorted.sort((a: any, b: any) => {
      const numA = parseFloat(a.chapterNumber ?? a.episodeNumber ?? a.number ?? a.url?.split("episode=").pop() ?? "0");
      const numB = parseFloat(b.chapterNumber ?? b.episodeNumber ?? b.number ?? b.url?.split("episode=").pop() ?? "0");
      return epsSort === "asc" ? numA - numB : numB - numA;
    });
    return sorted;
  }, [rawEps, epsSort]);

  const handleToggleSort = useCallback(
    (flatListRef: any) => {
      const nextSort = epsSort === "asc" ? "desc" : "asc";
      setEpsSort(nextSort);
      storage.set("mediaDetailSort", nextSort);
      setEpChunkIndex(0);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    [epsSort],
  );

  return {
    isReady,
    epChunkIndex,
    setEpChunkIndex,
    epsSort,
    eps,
    handleToggleSort,
  };
}
