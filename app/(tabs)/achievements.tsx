import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Plus, TrendingUp, Lock } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import { useAchievements } from "../../hooks/useAchievements";
import ScreenHeader from "../../components/ui/ScreenHeader";
import IconButton from "../../components/ui/IconButton";
import AchievementCard from "../../components/achievements/AchievementCard";
import AchievementSection from "../../components/achievements/AchievementSection";
import CreateAchievementForm from "../../components/achievements/CreateAchievementForm";
import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  getUserRPGStats,
  type CategoryProgress,
} from "../../services/rpgService";
import {
  getUnlockedSecretAchievements,
  type UnlockedSecretAchievement,
} from "../../services/secretAchievementEngine";

type MainTab = "goals" | "rewards";

interface RPGFeedItem {
  id: string;
  type: "rpg";
  titleKey: string;
  category: string;
  level: number;
  progress: number;
  timestamp: number;
}

interface SecretFeedItem {
  id: string;
  type: "secret";
  titleKey: string;
  descKey: string;
  icon: string;
  timestamp: number;
}

type FeedItem = RPGFeedItem | SecretFeedItem;

export default function AchievementsScreen() {
  const { t } = useTranslation("common");
  const colors = useThemeColors();
  const user = useAuthStore((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("goals");

  // Rewards tab state
  const [showRPG, setShowRPG] = useState(true);
  const [showSecrets, setShowSecrets] = useState(true);
  const [rpgStats, setRpgStats] = useState<CategoryProgress[]>([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState<
    UnlockedSecretAchievement[]
  >([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [rewardsRefreshing, setRewardsRefreshing] = useState(false);

  const {
    allAchievements,
    userHabits,
    refreshing,
    onRefresh,
    handleAddAchievement: addAchievement,
    deleteAchievement,
  } = useAchievements(user?.id);

  const loadRewards = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [stats, secrets] = await Promise.all([
        getUserRPGStats(user.id),
        getUnlockedSecretAchievements(user.id),
      ]);
      setRpgStats(stats);
      setUnlockedSecrets(secrets);
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setRewardsLoading(false);
      setRewardsRefreshing(false);
    }
  }, [user?.id]);

  // Load rewards when switching to rewards tab
  useEffect(() => {
    if (activeTab === "rewards") {
      setRewardsLoading(true);
      loadRewards();
    }
  }, [activeTab, loadRewards]);

  const onRewardsRefresh = useCallback(() => {
    setRewardsRefreshing(true);
    loadRewards();
  }, [loadRewards]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowAddForm(false);
      };
    }, []),
  );

  const handleAddAchievementWrapper = async (data: {
    title: string;
    description: string;
    iconSlug: "medal" | "trophy" | "flower";
    criteria: any[];
  }) => {
    const success = await addAchievement(data);
    if (success) setShowAddForm(false);
  };

  // ── Unified feed ──────────────────────────────────────────────
  const rpgItems: RPGFeedItem[] = rpgStats.map((cat) => ({
    id: `rpg_${cat.category}`,
    type: "rpg",
    titleKey: cat.rankKey,
    category: cat.category,
    level: cat.level,
    progress: cat.progressPercent,
    timestamp: cat.lastActivityAt ? new Date(cat.lastActivityAt).getTime() : 0,
  }));

  const secretItems: SecretFeedItem[] = unlockedSecrets.map((sec) => ({
    id: `secret_${sec.id}`,
    type: "secret",
    titleKey: `secret_achievements.${sec.id}.title`,
    descKey: `secret_achievements.${sec.id}.description`,
    icon: sec.icon,
    timestamp:
      sec.unlockedAt instanceof Date
        ? sec.unlockedAt.getTime()
        : new Date(sec.unlockedAt).getTime(),
  }));

  const unifiedFeed: FeedItem[] = [
    ...(showRPG ? rpgItems : []),
    ...(showSecrets ? secretItems : []),
  ].sort((a, b) => b.timestamp - a.timestamp);

  // ── Goal sections ─────────────────────────────────────────────
  const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
  const lockedAchievements = allAchievements.filter(
    (a) => !a.unlocked && !a.missed,
  );
  const missedAchievements = allAchievements.filter((a) => a.missed);

  // ── Renderers ─────────────────────────────────────────────────
  const renderMainTab = (tab: MainTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        style={{
          flex: 1,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          backgroundColor: isActive ? colors.primary : "transparent",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            fontWeight: isActive ? "600" : "400",
            color: isActive ? colors.primaryForeground : colors.textSecondary,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFilterToggle = (
    label: string,
    active: boolean,
    onToggle: () => void,
  ) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? colors.primary + "18" : "transparent",
        marginRight: 8,
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          borderWidth: 1.5,
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.primary : "transparent",
          marginRight: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {active && (
          <Text
            style={{
              color: colors.primaryForeground,
              fontSize: 9,
              fontWeight: "700",
            }}
          >
            ✓
          </Text>
        )}
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: active ? colors.primary : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderRPGCard = (item: RPGFeedItem) => (
    <View
      key={item.id}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.primary + "20",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <TrendingUp color={colors.primary} size={18} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
            {t(item.category)}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            {`Level ${item.level}`}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: colors.warning + "20",
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "700", color: colors.warning }}
          >
            {t(item.titleKey)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>
            {t("rpg_progress_to_next")}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>
            {item.progress}%
          </Text>
        </View>
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.border,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 6,
              borderRadius: 3,
              width: `${item.progress}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>
    </View>
  );

  const renderSecretCard = (item: SecretFeedItem) => {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return (
      <View
        key={item.id}
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Text style={{ fontSize: 30, marginRight: 12 }}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 4,
              }}
            >
              {t(item.titleKey)}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                marginBottom: 6,
                lineHeight: 18,
              }}
            >
              {t(item.descKey)}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
                backgroundColor: colors.primary + "18",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colors.primary,
                  fontWeight: "500",
                }}
              >
                🔓 {dateStr}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title={t("achievements")}
        subtitle={
          activeTab === "goals" ? t("achievements_subtitle") : t("rpg_subtitle")
        }
      />

      {/* Main Tab Selector */}
      <View
        style={{
          marginHorizontal: 24,
          marginTop: 8,
          marginBottom: 12,
          padding: 4,
          borderRadius: 10,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
        }}
      >
        {renderMainTab("goals", t("tab_goals"))}
        {renderMainTab("rewards", t("tab_rewards"))}
      </View>

      {activeTab === "goals" ? (
        <>
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {allAchievements.length === 0 ? (
              <View style={{ marginTop: 32, alignItems: "center" }}>
                <Text style={{ color: colors.textSecondary }}>
                  {t("no_achievements")}
                </Text>
              </View>
            ) : (
              <>
                <AchievementSection
                  title={t("unlocked")}
                  emptyMessage={t("no_unlocked")}
                  showSection={unlockedAchievements.length > 0}
                >
                  {unlockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onLongPress={deleteAchievement}
                    />
                  ))}
                </AchievementSection>

                <AchievementSection
                  title={t("locked")}
                  emptyMessage={t("all_unlocked")}
                  showSection={lockedAchievements.length > 0}
                >
                  {lockedAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onLongPress={deleteAchievement}
                    />
                  ))}
                </AchievementSection>

                {missedAchievements.length > 0 && (
                  <AchievementSection
                    title={t("missed")}
                    emptyMessage=""
                    showSection={true}
                  >
                    {missedAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onLongPress={deleteAchievement}
                      />
                    ))}
                  </AchievementSection>
                )}
              </>
            )}
          </ScrollView>

          {!showAddForm && (
            <IconButton
              icon={<Plus color="white" size={28} />}
              onPress={() => setShowAddForm(true)}
              className="absolute bottom-6 right-6"
            />
          )}
        </>
      ) : (
        /* Rewards Tab */
        <>
          {/* Filter row */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 24,
              paddingBottom: 12,
            }}
          >
            {renderFilterToggle(t("filter_rpg"), showRPG, () =>
              setShowRPG((v) => !v),
            )}
            {renderFilterToggle(t("filter_secrets"), showSecrets, () =>
              setShowSecrets((v) => !v),
            )}
          </View>

          <ScrollView
            style={{ flex: 1, paddingHorizontal: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={rewardsRefreshing}
                onRefresh={onRewardsRefresh}
              />
            }
          >
            {rewardsLoading ? (
              <View style={{ marginTop: 32, alignItems: "center" }}>
                <Text style={{ color: colors.textSecondary }}>
                  {t("loading")}
                </Text>
              </View>
            ) : unifiedFeed.length === 0 ? (
              <View style={{ marginTop: 32, alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.textSecondary,
                    textAlign: "center",
                    lineHeight: 22,
                  }}
                >
                  {t("no_rewards")}
                </Text>
              </View>
            ) : (
              <View style={{ paddingTop: 4, paddingBottom: 24 }}>
                {unifiedFeed.map((item) =>
                  item.type === "rpg"
                    ? renderRPGCard(item)
                    : renderSecretCard(item),
                )}
              </View>
            )}
          </ScrollView>
        </>
      )}

      {showAddForm && (
        <CreateAchievementForm
          userHabits={userHabits}
          onSubmit={handleAddAchievementWrapper}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </View>
  );
}
