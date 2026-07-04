import React from "react";
import { View, Text, FlatList, Dimensions, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { MediaCard } from "../../MediaCard";
import { Skeleton } from "../../Skeleton";
import { Theme } from "../../../lib/theme";

const { width: W } = Dimensions.get("window");
const CARD_WIDTH = (W - 32 - 16) / 3;

export function ExploreResults({
  results,
  isLoadingInitialData,
  isFetching,
  page,
  hasNextPage,
  onNextPage,
  onPrevPage,
  genre,
  query,
  mediaType,
}: any) {
  const flatListRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [page]);

  if (isLoadingInitialData) {
    return (
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={i} style={{ width: CARD_WIDTH, marginBottom: 16 }}>
            <Skeleton
              w="100%"
              h={CARD_WIDTH * 1.5}
              r={12}
              style={{ marginBottom: 8 }}
            />
            <Skeleton w="80%" h={14} r={6} style={{ marginBottom: 4 }} />
            <Skeleton w="40%" h={12} r={4} />
          </View>
        ))}
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Search size={32} color="rgba(255,255,255,0.2)" />
        </View>
        <Text style={styles.emptyTitle}>Tidak Ditemukan</Text>
        <Text style={styles.emptySubtitle}>
          Coba gunakan kata kunci atau filter genre yang berbeda.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      showsVerticalScrollIndicator={false}
      data={results}
      keyExtractor={(item, index) =>
        String(item.anilistId || item.id) + "-" + index
      }
      numColumns={3}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.listColumnWrapper}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>
            {genre
              ? `GENRE: ${genre}`
              : query
                ? "HASIL PENCARIAN"
                : "SEMUA ANIME"}
          </Text>
          <Text style={styles.listHeaderCount}>{results.length} ITEM</Text>
        </View>
      }
      ListFooterComponent={
        <View style={styles.paginationRow}>
          <Pressable
            disabled={page <= 1 || isFetching}
            onPress={onPrevPage}
            style={({ pressed }) => [
              styles.pageBtn,
              (page <= 1 || isFetching) && styles.pageBtnDisabled,
              pressed && !isFetching && styles.pageBtnPressed,
            ]}
          >
            <Text style={styles.pageBtnText}>Sebelumnya</Text>
          </Pressable>

          <View style={styles.pageIndicatorBox}>
            <Text style={styles.pageIndicatorText}>Halaman {page}</Text>
            {isFetching && (
              <ActivityIndicator
                size="small"
                color={Theme.colors.primary}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>

          <Pressable
            disabled={!hasNextPage || isFetching}
            onPress={onNextPage}
            style={({ pressed }) => [
              styles.pageBtn,
              (!hasNextPage || isFetching) && styles.pageBtnDisabled,
              pressed && !isFetching && styles.pageBtnPressed,
            ]}
          >
            <Text style={styles.pageBtnText}>Berikutnya</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH }}>
          <MediaCard item={item} mediaType={mediaType} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  skeletonGrid: { flexDirection: "row", flexWrap: "wrap", padding: 16, gap: 8 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.surface2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    color: Theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  listContent: { padding: 16, paddingBottom: 100 },
  listColumnWrapper: { gap: 8, marginBottom: 16 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listHeaderTitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  listHeaderCount: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "600",
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 8,
  },
  pageBtn: {
    backgroundColor: Theme.colors.surface2,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  pageBtnPressed: {
    backgroundColor: Theme.colors.borderHighlight,
  },
  pageBtnDisabled: {
    opacity: 0.3,
  },
  pageBtnText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: Theme.typography.weights.bold,
  },
  pageIndicatorBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageIndicatorText: {
    color: Theme.colors.textDim,
    fontSize: 13,
    fontWeight: Theme.typography.weights.semibold,
  },
});
