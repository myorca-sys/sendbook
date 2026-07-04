import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { CommentList } from "./CommentList";

interface ThreadViewProps {
  focusedComment: any;
  user: any;
  onBack: () => void;
  onLike: (id: number, liked: boolean) => void;
  onReply: (id: number, username: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export function ThreadView({
  focusedComment,
  user,
  onBack,
  onLike,
  onReply,
  onDelete,
  onEdit,
}: ThreadViewProps) {
  if (!focusedComment) return null;

  return (
    <View style={styles.layerThread}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0, 1]}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
            <ChevronLeft color="white" size={24} />
            <Text style={styles.headerTitle}>Balasan</Text>
          </Pressable>
        </View>

        <View style={styles.stickyParentContainer}>
          <CommentList
            comments={[focusedComment]}
            isLoading={false}
            user={user}
            onLike={onLike}
            onReply={onReply}
            onDelete={onDelete}
            onEdit={onEdit}
            isThreadView={false}
            hideRepliesInItem={true}
          />
        </View>

        <CommentList
          comments={focusedComment.replies || []}
          isLoading={false}
          user={user}
          onLike={onLike}
          onReply={onReply}
          onDelete={onDelete}
          onEdit={onEdit}
          isThreadView={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layerThread: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: "#0a0c10",
    zIndex: 10,
  },
  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#0a0c10",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: { flexDirection: "row", alignItems: "center", marginLeft: -4, gap: 4 },
  headerTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  stickyParentContainer: {
    backgroundColor: "#0a0c10",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
});
