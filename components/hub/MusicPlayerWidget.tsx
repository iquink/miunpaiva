import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Music2, Play, Pause, ChevronRight } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useAudioStore, PLAYER_TRACKS } from "../../store/audioStore";

export default function MusicPlayerWidget() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const colors = useThemeColors();

  const {
    isMixerPlaying,
    isPlayerPlaying,
    playerTrackId,
    activeMode,
    getActiveMixerCount,
    globalTogglePlayPause,
  } = useAudioStore();

  const isAnythingPlaying = isMixerPlaying || isPlayerPlaying;
  const activeMixerCount = getActiveMixerCount();
  const hasContent = playerTrackId !== null || activeMixerCount > 0;

  let trackLabel: string;
  if (activeMode === "player" && playerTrackId) {
    trackLabel = t(
      PLAYER_TRACKS[playerTrackId]?.nameKey ?? "hub_no_track_selected",
    );
  } else if (activeMode === "mixer" && activeMixerCount > 0) {
    trackLabel = t("hub_active_sounds", { count: activeMixerCount });
  } else {
    trackLabel = t("hub_no_track_selected");
  }

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

      <View className="flex-row items-center justify-between">
        <Text
          className="text-sm flex-1 mr-4"
          style={{ color: colors.textSecondary }}
          numberOfLines={1}
        >
          {trackLabel}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (!hasContent) {
              router.push("/(tabs)/relax");
            } else {
              globalTogglePlayPause();
            }
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isAnythingPlaying ? (
            <Pause size={22} color={colors.primary} />
          ) : (
            <Play size={22} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
