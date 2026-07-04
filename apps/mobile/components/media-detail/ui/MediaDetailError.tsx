import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";

export function MediaDetailError() {
  const router = useRouter();

  return (
    <View style={styles.errorContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.errorText}>Informasi Tidak Tersedia</Text>
      <Text
        style={{
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Periksa koneksi Anda atau coba lagi nanti.
      </Text>
      <Pressable onPress={() => router.back()} style={styles.errorButton}>
        <Text style={styles.errorButtonText}>Kembali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: "#0a0812",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { color: "white", fontSize: 18 },
  errorButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
  errorButtonText: { color: "white", fontWeight: "600" },
});
