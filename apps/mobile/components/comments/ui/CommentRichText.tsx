import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { usePlayerStore } from "../../../lib/store/playerStore";
import { styles } from "./CommentStyles";

interface CommentRichTextProps {
  text: string;
  isReply?: boolean;
}

export function CommentRichText({ text, isReply }: CommentRichTextProps) {
  const { seekTo } = usePlayerStore();
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const handleTimestampPress = (timestamp: string) => {
    const parts = timestamp.split(":").map(Number);
    let seconds =
      parts.length === 2
        ? parts[0] * 60 + parts[1]
        : parts.length === 3
          ? parts[0] * 3600 + parts[1] * 60 + parts[2]
          : 0;
    seekTo(seconds);
  };

  const renderRichText = (str: string) => {
    const parts = str.split(/(@\w+|\d{1,2}:\d{2}(?::\d{2})?)/g);
    return parts.map((part, i) => {
      if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(part))
        return (
          <Text key={i} style={styles.timestampText} onPress={() => handleTimestampPress(part)}>
            {part}
          </Text>
        );
      if (part.startsWith("@"))
        return (
          <Text key={i} style={styles.tagText}>
            {part}
          </Text>
        );
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <View>
      <Text
        style={[styles.commentText, isReply && styles.replyTextContent]}
        numberOfLines={isTextExpanded ? undefined : 4}
        onPress={() => !isTextExpanded && text.length > 150 && setIsTextExpanded(true)}
      >
        {renderRichText(text.trim())}
      </Text>
      {text.length > 150 && (
        <Text style={styles.readMoreText} onPress={() => setIsTextExpanded(!isTextExpanded)}>
          {isTextExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
        </Text>
      )}
    </View>
  );
}
