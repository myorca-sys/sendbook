import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Star, Info } from "lucide-react-native";
import { UnifiedMediaDetail } from "../../../lib/adapters/mediaAdapter";

export const DetailMetadata = React.memo(
  ({ media }: { media: UnifiedMediaDetail }) => {
    const router = useRouter();

    return (
      <View style={styles.titleArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metaStrip}
        >
          {media.score > 0 && (
            <View style={styles.metaPill}>
              <Star color="#FFD60A" fill="#FFD60A" size={12} />
              <Text style={styles.metaPillText}>
                {(media.score / 10).toFixed(1)}
              </Text>
            </View>
          )}
          <View style={styles.metaPill}>
            <Info color="rgba(255,255,255,0.6)" size={12} />
            <Text
              style={[styles.metaPillText, { color: "rgba(255,255,255,0.8)" }]}
            >
              {media.totalEpisodes || media.episodes.length || "?"}{" "}
              {media.id.includes("|") ? "Chap" : "Eps"}
            </Text>
          </View>
          {!!media.season && !!media.seasonYear && (
            <View style={styles.metaPill}>
              <Text
                style={[
                  styles.metaPillText,
                  {
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "capitalize",
                  },
                ]}
              >
                {media.season.toLowerCase()} {media.seasonYear}
              </Text>
            </View>
          )}
          {!!(media as any).format && (
            <View style={styles.metaPill}>
              <Text
                style={[
                  styles.metaPillText,
                  { color: "rgba(255,255,255,0.8)" },
                ]}
              >
                {(media as any).format}
              </Text>
            </View>
          )}
          {!!media.studios?.[0] && (
            <View style={styles.metaPill}>
              <Text
                style={[
                  styles.metaPillText,
                  { color: "rgba(255,255,255,0.8)" },
                ]}
              >
                {media.studios[0]}
              </Text>
            </View>
          )}
        </ScrollView>

        {media.genres?.length > 0 && (
          <View style={styles.genresContainer}>
            {media.genres.map((g: string) => (
              <Pressable
                key={g}
                onPress={() =>
                  router.push(`/explore?genre=${encodeURIComponent(g)}` as any)
                }
                style={({ pressed }) => [
                  styles.genreBadge,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.genreText}>{g}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  titleArea: {
    marginBottom: 16,
  },
  metaStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  genresContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  genreText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
});
