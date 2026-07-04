import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

const SURFACE = "#1f1c29";

export function NotificationItem({ notif, onPress }: any) {
  return (
    <Pressable
      style={[
        styles.notifCard,
        notif.isUnread
          ? { backgroundColor: SURFACE, borderColor: "rgba(255,255,255,0.1)" }
          : { backgroundColor: "transparent", borderColor: "transparent" },
      ]}
      onPress={onPress}
    >
      {notif.isUnread && <View style={styles.unreadDot} />}

      <View
        style={[
          styles.iconBox,
          notif.isUnread ? { borderColor: "rgba(10,132,255,0.3)" } : {},
        ]}
      >
        <Bell
          size={20}
          color={notif.isUnread ? "#0A84FF" : "rgba(255,255,255,0.4)"}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.title,
            notif.isUnread
              ? { color: Theme.colors.text, fontWeight: "700" }
              : { color: "rgba(255,255,255,0.7)", fontWeight: "500" },
          ]}
          numberOfLines={1}
        >
          {notif.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notif.message}
        </Text>
        <Text style={styles.time}>{notif.time || "Beberapa saat lalu"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  notifCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    left: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  title: { fontSize: 15, marginBottom: 4, lineHeight: 20 },
  message: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  time: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
