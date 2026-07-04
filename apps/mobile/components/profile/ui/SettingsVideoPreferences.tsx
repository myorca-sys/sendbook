import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { PlayCircle } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function SettingsVideoPreferences({
  preferredResolution,
  handleChangeResolution,
}: {
  preferredResolution: string;
  handleChangeResolution: (res: string) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <PlayCircle size={16} color={Theme.colors.primary} />
        <Text style={styles.sectionTitle}>Preferensi Video</Text>
      </View>
      <View style={styles.resContainer}>
        {["360p", "480p", "720p", "1080p"].map((res) => (
          <Pressable
            key={res}
            onPress={() => handleChangeResolution(res)}
            style={[styles.resBtn, preferredResolution === res && styles.resBtnActive]}
          >
            <Text style={[styles.resText, preferredResolution === res && styles.resTextActive]}>
              {res}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>
        Resolusi default akan otomatis dipilih saat kamu mulai memutar episode baru.
      </Text>
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
  resContainer: { flexDirection: "row", gap: 8 },
  resBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  resBtnActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  resText: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "700" },
  resTextActive: { color: "white" },
  hint: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
