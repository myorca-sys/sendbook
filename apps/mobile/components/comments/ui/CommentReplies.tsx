import React from "react";
import { View, Pressable, Text } from "react-native";
import { styles } from "./CommentStyles";

interface CommentRepliesProps {
  c: any;
  hasReplies: boolean;
  baitReply: any;
  isThreadView?: boolean;
  hideReplies?: boolean;
  areRepliesExpanded: boolean;
  remainingReplies: any[];
  onViewThread?: (id: number) => void;
  renderComment: (
    c: any,
    isReply?: boolean,
    rootId?: number,
    isBait?: boolean,
    isLastReply?: boolean,
  ) => React.ReactNode;
}

export function CommentReplies({
  c,
  hasReplies,
  baitReply,
  isThreadView,
  hideReplies,
  areRepliesExpanded,
  remainingReplies,
  onViewThread,
  renderComment,
}: CommentRepliesProps) {
  if (hideReplies) return null;

  return (
    <>
      {baitReply && !isThreadView && (
        <View style={styles.repliesList}>{renderComment(baitReply, true, c.id, true, true)}</View>
      )}

      {hasReplies && (
        <View style={styles.repliesSection}>
          {!isThreadView && (
            <Pressable
              style={styles.viewRepliesButton}
              onPress={() => onViewThread?.(c.id)}
              hitSlop={10}
            >
              <View style={styles.viewRepliesLine} />
              <Text style={styles.viewRepliesText}>
                {baitReply && c.replies.length > 1
                  ? `Lihat balasan lainnya (${c.replies.length - 1})`
                  : `Lihat balasan (${c.replies.length})`}
              </Text>
            </Pressable>
          )}
          {isThreadView && <View style={styles.threadSeparator} />}
          {areRepliesExpanded && (
            <View style={styles.repliesList}>
              {remainingReplies.map((reply: any, index: number) =>
                renderComment(reply, true, c.id, false, index === remainingReplies.length - 1),
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
}
