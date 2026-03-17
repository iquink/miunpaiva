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
import { useThemeColors } from "../../hooks/useThemeColors";

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const register = useAuthStore((state) => state.register);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await register(username, password);
    setIsLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Registration Failed", result.error || "An error occurred");
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
            Create Account
          </Text>
          <Text className="mt-2" style={{ color: colors.textSecondary }}>
            Start your habit tracking journey
          </Text>
        </View>

        <View className="space-y-4">
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>

          <View className="mt-6 flex-row items-center justify-center">
            <Text style={{ color: colors.textSecondary }}>
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
