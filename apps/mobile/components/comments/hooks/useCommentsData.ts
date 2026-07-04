import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HF_API_URL } from "../../../lib/config";
import { fetcher } from "../../../lib/fetcher";
import { storage } from "../../../lib/storage";

export function useCommentsData(
  anilistId: string,
  episode: string,
  sortBy: string,
  visible: boolean,
  user: any,
) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", anilistId, episode, sortBy];

  const {
    data: allComments = [],
    isLoading,
    refetch: mutate,
  } = useQuery({
    queryKey,
    queryFn: () =>
      fetcher(
        `${HF_API_URL}/api/v2/comments?anilistId=${encodeURIComponent(anilistId)}&episodeNumber=${encodeURIComponent(episode)}&sort_by=${sortBy}`,
      ),
    enabled: visible,
    refetchInterval: visible ? 5000 : false,
  });

  const localLikesKey = user ? `likes_${user.id}` : null;
  const likedCommentIds = localLikesKey
    ? JSON.parse(storage.getString(localLikesKey) || "[]")
    : [];

  const attachLikes = (c: any): any => ({
    ...c,
    reactions: c.likes_count ?? c.reactions ?? 0,
    user_liked: likedCommentIds.includes(c.id),
    replies: (c.replies || []).map(attachLikes),
  });

  const comments = Array.isArray(allComments)
    ? allComments.map(attachLikes).filter((c: any) => !c.parent_id)
    : [];

  return {
    comments,
    isLoading,
    mutate,
    queryKey,
    queryClient,
    localLikesKey,
    likedCommentIds,
  };
}
