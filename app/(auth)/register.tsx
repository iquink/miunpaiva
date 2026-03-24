import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Smartphone, Users, ChevronLeft } from "lucide-react-native";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

type Mode = "choose" | "personal" | "shared";

export default function RegisterScreen() {
  const { t } = useTranslation(["register", "common"]);
  const router = useRouter();
  const colors = useThemeColors();
  const { register, registerPersonal, isFirstLaunch } = useAuthStore();
  const [mode, setMode] = useState<Mode>(isFirstLaunch ? "choose" : "shared");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonalRegister = async () => {
    if (!username) {
      Alert.alert(
        t("error_failed"),
        t("error_username_only"),
      );
      return;
    }

    setIsLoading(true);
    const result = await registerPersonal(username);
    setIsLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        t("error_failed"),
        result.error || t("error_default"),
      );
    }
  };

  const handleSharedRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert(
        t("error_failed"),
        t("error_fill_fields"),
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t("error_failed"),
        t("error_password_match"),
      );
      return;
    }

    setIsLoading(true);
    const result = await register(username, password);
    setIsLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        t("error_failed"),
        result.error || t("error_default"),
      );
    }
  };

  // ── CHOOSE MODE ────────────────────────────────────────────────
  if (mode === "choose") {
    return (
      <View
        className="flex-1 justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <View className="items-center mb-12">
          <Text
            className="text-3xl font-bold text-center"
            style={{ color: colors.text }}
          >
            {t("choose_title")}
          </Text>
          <Text
            className="mt-2 text-base text-center"
            style={{ color: colors.textSecondary }}
          >
            {t("choose_subtitle")}
          </Text>
        </View>

        {/* Personal Device Card */}
        <TouchableOpacity
          onPress={() => setMode("personal")}
          className="mb-4 items-center rounded-2xl p-6 border-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.primary,
          }}
        >
          <View
            className="mb-4 rounded-full p-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Smartphone color={colors.primaryForeground} size={32} />
          </View>
          <Text
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            {t("personal_device_mode")}
          </Text>
          <Text className="text-center" style={{ color: colors.textSecondary }}>
            {t("personal_device_subtitle")}
          </Text>
        </TouchableOpacity>

        {/* Shared Device Card */}
        <TouchableOpacity
          onPress={() => setMode("shared")}
          className="items-center rounded-2xl p-6 border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <View
            className="mb-4 rounded-full p-4"
            style={{ backgroundColor: colors.secondary }}
          >
            <Users color={colors.secondaryForeground} size={32} />
          </View>
          <Text
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            {t("shared_device_mode")}
          </Text>
          <Text className="text-center" style={{ color: colors.textSecondary }}>
            {t("shared_device_subtitle")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── PERSONAL MODE ──────────────────────────────────────────────
  if (mode === "personal") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-1 justify-center px-6">
          <TouchableOpacity
            onPress={() => setMode("choose")}
            className="flex-row items-center mb-8"
          >
            <ChevronLeft color={colors.primary} size={20} />
            <Text
              className="font-semibold ml-1"
              style={{ color: colors.primary }}
            >
              {t("back")}
            </Text>
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View
              className="mb-4 rounded-full p-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Smartphone color={colors.primaryForeground} size={32} />
            </View>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {t("personal_device_mode")}
            </Text>
            <Text
              className="mt-2 text-center"
              style={{ color: colors.textSecondary }}
            >
              {t("personal_device_subtitle")}
            </Text>
          </View>

          <Input
            label={t("username_label")}
            placeholder={t("username_placeholder")}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            onPress={handlePersonalRegister}
            isLoading={isLoading}
            className="mt-6"
          >
            {isLoading
              ? t("loading")
              : t("button_personal")}
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── SHARED MODE ────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-1 justify-center px-6">
        {isFirstLaunch && (
          <TouchableOpacity
            onPress={() => setMode("choose")}
            className="flex-row items-center mb-8"
          >
            <ChevronLeft color={colors.primary} size={20} />
            <Text
              className="font-semibold ml-1"
              style={{ color: colors.primary }}
            >
              {t("back")}
            </Text>
          </TouchableOpacity>
        )}

        <View className="items-center mb-8">
          <View
            className="mb-4 rounded-full p-4"
            style={{ backgroundColor: colors.secondary }}
          >
            <Users color={colors.secondaryForeground} size={32} />
          </View>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {isFirstLaunch
              ? t("shared_device_mode")
              : t("title")}
          </Text>
          <Text
            className="mt-2 text-center"
            style={{ color: colors.textSecondary }}
          >
            {isFirstLaunch
              ? t("shared_device_subtitle")
              : t("subtitle")}
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label={t("username_label")}
            placeholder={t("username_placeholder")}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label={t("password_label")}
            placeholder={t("password_placeholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label={t("confirm_password_label")}
            placeholder={t("confirm_password_placeholder")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Button
          onPress={handleSharedRegister}
          isLoading={isLoading}
          className="mt-6"
        >
          {isLoading
            ? t("loading")
            : t("button")}
        </Button>

        {!isFirstLaunch && (
          <View className="mt-6 flex-row items-center justify-center">
            <Text style={{ color: colors.textSecondary }}>
              {t("have_account")}{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  {t("sign_in")}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
