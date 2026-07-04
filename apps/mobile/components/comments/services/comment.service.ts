import { fetchWithAuth } from "../../../lib/fetcher";
import { HF_API_URL } from "../../../lib/config";

export const commentService = {
  post: (data: {
    user_id: string;
    anilistId: string;
    episodeNumber: number;
    text: string;
    parent_id?: number | null;
  }) =>
    fetchWithAuth(`${HF_API_URL}/api/v2/comments`, {
      method: "POST",
      body: JSON.stringify({ ...data, timestamp_sec: 0 }),
    }),

  edit: (commentId: number, user_id: string, text: string) =>
    fetchWithAuth(`${HF_API_URL}/api/v2/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ user_id, text }),
    }),

  delete: (commentId: number, user_id: string) =>
    fetchWithAuth(
      `${HF_API_URL}/api/v2/comments/${commentId}?user_id=${user_id}`,
      {
        method: "DELETE",
      },
    ),

  toggleLike: (commentId: number, user_id: string) =>
    fetchWithAuth(`${HF_API_URL}/api/v2/comments/reaction`, {
      method: "POST",
      body: JSON.stringify({ comment_id: commentId, user_id, emoji: "🔥" }),
    }),
};
