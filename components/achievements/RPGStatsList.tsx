import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { TrendingUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  getUserRPGStats,
  type CategoryProgress,
} from "../../services/rpgService";

interface RPGStatsListProps {
  userId: number;
}

export default function RPGStatsList({ userId }: RPGStatsListProps) {
  const { t } = useTranslation('common');
  const colors = useThemeColors();
  const [stats, setStats] = useState<CategoryProgress[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await getUserRPGStats(userId);
      setStats(data);
    } catch (error) {
      console.error("Error loading RPG stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  // Load stats when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.textSecondary }}>{t("loading")}</Text>
      </View>
    );
  }

  if (stats.length === 0) {
    return (
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
            {t("no_rpg_stats")}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {stats.map((stat, index) => (
        <View
          key={`${stat.category}-${index}`}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {/* Header with icon and category */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.primary + "20",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <TrendingUp color={colors.primary} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 2,
                }}
              >
                {stat.category}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                }}
              >
                {stat.completedCount} {t("rpg_completed_tasks")}
              </Text>
            </View>
          </View>

          {/* Rank and Level */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginBottom: 2,
                }}
              >
                {t("rpg_rank")}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.warning,
                }}
              >
                {t(stat.rankKey)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginBottom: 2,
                }}
              >
                {t("rpg_level")}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {stat.level}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={{ marginTop: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                }}
              >
                {t("rpg_progress_to_next")}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                }}
              >
                {stat.completedCount} / {stat.nextLevelAt}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${stat.progressPercent}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 10,
                color: colors.textSecondary,
                marginTop: 2,
                textAlign: "right",
              }}
            >
              {stat.progressPercent}%
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
