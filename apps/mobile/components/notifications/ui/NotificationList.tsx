import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Bell } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { NotificationItem } from "./NotificationItem";

export function NotificationList({
  isLoading,
  isValidating,
  data,
  mutate,
  notifications,
  router,
}: any) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      refreshControl={
        <RefreshControl
          refreshing={isValidating && !!data}
          onRefresh={() => mutate()}
          tintColor={Theme.colors.text}
          colors={["#0A84FF"]}
        />
      }
    >
      {isLoading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="small" color={Theme.colors.text} />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Bell size={28} color="rgba(255,255,255,0.2)" />
          </View>
          <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
          <Text style={styles.emptySubtitle}>
            Update episode baru untuk anime favorit Anda akan muncul di sini.
          </Text>
        </View>
      ) : (
        notifications.map((notif: any, i: number) => (
          <NotificationItem
            key={notif.id || i}
            notif={notif}
            onPress={() => {
              if (notif.link) router.push(notif.link as any);
            }}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1f1c29",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
