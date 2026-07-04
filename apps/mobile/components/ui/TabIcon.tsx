import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Theme } from "../../lib/theme";

export function TabIcon({
  IconComponent,
  color,
  focused,
  isProfile,
  userImg,
}: {
  IconComponent: any;
  color: any;
  focused: boolean;
  isProfile?: boolean;
  userImg?: string;
}) {
  const size = 24;

  return (
    <View
      style={{
        width: 60,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: Theme.layout.tabBar.iconMarginTop,
      }}
    >
      {focused && (
        <View
          style={{
            position: "absolute",
            width: Theme.layout.tabBar.pillWidth,
            height: Theme.layout.tabBar.pillHeight,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: Theme.layout.tabBar.pillHeight / 2,
          }}
        />
      )}

      {isProfile && userImg ? (
        <Image
          source={{ uri: userImg }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: focused ? 1.5 : 0,
            borderColor: color,
          }}
          contentFit="cover"
        />
      ) : (
        <IconComponent
          size={size}
          color={Theme.colors.text}
          strokeWidth={2}
          fill="none"
        />
      )}
    </View>
  );
}
