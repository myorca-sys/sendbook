import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Trash2, ShieldCheck } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function SettingsAccountSection({ onClearCache, onSignOut }: any) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ShieldCheck size={16} color={Theme.colors.primary} />
        <Text style={styles.sectionTitle}>Akun & Data</Text>
      </View>

      <Pressable style={styles.menuItem} onPress={onClearCache}>
        <View
          style={[
            styles.menuIcon,
            { backgroundColor: "rgba(255,255,255,0.05)" },
          ]}
        >
          <Trash2 size={18} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuText}>Hapus Cache Aplikasi</Text>
          <Text style={styles.menuSubtext}>
            Membersihkan data sementara dan gambar yang tersimpan.
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.menuItem, { marginTop: 12 }]}
        onPress={onSignOut}
      >
        <View
          style={[styles.menuIcon, { backgroundColor: "rgba(255,59,48,0.1)" }]}
        >
          <ShieldCheck size={18} color="#FF3B30" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>
            Keluar Akun
          </Text>
          <Text style={styles.menuSubtext}>
            Kamu harus login kembali untuk mengakses koleksi.
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 36 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtext: { color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 16 },
});
