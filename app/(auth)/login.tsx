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
import { LogIn } from "lucide-react-native";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import React from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login Failed", result.error || "An error occurred");
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
            <LogIn color={colors.primaryForeground} size={32} />
          </View>
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            Welcome Back
          </Text>
          <Text className="mt-2" style={{ color: colors.textSecondary }}>
            Sign in to continue tracking
          </Text>
        </View>

        <View className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button className="mt-6" onPress={handleLogin} isLoading={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <View className="mt-6 flex-row items-center justify-center">
            <Text style={{ color: colors.textSecondary }}>
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
