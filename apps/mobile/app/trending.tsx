import React from "react";
import { View, Text, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrendingData } from "../lib/hooks/useTrendingData";
import { Theme } from "../lib/theme";
import { TrendingList } from "../components/explore/TrendingList";

const BG = Theme.colors.background;
const SURFACE = Theme.colors.surface2;

export default function TrendingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { results, loading } = useTrendingData();

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: insets.top + 10,
          paddingBottom: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: SURFACE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft color="white" size={20} />
        </Pressable>
        <View style={{ marginLeft: 16 }}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: -0.5,
            }}
          >
            Trending Sekarang
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" }}>
            Paling banyak dibicarakan
          </Text>
        </View>
      </View>

      <TrendingList results={results} loading={loading} />
    </View>
  );
}
