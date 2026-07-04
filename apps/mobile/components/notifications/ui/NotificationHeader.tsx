import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Bell, CheckCircle, ArrowLeft } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function NotificationHeader({ insets, onBack, hasNotifications }: any) {
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <ArrowLeft size={24} color={Theme.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifikasi</Text>
        </View>
        {hasNotifications && (
          <Pressable style={styles.readAllBtn}>
            <CheckCircle size={14} color={Theme.colors.primary} />
            <Text style={styles.readAllText}>Baca Semua</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgba(19,17,26,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: {
    color: Theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  readAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10,132,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  readAllText: { color: Theme.colors.primary, fontSize: 12, fontWeight: "700" },
});
