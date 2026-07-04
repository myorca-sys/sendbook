import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check, Star } from "lucide-react-native";

export function MediaCardStats({ score, isCompleted }: any) {
  return (
    <View style={styles.bottomBar}>
      <View style={styles.statsContainer}>
        {score ? (
          <View style={styles.statBadge}>
            <Star size={9} color="#FFD60A" fill="#FFD60A" />
            <Text style={styles.scoreText}>{(score / 10).toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Check size={10} color="#30D158" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: { fontSize: 9, fontWeight: "bold", color: "#FFD60A" },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(48, 209, 88, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
