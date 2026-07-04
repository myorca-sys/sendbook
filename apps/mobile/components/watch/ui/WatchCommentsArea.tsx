import React from "react";
import { View } from "react-native";
import { CommentSection } from "../../../components/CommentSection";
import { WatchListHeader } from "./WatchListHeader";
import { WatchSkeleton } from "./WatchSkeleton";

export function WatchCommentsArea({
  anime,
  id,
  episode,
  user,
  setShowComments,
  displayTitle,
  poster,
  realViews,
  likesCount,
  isLiked,
  episodes,
  handleShare,
  handleToggleLike,
  handleReport,
  handleEpisodeChange,
  isFullscreen,
  showComments,
}: any) {
  if (!isFullscreen) {
    return (
      <View style={{ flex: 1 }}>
        {anime ? (
          <CommentSection
            anilistId={String(id)}
            episode={String(episode)}
            user={user}
            visible={true}
            onClose={() => setShowComments(false)}
            isFullscreen={false}
            ListHeaderComponent={
              <WatchListHeader
                id={String(id)}
                episode={String(episode)}
                displayTitle={displayTitle}
                poster={poster}
                realViews={realViews}
                likesCount={likesCount}
                isLiked={isLiked}
                episodes={episodes}
                handleShare={handleShare}
                handleToggleLike={handleToggleLike}
                handleReport={handleReport}
                handleEpisodeChange={handleEpisodeChange}
              />
            }
          />
        ) : (
          <WatchSkeleton />
        )}
      </View>
    );
  }

  if (isFullscreen && showComments) {
    return (
      <CommentSection
        anilistId={String(id)}
        episode={String(episode)}
        user={user}
        visible={true}
        onClose={() => setShowComments(false)}
        isFullscreen={true}
      />
    );
  }

  return null;
}
