import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Theme } from "../../lib/theme";

interface CustomSplashScreenProps {
  isWakingUp: boolean;
  activeTrivia: string;
}

export function CustomSplashScreen({ isWakingUp, activeTrivia }: CustomSplashScreenProps) {
  return (
    <View style={styles.customSplash}>
      <Image source={require("../../assets/orca-logo.jpg")} style={styles.splashLogo} />

      <View style={styles.triviaBox}>
        <Text style={styles.triviaLabel}>Tahukah Kamu?</Text>
        <Text style={styles.triviaText}>"{activeTrivia}"</Text>
      </View>

      {isWakingUp && (
        <View style={styles.statusFooter}>
          <Text style={styles.wakingText}>Menyambungkan ke Server...</Text>
          <Text style={styles.statusSubtext}>Sedang membangunkan API (Hugging Face)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customSplash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 60,
  },
  triviaBox: {
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 20,
  },
  triviaLabel: {
    color: Theme.colors.primary,
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
    opacity: 0.6,
  },
  triviaText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.8,
  },
  statusFooter: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  wakingText: {
    color: "#FF9500",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.9,
  },
  statusSubtext: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 9,
    marginTop: 6,
    fontWeight: "600",
  },
});
