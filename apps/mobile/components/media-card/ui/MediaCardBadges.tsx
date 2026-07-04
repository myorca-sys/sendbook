import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function MediaCardBadges({
  rank,
  currentBadge,
  totalEps,
  epId,
  chPrefix,
}: any) {
  return (
    <>
      {!!rank && (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      )}
      {!rank && currentBadge === "NEW" && (
        <View style={[styles.badgeTopLeft, styles.badgeNew]}>
          <Text style={styles.badgeTextBlack}>NEW</Text>
        </View>
      )}
      {!rank && currentBadge === "UPDATE" && (
        <View style={[styles.badgeTopLeft, styles.badgeUpdate]}>
          <Text style={styles.badgeTextBlack}>UPDATE</Text>
        </View>
      )}
      {!rank && currentBadge === "BEST" && (
        <View style={[styles.badgeTopLeft, styles.badgeBest]}>
          <Text style={styles.badgeTextBlack}>BEST</Text>
        </View>
      )}
      {!rank && currentBadge === "MOVIE" && (
        <View style={[styles.badgeTopLeft, styles.badgeMovie]}>
          <Text style={styles.badgeTextWhite}>MOVIE</Text>
        </View>
      )}

      <View style={styles.badgeTopRight}>
        <Text style={styles.badgeTextWhite}>
          {currentBadge === "MOVIE"
            ? "HD"
            : currentBadge === "BEST"
              ? `${totalEps || epId || "?"} ${chPrefix}`
              : `${chPrefix} ${epId || totalEps || "?"}`}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rankBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 28,
    height: 36,
    backgroundColor: "rgba(19, 17, 26, 0.6)",
    borderBottomRightRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  rankText: { fontWeight: "900", fontSize: 14, color: "white" },
  badgeTopLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20,
  },
  badgeNew: { backgroundColor: "#FF9500" },
  badgeUpdate: { backgroundColor: "#30D158" },
  badgeBest: { backgroundColor: "#30D158" },
  badgeMovie: { backgroundColor: "#AF52DE" },
  badgeTopRight: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "rgba(255, 69, 58, 0.9)",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 20,
  },
  badgeTextBlack: {
    color: "black",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeTextWhite: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
