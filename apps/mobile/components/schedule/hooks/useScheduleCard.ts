import { Alert } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../../lib/config";
import { fetcher, fetchWithAuth } from "../../../lib/fetcher";

export function useScheduleCard(item: any, isToday: boolean, isPast: boolean, user: any) {
  const queryClient = useQueryClient();
  const userId = user?.id || user?.email;
  const id = String(item.anilistId || item.id);

  const img =
    item.poster ||
    item.img ||
    item.coverImage?.extraLarge ||
    item.banner ||
    "https://s4.anilist.co/file/anilistcdn/medium/default.jpg";

  let title = "";
  if (typeof item.title === "string") {
    title = item.title;
  } else if (item.title) {
    title =
      item.title.english ||
      item.title.romaji ||
      item.title.userPreferred ||
      item.title.native ||
      "";
  }
  if (!title) title = "Unknown Title";

  const score = item.score || item.averageScore || 0;
  const airingTime = item.airingTime ? String(item.airingTime) : "";
  const eps = item.latestEpisode ? String(item.latestEpisode) : "?";

  // Check if item is saved in user's collection
  const { data: collectionResponse } = useQuery({
    queryKey: ["userCollections", userId],
    queryFn: () => fetcher(`${API_URL}/api/v2/collection?user_id=${userId}`),
    enabled: !!userId,
  });

  const rawItems = Array.isArray(collectionResponse)
    ? collectionResponse
    : collectionResponse?.data || [];
  const isSaved = rawItems.some((h: any) => String(h.anilistId || h.id) === id);

  let isAired = false;
  if (isPast) {
    isAired = true;
  } else if (isToday && airingTime && airingTime !== "TBA") {
    const match = airingTime.match(/(\d+):(\d+)/);
    if (match) {
      const hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      if (currentHour > hour || (currentHour === hour && currentMinute >= minute)) {
        isAired = true;
      }
    }
  }

  // Smart release status text
  let statusText = `Eps ${eps} Segera Rilis`;
  let statusColor = "rgba(255,255,255,0.5)";

  if (isPast) {
    statusText = `Eps ${eps} Rilis`;
    statusColor = "#0A84FF";
  } else if (isToday) {
    if (airingTime === "TBA" || !airingTime) {
      statusText = `Eps ${eps} Rilis Hari Ini`;
      statusColor = "#0A84FF";
    } else {
      if (isAired) {
        statusText = `Eps ${eps} Rilis`;
        statusColor = "#0A84FF";
      } else {
        statusText = `Eps ${eps} Rilis ${airingTime}`;
        statusColor = "rgba(255,255,255,0.6)";
      }
    }
  }

  const handleSaveCollection = async () => {
    if (!user) {
      Alert.alert("Login Dibutuhkan", "Silakan login untuk mengelola koleksi Anda.");
      return;
    }
    try {
      if (isSaved) {
        // Toggle Action: Delete from collection
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
                    `${API_URL}/api/v2/collection?user_id=${userId}&anilistId=${id}`,
                    { method: "DELETE" }
                  );
                  queryClient.invalidateQueries({ queryKey: ["userCollections", userId] });
                  Alert.alert("Terhapus", "Telah dihapus dari Koleksi Anda.");
                } catch (e) {
                  Alert.alert("Perhatian", "Gagal menghapus koleksi. Silakan coba lagi.");
                }
              },
            },
          ]
        );
      } else {
        // Toggle Action: Add to collection
        const res = await fetchWithAuth(`${API_URL}/api/v2/collection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            anilistId: id,
            status: "plan_to_watch",
            progress: 0,
            title: title,
            img: img,
            mediaType: "anime",
          }),
        });
        if (res.ok) {
          queryClient.invalidateQueries({ queryKey: ["userCollections", userId] });
          Alert.alert("Tersimpan", "Telah ditambahkan ke Koleksi Anda.");
        } else {
          Alert.alert("Perhatian", "Tidak dapat menyimpan saat ini.");
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Perhatian", "Koneksi terganggu. Silakan coba lagi.");
    }
  };

  return {
    id,
    img,
    title,
    score,
    airingTime,
    statusText,
    statusColor,
    isSaved,
    handleSaveCollection,
  };
}
