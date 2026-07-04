import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Search,
  X,
  Play,
  BookOpen,
  Clock,
  Film,
  Trash2,
} from "lucide-react-native";
import { useAuth } from "../../lib/auth";
import { Theme } from "../../lib/theme";
import { useMediaHistory } from "../../lib/hooks/useMediaHistory";
import { Skeleton } from "../../components/Skeleton";
import { formatHistoryDate } from "../../lib/utils/dateUtils";
import { formatDuration } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../lib/config";
import { fetcher, fetchWithAuth } from "../../lib/fetcher";
import { FEATURE_FLAGS } from "../../lib/config/features";

export default function CollectionScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading, signInWithGoogle } = useAuth();
  const userId = user?.id || user?.email;

  // 1. Fetch User Collections (Bookmarks)
  const {
    data: collectionsRes,
    isLoading: collectionsLoading,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ["userCollections", userId],
    queryFn: () => fetcher(`${API_URL}/api/v2/collection?user_id=${userId}`),
    enabled: !!userId,
  });

  // 2. Fetch User Watch Progress (History)
  const {
    animeHistory,
    mangaHistory,
    isLoading: historyLoading,
    mutate: refetchHistory,
  } = useMediaHistory();

  const [activeTab, setActiveTab] = useState<"anime" | "manga">("anime");
  const [searchQuery, setSearchQuery] = useState("");

  const isRefreshing = collectionsLoading || historyLoading;

  const handleRefresh = async () => {
    await Promise.all([refetchCollections(), refetchHistory()]);
  };

  // Create a progress lookup map keyed by anilistId
  const progressMap = useMemo(() => {
    const map = new Map<string, any>();
    const allHistory = [...(animeHistory || []), ...(mangaHistory || [])];
    allHistory.forEach((item) => {
      const rawId = String(item.anilistId || item.anilist_id || item.id || "");
      const cleanId = rawId.replace("manga|", "");
      if (cleanId) {
        map.set(cleanId, item);
      }
    });
    return map;
  }, [animeHistory, mangaHistory]);

  // Combine collections with watch progress
  const collectionItems = useMemo(() => {
    const raw = Array.isArray(collectionsRes) ? collectionsRes : collectionsRes?.data || [];
    return raw.map((item: any) => {
      const aId = String(item.anilistId || "");
      const matchedProgress = progressMap.get(aId);

      return {
        ...item,
        watchProgress: matchedProgress
          ? {
              episode: matchedProgress.episode || "?",
              timestampSec: matchedProgress.timestampSec || matchedProgress.timestamp_sec || 0,
              durationSec: matchedProgress.durationSec || matchedProgress.duration_sec || 0,
              updatedAt: matchedProgress.updatedAt,
            }
          : null,
      };
    });
  }, [collectionsRes, progressMap]);

  // Filter items by type (anime/manga) and search query
  const filteredItems = useMemo(() => {
    return collectionItems.filter((item: any) => {
      const itemType = String(item.mediaType || "ANIME").toLowerCase();
      const targetType = activeTab === "anime" ? "anime" : "manga";
      if (itemType !== targetType) return false;

      const title = item.cleanTitle || item.title || item.nativeTitle || "";
      return title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [collectionItems, activeTab, searchQuery]);

  // CRUD: Delete Bookmark
  const handleDelete = (anilistId: string, title: string) => {
    Alert.alert(
      "Hapus Koleksi",
      `Apakah Anda yakin ingin menghapus "${title}" dari koleksi Anda?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await fetchWithAuth(
                `${API_URL}/api/v2/collection?user_id=${userId}&anilistId=${anilistId}`,
                { method: "DELETE" }
              );
              refetchCollections();
            } catch (error) {
              Alert.alert("Perhatian", "Gagal menghapus koleksi. Silakan coba lagi.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Premium Header */}
      <View style={styles.headerFixed}>
        <Text style={styles.headerTitle}>Koleksi Saya</Text>
      </View>

      {!user ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Clock size={36} color="white" />
          </View>
          <Text style={styles.emptyTitle}>Silakan Login</Text>
          <Text style={styles.emptyDesc}>
            Masuk dengan Google untuk menyinkronkan daftar koleksi dan progress tontonan Anda.
          </Text>
          <Pressable onPress={signInWithGoogle} style={styles.loginButton}>
            <Text style={styles.loginText}>Lanjutkan dengan Google</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Segmented Control (Only if Manga is enabled) */}
          {FEATURE_FLAGS.ENABLE_MANGA && (
            <View style={styles.segmentedContainer}>
              <Pressable
                onPress={() => {
                  setActiveTab("anime");
                  setSearchQuery("");
                }}
                style={[styles.segmentBtn, activeTab === "anime" && styles.segmentBtnActive]}
              >
                <Film size={14} color={activeTab === "anime" ? "black" : "rgba(255,255,255,0.6)"} />
                <Text style={[styles.segmentBtnText, activeTab === "anime" && styles.segmentBtnTextActive]}>
                  Anime
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveTab("manga");
                  setSearchQuery("");
                }}
                style={[styles.segmentBtn, activeTab === "manga" && styles.segmentBtnActive]}
              >
                <BookOpen size={14} color={activeTab === "manga" ? "black" : "rgba(255,255,255,0.6)"} />
                <Text style={[styles.segmentBtnText, activeTab === "manga" && styles.segmentBtnTextActive]}>
                  Manga
                </Text>
              </Pressable>
            </View>
          )}

          {/* Search Bar */}
          <View style={[styles.searchContainer, !FEATURE_FLAGS.ENABLE_MANGA && { marginTop: 16 }]}>
            <Search size={16} color="rgba(255,255,255,0.4)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === "anime" ? "Cari anime..." : "Cari manga..."}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} style={styles.clearSearchBtn}>
                <X size={14} color="white" />
              </Pressable>
            )}
          </View>

          {/* Scrollable list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#fff"
                colors={[Theme.colors.primary]}
              />
            }
          >
            {collectionsLoading && filteredItems.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} w="100%" h={116} r={16} style={{ marginBottom: 12 }} />
              ))
            ) : filteredItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={36} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyStateTitle}>
                  {searchQuery.length > 0 ? "Tidak Ditemukan" : "Koleksi Kosong"}
                </Text>
                <Text style={styles.emptyStateDesc}>
                  {searchQuery.length > 0
                    ? "Coba cari dengan kata kunci lain."
                    : `Simpan ${activeTab} favorit Anda di halaman detail untuk melihatnya di sini.`}
                </Text>
              </View>
            ) : (
              filteredItems.map((item: any, idx: number) => {
                const rawId = String(item.anilistId || item.id || "");
                const isManga = activeTab === "manga";
                const cleanId = rawId.replace("manga|", "");

                const title = item.cleanTitle || item.title || item.nativeTitle || `Media #${cleanId}`;
                const img = item.coverImage || item.img || "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg";
                const href = isManga ? `/manga/${cleanId}` : `/anime/${cleanId}`;

                // Process merged progress
                const progress = item.watchProgress;
                const ep = progress?.episode || "?";
                const ts = progress?.timestampSec || 0;
                const dur = progress?.durationSec || 0;
                const pct = dur > 0 ? Math.min(100, Math.max(0, (ts / dur) * 100)) : 0;
                const updatedAt = progress?.updatedAt || item.updatedAt;

                const epLabel = isManga ? `Chapter ${ep}` : `Episode ${ep}`;
                const progressLabel = isManga
                  ? `${dur - ts} hal tersisa`
                  : `${formatDuration(ts)} / ${formatDuration(dur)}`;

                // If progress exists, Continue button goes straight to Watch/Read screen
                const continueHref = progress && !isManga
                  ? `/watch/${cleanId}/${ep}`
                  : href;

                return (
                  <View key={`${rawId}-${idx}`} style={styles.itemCard}>
                    <Pressable onPress={() => router.push(href as any)} style={styles.cardPressable}>
                      <Image source={{ uri: img }} style={styles.cardImg} contentFit="cover" transition={200} />
                      <View style={styles.cardInfo}>
                        <View style={styles.topInfoRow}>
                          <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                              {title}
                            </Text>
                            
                            <View style={styles.cardMetaRow}>
                              <Clock size={10} color="rgba(255,255,255,0.4)" style={{ marginRight: 4 }} />
                              <Text style={styles.timeText}>
                                {updatedAt ? formatHistoryDate(updatedAt) : "Baru saja"}
                              </Text>
                              {progress && (
                                <>
                                  <Text style={styles.metaDot}>•</Text>
                                  <Text style={styles.progressText}>{epLabel}</Text>
                                </>
                              )}
                            </View>
                          </View>

                          {/* CRUD Delete Button */}
                          <Pressable
                            onPress={() => handleDelete(cleanId, title)}
                            style={styles.deleteBtn}
                            hitSlop={8}
                          >
                            <Trash2 size={16} color="rgba(255,69,58,0.75)" />
                          </Pressable>
                        </View>

                        <View style={styles.bottomSection}>
                          {progress && dur > 0 ? (
                            <View style={styles.progressContainer}>
                              <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                              </View>
                              <Text style={styles.durationText}>{progressLabel}</Text>
                            </View>
                          ) : (
                            <Text style={styles.noProgressText}>Belum ditonton</Text>
                          )}

                          <Pressable onPress={() => router.push(continueHref as any)} style={styles.continueButton}>
                            {isManga ? (
                              <BookOpen size={11} color="black" />
                            ) : (
                              <Play size={11} color="black" fill="black" />
                            )}
                            <Text style={styles.continueText}>Lanjutkan</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  headerFixed: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Theme.colors.background,
    zIndex: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    backgroundColor: "#0A84FF",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptyDesc: {
    color: "#8e8e93",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  loginText: {
    color: "#0a0812",
    fontWeight: "800",
    fontSize: 15,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: "white",
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  segmentBtnTextActive: {
    color: "black",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    padding: 0,
  },
  clearSearchBtn: { padding: 4 },
  scrollContent: { flex: 1, paddingHorizontal: 20 },
  scrollContainer: { paddingBottom: 120, paddingTop: 4 },
  itemCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },
  cardPressable: {
    flexDirection: "row",
    padding: 12,
  },
  cardImg: {
    width: 72,
    height: 100,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  topInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "500",
  },
  metaDot: {
    color: "rgba(255,255,255,0.3)",
    marginHorizontal: 6,
    fontSize: 10,
  },
  progressText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "600",
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,69,58,0.1)",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 1.5,
    width: "100%",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 1.5,
    backgroundColor: "#0A84FF",
  },
  durationText: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
  },
  noProgressText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "500",
    flex: 1,
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  continueText: {
    color: "black",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyStateTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
  emptyStateDesc: {
    color: "#8e8e93",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18,
  },
});
