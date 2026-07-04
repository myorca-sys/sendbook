import React from "react";
import { useAuth } from "../../lib/auth";
import { useProfile } from "../../lib/hooks/useProfile";
import { useGamificationStats } from "../../lib/utils/gamification";
import { useMediaHistory } from "../../lib/hooks/useMediaHistory";
import { ProfileLayout } from "../../components/profile/ui/ProfileLayout";

export default function ProfileScreen() {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();
  const stats = useGamificationStats(user?.id || user?.email);
  const { animeHistory, isLoading: historyLoading } = useMediaHistory();

  const {
    customProfile,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    handleSaveProfile,
    openEditModal,
    preferredResolution,
    handleChangeResolution,
    handleClearCache,
  } = useProfile(user);

  const displayBanner = isEditing ? editForm.banner : customProfile.banner;
  const displayAvatar = isEditing
    ? editForm.avatar
    : customProfile.avatar ||
      user?.image ||
      user?.picture ||
      "https://api.dicebear.com/7.x/notionists/svg?seed=OrcaUser";

  return (
    <ProfileLayout
      user={user}
      stats={stats}
      customProfile={customProfile}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      editForm={editForm}
      setEditForm={setEditForm}
      handleSaveProfile={handleSaveProfile}
      openEditModal={openEditModal}
      signInWithGoogle={signInWithGoogle}
      isLoading={isLoading}
      displayBanner={displayBanner}
      displayAvatar={displayAvatar}
      historyItems={animeHistory}
      historyLoading={historyLoading}
      preferredResolution={preferredResolution}
      handleChangeResolution={handleChangeResolution}
      handleClearCache={handleClearCache}
      signOut={signOut}
    />
  );
}
