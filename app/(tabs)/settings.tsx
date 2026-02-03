import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { eq } from "drizzle-orm";
import { LogOut, Trash2, User, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">{t("no_user")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900">
          {t("settings")}
        </Text>
        <Text className="mt-1 text-gray-600">{t("manage_account")}</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* User Info Section */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
            {t("account_info")}
          </Text>

          <View className="flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User color="#3b82f6" size={24} />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-900">
                {user.username}
              </Text>
              <Text className="text-sm text-gray-500">
                {t("user_id")}: {user.id}
              </Text>
            </View>
          </View>

          {user.createdAt && (
            <View className="mt-3 rounded-lg bg-gray-50 p-3">
              <Text className="text-xs text-gray-600">
                {t("member_since")}:{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Language Section */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
            {t("language")}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleChangeLanguage("en")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
                i18n.language === "en" ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Globe
                color={i18n.language === "en" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  i18n.language === "en" ? "text-white" : "text-gray-700"
                }`}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleChangeLanguage("fi")}
              className={`flex-1 flex-row items-center justify-center rounded-lg p-4 ${
                i18n.language === "fi" ? "bg-blue-500" : "bg-gray-100"
              }`}
            >
              <Globe
                color={i18n.language === "fi" ? "white" : "#6b7280"}
                size={20}
              />
              <Text
                className={`ml-2 text-base font-semibold ${
                  i18n.language === "fi" ? "text-white" : "text-gray-700"
                }`}
              >
                Suomi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View className="mb-6 rounded-xl bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
            {t("actions")}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center rounded-lg bg-gray-100 p-4"
          >
            <LogOut color="#6b7280" size={20} />
            <Text className="ml-3 text-base font-semibold text-gray-700">
              {t("logout")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-6 rounded-xl border border-red-200 bg-white p-4">
          <Text className="mb-3 text-sm font-semibold uppercase text-red-600">
            {t("danger_zone")}
          </Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isDeleting}
            className={`flex-row items-center rounded-lg p-4 ${
              isDeleting ? "bg-red-200" : "bg-red-100"
            }`}
          >
            <Trash2 color="#dc2626" size={20} />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-red-600">
                {isDeleting ? t("deleting") : t("delete_account")}
              </Text>
              <Text className="mt-1 text-xs text-red-500">
                {t("delete_account_description")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-8 items-center">
          <Text className="text-xs text-gray-400">{t("app_version")}</Text>
          <Text className="mt-1 text-xs text-gray-400">
            {t("made_with_love")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
