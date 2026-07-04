import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Cloud, Zap, Shield } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { EditProfileModal } from "../EditProfileModal";
import { WatchHistoryRow } from "../../home/sections/WatchHistoryRow";
import { SettingsVideoPreferences } from "./SettingsVideoPreferences";
import { SettingsAccountSection } from "./SettingsAccountSection";
import { SettingsAbout } from "./SettingsAbout";

export function ProfileLayout({
  user,
  stats,
  customProfile,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  handleSaveProfile,
  openEditModal,
  signInWithGoogle,
  isLoading,
  displayBanner,
  displayAvatar,
  historyItems,
  historyLoading,
  preferredResolution,
  handleChangeResolution,
  handleClearCache,
  signOut,
}: any) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} bounces={false}>
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: displayBanner }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,8,18,0.1)", "rgba(10,8,18,0.6)", Theme.colors.background]}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.contentContainer}>
          <ProfileHeader
            user={user}
            customProfile={customProfile}
            displayAvatar={displayAvatar}
            stats={stats}
            signInWithGoogle={signInWithGoogle}
            isLoading={isLoading}
          />

          {user ? (
            <>
              <ProfileStats stats={stats} bio={customProfile.bio} onOpenEdit={openEditModal} />
              
              <View style={styles.historySection}>
                {historyLoading && (!historyItems || historyItems.length === 0) ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={Theme.colors.primary} size="small" />
                  </View>
                ) : (
                  <WatchHistoryRow items={historyItems || []} mediaType="anime" />
                )}
              </View>

              {/* Inline Settings Section (No sub-page) */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Pengaturan Aplikasi</Text>
                
                <SettingsVideoPreferences
                  preferredResolution={preferredResolution}
                  handleChangeResolution={handleChangeResolution}
                />

                <SettingsAccountSection
                  onClearCache={handleClearCache}
                  onSignOut={signOut}
                />

                <SettingsAbout />
              </View>
            </>
          ) : (
            /* Guest Mode Onboarding Cards */
            <View style={styles.onboardingSection}>
              <Text style={styles.onboardingTitle}>Kenapa Harus Masuk?</Text>

              <View style={styles.onboardingCard}>
                <View style={[styles.onboardingIconContainer, { backgroundColor: "rgba(10, 132, 255, 0.1)" }]}>
                  <Cloud size={20} color="#0A84FF" />
                </View>
                <View style={styles.onboardingTextContainer}>
                  <Text style={styles.onboardingCardTitle}>Sinkronisasi Cloud</Text>
                  <Text style={styles.onboardingCardDesc}>
                    Koleksi & riwayat tontonan Anda tersinkronisasi instan ke database cloud Supabase.
                  </Text>
                </View>
              </View>

              <View style={styles.onboardingCard}>
                <View style={[styles.onboardingIconContainer, { backgroundColor: "rgba(48, 209, 88, 0.1)" }]}>
                  <Zap size={20} color="#30D158" />
                </View>
                <View style={styles.onboardingTextContainer}>
                  <Text style={styles.onboardingCardTitle}>Offline Resilience</Text>
                  <Text style={styles.onboardingCardDesc}>
                    Penyimpanan asinkron latar belakang memastikan progres tonton tetap tercatat saat luring.
                  </Text>
                </View>
              </View>

              <View style={styles.onboardingCard}>
                <View style={[styles.onboardingIconContainer, { backgroundColor: "rgba(191, 90, 242, 0.1)" }]}>
                  <Shield size={20} color="#BF5AF2" />
                </View>
                <View style={styles.onboardingTextContainer}>
                  <Text style={styles.onboardingCardTitle}>Keamanan Akun</Text>
                  <Text style={styles.onboardingCardDesc}>
                    Masuk secara aman menggunakan Google Sign-In terenkripsi Better-Auth.
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerVersion}>Orca v3.2.0 (Stable)</Text>
            <Text style={styles.footerSlogan}>Didesain untuk efisiensi maksimal </Text>
          </View>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={isEditing}
        onClose={() => setIsEditing(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollView: { flex: 1 },
  bannerContainer: { width: "100%", height: 260, position: "absolute", top: 0 },
  contentContainer: { paddingTop: 210, paddingHorizontal: 20, paddingBottom: 100 },
  historySection: {
    marginTop: 10,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  settingsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 28,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  onboardingSection: {
    marginTop: 20,
    width: "100%",
  },
  onboardingTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  onboardingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 12,
    alignItems: "center",
  },
  onboardingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  onboardingTextContainer: {
    flex: 1,
  },
  onboardingCardTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  onboardingCardDesc: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    lineHeight: 16,
  },
  footer: { alignItems: "center", paddingTop: 40, paddingBottom: 24 },
  footerVersion: {
    color: Theme.colors.textDim,
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footerSlogan: {
    color: "rgba(255,255,255,0.15)",
    fontSize: 10,
    fontWeight: Theme.typography.weights.medium,
    marginTop: 6,
  },
});
