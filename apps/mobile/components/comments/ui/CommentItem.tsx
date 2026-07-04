import React from "react";
import { View, Text, Pressable } from "react-native";
import { Heart, ThumbsDown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { styles } from "./CommentStyles";
import { CommentMenu } from "./CommentMenu";
import { CommentAvatar } from "./CommentAvatar";
import { CommentEditBox } from "./CommentEditBox";
import { CommentRichText } from "./CommentRichText";
import { CommentReplies } from "./CommentReplies";
import { useCommentActions } from "../hooks/useCommentActions";

interface CommentItemProps {
  c: any;
  user: any;
  isReply?: boolean;
  rootId?: number;
  isBait?: boolean;
  isLastReply?: boolean;
  isThreadView?: boolean;
  hideReplies?: boolean;
  onLike: (id: number, currentlyLiked: boolean) => void;
  onReply: (id: number, username: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onViewThread?: (id: number) => void;
  onLayout?: (e: any) => void;
  renderComment: (
    c: any,
    isReply?: boolean,
    rootId?: number,
    isBait?: boolean,
    isLastReply?: boolean,
  ) => React.ReactNode;
}

export function CommentItem({
  c,
  user,
  isReply,
  rootId,
  isBait,
  isLastReply,
  isThreadView,
  hideReplies,
  onLike,
  onReply,
  onDelete,
  onEdit,
  onViewThread,
  onLayout,
  renderComment,
}: CommentItemProps) {
  const router = useRouter();
  const {
    editingId,
    setEditingId,
    editDraft,
    setEditDraft,
    showMenu,
    setShowMenu,
    localDisliked,
    isMe,
    handleLike,
    toggleDislike,
  } = useCommentActions(c, user, onLike);

  const hasReplies = !isReply && c.replies && c.replies.length > 0;
  const threadId = isReply ? rootId : c.id;

  const navigateToProfile = () => {
    if (c.user_id) router.push(`/user/${c.user_id}` as any);
  };

  let baitReply = null;
  let remainingReplies = [];
  const areRepliesExpanded = isThreadView;

  if (hasReplies && !areRepliesExpanded && !isThreadView) {
    const sorted = [...c.replies].sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
    if ((sorted[0].reactions || 0) > 0 || sorted[0].user_id === c.user_id) baitReply = sorted[0];
  }

  if (hasReplies && areRepliesExpanded) {
    remainingReplies = [...c.replies].sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
  }

  return (
    <View
      onLayout={onLayout}
      style={[styles.commentRow, isReply && styles.replyRow, isBait && styles.baitReplyRow]}
    >
      {isReply && <View style={styles.replyLine} />}
      {!isReply && hasReplies && areRepliesExpanded && <View style={styles.mainThreadLine} />}

      <CommentAvatar
        avatar={c.avatar}
        username={c.username}
        isReply={isReply}
        onPress={navigateToProfile}
      />

      <View style={styles.commentMain}>
        <View style={styles.commentBodyWrapper}>
          <View style={styles.commentContent}>
            <View style={styles.usernameRow}>
              <Pressable onPress={navigateToProfile}>
                <Text
                  style={[
                    styles.commentUsername,
                    isMe && styles.commentUsernameMe,
                    isReply && styles.replyUsername,
                  ]}
                >
                  {c.username} {isMe && <Text style={styles.authorBadge}>Author</Text>}
                </Text>
              </Pressable>
              <CommentMenu
                c={c}
                isMe={isMe}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                setEditingId={setEditingId}
                setEditDraft={setEditDraft}
                onDelete={onDelete}
              />
            </View>

            {editingId === c.id ? (
              <CommentEditBox
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                setEditingId={setEditingId}
                setShowMenu={setShowMenu}
                onEdit={onEdit}
                commentId={c.id}
              />
            ) : (
              <CommentRichText text={c.text} isReply={isReply} />
            )}

            <View style={styles.commentFooter}>
              <Text style={styles.commentDate}>
                {new Date(c.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
              <Pressable onPress={() => onReply(threadId!, c.username)} hitSlop={10}>
                <Text style={styles.replyBtnText}>Balas</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.likeContainer}>
            <Pressable style={styles.likeButton} onPress={handleLike} hitSlop={10}>
              <Heart
                color={c.user_liked || c.reactions > 0 ? "#ff2d55" : "#8e8e93"}
                size={isReply ? 14 : 16}
                fill={c.user_liked || c.reactions > 0 ? "#ff2d55" : "none"}
              />
              <Text style={[styles.likeCountText, isReply && styles.replyLikeCount]}>
                {c.reactions || c.likes_count || "0"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.likeButton, { marginTop: 8 }]}
              onPress={toggleDislike}
              hitSlop={10}
            >
              <ThumbsDown color={localDisliked ? "#0a84ff" : "#8e8e93"} size={isReply ? 14 : 16} />
            </Pressable>
          </View>
        </View>

        <CommentReplies
          c={c}
          hasReplies={hasReplies}
          baitReply={baitReply}
          isThreadView={isThreadView}
          hideReplies={hideReplies}
          areRepliesExpanded={!!areRepliesExpanded}
          remainingReplies={remainingReplies}
          onViewThread={onViewThread}
          renderComment={renderComment}
        />
      </View>
    </View>
  );
}
