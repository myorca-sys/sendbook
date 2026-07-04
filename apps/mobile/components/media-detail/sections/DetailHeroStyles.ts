import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  heroSection: {
    width: "100%",
    aspectRatio: 3 / 4,
    position: "relative",
    backgroundColor: "#0a0812",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  heroBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  heroLeft: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    marginBottom: 8,
  },
  heroRight: {
    gap: 12,
    alignItems: "center",
    paddingBottom: 24,
  },
  bookmarkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  togglingState: {
    opacity: 0.5,
  },
  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  heroPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#0A84FF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
