import React from "react";
import { View, Text, Pressable, ScrollView, Animated, StyleSheet, Modal } from "react-native";

interface VideoSettingsSheetProps {
  isFullscreen: boolean;
  availableQualities: string[];
  activeQuality: string | null;
  onClose: () => void;
  onQualitySelect: (quality: string) => void;
}

export const VideoSettingsSheet = React.memo(function VideoSettingsSheet({
  isFullscreen,
  availableQualities,
  activeQuality,
  onClose,
  onQualitySelect,
}: VideoSettingsSheetProps) {
  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill} pointerEvents="auto">
        {/* Blur Background */}
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 40 }]}
          onPress={onClose}
        />

        <Animated.View
          style={[styles.settingsSheet, isFullscreen && styles.settingsSheetFullscreen]}
        >
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Kualitas Video</Text>
          </View>
          <ScrollView style={styles.settingsContent} showsVerticalScrollIndicator={false}>
            {availableQualities.map((quality, i) => {
              const isSelected = quality === activeQuality;
              return (
                <Pressable
                  key={`${quality}-${i}`}
                  onPress={() => onQualitySelect(quality)}
                  style={({ pressed }) => [
                    styles.settingsOption,
                    isSelected && styles.settingsOptionSelected,
                    pressed && { backgroundColor: "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <View style={styles.settingsOptionLeft}>
                    <Text
                       style={[styles.settingsOptionQuality, isSelected && { color: "#0A84FF" }]}
                    >
                      {quality}
                    </Text>
                  </View>
                  {isSelected && <View style={styles.settingsOptionDot} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  settingsSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(20, 18, 25, 0.95)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingTop: 16,
    paddingHorizontal: 20,
    zIndex: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  settingsSheetFullscreen: {
    right: 0,
    left: "auto",
    width: 300,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 0,
    paddingTop: 40,
    paddingBottom: 20,
  },
  settingsHeader: {
    marginBottom: 16,
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  settingsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsContent: {
    gap: 8,
  },
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  settingsOptionSelected: {
    backgroundColor: "rgba(10, 132, 255, 0.1)",
    borderColor: "rgba(10, 132, 255, 0.3)",
    borderWidth: 1,
  },
  settingsOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsOptionQuality: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  settingsOptionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0A84FF",
  },
});
