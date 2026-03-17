import React from "react";
import {
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "../../lib/utils";
import { useThemeColors } from "../../hooks/useThemeColors";

type IconButtonVariant = "solid" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends Omit<TouchableOpacityProps, "className"> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

export default function IconButton({
  variant = "solid",
  size = "lg",
  icon,
  className,
  ...props
}: IconButtonProps) {
  const colors = useThemeColors();

  const getVariantStyle = () => {
    if (variant === "solid") {
      return { backgroundColor: colors.primary };
    }
    return { backgroundColor: "transparent" };
  };

  return (
    <TouchableOpacity
      className={cn(
        "rounded-full items-center justify-center",
        sizeStyles[size],
        className,
      )}
      style={getVariantStyle()}
      {...props}
    >
      <View>{icon}</View>
    </TouchableOpacity>
  );
}
