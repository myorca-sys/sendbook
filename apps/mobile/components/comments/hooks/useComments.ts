import { useState } from "react";
import { storage } from "../../../lib/storage";
import { commentService } from "../services/comment.service";
import { useCommentsData } from "./useCommentsData";

export function useComments(
  anilistId: string,
  episode: string,
  user: any,
  visible: boolean,
) {
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: number;
    username: string;
  } | null>(null);

  const {
    comments,
    isLoading,
    mutate,
    queryKey,
    queryClient,
    localLikesKey,
    likedCommentIds,
  } = useCommentsData(anilistId, episode, sortBy, visible, user);

  const handlePostComment = async () => {
    if (!user || !text.trim() || isSubmitting) return;
    const textToSubmit = replyingTo
      ? `@${replyingTo.username} ${text.trim()}`
      : text.trim();
    const newComment = {
      id: Date.now(),
      user_id: user.id,
      username: user.name || "User",
      avatar: user.image || user.picture || "",
      text: textToSubmit,
      created_at: new Date().toISOString(),
      likes_count: 0,
      reply_count: 0,
      replies: [],
      parent_id: replyingTo ? replyingTo.id : null,
    };

    queryClient.setQueryData(queryKey, (prev: any) => {
      const current = Array.isArray(prev) ? prev : [];
      if (replyingTo)
        return current.map((c: any) =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c,
        );
      return [newComment, ...current];
    });

    setIsSubmitting(true);
    setText("");
    setReplyingTo(null);
    try {
      const res = await commentService.post({
        user_id: user.id,
        anilistId: String(anilistId),
        episodeNumber: parseFloat(episode),
        text: textToSubmit,
        parent_id: newComment.parent_id,
      });
      if (!res.ok) mutate();
      else mutate();
    } catch (e) {
      mutate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (
    commentId: number,
    currentlyLiked: boolean,
  ) => {
    if (!user) return;
    storage.set(
      localLikesKey!,
      JSON.stringify(
        currentlyLiked
          ? likedCommentIds.filter((id: number) => id !== commentId)
          : [...likedCommentIds, commentId],
      ),
    );

    queryClient.setQueryData(queryKey, (prev: any) => {
      const update = (c: any): any =>
        c.id === commentId
          ? {
              ...c,
              likes_count: currentlyLiked
                ? Math.max((c.likes_count || 0) - 1, 0)
                : (c.likes_count || 0) + 1,
            }
          : c.replies
            ? { ...c, replies: c.replies.map(update) }
            : c;
      return (Array.isArray(prev) ? prev : []).map(update);
    });

    try {
      const res = await commentService.toggleLike(commentId, user.id);
      if (!res.ok) throw new Error();
      mutate();
    } catch (e) {
      storage.set(
        localLikesKey!,
        JSON.stringify(
          currentlyLiked
            ? [...likedCommentIds, commentId]
            : likedCommentIds.filter((id: number) => id !== commentId),
        ),
      );
      mutate();
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (user && (await commentService.delete(id, user.id)).ok) mutate();
  };
  const handleEditComment = async (id: number, t: string) => {
    if (user && (await commentService.edit(id, user.id, t)).ok) mutate();
  };

  return {
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
  };
}
