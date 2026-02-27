import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps extends Omit<ViewProps, "className"> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn("rounded-xl bg-white dark:bg-slate-800 p-4", className)}
      {...props}
    >
      {children}
    </View>
  );
}
