import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Heart, MessageSquare, Flag } from "lucide-react-native";
import { FEATURE_FLAGS } from "../../../lib/config/features";

export function VideoSocialBar({
  onShowComments,
  onReport,
}: any) {
  const handleSupportPress = () => {
    Alert.alert(
      "Dukung Project",
      "Dukungan Anda membantu menjaga server kami tetap gratis ($0 cost). Donasi fitur ini segera hadir!",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSupportPress} style={styles.statItem}>
        <Heart color="#FF2D55" fill="#FF2D55" size={20} />
        <Text style={styles.statText}>Support</Text>
      </Pressable>
      
      <View style={styles.divider} />
      
      <Pressable onPress={onReport} style={styles.statItem}>
        <Flag color="white" size={20} />
        <Text style={styles.statText}>Lapor</Text>
      </Pressable>
      
      {FEATURE_FLAGS.ENABLE_COMMENTS && (
        <>
          <View style={styles.divider} />
          <Pressable onPress={onShowComments} style={styles.statItem}>
            <MessageSquare color="white" size={20} />
            <Text style={styles.statText}>Komentar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 12,
    marginLeft: 16,
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});
