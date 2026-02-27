import React from "react";
import {
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "../../lib/utils";

type IconButtonVariant = "solid" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends Omit<TouchableOpacityProps, "className"> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
  className?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  solid: "bg-blue-500 shadow-lg active:bg-blue-600",
  ghost: "bg-transparent active:bg-gray-100 dark:active:bg-slate-700",
};

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
  return (
    <TouchableOpacity
      className={cn(
        "rounded-full items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <View>{icon}</View>
    </TouchableOpacity>
  );
}
