import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../../lib/config";
import { fetcher } from "../../../lib/fetcher";
import { useUserProgress } from "../../../lib/hooks/useUserProgress";
import { storage } from "../../../lib/storage";
import type { HistoryItemType, CollectionItem } from "@shared/types/api";

export function useCollectionData(userId: string | undefined | null, initialTab: string) {
  const [activeTab, setActiveTab] = useState(initialTab || "collection");
  const cacheKey = `collection_cache_${userId}`;

  const {
    data: collectionRes,
    isLoading: colLoading,
    error: colError,
    refetch: mutateCol,
  } = useQuery({
    queryKey: ["collection", "v3", userId],
    queryFn: async () => {
      const res = await fetcher(`${API_URL}/api/v2/collection?user_id=${userId}`);
      try {
        storage.set(cacheKey, JSON.stringify(res));
      } catch (e) {}
      return res;
    },
    initialData: () => {
      if (!userId) return undefined;
      try {
        const cached = storage.getString(cacheKey);
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  const {
    progressData: historyRes,
    isLoading: hisLoading,
    error: hisError,
    mutate: mutateHis,
  } = useUserProgress(userId);

  const allItems = useMemo(() => {
    const raw = Array.isArray(collectionRes) ? collectionRes : collectionRes?.data || [];
    return [...raw]
      .map(
        (h: any): CollectionItem => ({
          id: String(h.anilistId || h.id),
          title:
            h.title ||
            h.cleanTitle ||
            h.nativeTitle ||
            h.animeTitle ||
            `Anime #${h.anilistId || h.id}`,
          img: h.img || h.coverImage || h.animeCover,
          totalEps: h.totalEps || h.totalEpisodes || 0,
          status: String(h.status || "").toUpperCase(),
          progress: h.progress || 0,
          updatedAt: new Date(h.updatedAt).getTime(),
        }),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [collectionRes]);

  const historyItems = useMemo(() => {
    const raw = Array.isArray(historyRes) ? historyRes : historyRes?.data || [];
    const grouped = new Map();
    raw.forEach((item: HistoryItemType) => {
      const id = String(item.anilistId || item.anilist_id || item.animeSlug || "");
      const existing = grouped.get(id);
      if (
        !existing ||
        new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()
      ) {
        grouped.set(id, item);
      }
    });
    return Array.from(grouped.values()).sort(
      (a: HistoryItemType, b: HistoryItemType) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [historyRes]);

  const pagesData = useMemo(
    () => [
      {
        id: "collection",
        type: "collection",
        data: allItems,
        isLoading: colLoading,
        error: colError,
        mutate: mutateCol,
      },
      {
        id: "history",
        type: "history",
        data: historyItems,
        isLoading: hisLoading,
        error: hisError,
        mutate: mutateHis,
      },
    ],
    [allItems, historyItems, colLoading, hisLoading, colError, hisError, mutateCol, mutateHis],
  );

  return { activeTab, setActiveTab, pagesData };
}
