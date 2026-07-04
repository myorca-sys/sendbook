import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Theme } from "../../../lib/theme";

export function CollectionHeader({ activeTab, onTabPress, TABS, user }: any) {
  return (
    <View style={styles.headerFixed}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Koleksi</Text>
      </View>
      {user && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((tab: any, index: number) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => onTabPress(index, tab.id)}
                style={styles.tabButton}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeTabIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerFixed: {
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: Theme.colors.background,
    zIndex: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  tabButton: { position: "relative", paddingVertical: 8 },
  activeTabIndicator: {
    position: "absolute",
    bottom: -11,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Theme.colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.4)" },
  tabTextActive: { color: Theme.colors.text },
});
