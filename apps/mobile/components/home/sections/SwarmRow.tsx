import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Image } from "expo-image";
import { Theme } from "../../../lib/theme";
import { SecHeader } from "../../ui/SecHeader";

export function SwarmRow({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: any[];
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <Text style={{ color: "rgba(255,255,255,0.5)", paddingHorizontal: 16 }}>
        Memuat dari Edge Swarm...
      </Text>
    );
  if (!data || data.length === 0) return null;
  return (
    <View style={{ marginBottom: 32 }}>
      <SecHeader label={title} />
      <View style={{ paddingHorizontal: 16 }}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{ gap: 12 }}
        >
          {data.map((item, i) => (
            <Pressable
              key={i}
              style={{ width: 120 }}
              onPress={() => {
                import("react-native").then(({ Alert }) => {
                  Alert.alert(
                    "Data Mentah (Tanpa Anilist ID)",
                    `Ini adalah data mentah langsung dari ${title.includes("Otakudesu") ? "Otakudesu" : "Samehadaku"}.\n\nURL: ${item.link}\n\nKarena tidak memiliki ID Anilist (Database Global), ia tidak bisa diarahkan ke Halaman Detail yang cantik. Ini murni untuk mendemonstrasikan kecepatan Edge Swarm.`,
                  );
                });
              }}
            >
              <View
                style={{
                  height: 160,
                  borderRadius: 12,
                  backgroundColor: Theme.colors.surface,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[StyleSheet.absoluteFill, { width: "100%", height: "100%", zIndex: 1 }]}
                  contentFit="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    padding: 6,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    borderTopRightRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: Theme.colors.primary,
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {item.episode}
                  </Text>
                </View>
              </View>
              <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}
