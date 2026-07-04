import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { fetcher } from "../fetcher";
import { storage } from "../storage";

export function useUserProgress(userId: string | undefined | null) {
  const endpoint = userId ? `${API_URL}/api/v2/social/progress?user_id=${userId}` : null;
  const cacheKey = `user_progress_cache_${userId}`;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userProgress", "v2", userId],
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

  return {
    progressData: data,
    isLoading,
    error,
    mutate: refetch,
  };
}
