import { Alert, Share } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, fetchWithAuth } from "../../../lib/fetcher";
import { API_URL } from "../../../lib/config";

export function useWatchSocial(
  id: string,
  episode: string,
  user: any,
  animeData: any,
  videoUrl: string | null,
) {
  const queryClient = useQueryClient();
  const statsQueryKey = ["stats", id, episode, user?.id];

  const { data: statsData, refetch: mutateStats } = useQuery({
    queryKey: statsQueryKey,
    queryFn: () =>
      fetcher(
        user
          ? `${API_URL}/api/v2/social/episode/${id}/${episode}/stats?user_id=${user.id}`
          : `${API_URL}/api/v2/social/episode/${id}/${episode}/stats`,
      ),
  });

  const { data: animeStatsData } = useQuery({
    queryKey: ["animeStats", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/social/anime/${id}/stats`),
  });

  const likesCount = statsData?.likes || 0;
  const isLiked = statsData?.user_liked || false;
  const realViews =
    animeStatsData?.total_episode_views ||
    animeData?.data?.views ||
    animeData?.data?.popularity ||
    0;
  const anime = animeData?.data;
  const displayTitle =
    anime?.cleanTitle ||
    anime?.nativeTitle ||
    anime?.title?.english ||
    anime?.title?.romaji ||
    anime?.title ||
    "Anime";

  const handleToggleLike = async () => {
    if (!user) {
      Alert.alert("Login Dibutuhkan", "Silakan login untuk menyukai episode ini.");
      return;
    }
    queryClient.setQueryData(statsQueryKey, (prev: any) => ({
      ...prev,
      likes: isLiked ? likesCount - 1 : likesCount + 1,
      user_liked: !isLiked,
    }));
    try {
      await fetchWithAuth(`${API_URL}/api/v2/social/episode/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          anilistId: parseInt(id),
          episodeNumber: parseFloat(episode),
        }),
      });
      mutateStats();
    } catch (e) {
      console.error(e);
      mutateStats();
    }
  };

  const handleShare = async () => {
    if (!anime) return;
    try {
      await Share.share({
        message: `Nonton ${displayTitle} Episode ${episode} di aplikasi Orca!`,
        url: `https://orca-anime.com/watch/${id}/${episode}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = () => {
    if (!user) {
      Alert.alert("Login Dibutuhkan", "Silakan login untuk mengirimkan laporan.");
      return;
    }
    const sendReport = async (issue: string) => {
      try {
        await fetchWithAuth(`${API_URL}/api/v2/social/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            anilist_id: parseInt(id),
            episode_number: parseFloat(episode),
            issue_type: issue,
            video_url: videoUrl,
          }),
        });
        Alert.alert("Terima Kasih", `Laporan '${issue}' telah dikirim ke tim kami.`);
      } catch (e) {
        Alert.alert("Perhatian", "Tidak dapat mengirim laporan saat ini.");
      }
    };
    Alert.alert("Laporkan Masalah", "Pilih jenis masalah yang ingin Anda laporkan:", [
      {
        text: "Video Rusak / Tidak Jalan",
        onPress: () => sendReport("Video Rusak"),
      },
      {
        text: "Teks Tidak Sinkron / Hilang",
        onPress: () => sendReport("Subtitle Error"),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  return {
    realViews,
    likesCount,
    isLiked,
    displayTitle,
    handleToggleLike,
    handleShare,
    handleReport,
  };
}
