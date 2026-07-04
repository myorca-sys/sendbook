import React from "react";
import { View, Pressable, Modal, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "../../../lib/theme";
import { CommentSection } from "../../CommentSection";
import { MediaEpisodes } from "../../media-detail/sections/MediaEpisodes";

interface MangaModalsProps {
  user: any;
  mangaId: string;
  sourceId: string;
  title: string;
  img: string;
  chapter: string;
  episodes: any[];
  insetsBottom: number;
  isListVisible: boolean;
  setIsListVisible: (visible: boolean) => void;
  isCommentsVisible: boolean;
  setIsCommentsVisible: (visible: boolean) => void;
}

export function MangaModals({
  user,
  mangaId,
  sourceId,
  title,
  img,
  chapter,
  episodes,
  insetsBottom,
  isListVisible,
  setIsListVisible,
  isCommentsVisible,
  setIsCommentsVisible,
}: MangaModalsProps) {
  const router = useRouter();
  const match = String(chapter).match(/[\d.]+/);
  const epNum = match ? match[0] : "1";

  return (
    <>
      {/* Chapter List Modal */}
      <Modal
        visible={isListVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsListVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsListVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { paddingBottom: insetsBottom }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dragIndicator} />
            <MediaEpisodes
              mediaId={String(mangaId)}
              mediaType="manga"
              rawEps={episodes}
              activeEpisode={String(chapter)}
              onEpisodePress={(ep: string) => {
                setIsListVisible(false);
                const targetEp = episodes.find(
                  (e: any) => String(e.episodeNumber || e.number) === ep,
                );
                if (targetEp) {
                  router.replace({
                    pathname: "/manga/read",
                    params: {
                      link: encodeURIComponent(targetEp.link || targetEp.url),
                      sourceId: targetEp.providerId || sourceId,
                      mangaId,
                      title,
                      img,
                      chapter: String(
                        targetEp.episodeNumber || targetEp.number,
                      ),
                    },
                  });
                }
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={isCommentsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCommentsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCommentsVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { paddingBottom: insetsBottom }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dragIndicator} />
            <CommentSection
              anilistId={String(mangaId)}
              episode={epNum}
              user={user}
              visible={isCommentsVisible}
              onClose={() => setIsCommentsVisible(false)}
              isFullscreen={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Theme.colors.background,
    height: "75%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
});
