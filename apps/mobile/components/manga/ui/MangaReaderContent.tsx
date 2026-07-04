import React from "react";
import { View, StyleSheet, ActivityIndicator, Pressable, Text, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
const FlashListAny = FlashList as any;
import { Theme } from "../../../lib/theme";
import { AutoHeightImage } from "../AutoHeightImage";

interface MangaReaderContentProps {
  loading: boolean;
  error: boolean;
  images: string[];
  controlsVisible: boolean;
  toggleControls: (force?: boolean) => void;
  onViewableItemsChanged: any;
  viewabilityConfig: any;
}

export function MangaReaderContent({
  loading,
  error,
  images,
  controlsVisible,
  toggleControls,
  onViewableItemsChanged,
  viewabilityConfig,
}: MangaReaderContentProps) {
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable onPress={() => toggleControls()}>
      <AutoHeightImage uri={item} isFirst={index < 3} />
    </Pressable>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Menyiapkan halaman...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Tidak dapat memuat halaman</Text>
          <Text style={styles.errorSubText}>Silakan periksa koneksi Anda dan coba lagi.</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashListAny
            data={images}
            keyExtractor={(item: any, index: number) => String(index)}
            renderItem={renderItem}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            estimatedItemSize={Dimensions.get("window").width * 1.5}
            bounces={false}
            onScrollBeginDrag={() => {
              if (controlsVisible) toggleControls(false);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 0 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 16,
    fontWeight: "600",
    fontSize: 13,
  },
  errorText: {
    color: Theme.colors.danger,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorSubText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
