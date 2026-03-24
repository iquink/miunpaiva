import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
// 1. Add import for useAudioPlayerStatus
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Play, Square, Headphones } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import Card from "../../components/ui/Card";

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
  const { t } = useTranslation('common');
  const colors = useThemeColors();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const player = useAudioPlayer(null);

  // 2. Initialize player status. This object is reactive
  // and will cause the component to re-render on state changes.
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // Configure audio session for background playback
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  const handlePlaySound = (track: (typeof TRACKS)[0]) => {
    if (activeTrackId === track.id) {
      // 3. Use status.playing to check playback state
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
      return;
    }

    player.replace(track.url);

    player.setActiveForLockScreen(true, {
      title: t(track.titleKey),
      artist: track.artist,
    });

    player.loop = true;
    player.play();
    setActiveTrackId(track.id);
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
          const isPlaying = activeTrackId === track.id && status.playing;

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
