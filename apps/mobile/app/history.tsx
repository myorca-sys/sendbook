import React from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMediaHistory } from "../lib/hooks/useMediaHistory";
import { Theme } from "../lib/theme";
import { HistoryList } from "../components/collection/HistoryList";

const BG = Theme.colors.background;
const SURFACE = Theme.colors.surface2;

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { animeHistory, isLoading } = useMediaHistory();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="white" size={20} />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Riwayat Tontonan</Text>
          <Text style={styles.headerSubtitle}>Aktivitas menonton terakhir Anda</Text>
        </View>
      </View>

      {isLoading && animeHistory.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Theme.colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
        >
          <HistoryList items={animeHistory} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: { marginLeft: 16 },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  headerSubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});
