import React from "react";
import { View, Text, Pressable, Alert, Share } from "react-native";
import { MoreVertical, Trash2, Edit2, Share2, Flag } from "lucide-react-native";
import { styles } from "./CommentStyles";

export function CommentMenu({
  c,
  isMe,
  showMenu,
  setShowMenu,
  setEditingId,
  setEditDraft,
  onDelete,
}: any) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Komentar @${c.username} di OrcAnime: "${c.text}"`,
        url: "https://orcanime.com",
      });
      setShowMenu(false);
    } catch (e) {}
  };

  const handleReport = () => {
    Alert.alert(
      "Laporkan Komentar",
      "Apakah komentar ini melanggar peraturan (Spam/Spoiler/Hate)?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Laporkan",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Berhasil",
              "Laporan Anda telah terkirim ke moderator.",
            ),
        },
      ],
    );
    setShowMenu(false);
  };

  if (c.id >= 2147483647) return null;

  return (
    <View style={styles.menuAnchor}>
      <Pressable onPress={() => setShowMenu(!showMenu)} hitSlop={10}>
        <MoreVertical color="#8e8e93" size={14} />
      </Pressable>
      {showMenu && (
        <View style={styles.popupMenu}>
          {isMe ? (
            <>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setEditingId(c.id);
                  setEditDraft(c.text);
                  setShowMenu(false);
                }}
              >
                <Edit2 color="white" size={12} />
                <Text style={styles.menuItemText}>Edit</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert("Hapus", "Yakin?", [
                    { text: "Batal" },
                    { text: "Hapus", onPress: () => onDelete(c.id) },
                  ]);
                  setShowMenu(false);
                }}
              >
                <Trash2 color="#ff3b30" size={12} />
                <Text style={[styles.menuItemText, { color: "#ff3b30" }]}>
                  Hapus
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.menuItem} onPress={handleReport}>
              <Flag color="#ff3b30" size={12} />
              <Text style={[styles.menuItemText, { color: "#ff3b30" }]}>
                Laporkan
              </Text>
            </Pressable>
          )}
          <Pressable style={styles.menuItem} onPress={handleShare}>
            <Share2 color="white" size={12} />
            <Text style={styles.menuItemText}>Bagikan</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
