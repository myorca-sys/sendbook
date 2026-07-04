import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { HF_API_URL } from "../config";
import { fetcher } from "../fetcher";
import { hasEps } from "../utils";
import { useDebounce } from "./useDebounce";
import { useSearchHistory } from "./useSearchHistory";

export function useExploreSearch(
  initialQuery: string,
  initialGenre: string,
  mediaType: "anime" | "manga",
) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 600);
  const { history, addSearchTerm, clearHistory } = useSearchHistory();
  const isSearchActive = !!debouncedQuery || !!genre || sort !== "popularity";

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, genre, sort]);

  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: ["explore", "v6", mediaType, debouncedQuery, genre, sort, page],
    queryFn: async () => {
      const bUrl = mediaType === "manga" ? "manga/browse" : "browse";
      let url = `${HF_API_URL}/api/v1/${bUrl}?page=${page}&sort=${sort}&_cb=6`;
      if (debouncedQuery) url += `&q=${encodeURIComponent(debouncedQuery)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;
      return fetcher(url);
    },
    enabled: isSearchActive,
  });

  const rawData = data?.data || [];
  const results = rawData.filter(hasEps);
  const hasNextPage = rawData.length >= 20;

  useEffect(() => {
    if (debouncedQuery && results.length > 0 && (page === 1 || mediaType === "manga"))
      addSearchTerm(debouncedQuery);
  }, [results.length, debouncedQuery, page, mediaType, addSearchTerm]);

  const handleSortChange = useCallback((s: string) => setSort(s), []);
  const handleGenreSelect = useCallback((g: string) => {
    setGenre(g);
    setQuery("");
  }, []);
  const handleHistoryTap = useCallback((t: string) => {
    setQuery(t);
    setGenre("");
  }, []);
  const clearSearch = useCallback(() => {
    setQuery("");
    setGenre("");
  }, []);

  const handleNextPage = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage, isFetching]);

  const handlePrevPage = useCallback(() => {
    if (page > 1 && !isFetching) {
      setPage((prev) => prev - 1);
    }
  }, [page, isFetching]);

  return {
    query,
    setQuery,
    genre,
    sort,
    debouncedQuery,
    isSearchActive,
    history,
    addSearchTerm,
    clearHistory,
    results,
    isLoadingInitialData: isLoading || (isFetching && results.length === 0),
    isFetching,
    page,
    hasNextPage,
    handleNextPage,
    handlePrevPage,
    handleSortChange,
    handleGenreSelect,
    handleHistoryTap,
    clearSearch,
  };
}
