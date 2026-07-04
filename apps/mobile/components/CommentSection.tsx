import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
} from "react-native";

import { useComments } from "./comments/hooks/useComments";
import { CommentList } from "./comments/ui/CommentList";
import { CommentComposer } from "./comments/ui/CommentComposer";
import { CommentHeader } from "./comments/ui/CommentHeader";
import { ThreadView } from "./comments/ui/ThreadView";
import { storage } from "../lib/storage";
import { FEATURE_FLAGS } from "../lib/config/features";

interface CommentProps {
  mediaId?: string; // New UUID-based identifier
  anilistId: string;
  episode: string;
  user: any;
  onClose: () => void;
  visible: boolean;
  isFullscreen?: boolean;
  ListHeaderComponent?: React.ReactNode;
}

export function CommentSection({
  mediaId,
  anilistId,
  episode,
  user,
  onClose,
  visible,
  isFullscreen = false,
  ListHeaderComponent,
}: CommentProps) {
  const commentIdentifier = mediaId || anilistId; // Migration Bridge

  const [focusedThreadId, setFocusedThreadId] = useState<number | null>(() => {
    try {
      return storage.getNumber(`focused_thread_${commentIdentifier}_${episode}`) || null;
    } catch (e) {
      return null;
    }
  });

  const composerRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const threadKey = `focused_thread_${commentIdentifier}_${episode}`;
    if (focusedThreadId) storage.set(threadKey, focusedThreadId);
    else (storage as any).delete?.(threadKey) || (storage as any).remove?.(threadKey);
  }, [focusedThreadId]);

  useEffect(() => {
    const onBackPress = () => {
      if (focusedThreadId) {
        setFocusedThreadId(null);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [focusedThreadId]);

  const {
    comments,
    isLoading,
    sortBy,
    setSortBy,
    text,
    setText,
    isSubmitting,
    replyingTo,
    setReplyingTo,
    handlePostComment,
    handleLikeComment,
    handleDeleteComment,
    handleEditComment,
  } = useComments(commentIdentifier, episode, user, visible);

  if (!visible && isFullscreen) return null;

  const focusedComment = focusedThreadId ? comments.find((c) => c.id === focusedThreadId) : null;

  const onReply = (id: number, username: string) => {
    setReplyingTo({ id, username });
    setTimeout(() => composerRef.current?.focus(), 100);
  };

  if (!FEATURE_FLAGS.ENABLE_COMMENTS) {
    if (isFullscreen) return null;
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0812" }}>
        {!isFullscreen && ListHeaderComponent}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, isFullscreen ? styles.fullscreenContainer : { flex: 1 }]}>
        <View style={styles.layersContainer}>
          <View
            style={[StyleSheet.absoluteFill, { opacity: focusedThreadId ? 0 : 1 }]}
            pointerEvents={focusedThreadId ? "none" : "auto"}
          >
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              stickyHeaderIndices={[isFullscreen ? 0 : ListHeaderComponent ? 1 : 0]}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {!isFullscreen && ListHeaderComponent}
              <CommentHeader
                count={comments.length}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isFullscreen={isFullscreen}
                onClose={onClose}
              />
              <CommentList
                comments={comments}
                isLoading={isLoading}
                user={user}
                onLike={handleLikeComment}
                onReply={onReply}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                onViewThread={(id) => setFocusedThreadId(id)}
                isThreadView={false}
              />
            </ScrollView>
          </View>

          <ThreadView
            focusedComment={focusedComment}
            user={user}
            onBack={() => setFocusedThreadId(null)}
            onLike={handleLikeComment}
            onReply={onReply}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        </View>

        <View style={styles.composerWrapper}>
          <CommentComposer
            ref={composerRef}
            user={user}
            text={text}
            setText={setText}
            isSubmitting={isSubmitting}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            onSubmit={handlePostComment}
            isFullscreen={isFullscreen}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0c10" },
  fullscreenContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: "#0a0c10",
    borderLeftWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    zIndex: 9999,
  },
  layersContainer: { flex: 1, position: "relative" },
  composerWrapper: {
    backgroundColor: "#0a0812",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
});
