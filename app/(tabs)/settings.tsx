import { useState } from "react";
import { View, Text, ScrollView, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { useAuthStore } from "../../store/authStore";
import { deleteUser } from "../../services/authService";
import { changeLanguage } from "../../i18n";
import ScreenHeader from "../../components/ui/ScreenHeader";
import UserInfoSection from "../../components/settings/UserInfoSection";
import LanguageSelector from "../../components/settings/LanguageSelector";
import ThemeSelector from "../../components/settings/ThemeSelector";
import LogoutSection from "../../components/settings/LogoutSection";
import DangerZoneSection from "../../components/settings/DangerZoneSection";
import React from "react";
import ColorThemeSelector from "../../components/settings/ColorThemeSelector";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDeleting, setIsDeleting] = useState(false);

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

            // Logout and redirect
            await logout();
            router.replace("/(auth)/login");

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

        <LogoutSection onLogout={handleLogout} />

        <DangerZoneSection
          onDeleteAccount={handleDeleteAccount}
          isDeleting={isDeleting}
        />

        {/* EU Logo */}
        <View className="mt-8 items-center pb-4">
          <Image
            source={require("../../assets/eu-logo.png")}
            className="h-12 w-auto"
            resizeMode="contain"
          />
        </View>

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
