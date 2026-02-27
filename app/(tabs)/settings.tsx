import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";
import {
  LogOut,
  Trash2,
  User,
  Globe,
  Sun,
  Moon,
  Smartphone,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../db";
import {
  users,
  habits,
  logs,
  achievements,
  userAchievements,
} from "../../db/schema";
import { changeLanguage } from "../../i18n";
import React from "react";

export default function SettingsScreen() {
  const router = useRouter();
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
            // Delete all user data (cascade will handle related tables)
            await db.delete(users).where(eq(users.id, user.id));

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
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Text className="text-gray-500 dark:text-gray-400">{t("no_user")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("settings")}
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          {t("manage_account")}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info Section */}
        <View className="mb-6 rounded-xl bg-white dark:bg-slate-800 p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t("account_info")}
          </Text>

          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <User color="#3b82f6" size={24} />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {user.username}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t("user_id")}: {user.id}
              </Text>
            </View>
          </View>

          {user.createdAt && (
            <View className="mt-3 rounded-lg bg-gray-50 dark:bg-slate-700 p-3">
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {t("member_since")}:{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Language Section */}
        <View className="mb-6 rounded-xl bg-white dark:bg-slate-800 p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t("language")}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleChangeLanguage("en")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
                i18n.language === "en"
                  ? "bg-blue-500"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <Globe
                color={i18n.language === "en" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  i18n.language === "en"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleChangeLanguage("fi")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
                i18n.language === "fi"
                  ? "bg-blue-500"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <Globe
                color={i18n.language === "fi" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  i18n.language === "fi"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Suomi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        <View className="mb-6 rounded-xl bg-white dark:bg-slate-800 p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Theme
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setColorScheme("light")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-3 ${
                colorScheme === "light"
                  ? "bg-yellow-500"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <Sun
                color={colorScheme === "light" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-sm font-semibold ${
                  colorScheme === "light"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setColorScheme("dark")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-3 ${
                colorScheme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <Moon
                color={colorScheme === "dark" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-sm font-semibold ${
                  colorScheme === "dark"
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View className="mb-6 rounded-xl bg-white dark:bg-slate-800 p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            {t("actions")}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center rounded-lg bg-gray-100 dark:bg-slate-700 p-4"
          >
            <LogOut color="#6b7280" size={20} />
            <Text className="ml-3 text-base font-semibold text-gray-700 dark:text-gray-300">
              {t("logout")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-6 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800 p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-red-600 dark:text-red-400">
            {t("danger_zone")}
          </Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isDeleting}
            className={`flex-row items-center rounded-lg p-4 ${
              isDeleting
                ? "bg-red-200 dark:bg-red-900"
                : "bg-red-100 dark:bg-red-900/50"
            }`}
          >
            <Trash2 color="#dc2626" size={20} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                {isDeleting ? t("deleting") : t("delete_account")}
              </Text>
              <Text className="mt-1 text-xs text-red-500 dark:text-red-400">
                {t("delete_account_description")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            {t("app_version")}
          </Text>
          <Text className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t("made_with_love")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
