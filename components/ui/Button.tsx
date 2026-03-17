import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "../../lib/utils";
import { useThemeColors } from "../../hooks/useThemeColors";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends Omit<TouchableOpacityProps, "className"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || isLoading;

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case "secondary":
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "danger":
        return {
          backgroundColor: colors.error + "20",
          borderWidth: 1,
          borderColor: colors.error + "40",
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return colors.primaryForeground;
      case "secondary":
        return colors.text;
      case "danger":
        return colors.error;
    }
  };

  return (
    <TouchableOpacity
      className={cn(
        "rounded-lg py-4 px-4 flex-row items-center justify-center",
        isDisabled && "opacity-50",
        className,
      )}
      style={getVariantStyles()}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.primaryForeground : colors.text}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className="text-base font-semibold text-center"
            style={{ color: getTextColor() }}
          >
            {children}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
