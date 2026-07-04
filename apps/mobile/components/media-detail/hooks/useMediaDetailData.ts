import { useState, useCallback, useMemo, useEffect } from "react";
import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../../lib/config";
import { fetcher, fetchWithAuth } from "../../../lib/fetcher";
import { useMediaDetail as useMediaDetailBase } from "../../../lib/hooks/useMediaDetail";
import { useSwarmScraper } from "../../../lib/hooks/useSwarmScraper";

export function useMediaDetailData(id: string, mediaType: "anime" | "manga", user: any) {
  const userId = user?.id || user?.email;
  const [isToggling, setIsToggling] = useState(false);

  const { data: d, isLoading, isBridging, error, mutate } = useMediaDetailBase(id, mediaType);

  const { data: collectionResponse, refetch: mutateCollection } = useQuery({
    queryKey: ["collection", "v3", userId],
    queryFn: () => fetcher(`${API_URL}/api/v2/collection?user_id=${userId}`),
    enabled: !!userId,
  });

  const { data: progressData } = useQuery({
    queryKey: ["userProgress", "v2", userId],
    queryFn: () => fetcher(`${API_URL}/api/v2/social/progress?user_id=${userId}`),
    enabled: !!userId,
  });

  const rawItems = Array.isArray(collectionResponse)
    ? collectionResponse
    : collectionResponse?.data || [];
  const isSaved = rawItems.some((h: any) => String(h.anilistId || h.id) === String(id));

  const watchHistoryRaw = Array.isArray(progressData) ? progressData : progressData?.data || [];
  const mediaHistory = watchHistoryRaw.filter(
    (h: any) => String(h.anilistId || h.id) === String(id),
  );
  const lastEp = mediaHistory.length > 0 ? mediaHistory[0].episode : undefined;

  const toggleCollection = useCallback(async () => {
    if (!user) {
      Alert.alert("Login Dibutuhkan", "Silakan login untuk menyimpan koleksi.");
      return;
    }
    setIsToggling(true);
    try {
      if (isSaved) {
        await fetchWithAuth(`${API_URL}/api/v2/collection?user_id=${userId}&anilistId=${id}`, {
          method: "DELETE",
        });
      } else {
        const payload = {
          user_id: userId,
          anilistId: String(id),
          status: "plan_to_watch",
          progress: 0,
          title: d?.title,
          img: d?.imageUrl,
          mediaType,
        };
        await fetchWithAuth(`${API_URL}/api/v2/collection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await mutateCollection();
    } catch (e) {
      Alert.alert("Perhatian", "Koneksi terganggu. Silakan coba lagi.");
    } finally {
      setIsToggling(false);
    }
  }, [user, isSaved, userId, id, mutateCollection, d, mediaType]);

  const isColdStart = error?.message === "COLD_START";

  return {
    d,
    isLoading,
    isBridging,
    error,
    mutate,
    isToggling,
    isSaved,
    lastEp,
    toggleCollection,
    isColdStart,
  };
}
