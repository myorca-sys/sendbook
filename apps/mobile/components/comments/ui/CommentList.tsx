import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: any[];
  isLoading: boolean;
  user: any;
  onLike: (id: number, currentlyLiked: boolean) => void;
  onReply: (id: number, username: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onViewThread?: (id: number) => void;
  onLayoutComment?: (id: number, y: number) => void;
  isThreadView?: boolean;
  hideRepliesInItem?: boolean;
}

export function CommentList({
  comments,
  isLoading,
  user,
  onLike,
  onReply,
  onDelete,
  onEdit,
  onViewThread,
  onLayoutComment,
  isThreadView,
  hideRepliesInItem,
}: CommentListProps) {
  const renderComment = (
    c: any,
    isReply = false,
    rootId?: number,
    isBait = false,
    isLastReply = false,
  ) => {
    return (
      <CommentItem
        key={c.id}
        c={c}
        user={user}
        isReply={isReply}
        rootId={rootId}
        isBait={isBait}
        isLastReply={isLastReply}
        isThreadView={isThreadView}
        hideReplies={hideRepliesInItem}
        onLike={onLike}
        onReply={onReply}
        onDelete={onDelete}
        onEdit={onEdit}
        onViewThread={onViewThread}
        onLayout={(e) => {
          if (!isReply && !isThreadView && onLayoutComment) {
            onLayoutComment(c.id, e.nativeEvent.layout.y);
          }
        }}
        renderComment={renderComment}
      />
    );
  };

  return (
    <View style={styles.listContainer}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#0A84FF" style={styles.loader} />
      ) : comments.length > 0 ? (
        comments.map((c: any) => renderComment(c))
      ) : (
        <Text style={styles.emptyText}>Jadilah yang pertama berkomentar!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16, paddingTop: 8 },
  loader: { marginTop: 40 },
  emptyText: {
    color: "#8e8e93",
    textAlign: "center",
    marginTop: 40,
    fontWeight: "500",
  },
});
