import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { fetcher } from "../fetcher";
import { normalizeMediaDetail, UnifiedMediaDetail } from "../adapters/mediaAdapter";
import { useLegacyManga } from "./useLegacyManga";
import { useMangaBridging } from "./useMangaBridging";
export function useMediaDetail(id: string, mediaType: "anime" | "manga") {
  const isLegacyManga = mediaType === "manga" && id.includes("|");
  const endpoint = isLegacyManga
    ? null
    : mediaType === "anime"
      ? `${API_URL}/api/v2/anime/${id}?_cb=7`
      : `${API_URL}/api/v2/manga/${id}?_cb=7`;

  const {
    data: rawRes,
    error: swrError,
    isLoading: swrLoading,
    refetch: swrMutate,
  } = useQuery({
    queryKey: ["mediaDetail", "v7", mediaType, id],
    queryFn: () => fetcher(endpoint!),
    enabled: !!endpoint,
  });

  const rawData = rawRes?.data;
  const { legacyData, legacyLoading, legacyError, fetchLegacyManga } = useLegacyManga(
    id,
    isLegacyManga,
  );
  const { bridgedData, isBridging } = useMangaBridging(rawData, isLegacyManga, mediaType);

  let normalizedData: UnifiedMediaDetail | null = null;
  if (isLegacyManga) normalizedData = legacyData;
  else if (bridgedData) normalizedData = bridgedData;
  else if (rawData) normalizedData = normalizeMediaDetail(rawData);

  return {
    data: normalizedData,
    isLoading: isLegacyManga ? legacyLoading : swrLoading,
    isBridging,
    error: isLegacyManga ? legacyError : swrError,
    mutate: isLegacyManga ? fetchLegacyManga : swrMutate,
  };
}
