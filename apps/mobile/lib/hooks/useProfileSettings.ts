import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { storage } from "../storage";

export function useProfileSettings() {
  const [preferredResolution, setPreferredResolution] = useState("720p");

  useEffect(() => {
    const storedRes = storage.getString("@preferred_resolution");
    if (storedRes) setPreferredResolution(storedRes);
  }, []);

  const saveResolution = (val: string) => {
    const res = val.replace(/ \(.+\)/, "");
    storage.set("@preferred_resolution", res);
    setPreferredResolution(res);
  };

  const handleChangeResolution = () => {
    Alert.alert(
      "Resolusi Default",
      "Pilih kualitas pemutaran video secara otomatis.",
      [
        { text: "1080p", onPress: () => saveResolution("1080p") },
        { text: "720p (Standar)", onPress: () => saveResolution("720p") },
        { text: "480p", onPress: () => saveResolution("480p") },
        { text: "360p (Hemat Kuota)", onPress: () => saveResolution("360p") },
        { text: "Batal", style: "cancel" },
      ],
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Hapus Cache Lokal",
      "Hapus semua riwayat dan koleksi secara permanen dari perangkat ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            storage.clearAll();
            Alert.alert("Selesai", "Cache telah dibersihkan.");
          },
        },
      ],
    );
  };

  return { preferredResolution, handleChangeResolution, handleClearCache };
}
