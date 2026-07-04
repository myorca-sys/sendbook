import React, { useState, memo, useRef } from "react";
import { View, Dimensions, StyleSheet, Text, ActivityIndicator, Animated } from "react-native";
import { Image } from "expo-image";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

interface Props {
  uri: string;
  isFirst?: boolean;
}

export const AutoHeightImage = memo(
  ({ uri, isFirst }: Props) => {
    const [height, setHeight] = useState<number>(SCREEN_WIDTH * 1.5);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentUri, setCurrentUri] = useState(uri);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Synchronous state update (Derived State)
    if (uri !== currentUri) {
      setCurrentUri(uri);
      setLoaded(false);
      setError(false);
      fadeAnim.setValue(0);
    }

    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: height,
          backgroundColor: "#0a0812",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!loaded && !error && (
          <View
            style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}
          >
            <View style={{ alignItems: "center", gap: 12 }}>
              <Image
                source={require("../../assets/orca-logo.jpg")}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  opacity: 0.3,
                }}
                contentFit="cover"
              />
              <ActivityIndicator size="small" color="rgba(255,255,255,0.2)" />
            </View>
          </View>
        )}
        {error && (
          <View
            style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}
          >
            <Text style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>Tidak dapat memuat</Text>
          </View>
        )}

        <AnimatedExpoImage
          source={{ uri }}
          style={{ width: "100%", height: "100%", opacity: fadeAnim }}
          contentFit="fill"
          priority={isFirst ? "high" : "normal"}
          onLoad={(e) => {
            if (e.source.width && e.source.height) {
              const calculatedHeight = (SCREEN_WIDTH / e.source.width) * e.source.height;
              setHeight(calculatedHeight);
            }
            setLoaded(true);

            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }).start();
          }}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          cachePolicy="disk"
        />
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.uri === nextProps.uri,
);
