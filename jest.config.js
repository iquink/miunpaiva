module.exports = {
  preset: "jest-expo",
  testMatch: [
    "**/__tests__/**/*.test.(ts|tsx|js)",
    "**/*.test.(ts|tsx|js)",
  ],
  // Use jest-expo's own allow-list (expo matches expo-modules-core, expo-sqlite, etc.)
  // plus nativewind/drizzle-orm for completeness.
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|nativewind|drizzle-orm))",
    "/node_modules/react-native-reanimated/plugin/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
