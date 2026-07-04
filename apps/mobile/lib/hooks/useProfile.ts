import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { PRESET_BANNERS } from "../constants/presetBanners";
import { storage } from "../storage";
import { useProfileSettings } from "./useProfileSettings";

export function useProfile(user: any) {
  const [customProfile, setCustomProfile] = useState({
    name: "",
    bio: "Pecinta anime musiman yang sedang mencari harta karun di lautan internet.",
    avatar: "",
    banner: PRESET_BANNERS[0].url,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...customProfile });
  const settings = useProfileSettings();

  useEffect(() => {
    try {
      const stored = storage.getString("@custom_profile");
      if (stored) setCustomProfile(JSON.parse(stored));
      else if (user)
        setCustomProfile((prev) => ({
          ...prev,
          name: user.name || "Orca User",
          avatar:
            user.image ||
            user.picture ||
            "https://api.dicebear.com/7.x/notionists/svg?seed=OrcaUser",
        }));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const handleSaveProfile = () => {
    try {
      storage.set("@custom_profile", JSON.stringify(editForm));
      setCustomProfile(editForm);
      setIsEditing(false);
    } catch (e) {
      Alert.alert("Perhatian", "Tidak dapat menyimpan profil saat ini");
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: customProfile.name || user?.name || "Orca User",
      bio: customProfile.bio,
      avatar:
        customProfile.avatar ||
        user?.image ||
        user?.picture ||
        "https://api.dicebear.com/7.x/notionists/svg?seed=OrcaUser",
      banner: customProfile.banner,
    });
    setIsEditing(true);
  };

  return {
    customProfile,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    handleSaveProfile,
    openEditModal,
    ...settings,
  };
}
