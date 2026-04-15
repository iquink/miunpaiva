import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Text, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import { useToastStore } from "../../store/toastStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useThemeColors } from "../../hooks/useThemeColors";

const VICTORY_SOUND = require("../../assets/audio/victory.mp3");

export default function GlobalToast() {
  const router = useRouter();
  const colors = useThemeColors();
  const currentToast = useToastStore((s) => s.currentToast);
  const isVisible = useToastStore((s) => s.isVisible);
  const hideToast = useToastStore((s) => s.hideToast);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const player = useAudioPlayer(VICTORY_SOUND);

  // Slide in when visible, slide out immediately when hidden (content stays
  // during the 300ms exit window so the animation has something to render)
  useEffect(() => {
    if (isVisible && currentToast) {
      // Play sound if enabled
      if (useSettingsStore.getState().isSoundEnabled) {
        try {
          player.seekTo(0);
          player.play();
        } catch {
          // Audio failure is non-critical
        }
      }

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, currentToast]);

  const handlePress = () => {
    if (!currentToast) return;
    const tab = currentToast.tab;
    hideToast();
    if (tab) {
      router.push(`/(tabs)/rewards?tab=${tab}` as any);
    }
  };

  // Always rendered so animations can play out; invisible when no toast
  const topInset = Platform.OS === "ios" ? 56 : 40;

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        position: "absolute",
        top: topInset,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {currentToast?.icon ? (
          <Text style={{ fontSize: 28, marginRight: 12 }}>
            {currentToast.icon}
          </Text>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {currentToast?.title ?? ""}
          </Text>
          {currentToast?.description ? (
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {currentToast.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
