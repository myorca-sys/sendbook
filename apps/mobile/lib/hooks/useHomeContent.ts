import { useQuery } from "@tanstack/react-query";
import { HF_API_URL } from "../config";
import { fetcher } from "../fetcher";
import { validateHomeData } from "../../components/home/zodValidator";
import { mapHomeData } from "../adapters/homeAdapter";
import { storage } from "../storage";
import React from "react";

export function useHomeContent(mediaType: "anime" | "manga") {
  const endpoint =
    mediaType === "anime" ? `${HF_API_URL}/api/v1/home` : `${HF_API_URL}/api/v1/manga/home`;

  const {
    data: swrData,
    isLoading,
    isFetching: isValidating,
    error,
    refetch: mutate,
  } = useQuery({
    queryKey: ["home", "v6", mediaType],
    queryFn: async () => {
      const data = await fetcher(endpoint);
      try {
        validateHomeData(data);
        storage.set(`home_cache_${mediaType}`, JSON.stringify(data));
      } catch (e) {
        console.error("Zod Validation failed for Home API", e);
        throw new Error("Invalid Data Format");
      }
      return data;
    },
    initialData: () => {
      try {
        const cached = storage.getString(`home_cache_${mediaType}`);
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
    staleTime: 60000,
  });

  const d = swrData?.data || swrData || {};
  const mappedData = React.useMemo(() => mapHomeData(d, mediaType), [d, mediaType]);

  const hasData = !!swrData && Object.keys(d).length > 0;
  const isError = error || (!hasData && !isLoading && !isValidating);
  const isColdStart = (error as any)?.message === "COLD_START";

  return {
    mappedData,
    isLoading,
    isValidating,
    isError,
    isColdStart,
    hasData,
    mutate,
  };
}

