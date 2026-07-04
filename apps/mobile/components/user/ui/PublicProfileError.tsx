import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { Theme } from "../../../lib/theme";

export function PublicProfileError({ router, isError }: { router: any; isError?: boolean }) {
  if (!isError) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.centerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.errorText}>Profil Tidak Tersedia</Text>
      <Text style={styles.subtitle}>Periksa koneksi Anda atau coba lagi nanti.</Text>
      <Pressable onPress={() => router.back()} style={styles.backButtonCenter}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Kembali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Theme.colors.danger,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  backButtonCenter: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
