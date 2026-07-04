import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";

import { API_URL } from "../lib/config";
import { fetcher } from "../lib/fetcher";
import { Theme } from "../lib/theme";
import { NotificationHeader } from "../components/notifications/ui/NotificationHeader";
import { NotificationList } from "../components/notifications/ui/NotificationList";

const BG = "#0a0812";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isLoading: authLoading } = useAuth();

  const {
    data,
    isLoading,
    isFetching: isValidating,
    refetch: mutate,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetcher(`${API_URL}/api/v2/social/notifications`),
    enabled: !!user,
    refetchInterval: 120000,
  });

  useEffect(() => {
    if (!authLoading && !user) router.replace("/profile" as any);
  }, [user, authLoading]);

  const notifications = data?.data || [];

  if (authLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <NotificationHeader
        insets={insets}
        onBack={() => router.back()}
        hasNotifications={notifications.length > 0}
      />

      <NotificationList
        isLoading={isLoading}
        isValidating={isValidating}
        data={data}
        mutate={mutate}
        notifications={notifications}
        router={router}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
});
