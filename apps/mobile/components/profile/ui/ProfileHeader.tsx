import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Theme } from "../../../lib/theme";
import { FEATURE_FLAGS } from "../../../lib/config/features";

export function ProfileHeader({
  user,
  customProfile,
  displayAvatar,
  stats,
  signInWithGoogle,
  isLoading,
}: any) {
  return (
    <View style={styles.headerSection}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: displayAvatar }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        </View>
        {FEATURE_FLAGS.ENABLE_GAMIFICATION && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Lv {stats.level}</Text>
          </View>
        )}
      </View>

      {user ? (
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {customProfile.name || user.name || "Orca User"}
            </Text>
          </View>
          {FEATURE_FLAGS.ENABLE_GAMIFICATION && (
            <View style={styles.expContainer}>
              <View style={styles.expBarBg}>
                <LinearGradient
                  colors={[Theme.colors.primary, "#64D2FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.expBarFill,
                    {
                      width: `${Math.min(100, (stats.exp / stats.nextExp) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.expText}>
                {stats.exp} / {stats.nextExp} EXP
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.guestInfo}>
          <Text style={styles.userName}>Guest Mode</Text>
          <Text style={styles.guestDescription}>
            {FEATURE_FLAGS.ENABLE_GAMIFICATION
              ? "Masuk untuk melacak progress dan mendapatkan Trophy."
              : "Masuk untuk melacak progress tontonan Anda."}
          </Text>
          <Pressable
            onPress={signInWithGoogle}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
              pressed && !isLoading && styles.loginButtonPressed,
            ]}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Memproses..." : "Lanjutkan dengan Google"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: { position: "relative", marginRight: 16 },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: Theme.colors.surface2,
    borderWidth: 2,
    borderColor: Theme.colors.background,
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    alignSelf: "center",
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  levelBadgeText: {
    color: Theme.colors.text,
    fontSize: 10,
    fontWeight: Theme.typography.weights.bold,
  },
  userInfo: { flex: 1, justifyContent: "center" },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: Theme.typography.weights.bold,
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  expContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  expBarFill: { height: "100%", borderRadius: 2 },
  expText: {
    fontSize: 10,
    color: Theme.colors.textDim,
    fontWeight: Theme.typography.weights.semibold,
  },
  guestInfo: { alignItems: "flex-start", paddingVertical: 8 },
  guestDescription: {
    fontSize: 14,
    color: Theme.colors.textDim,
    marginBottom: 16,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: Theme.colors.text,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  loginButtonDisabled: { opacity: 0.5 },
  loginButtonPressed: { opacity: 0.8 },
  loginButtonText: {
    color: Theme.colors.background,
    fontWeight: Theme.typography.weights.bold,
    fontSize: 14,
  },
});
