import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { Theme } from "../../../lib/theme";
import { FEATURE_FLAGS } from "../../../lib/config/features";

export function UserHero({ banner, insets, router, userData, level, exp, nextExp }: any) {
  return (
    <>
      <View style={styles.bannerContainer}>
        <Image source={{ uri: banner }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={["rgba(10,8,18,0.1)", "rgba(10,8,18,0.8)", Theme.colors.background]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtnTop, { top: insets.top + 10 }]}
        >
          <ArrowLeft size={20} color="white" />
        </Pressable>
      </View>
      <View style={styles.headerSection}>
        <View style={styles.avatarWrapper}>
          {FEATURE_FLAGS.ENABLE_GAMIFICATION ? (
            <LinearGradient
              colors={["#FFD60A", "#FF3B30", "#AF52DE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarBorderGlow}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      userData.image || "https://api.dicebear.com/7.x/notionists/svg?seed=OrcaUser",
                  }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              </View>
            </LinearGradient>
          ) : (
            <View style={[styles.avatarBorderGlow, { backgroundColor: Theme.colors.border, borderWidth: 1.5, borderColor: Theme.colors.border }]}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      userData.image || "https://api.dicebear.com/7.x/notionists/svg?seed=OrcaUser",
                  }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              </View>
            </View>
          )}
          {FEATURE_FLAGS.ENABLE_GAMIFICATION && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv {level}</Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name || "Orca User"}</Text>
          {FEATURE_FLAGS.ENABLE_GAMIFICATION && (
            <View style={styles.expContainer}>
              <View style={styles.expBarBg}>
                <LinearGradient
                  colors={[Theme.colors.primary, "#64D2FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.expBarFill, { width: `${Math.min(100, (exp / nextExp) * 100)}%` }]}
                />
              </View>
              <Text style={styles.expText}>
                {exp} / {nextExp} EXP
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: { width: "100%", height: 220, position: "absolute", top: 0 },
  backBtnTop: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerSection: { alignItems: "center", marginBottom: 32 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatarBorderGlow: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: Theme.colors.surface2,
    borderWidth: 3,
    borderColor: Theme.colors.background,
  },
  levelBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  levelBadgeText: {
    color: Theme.colors.text,
    fontSize: 12,
    fontWeight: Theme.typography.weights.black,
  },
  userInfo: { alignItems: "center", width: "100%" },
  userName: {
    fontSize: 26,
    fontWeight: Theme.typography.weights.black,
    color: Theme.colors.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  expContainer: { width: "70%", alignItems: "center", marginTop: 10 },
  expBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: Theme.colors.surface2,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  expBarFill: { height: "100%", borderRadius: 3 },
  expText: {
    fontSize: 11,
    color: Theme.colors.textDim,
    fontWeight: Theme.typography.weights.semibold,
  },
});
