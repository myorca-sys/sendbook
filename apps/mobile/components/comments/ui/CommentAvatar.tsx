import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { styles } from "./CommentStyles";

interface CommentAvatarProps {
  avatar: string;
  username: string;
  isReply?: boolean;
  onPress: () => void;
}

export function CommentAvatar({ avatar, username, isReply, onPress }: CommentAvatarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.avatarContainer, isReply && styles.avatarContainerSmall]}
    >
      {typeof avatar === "string" && avatar.trim() !== "" ? (
        <Image source={{ uri: avatar }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <Text style={[styles.avatarFallback, isReply && styles.avatarFallbackSmall]}>
          {(username || "U").charAt(0).toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
}
