import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Tv } from "lucide-react-native";
import { Theme } from "../../lib/theme";

interface HomeErrorStateProps {
  onRetry: () => void;
  renderSwarmResolvers: () => React.ReactNode;
}

export function HomeErrorState({ onRetry, renderSwarmResolvers }: HomeErrorStateProps) {
  return (
    <View style={styles.errorContainer}>
      {renderSwarmResolvers()}
      <View style={styles.errorIconBox}>
        <Tv size={28} color="#FF3B30" />
      </View>
      <Text style={styles.errorTitle}>Konten Tidak Tersedia</Text>
      <Text style={styles.errorDesc}>
        Mohon periksa koneksi internet Anda atau coba beberapa saat lagi.
      </Text>
      <Pressable onPress={onRetry} style={styles.retryBtn}>
        <Text style={styles.retryBtnText}>Coba Lagi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: Theme.layout.paddingTopSafe + 100,
  },
  errorIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,59,48,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDesc: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
