import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Activity, Trophy } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { FEATURE_FLAGS } from "../../../lib/config/features";

export function UserStats({ userData, exp }: any) {
  return (
    <View style={styles.statsShowcase}>
      <View style={styles.statCard}>
        <View
          style={[
            styles.statIconBox,
            { backgroundColor: "rgba(10, 132, 255, 0.15)" },
          ]}
        >
          <Activity size={20} color={Theme.colors.primary} />
        </View>
        <Text style={styles.statValue}>{userData.totalEpisodes || 0}</Text>
        <Text style={styles.statLabel}>Eps Ditonton</Text>
      </View>

      <View style={styles.statCard}>
        <View
          style={[
            styles.statIconBox,
            { backgroundColor: "rgba(255, 159, 10, 0.15)" },
          ]}
        >
          <Trophy size={20} color={Theme.colors.warningAlt} />
        </View>
        <Text style={styles.statValue}>
          {FEATURE_FLAGS.ENABLE_GAMIFICATION ? exp : (userData.completed || 0)}
        </Text>
        <Text style={styles.statLabel}>
          {FEATURE_FLAGS.ENABLE_GAMIFICATION ? "Total EXP" : "Anime Tamat"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsShowcase: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Theme.colors.textDim,
    fontWeight: Theme.typography.weights.bold,
    textTransform: "uppercase",
  },
});
