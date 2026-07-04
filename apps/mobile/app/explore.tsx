import React, { useRef, useEffect } from "react";
import { View, Keyboard } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useExploreSearch } from "../lib/hooks/useExploreSearch";
import { ExploreHeader } from "../components/explore/ui/ExploreHeader";
import { ExploreResults } from "../components/explore/ui/ExploreResults";
import { ExploreDefault } from "../components/explore/ui/ExploreDefault";
import { Theme } from "../lib/theme";
import { FEATURE_FLAGS } from "../lib/config/features";

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const mediaType = FEATURE_FLAGS.ENABLE_MANGA ? ((params.mediaType as string) || "anime") : "anime";
  const initialQuery = (params.q as string) || "";
  const initialGenre = (params.genre as string) || "";

  const {
    query,
    setQuery,
    genre,
    sort,
    isSearchActive,
    history,
    addSearchTerm,
    clearHistory,
    results,
    isLoadingInitialData,
    isFetching,
    page,
    hasNextPage,
    handleNextPage,
    handlePrevPage,
    handleSortChange,
    handleGenreSelect,
    handleHistoryTap,
    clearSearch,
  } = useExploreSearch(
    initialQuery,
    initialGenre,
    mediaType as "anime" | "manga",
  );

  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (!initialGenre) setTimeout(() => inputRef.current?.focus(), 100);
  }, [initialGenre]);

  const onClear = () => {
    clearSearch();
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ExploreHeader
        insets={insets}
        router={router}
        query={query}
        setQuery={setQuery}
        genre={genre}
        sort={sort}
        handleSortChange={handleSortChange}
        clearSearch={onClear}
        inputRef={inputRef}
        addSearchTerm={addSearchTerm}
      />

      {isSearchActive ? (
        <ExploreResults
          results={results}
          isLoadingInitialData={isLoadingInitialData}
          isFetching={isFetching}
          page={page}
          hasNextPage={hasNextPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          genre={genre}
          query={query}
          mediaType={mediaType}
        />
      ) : (
        <ExploreDefault
          history={history}
          handleHistoryTap={handleHistoryTap}
          clearHistory={clearHistory}
          handleGenreSelect={handleGenreSelect}
        />
      )}
    </View>
  );
}
