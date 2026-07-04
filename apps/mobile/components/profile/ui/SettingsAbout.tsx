import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function SettingsAbout() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Info size={16} color={Theme.colors.primary} />
        <Text style={styles.sectionTitle}>Tentang</Text>
      </View>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutText}>
          Orca dikembangkan untuk memberikan pengalaman streaming anime dan baca manga tercepat
          dengan biaya infrastruktur $0.
        </Text>
        <Text style={[styles.aboutText, { marginTop: 12, color: Theme.colors.textDim }]}>
          Versi 3.2.0 (Build 2026.06.01)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 36 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  aboutBox: {
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  aboutText: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 20 },
});
