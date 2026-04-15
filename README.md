# Habit Tracker

A secure, offline-first habit tracking app built for accessibility — originally tailored for use by clients at rehabilitation centers. The app runs entirely on-device with no backend, no cloud sync, and no tracking of any kind.

## Features

### Dual Authentication Modes

- **Personal Device** — Passwordless single-user onboarding. The user enters only a username on first launch and is immediately signed in. No password is ever stored or required.
- **Shared Device** — Full username + password authentication for environments where multiple people share one device. Passwords are hashed with SHA-256 via `expo-crypto` before storage.

### Habit Tracking

- Track **boolean** (done / not done) and **counter** habits (e.g. glasses of water).
- Habits support `daily`, `weekly`, and `once` frequencies with optional end dates.
- A **preset catalog** with localised habit names speeds up habit creation.
- A **date paginator** lets users log habits retroactively or review past dates.

### Dual Gamification System

| Layer | Mechanism | Storage |
|---|---|---|
| **User Goals** | User-defined achievements with one or more criteria (streak, total count, sum value). Unlocked automatically when criteria are met. | SQLite — `achievements` + `achievementCriteria` tables |
| **Auto RPG Levels** | Per-category levels calculated on-the-fly from completed log counts using `level = floor(sqrt(totalCompleted)) + 1`. Six rank tiers: Novice → Legend. | No separate storage — computed from `logs` |
| **Secret Badges** | Hidden achievements defined in a static TypeScript catalog. Unlocked in the background by the secret achievement engine after each habit log. | SQLite — `userSecretAchievements` table (string IDs only) |

### Full Internationalisation (i18n)

- Finnish and English, with automatic system-locale detection.
- Translations organised into `react-i18next` namespaces (`common`, `login`, `register`).
- Language preference persisted to `AsyncStorage` and overridable from Settings.

### 100% Offline SQLite Storage

- All data lives in a local SQLite database managed by **Drizzle ORM**.
- Migrations run automatically on app start.
- No network permissions required.

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React Native + Expo (Expo Router) |
| Database | SQLite via `expo-sqlite` |
| ORM & Migrations | Drizzle ORM |
| State Management | Zustand |
| Internationalisation | react-i18next + expo-localization |
| Styling | NativeWind (Tailwind CSS) + custom `useThemeColors` hook |
| Secure Storage | expo-secure-store (session token) + expo-crypto (password hashing) |

## Getting Started

```bash
# Install dependencies
npm install

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run tests
npm test
```

## Project Structure

```
app/            # Expo Router screens (_layout, auth, tabs)
components/     # UI components grouped by feature
constants/      # Static catalogs (secretAchievements.ts)
db/             # Drizzle schema and DB initialisation
drizzle/        # Auto-generated SQL migrations
hooks/          # Custom React hooks (useThemeColors, useHabits, useAchievements)
locales/        # en.ts / fi.ts translation files
services/       # Business logic (auth, habits, RPG, secret achievements)
  helpers/      # Pure functions (rpgCalculations.ts, achievementLogic.ts)
store/          # Zustand stores (authStore, themeStore)
utils/          # Date utilities, habit scheduler
```

## Documentation

- [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) — LLM onboarding: full tech stack, architecture, feature index, and developer gotchas.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Database design, gamification engine internals, audio system, auth flow.
- [docs/USER_MANUAL.md](docs/USER_MANUAL.md) — End-user guide for all features, including troubleshooting tips.
- [docs/MANUAL_TESTING.md](docs/MANUAL_TESTING.md) — Step-by-step manual test cases for every feature.
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — Styling rules, i18n conventions, PR checklist, how to add secret achievements.

