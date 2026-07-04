import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Bookmark, RefreshCcw } from "lucide-react-native";
import { Skeleton } from "../Skeleton";
import { CollectionGrid } from "./CollectionGrid";
import { HistoryList } from "./HistoryList";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const TabPage = React.memo(
  ({ item, itemWidth, user, signInWithGoogle }: any) => {
    return (
      <View style={{ width: WINDOW_WIDTH }}>
        {!user ? (
          <View style={styles.scrollContent}>
            <View style={styles.emptyState}>
              <View style={styles.iconCircle}>
                <Bookmark size={36} color="white" />
              </View>
              <Text style={styles.emptyTitle}>Silakan Login</Text>
              <Text style={styles.emptyDesc}>
                Masuk untuk menyimpan koleksi dan menyinkronkan riwayat tontonan
                Anda.
              </Text>
              <Pressable onPress={signInWithGoogle} style={styles.loginButton}>
                <Text style={styles.loginText}>Lanjutkan dengan Google</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContainer}
          >
            {item.isLoading ? (
              item.type === "collection" ? (
                <View style={styles.gridList}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <View
                      key={i}
                      style={{ width: itemWidth, marginBottom: 16 }}
                    >
                      <Skeleton
                        w="100%"
                        h={itemWidth * 1.5}
                        r={16}
                        style={{ marginBottom: 8 }}
                      />
                      <Skeleton
                        w="90%"
                        h={14}
                        r={6}
                        style={{ marginBottom: 4 }}
                      />
                      <Skeleton w="60%" h={14} r={6} />
                    </View>
                  ))}
                </View>
              ) : (
                <View>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View
                      key={i}
                      style={[styles.historyItemRow, { marginBottom: 20 }]}
                    >
                      <Skeleton
                        w={48}
                        h={64}
                        r={8}
                        style={{ marginRight: 16 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Skeleton
                          w="80%"
                          h={16}
                          r={6}
                          style={{ marginBottom: 8 }}
                        />
                        <Skeleton w="40%" h={12} r={4} />
                      </View>
                    </View>
                  ))}
                </View>
              )
            ) : item.error ? (
              <View style={styles.emptyState}>
                <Text style={styles.errorText}>Koneksi Bermasalah</Text>
                <Text style={styles.emptyDesc}>
                  Pastikan perangkat terhubung ke internet.
                </Text>
                <Pressable onPress={item.mutate} style={styles.retryButton}>
                  <RefreshCcw size={14} color="white" />
                  <Text style={styles.retryText}>Muat Ulang</Text>
                </Pressable>
              </View>
            ) : item.type === "collection" ? (
              <CollectionGrid items={item.data} itemWidth={itemWidth} />
            ) : (
              <HistoryList items={item.data} />
            )}
          </ScrollView>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingBottom: 120,
    paddingTop: 16,
  },
  emptyState: {
    paddingVertical: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    backgroundColor: "#0A84FF",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptyDesc: {
    color: "#8e8e93",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  loginText: {
    color: "#0a0812",
    fontWeight: "800",
    fontSize: 15,
  },
  errorText: {
    color: "#FF453A",
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "700",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    marginTop: 16,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  gridList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  historyItemRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
});
