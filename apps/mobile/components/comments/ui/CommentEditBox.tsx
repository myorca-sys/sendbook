import React from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { styles } from "./CommentStyles";

interface CommentEditBoxProps {
  editDraft: string;
  setEditDraft: (val: string) => void;
  setEditingId: (val: number | null) => void;
  setShowMenu: (val: boolean) => void;
  onEdit: (id: number, text: string) => void;
  commentId: number;
}

export function CommentEditBox({
  editDraft,
  setEditDraft,
  setEditingId,
  setShowMenu,
  onEdit,
  commentId,
}: CommentEditBoxProps) {
  return (
    <View style={styles.editContainer}>
      <TextInput
        style={styles.editInput}
        value={editDraft}
        onChangeText={setEditDraft}
        multiline
        autoFocus
      />
      <View style={styles.editActions}>
        <Pressable onPress={() => setEditingId(null)}>
          <Text style={styles.editCancelText}>Batal</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (editDraft.trim()) onEdit(commentId, editDraft.trim());
            setEditingId(null);
            setShowMenu(false);
          }}
        >
          <Text style={styles.editSaveText}>Simpan</Text>
        </Pressable>
      </View>
    </View>
  );
}
