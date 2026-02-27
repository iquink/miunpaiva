import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "../../lib/utils";

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

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 active:bg-blue-600",
  secondary:
    "bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600",
  danger:
    "bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-900",
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-gray-700 dark:text-gray-300",
  danger: "text-red-600 dark:text-red-400",
};

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
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={cn(
        "rounded-lg py-4 px-4 flex-row items-center justify-center",
        variantStyles[variant],
        isDisabled && "opacity-50",
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "white" : "#6b7280"}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className={cn(
              "text-base font-semibold text-center",
              textVariantStyles[variant],
            )}
          >
            {children}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
