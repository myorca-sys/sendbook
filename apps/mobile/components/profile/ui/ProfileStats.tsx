import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Edit2, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Theme } from "../../../lib/theme";

export function ProfileStats({
  stats,
  bio,
  onOpenEdit,
}: {
  stats: any;
  bio: string;
  onOpenEdit: () => void;
}) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.userBio}>{bio || "Pecinta anime musiman yang sedang mencari harta karun di lautan internet."}</Text>

      <View style={styles.pillActions}>
        <Pressable
          onPress={onOpenEdit}
          style={({ pressed }) => [styles.pillBtn, pressed && styles.pillBtnPressed]}
        >
          <Edit2 size={15} color={Theme.colors.text} />
          <Text style={styles.pillBtnText}>Edit Profil</Text>
        </Pressable>
      </View>

      <View style={styles.statsShowcase}>
        <View style={[styles.statCard, { borderLeftColor: "#0A84FF" }]}>
          <Text style={[styles.statValue, { color: "#0A84FF" }]}>{stats.totalEps}</Text>
          <Text style={styles.statLabel}>Eps Ditonton</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#30D158" }]}>
          <Text style={[styles.statValue, { color: "#30D158" }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Anime Tamat</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#BF5AF2" }]}>
          <Text style={[styles.statValue, { color: "#BF5AF2" }]}>{stats.days}</Text>
          <Text style={styles.statLabel}>Hari Tonton</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  userBio: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    fontStyle: "italic",
  },
  pillActions: { flexDirection: "row", gap: 12, marginBottom: 24 },
  pillBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pillBtnPressed: { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" },
  pillBtnText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  statsShowcase: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
  },
});
