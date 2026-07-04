import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Search, X, ArrowLeft } from "lucide-react-native";
import { Theme } from "../../../lib/theme";

export function ExploreHeader({
  insets,
  router,
  query,
  setQuery,
  genre,
  sort,
  handleSortChange,
  clearSearch,
  inputRef,
  addSearchTerm,
}: any) {
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={Theme.colors.text} />
        </Pressable>
        <View style={styles.searchBox}>
          <Search
            size={18}
            color="rgba(255,255,255,0.4)"
            style={{ marginLeft: 12 }}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Ketik judul anime..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (query) addSearchTerm(query);
            }}
          />
          {(query.length > 0 || genre.length > 0) && (
            <Pressable onPress={clearSearch} style={styles.clearBtn}>
              <X size={14} color="rgba(255,255,255,0.8)" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ paddingBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScroll}
        >
          {[
            { id: "popularity", label: "Populer" },
            { id: "trending", label: "Sedang Tren" },
            { id: "score", label: "Tertinggi" },
            { id: "a-z", label: "A-Z" },
            { id: "z-a", label: "Z-A" },
          ].map((sObj) => (
            <Pressable
              key={sObj.id}
              onPress={() => handleSortChange(sObj.id)}
              style={({ pressed }) => [
                styles.sortPill,
                sort === sObj.id && styles.sortPillActive,
                pressed && styles.sortPillPressed,
              ]}
            >
              <Text
                style={[
                  styles.sortPillText,
                  sort === sObj.id && styles.sortPillTextActive,
                ]}
              >
                {sObj.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "rgba(19,17,26,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    zIndex: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 22,
    height: 44,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    color: Theme.colors.text,
    fontSize: 16,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sortScroll: { paddingHorizontal: 16, gap: 8 },
  sortPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.colors.surface2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sortPillActive: {
    backgroundColor: "rgba(10, 132, 255, 0.15)",
    borderColor: "rgba(10, 132, 255, 0.5)",
  },
  sortPillPressed: { opacity: 0.8 },
  sortPillText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  sortPillTextActive: { color: Theme.colors.primary },
});
