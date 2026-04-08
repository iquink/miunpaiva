import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { useTranslation } from "react-i18next";
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
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  useAudioStore,
  MIXER_TRACKS,
  PLAYER_TRACKS,
} from "../../store/audioStore";

const MIXER_TRACK_ORDER = [
  "rain",
  "fire",
  "birds",
  "bg-morning",
  "bg-guitar",
  "bg-piano",
  "bg-piano2",
];

const PLAYER_TRACK_ORDER = ["guitar1", "guitar2"];

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

export default function RelaxScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<"mixer" | "player">("mixer");
  const [slidingVolumes, setSlidingVolumes] = useState<Record<string, number>>(
    {},
  );

  const {
    isMixerPlaying,
    isPlayerPlaying,
    mixerVolumes,
    playerTrackId,
    setMixerVolume,
    toggleMixerPlayPause,
    setPlayerTrack,
    togglePlayerPlayPause,
  } = useAudioStore();

  return (
    <View
      className="flex-1 pt-12"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="px-4 mb-4 flex-row items-center">
        <Headphones color={colors.primary} size={28} />
        <Text
          className="ml-3 text-2xl font-bold"
          style={{ color: colors.text }}
        >
          {t("relax")}
        </Text>
      </View>

      {/* Tab bar */}
      <View className="flex-row px-4 mb-4" style={{ gap: 8 }}>
        {(["mixer", "player"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="flex-1 py-2 items-center rounded-xl"
            style={{
              backgroundColor:
                activeTab === tab ? colors.primary : colors.surface,
              borderWidth: 1,
              borderColor: activeTab === tab ? colors.primary : colors.border,
            }}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: activeTab === tab ? "#fff" : colors.textSecondary,
              }}
            >
              {tab === "mixer" ? t("tab_mixer") : t("tab_music")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "mixer" ? (
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

          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
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
                    borderColor: isActive
                      ? colors.primary + "60"
                      : colors.border,
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
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
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
                    <Pause
                      fill={colors.primary}
                      color={colors.primary}
                      size={22}
                    />
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
      )}
    </View>
  );
}
