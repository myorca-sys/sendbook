import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LogOut, ChevronRight, Shield, MonitorPlay } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function ProfileMenu({
  user,
  onClearCache,
  onSignOut,
  preferredResolution = "720p",
  onChangeResolution,
}: {
  user: any;
  onClearCache: () => void;
  onSignOut: () => void;
  preferredResolution?: string;
  onChangeResolution?: () => void;
}) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>Sistem</Text>
      <View style={styles.menuCard}>
        <Pressable
          onPress={onChangeResolution}
          style={({ pressed }) => [
            styles.menuItem,
            styles.menuItemBorder,
            pressed && styles.menuItemPressed,
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <MonitorPlay size={16} color={Theme.colors.text} />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Resolusi Video Default</Text>
              <Text style={styles.menuItemSubtitle}>
                Pilih kualitas streaming otomatis
              </Text>
            </View>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={styles.menuItemValue}>{preferredResolution}</Text>
            <ChevronRight size={18} color={Theme.colors.textDim} />
          </View>
        </Pressable>
        <Pressable
          onPress={onClearCache}
          style={({ pressed }) => [
            styles.menuItem,
            styles.menuItemBorder,
            pressed && styles.menuItemPressed,
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <Shield size={16} color={Theme.colors.text} />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Hapus Cache Lokal</Text>
              <Text style={styles.menuItemSubtitle}>
                Reset data perangkat untuk performa
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color={Theme.colors.textDim} />
        </Pressable>
        {user && (
          <Pressable
            onPress={onSignOut}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "rgba(255, 59, 48, 0.1)" },
                ]}
              >
                <LogOut size={16} color={Theme.colors.danger} />
              </View>
              <Text
                style={[styles.menuItemTitle, { color: Theme.colors.danger }]}
              >
                Keluar Akun
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: { marginBottom: 24 },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: Theme.typography.weights.semibold,
    color: Theme.colors.textDim,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  menuItemPressed: { backgroundColor: Theme.colors.borderHighlight },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  menuItemValue: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.weights.bold,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.surface2,
  },
  menuItemTitle: {
    fontWeight: Theme.typography.weights.medium,
    fontSize: 15,
    color: Theme.colors.text,
  },
  menuItemSubtitle: { fontSize: 12, color: Theme.colors.textDim, marginTop: 2 },
});
