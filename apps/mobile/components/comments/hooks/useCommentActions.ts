import { useState } from "react";

export function useCommentActions(
  c: any,
  user: any,
  onLike: (id: number, currentlyLiked: boolean) => void,
) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [localDisliked, setLocalDisliked] = useState(false);

  const isMe = user && c.user_id === user.id;

  const handleLike = () => {
    if (c.id <= 2147483647) {
      onLike(c.id, c.user_liked || (c.reactions > 0 && isMe));
    }
  };

  const toggleDislike = () => {
    setLocalDisliked(!localDisliked);
  };

  return {
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
  };
}
