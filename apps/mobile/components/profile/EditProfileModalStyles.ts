import { StyleSheet, Platform } from "react-native";
import { Theme } from "../../lib/theme";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "70%",
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: Theme.typography.weights.bold,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    color: Theme.colors.text,
    fontSize: 14,
    fontWeight: Theme.typography.weights.semibold,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: Theme.colors.surface2,
    color: Theme.colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    fontSize: 14,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  saveButton: {
    backgroundColor: Theme.colors.text,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  saveButtonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontWeight: Theme.typography.weights.bold,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarOption: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface2,
  },
  avatarOptionSelected: {
    borderColor: Theme.colors.primary,
  },
  bannerScroll: {
    marginHorizontal: -20,
  },
  bannerScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bannerOption: {
    width: 160,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface2,
  },
  bannerOptionSelected: {
    borderColor: Theme.colors.primary,
  },
  bannerOptionLabel: {
    position: "absolute",
    bottom: 6,
    left: 8,
    right: 8,
  },
  bannerOptionText: {
    color: "white",
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
  },
});
