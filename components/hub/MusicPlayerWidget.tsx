import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Music2, Play, Pause, ChevronRight } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { AudioPlayer } from "expo-audio";

interface Props {
  isPlaying: boolean;
  currentTrackName: string | null;
  player: AudioPlayer | null;
  togglePlayPause: () => void;
}

export default function MusicPlayerWidget({
  isPlaying,
  currentTrackName,
  player,
  togglePlayPause,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/(tabs)/relax")}
      className="rounded-2xl p-5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <Music2 size={22} color={colors.accent} />
          <Text
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            {t("hub_relaxation")}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </View>

      <View>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-sm flex-1 mr-4"
            style={{ color: colors.textSecondary }}
            numberOfLines={1}
          >
            {!player && !currentTrackName
              ? t("hub_no_track_selected")
              : currentTrackName || t("hub_relaxing_ambient")}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (!player) {
                router.push("/(tabs)/relax");
              } else {
                togglePlayPause();
              }
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isPlaying ? (
              <Pause size={22} color={colors.primary} />
            ) : (
              <Play size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
