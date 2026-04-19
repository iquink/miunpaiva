import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import {
  Play,
  Pause,
  CloudRain,
  Flame,
  Wind,
  Sun,
  Music,
  Music2,
  Headphones,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useAudioStore, MIXER_TRACKS } from "../../store/audioStore";

const MIXER_TRACK_ORDER = [
  "rain",
  "fire",
  "birds",
  "bg-morning",
  "bg-guitar",
  "bg-piano",
  "bg-piano2",
];

const MIXER_ICONS: Record<
  string,
  React.ComponentType<{ size: number; color: string }>
> = {
  rain: CloudRain,
  fire: Flame,
  birds: Wind,
  "bg-morning": Sun,
  "bg-guitar": Music,
  "bg-piano": Music2,
  "bg-piano2": Headphones,
};

export default function MixerPanel() {
  const { t } = useTranslation(["relax", "common"]);
  const colors = useThemeColors();
  const [slidingVolumes, setSlidingVolumes] = useState<Record<string, number>>(
    {},
  );
  const { isMixerPlaying, mixerVolumes, setMixerVolume, toggleMixerPlayPause } =
    useAudioStore();

  return (
    <View className="flex-1">
      {/* Master play/pause */}
      <TouchableOpacity
        onPress={toggleMixerPlayPause}
        className="mx-4 mb-4 py-4 rounded-2xl flex-row items-center justify-center"
        style={{
          backgroundColor: isMixerPlaying ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: colors.primary,
        }}
      >
        {isMixerPlaying ? (
          <Pause size={22} color="#fff" />
        ) : (
          <Play size={22} color={colors.primary} />
        )}
        <Text
          className="ml-3 font-semibold text-base"
          style={{ color: isMixerPlaying ? "#fff" : colors.primary }}
        >
          {isMixerPlaying ? t("mixer_pause") : t("mixer_play")}
        </Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {MIXER_TRACK_ORDER.map((id) => {
          const track = MIXER_TRACKS[id];
          const IconComponent = MIXER_ICONS[id];
          const displayVolume = slidingVolumes[id] ?? mixerVolumes[id] ?? 0;
          const isActive = displayVolume > 0;

          return (
            <View
              key={id}
              className="mb-3 p-4 rounded-2xl"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: isActive ? colors.primary + "60" : colors.border,
              }}
            >
              <View className="flex-row items-center mb-2">
                <IconComponent
                  size={20}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  className="ml-2 font-semibold"
                  style={{
                    color: isActive ? colors.text : colors.textSecondary,
                  }}
                >
                  {t(track.nameKey)}
                </Text>
                <Text
                  className="ml-auto text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {Math.round(displayVolume * 100)}%
                </Text>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={mixerVolumes[id] ?? 0}
                onValueChange={(v) =>
                  setSlidingVolumes((prev) => ({ ...prev, [id]: v }))
                }
                onSlidingComplete={(v) => {
                  setSlidingVolumes((prev) => {
                    const next = { ...prev };
                    delete next[id];
                    return next;
                  });
                  setMixerVolume(id, v);
                }}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
                style={{ height: 36 }}
              />
            </View>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
