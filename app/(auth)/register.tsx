import { useState } from "react";
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
import { UserPlus } from "lucide-react-native";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useThemeColors();
  const register = useAuthStore((state) => state.register);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert(
        t("error_failed", { ns: "register" }),
        t("error_fill_fields", { ns: "register" }),
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t("error_failed", { ns: "register" }),
        t("error_password_match", { ns: "register" }),
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
        t("error_failed", { ns: "register" }),
        result.error || t("error_default", { ns: "register" }),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center">
          <View
            className="mb-4 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <UserPlus color={colors.primaryForeground} size={32} />
          </View>
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            {t("title", { ns: "register" })}
          </Text>
          <Text className="mt-2" style={{ color: colors.textSecondary }}>
            {t("subtitle", { ns: "register" })}
          </Text>
        </View>

        <View className="space-y-4">
          <Input
            label={t("username_label", { ns: "register" })}
            placeholder={t("username_placeholder", { ns: "register" })}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label={t("password_label", { ns: "register" })}
            placeholder={t("password_placeholder", { ns: "register" })}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label={t("confirm_password_label", { ns: "register" })}
            placeholder={t("confirm_password_placeholder", { ns: "register" })}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            className="mt-6"
            onPress={handleRegister}
            isLoading={isLoading}
          >
            {isLoading
              ? t("loading", { ns: "register" })
              : t("button", { ns: "register" })}
          </Button>

          <View className="mt-6 flex-row items-center justify-center">
            <Text style={{ color: colors.textSecondary }}>
              {t("have_account", { ns: "register" })}{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  {t("sign_in", { ns: "register" })}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
