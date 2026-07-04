import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  composerWrapper: {
    backgroundColor: "transparent",
    paddingBottom: 0,
  },
  emojiRow: {
    paddingVertical: 8,
  },
  emojiContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  emojiBtn: {
    padding: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  composerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2536",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  composerAvatarFallback: {
    color: "white",
    fontWeight: "900",
    fontSize: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "transparent",
    paddingLeft: 12,
    paddingRight: 6,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    color: "#0a84ff",
    fontWeight: "bold",
    fontSize: 14,
  },
  tagSpace: {
    width: 4,
  },
  thanksButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  thanksButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  thanksIconText: {
    position: "absolute",
    color: "white",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    marginTop: -1,
  },
  textInput: {
    flex: 1,
    color: "white",
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
  },
  cancelTagBtn: {
    padding: 4,
    marginRight: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0a84ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
