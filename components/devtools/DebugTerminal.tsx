import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView as GestureHandlerScrollView } from "react-native-gesture-handler";
import { useThemeColors } from "../../hooks/useThemeColors";

interface DebugTerminalProps {
  logs: string[];
  onClear: () => void;
}

export default function DebugTerminal({ logs, onClear }: DebugTerminalProps) {
  const colors = useThemeColors();
  return (
    <>
      <View className="mb-3 mt-4 flex-row items-center justify-between">
        <Text
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colors.textSecondary }}
        >
          Debug Terminal
        </Text>
        <TouchableOpacity
          className="rounded-md px-3 py-1"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: colors.textSecondary }}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className="mb-6 overflow-hidden rounded-xl"
        style={{ backgroundColor: "#111827", height: 250 }}
      >
        <GestureHandlerScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          {logs.length === 0 ? (
            <Text
              style={{
                color: "#4B5563",
                fontSize: 11,
                fontFamily: "monospace",
              }}
            >
              No logs yet. Run a dev action to see output here.
            </Text>
          ) : (
            logs.map((entry, index) => (
              <Text
                key={index}
                style={{
                  color: "#D1D5DB",
                  fontSize: 11,
                  fontFamily: "monospace",
                  lineHeight: 18,
                }}
              >
                {entry}
              </Text>
            ))
          )}
        </GestureHandlerScrollView>
      </View>
    </>
  );
}
