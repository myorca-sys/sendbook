import { useCallback, useRef, useEffect } from "react";
import { fetchWithAuth } from "../../../lib/fetcher";
import { API_URL } from "../../../lib/config";

export function useMangaSync(
  user: any,
  imagesLength: number,
  mangaId: string,
  chapter: string,
  title: string,
  img: string,
) {
  const maxViewedRef = useRef(0);
  const lastSyncRef = useRef(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const syncProgress = useCallback(
    (highest: number) => {
      if (!user || imagesLength === 0 || !mangaId) return;

      const progressSeconds = highest + 1;
      const durationSeconds = imagesLength;
      const isCompleted = progressSeconds >= durationSeconds - 1;
      const match = String(chapter).match(/[\d.]+/);
      const epNum = match ? parseFloat(match[0]) : 1.0;

      fetchWithAuth(`${API_URL}/api/v2/social/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          anilistId: String(mangaId),
          episodeNumber: epNum,
          progressSeconds,
          durationSeconds,
          isCompleted,
          title,
          coverImage: img,
          mediaType: "manga",
        }),
      }).catch(() => {});
    },
    [user, imagesLength, mangaId, chapter, title, img],
  );

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (maxViewedRef.current > 0 && maxViewedRef.current !== lastSyncRef.current)
        syncProgress(maxViewedRef.current);
    };
  }, [syncProgress]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (!user || imagesLength === 0 || !mangaId) return;

      let highest = maxViewedRef.current;
      for (const v of viewableItems) {
        if (v.index !== null && v.index > highest) highest = v.index;
      }

      if (highest > maxViewedRef.current) {
        maxViewedRef.current = highest;
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          lastSyncRef.current = highest;
          syncProgress(highest);
        }, 3000);
      }
    },
    [user, imagesLength, mangaId, syncProgress],
  );

  return { onViewableItemsChanged };
}
