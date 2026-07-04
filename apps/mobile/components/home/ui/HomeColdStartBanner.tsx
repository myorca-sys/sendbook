import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function HomeColdStartBanner() {
  return (
    <View style={styles.inlineColdStart}>
      <View style={styles.statusDot} />
      <Text style={styles.inlineColdStartText}>Menghubungkan ke server...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineColdStart: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,149,0,0.1)",
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    zIndex: 100,
    borderWidth: 1,
    borderColor: "rgba(255,149,0,0.2)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF9500",
  },
  inlineColdStartText: {
    color: "#FF9500",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
