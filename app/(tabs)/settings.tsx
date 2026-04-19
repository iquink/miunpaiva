import { useState, useRef } from "react";
import { View, Text, ScrollView, Alert, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { useAuthStore } from "../../store/authStore";
import {
  deleteUser,
  hasAnyUsers,
  DUMMY_PASSWORD,
} from "../../services/authService";
import { changeLanguage } from "../../i18n";
import { syncUserNotifications } from "../../services/notificationService";
import ScreenHeader from "../../components/ui/ScreenHeader";
import UserInfoSection from "../../components/settings/UserInfoSection";
import LanguageSelector from "../../components/settings/LanguageSelector";
import ThemeSelector from "../../components/settings/ThemeSelector";
import LogoutSection from "../../components/settings/LogoutSection";
import DangerZoneSection from "../../components/settings/DangerZoneSection";
import FeedbackSection from "../../components/settings/FeedbackSection";
import React from "react";
import ColorThemeSelector from "../../components/settings/ColorThemeSelector";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSettingsStore } from "../../store/settingsStore";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, logout, isDeveloperMode, setDeveloperMode, setFirstLaunch } =
    useAuthStore();
  const isPersonalAccount = user?.passwordHash === DUMMY_PASSWORD;
  const { t, i18n } = useTranslation(["settings", "common"]);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isToastsEnabled, isSoundEnabled, toggleToasts, toggleSound } =
    useSettingsStore();
  const tapCountRef = useRef(0);
  const lastTapRef = useRef<number>(0);

  const handleEuLogoTap = () => {
    if (isDeveloperMode) return;
    const now = Date.now();
    if (now - lastTapRef.current > 1000) {
      tapCountRef.current = 1;
    } else {
      tapCountRef.current += 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      Alert.alert(t("enable_dev_mode_title"), t("enable_dev_mode_message"), [
        { text: t("no"), style: "cancel" },
        {
          text: t("yes"),
          onPress: () => {
            Alert.alert(t("danger_title"), t("danger_message"), [
              { text: t("cancel"), style: "cancel" },
              {
                text: t("enable"),
                style: "destructive",
                onPress: () => {
                  setDeveloperMode(true);
                  Alert.alert(
                    t("dev_mode_enabled_title"),
                    t("dev_mode_enabled_message"),
                  );
                },
              },
            ]);
          },
        },
      ]);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("logout"), t("logout_confirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("delete_account"), t("delete_account_warning"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          if (!user) return;

          setIsDeleting(true);
          try {
            // Delete user (cascade will handle related tables)
            await deleteUser(user.id);

            // If no users remain, treat next launch as a fresh install
            const anyRemaining = await hasAnyUsers();
            if (!anyRemaining) {
              setFirstLaunch(true);
            }

            // Logout and redirect
            await logout();
            router.replace(anyRemaining ? "/(auth)/login" : "/(auth)/register");

            Alert.alert(t("success"), t("account_deleted"));
          } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert(t("error"), t("error_delete_account"));
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const handleChangeLanguage = async (lang: string) => {
    await changeLanguage(lang);
    if (user) {
      await syncUserNotifications(user.id);
    }
  };

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.textSecondary }}>{t("no_user")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScreenHeader title={t("settings")} subtitle={t("manage_account")} />

      <ScrollView className="flex-1 px-6 py-6">
        <UserInfoSection
          username={user.username}
          userId={user.id}
          createdAt={user.createdAt}
        />

        <LanguageSelector
          currentLanguage={i18n.language}
          onLanguageChange={handleChangeLanguage}
        />

        <ThemeSelector
          currentTheme={colorScheme as "light" | "dark"}
          onThemeChange={setColorScheme}
        />

        <ColorThemeSelector />

        <FeedbackSection
          isToastsEnabled={isToastsEnabled}
          isSoundEnabled={isSoundEnabled}
          onToggleToasts={toggleToasts}
          onToggleSound={toggleSound}
        />

        {!isPersonalAccount && <LogoutSection onLogout={handleLogout} />}

        <DangerZoneSection
          onDeleteAccount={handleDeleteAccount}
          isDeleting={isDeleting}
        />

        {/* EU Logo — tap 5 times quickly to unlock Developer Mode */}
        <Pressable
          className="mt-8 items-center pb-4"
          onPress={handleEuLogoTap}
          accessibilityLabel="EU Logo"
        >
          <Image
            source={require("../../assets/eu-logo.png")}
            className="h-12 w-auto"
            resizeMode="contain"
          />
        </Pressable>

        {/* App Info */}
        <View className="mt-4 items-center pb-8">
          <Text className="text-xs" style={{ color: colors.textSecondary }}>
            {t("app_version")}
          </Text>
          <Text
            className="mt-1 text-xs"
            style={{ color: colors.textSecondary }}
          >
            {t("made_with_love")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
