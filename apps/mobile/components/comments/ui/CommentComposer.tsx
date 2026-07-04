import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Heart, Send, X } from "lucide-react-native";
import { styles } from "./CommentComposerStyles";

const EMOJIS = ["😂", "😍", "😭", "🔥", "🤔", "👍", "🙏", "🤯"];

interface CommentComposerProps {
  user: any;
  text: string;
  setText: (text: string | ((prev: string) => string)) => void;
  isSubmitting: boolean;
  replyingTo: { id: number; username: string } | null;
  setReplyingTo: (reply: { id: number; username: string } | null) => void;
  onSubmit: () => void;
  isFullscreen?: boolean;
}

export const CommentComposer = forwardRef(
  (
    {
      user,
      text,
      setText,
      isSubmitting,
      replyingTo,
      setReplyingTo,
      onSubmit,
      isFullscreen,
    }: CommentComposerProps,
    ref,
  ) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const handleKeyPress = ({ nativeEvent }: any) => {
      if (nativeEvent.key === "Backspace" && text === "" && replyingTo) setReplyingTo(null);
    };

    return (
      <View
        style={[
          styles.composerWrapper,
          !isFullscreen && { paddingBottom: 16, backgroundColor: "#0a0812" },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.emojiRow}
          contentContainerStyle={styles.emojiContent}
        >
          {EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => setText((prev) => prev + emoji)}
              style={styles.emojiBtn}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.composerContainer}>
          {user && (
            <View style={styles.composerAvatar}>
              {user.picture || user.image ? (
                <Image
                  source={{
                    uri:
                      typeof (user.picture || user.image) === "string"
                        ? user.picture || user.image
                        : "https://api.dicebear.com/7.x/notionists/svg",
                  }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              ) : (
                <Text style={styles.composerAvatarFallback}>
                  {(user.name || "U").charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          <View style={styles.inputWrapper}>
            {replyingTo && (
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>{replyingTo.username}</Text>
                <View style={styles.tagSpace} />
              </View>
            )}

            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              onKeyPress={handleKeyPress}
              placeholder={user && !replyingTo ? "Komentar..." : ""}
              placeholderTextColor="#8e8e93"
              editable={!!user}
              multiline
              style={styles.textInput}
              selectionColor="#0a84ff"
            />
            {text.trim() ? (
              <Pressable onPress={onSubmit} disabled={isSubmitting} style={styles.sendButton}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <View style={styles.sendIconContainer}>
                    <Send color="white" size={14} />
                  </View>
                )}
              </Pressable>
            ) : replyingTo ? (
              <Pressable onPress={() => setReplyingTo(null)} style={styles.cancelTagBtn}>
                <X color="#8e8e93" size={16} />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={() => Alert.alert("Segera Hadir", "Fitur dukungan segera hadir!")}
            style={({ pressed }) => [styles.thanksButton, pressed && styles.thanksButtonPressed]}
          >
            <Heart color="white" size={22} strokeWidth={2} />
            <Text style={styles.thanksIconText}>$</Text>
          </Pressable>
        </View>
      </View>
    );
  },
);
