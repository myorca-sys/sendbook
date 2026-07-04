import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { API_URL } from "../../lib/config";
import { fetcher } from "../../lib/fetcher";
import { Theme } from "../../lib/theme";
import { PRESET_BANNERS } from "../../lib/constants/presetBanners";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { UserHero } from "../../components/user/ui/UserHero";
import { UserStats } from "../../components/user/ui/UserStats";
import { PublicProfileError } from "../../components/user/ui/PublicProfileError";

export default function PublicProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["publicProfile", id],
    queryFn: () => fetcher(`${API_URL}/api/v2/social/user/${id}`),
    enabled: !!id,
    staleTime: 60000,
  });

  const userData = data?.data;

  if (isLoading || error || !userData) {
    return <PublicProfileError router={router} isError={!!error || !userData} />;
  }

  const banner = PRESET_BANNERS[0].url;
  const level = userData.level || 1;
  const exp = userData.exp || 0;
  const nextExp = Math.pow(level, 2) * 50;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} bounces={false}>
        <UserHero
          banner={banner}
          insets={insets}
          router={router}
          userData={userData}
          level={level}
          exp={exp}
          nextExp={nextExp}
        />
        <View style={styles.contentContainer}>
          <UserStats userData={userData} exp={exp} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollView: { flex: 1 },
  contentContainer: {
    paddingTop: 140,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
