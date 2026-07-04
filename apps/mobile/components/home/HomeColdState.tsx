import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../lib/theme";
import { LoadingState } from "../ui/LoadingState";

export function HomeColdState({
  renderSwarmResolvers,
}: {
  renderSwarmResolvers: () => React.ReactNode;
}) {
  return (
    <View style={{ flex: 1 }}>
      {renderSwarmResolvers()}
      <View style={styles.coldStartHeader}>
        <View style={styles.statusDot} />
        <Text style={styles.coldStartText}>Membangunkan server (15-30 detik)...</Text>
      </View>
      <LoadingState />
    </View>
  );
}

const styles = StyleSheet.create({
  coldStartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Theme.layout.paddingTopSafe + 20,
    marginBottom: -Theme.layout.paddingTopSafe - 10,
    zIndex: 10,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9500",
  },
  coldStartText: {
    color: "#FF9500",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
