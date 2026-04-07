import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { Play, Square, Headphones } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import Card from "../../components/ui/Card";
import { useAudioStore } from "../../store/audioStore";

// Offline tracks (IDs correspond to localization keys)
const TRACKS = [
  {
    id: "1",
    url: require("../../assets/audio/guitar1.mp3"),
    titleKey: "relax_track_1_title",
    artist: "Miunpäivä",
    descriptionKey: "relax_track_1_description",
  },
  {
    id: "2",
    url: require("../../assets/audio/guitar2.mp3"),
    titleKey: "relax_track_2_title",
    artist: "Miunpäivä",
    descriptionKey: "relax_track_2_description",
  },
];

export default function RelaxScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const {
    loadAndPlay,
    isPlaying: globalIsPlaying,
    currentTrackId,
  } = useAudioStore();

  const handlePlaySound = (track: (typeof TRACKS)[0]) => {
    loadAndPlay(track.url, track.id, t(track.titleKey), track.artist);
  };

  return (
    <View
      className="flex-1 px-4 pt-12"
      style={{ backgroundColor: colors.background }}
    >
      <View className="mb-6 flex-row items-center">
        <Headphones color={colors.primary} size={28} />
        <Text
          className="ml-3 text-2xl font-bold"
          style={{ color: colors.text }}
        >
          {t("relax")}
        </Text>
      </View>

      <Text className="mb-6 text-base" style={{ color: colors.textSecondary }}>
        {t("relax_subtitle")}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {TRACKS.map((track) => {
          // 4. isPlaying is computed dynamically on each render,
          // because status.playing triggers re-render.
          const isPlaying = currentTrackId === track.id && globalIsPlaying;

          return (
            <Card
              key={track.id}
              className="mb-4 flex-row items-center justify-between p-4"
              style={{
                backgroundColor: colors.surface,
                borderColor: isPlaying ? colors.primary : colors.border,
                borderWidth: isPlaying ? 2 : 1,
              }}
            >
              <View className="flex-1 pr-4">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {t(track.titleKey)}
                </Text>
                <Text
                  className="mt-1 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {t(track.descriptionKey)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handlePlaySound(track)}
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isPlaying
                    ? colors.error + "20"
                    : colors.primary + "20",
                }}
              >
                {isPlaying ? (
                  <Square fill={colors.error} color={colors.error} size={24} />
                ) : (
                  <Play
                    fill={colors.primary}
                    color={colors.primary}
                    size={24}
                    className="ml-1"
                  />
                )}
              </TouchableOpacity>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
