import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { API_URL } from "../config";
import { fetcher } from "../fetcher";
import { storage } from "../storage";

export function useMediaHistory() {
  const { user } = useAuth();
  const userId = user?.id || user?.email;
  const cacheKey = `media_history_cache_${userId}`;

  const endpoint = userId ? `${API_URL}/api/v2/social/progress?user_id=${userId}` : null;

  const {
    data: historyRes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mediaHistory", userId],
    queryFn: async () => {
      const res = await fetcher(endpoint!);
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
    enabled: !!endpoint,
    staleTime: 30000,
  });

  const historyItems = React.useMemo(() => {
    const raw = Array.isArray(historyRes) ? historyRes : historyRes?.data || [];
    return raw;
  }, [historyRes]);

  const animeHistory = React.useMemo(() => {
    const grouped = new Map();
    historyItems.forEach((item: any) => {
      const id = String(item.anilistId || item.id || "");
      if (!id || id.includes("|")) return;

      const existing = grouped.get(id);
      if (
        !existing ||
        new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()
      ) {
        grouped.set(id, item);
      }
    });
    return Array.from(grouped.values()).sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [historyItems]);

  const mangaHistory = React.useMemo(() => {
    const grouped = new Map();
    historyItems.forEach((item: any) => {
      const id = String(item.anilistId || item.id || "");
      if (!id || !id.includes("|")) return;

      const existing = grouped.get(id);
      if (
        !existing ||
        new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()
      ) {
        grouped.set(id, item);
      }
    });
    return Array.from(grouped.values()).sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [historyItems]);

  return {
    animeHistory,
    mangaHistory,
    isLoading,
    error,
    mutate: refetch,
  };
}
