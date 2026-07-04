import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useAuth } from "../lib/auth";
import { Theme } from "../lib/theme";
import { useProfile } from "../lib/hooks/useProfile";
import { SettingsAccountSection } from "../components/profile/ui/SettingsAccountSection";
import { SettingsVideoPreferences } from "../components/profile/ui/SettingsVideoPreferences";
import { SettingsAbout } from "../components/profile/ui/SettingsAbout";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { handleClearCache, preferredResolution, handleChangeResolution } = useProfile(user);

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Mohon login...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft color="white" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SettingsVideoPreferences
          preferredResolution={preferredResolution}
          handleChangeResolution={handleChangeResolution}
        />

        <SettingsAccountSection
          onClearCache={handleClearCache}
          onSignOut={() => {
            signOut();
            router.replace("/profile");
          }}
        />

        <SettingsAbout />
        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: { color: "white", fontSize: 17, fontWeight: "700" },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { padding: 20 },
});
