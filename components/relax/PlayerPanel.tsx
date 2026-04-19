import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useAudioStore, PLAYER_TRACKS } from "../../store/audioStore";

const PLAYER_TRACK_ORDER = ["guitar1", "guitar2"];

export default function PlayerPanel() {
  const { t } = useTranslation(["relax", "common"]);
  const colors = useThemeColors();
  const {
    isPlayerPlaying,
    playerTrackId,
    setPlayerTrack,
    togglePlayerPlayPause,
  } = useAudioStore();

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {PLAYER_TRACK_ORDER.map((id) => {
        const track = PLAYER_TRACKS[id];
        const isActive = playerTrackId === id;
        const isThisPlaying = isActive && isPlayerPlaying;

        return (
          <TouchableOpacity
            key={id}
            activeOpacity={0.8}
            onPress={() => {
              if (isActive) {
                togglePlayerPlayPause();
              } else {
                setPlayerTrack(id);
              }
            }}
            className="mb-3 p-4 rounded-2xl flex-row items-center justify-between"
            style={{
              backgroundColor: colors.surface,
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? colors.primary : colors.border,
            }}
          >
            <Text
              className="text-base font-semibold flex-1 pr-4"
              style={{ color: colors.text }}
            >
              {t(track.nameKey)}
            </Text>
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: isActive
                  ? colors.primary + "20"
                  : colors.border + "40",
              }}
            >
              {isThisPlaying ? (
                <Pause fill={colors.primary} color={colors.primary} size={22} />
              ) : (
                <Play
                  fill={isActive ? colors.primary : colors.textSecondary}
                  color={isActive ? colors.primary : colors.textSecondary}
                  size={22}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
