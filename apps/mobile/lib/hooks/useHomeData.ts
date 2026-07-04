import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { fetcher } from "../fetcher";
import { hasEps } from "../utils";

export function useHomeData(mediaType: "anime" | "manga") {
  // Endpoint switching
  const endpoint =
    mediaType === "anime"
      ? `${API_URL}/api/v2/home?v=3`
      : `${API_URL}/api/v2/manga/home?_cb=5`;

  const {
    data: swrData,
    isLoading,
    isFetching: isValidating,
    error,
    refetch: mutate,
  } = useQuery({
    queryKey: ["home", mediaType],
    queryFn: () => fetcher(endpoint),
    staleTime: 60000,
  });

  const d = swrData?.data || {};

  // Data Mapping for Universal Slots
  const mappedData = useMemo(() => {
    if (mediaType === "anime") {
      const latest = (d.latest || []).filter(hasEps);
      const airing = (d.airing || []).filter(hasEps);
      const popular = (d.popular || []).filter(hasEps);
      const topRated = (d.top_rated || []).filter(hasEps);
      const movies = (d.movies || []).filter(hasEps);
      const completed = (d.completed || []).filter(hasEps);

      const hero = airing[0] || latest[0];
      const trending = (d.popular || []).slice(0, 10);

      const ongoingItems = Array.from(
        [...latest, ...airing]
          .reduce((m, i) => {
            const k = String(i.anilistId || i.id);
            if (!m.has(k)) m.set(k, i);
            return m;
          }, new Map())
          .values(),
      );

      // Ensure Slot 6 is filled (if movies are few, add popular)
      const wRowItems =
        movies.length >= 3
          ? movies
          : [...movies, ...popular.slice(10, 15)].slice(0, 5);

      return {
        hero,
        ongoing: ongoingItems,
        trending,
        vRow1: { label: "Skor Tertinggi", items: topRated },
        wRow: { label: "Film Anime", items: wRowItems },
        vRow2: { label: "Sudah Tamat", items: completed },
      };
    } else {
      // Manga Mapping - ABSOLUTE SYMMETRY
      const trending = d.trending || [];
      const latest = d.latest || [];
      const popular = d.popular || [];

      return {
        hero: trending[0] || popular[0] || latest[0],
        ongoing: latest.slice(0, 12),
        trending: trending.slice(1, 11),
        vRow1: { label: "Skor Tertinggi", items: popular.slice(0, 12) },
        wRow: { label: "Komik Populer", items: popular.slice(12, 17) },
        vRow2: {
          label: "Sudah Tamat",
          items:
            popular.filter(
              (m: any) => m.status === "Completed" || m.status === "Finished",
            ).length > 0
              ? popular.filter(
                  (m: any) =>
                    m.status === "Completed" || m.status === "Finished",
                )
              : latest.slice(12, 25),
        },
      };
    }
  }, [d, mediaType]);

  const isError = error || (!isLoading && Object.keys(d).length === 0);

  return {
    swrData,
    mappedData,
    isLoading,
    isValidating,
    isError,
    mutate,
  };
}
