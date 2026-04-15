# Architecture

## Overview

The app is a fully offline, single-binary React Native application. There is no backend server, no REST API, and no cloud database. All state lives in a local SQLite file managed by Drizzle ORM; the only network calls are made by Expo's build toolchain during development.

---

## Directory Structure

```
app/                    Expo Router file-system routes
  _layout.tsx           Root layout — initialises DB, i18n, auth state, toast overlay
  (auth)/               Public routes (login, register)
  (tabs)/               Protected routes (Hub, Tasks, Rewards, Relax, Settings, DevTools)

components/             Feature-grouped UI components
  achievements/         Goals, Badges, RPG Levels UI
  devtools/             DebugTerminal, DevActionButton, GeneratorCard
  habits/               HabitCard, CreateHabitForm, DatePaginator, HabitDetailsModal
  hub/                  DailyProgressWidget, MusicPlayerWidget, RPGLevelsWidget,
                        PersonalGoalsWidget, SecretBadgesWidget
  relax/                RelaxTabBar, MixerPanel, PlayerPanel
  settings/             UserInfoSection, LanguageSelector, ThemeSelector,
                        ColorThemeSelector, LogoutSection, DangerZoneSection
  ui/                   Generic primitives (Button, Card, Input, ...)

constants/
  secretAchievements.ts Static catalog of secret badge definitions

db/
  schema.ts             Drizzle table definitions (single source of truth)
  index.ts              SQLite connection + migration runner

docs/                   Project documentation
  AI_CONTEXT.md         LLM onboarding document
  ARCHITECTURE.md       This file
  CONTRIBUTING.md       Styling rules, i18n conventions, PR checklist
  USER_MANUAL.md        End-user feature guide
  MANUAL_TESTING.md     Step-by-step manual test cases

drizzle/                Auto-generated SQL migrations + meta snapshots

hooks/
  useThemeColors.ts     Returns resolved hex colour values for the active theme
  useHabits.ts          Habits + logs for a date; add/toggle/delete/notify
  useAchievements.ts    Achievement CRUD + status enrichment
  useDashboard.ts       Composes useHabits; adds date nav + modal state
  useHubRewards.ts      Hub dashboard badges/rpg/goals widgets
  useHubStats.ts        Today's habit completion ratio for Hub
  useRewardsFeed.ts     Combined RPG + Secret achievement feed
  useDevTools.ts        Dev tool actions (all DB ops delegated to services)

locales/
  en.ts                 English translations (all namespaces)
  fi.ts                 Finnish translations (all namespaces)

services/
  authService.ts        User CRUD + password hashing
  habitService.ts       Habit + log CRUD; fires gamification checks
  achievementService.ts Goal CRUD + multi-criteria unlock engine
  rpgService.ts         On-the-fly RPG stat queries + level-up toast notifications
  secretAchievementEngine.ts  Background badge unlock checker
  notificationService.ts      expo-notifications scheduling / cancelling
  devGeneratorService.ts      Mock data generators
  devService.ts         DB wipe + notification flag reset
  helpers/
    rpgCalculations.ts  Pure level formula (no DB dependency) — unit tested
    achievementLogic.ts Pure criteria evaluation helpers — unit tested

store/
  authStore.ts          Zustand — session, login, register, logout
  settingsStore.ts      Zustand — isToastsEnabled, isSoundEnabled
  themeStore.ts         Zustand — active theme name + dark-mode flag
  audioStore.ts         Zustand — Ambient Mixer + Music Player state
  toastStore.ts         Zustand — showToast queue
  devLogStore.ts        Zustand — in-memory log lines for DebugTerminal

utils/
  dateUtils.ts
  habitScheduler.ts     shouldShowHabit(habit, date): boolean
  habitUtils.ts
```

---

## Strict UI → Hooks → Services → DB Layering

The codebase enforces a strict four-tier architecture. No tier may skip a level.

```
UI LAYER (app/, components/)
   ↓ calls hooks
CONNECTOR LAYER (hooks/)
   ↓ calls service functions
BUSINESS LOGIC LAYER (services/)
   ↓ reads/writes
DATABASE LAYER (db/schema.ts + drizzle/)

GLOBAL CLIENT STATE (store/)
   ↑ written by services and hooks, read by UI
```

| Tier | Allowed | Forbidden |
|---|---|---|
| TSX / UI | `useState`, hooks, render | `db.select()`, `db.insert()`, Drizzle imports |
| Hooks | Service calls, Zustand reads/writes | Drizzle imports |
| Services | Drizzle queries, Zustand writes | Direct UI state |
| Stores | AsyncStorage, SecureStore | Drizzle queries |

---

## Database

### Connection and Migrations

`db/index.ts` opens a single SQLite connection with `expo-sqlite` and runs all pending Drizzle migrations on startup via the bundled `drizzle/migrations.js` loader. Migrations are generated from `db/schema.ts` using `npx drizzle-kit generate` and must be committed alongside schema changes.

### Schema — 7 Tables

| Table | PK type | Purpose |
|---|---|---|
| `users` | integer auto-increment | User accounts |
| `habits` | integer auto-increment | Habit definitions per user |
| `logs` | integer auto-increment | Daily habit completion records |
| `achievements` | integer auto-increment | User-defined goal badges |
| `achievementCriteria` | integer auto-increment | One or more rules per achievement |
| `userAchievements` | integer auto-increment | Unlocked goal badge records |
| `userSecretAchievements` | integer auto-increment | Unlocked secret badge records |

All tables that belong to a user cascade-delete when the user row is removed.

### Hybrid ID Approach

**Auto-incrementing integers** are used for every _dynamic_ table (`users`, `habits`, `logs`, `achievements`, `achievementCriteria`, `userAchievements`). These rows are created at runtime on this device, so an integer primary key guarantees uniqueness without requiring a network round-trip or UUID generation — essential for offline safety.

**String IDs** are used in `userSecretAchievements.secretAchievementId`. Secret achievements are defined in the static catalog `constants/secretAchievements.ts` and are _never_ inserted into a database table. The `userSecretAchievements` table only records _which catalog entry was unlocked and when_. Storing the catalog string ID (e.g. `"aquaman"`, `"ironman"`) instead of a foreign-key integer means unlock records remain valid even if the database is wiped and rebuilt, and developers can safely reorder or extend the catalog without renumbering anything.

```
constants/secretAchievements.ts        ← source of truth (string IDs, no DB rows)
         |
         |  id: "aquaman"
         v
userSecretAchievements.secretAchievementId = "aquaman"   ← unlock state only
```

---

## Gamification Engine

The gamification system is split into three independent layers, each with a different data source and evaluation strategy.

### 1 — Manual Goals (achievementService.ts)

Users create custom achievements in the UI. Each achievement has one or more criteria rows in `achievementCriteria`:

| ruleType | Meaning |
|---|---|
| `streak` | N consecutive completed days |
| `total_count` | N completed logs of any value |
| `sum_value` | Sum of counter log values >= N |

`achievementService.ts` evaluates all unmet criteria after every habit log update. When every criterion for an achievement passes, a `userAchievements` row is inserted.

### 2 — Auto RPG Levels (rpgService.ts + services/helpers/rpgCalculations.ts)

No additional tables are written for RPG data. Levels are derived entirely from `logs` counts:

```
Level = floor( sqrt(totalCompletedLogs) ) + 1
```

Progress toward the next level is the percentage between `(level-1)^2` and `level^2` completed logs.

Ranks map to level thresholds:

| Level | Rank |
|---|---|
| 1–4 | Novice |
| 5–9 | Adept |
| 10–14 | Master |
| 15–19 | Expert |
| 20–24 | Hero |
| 25+ | Legend |

`rpgService.getUserRPGStats(userId)` groups completed logs by `habits.category`, calls `calculateLevelData()` for each group, and returns `CategoryProgress[]` ready for display.

`checkAndNotifyLevelUps(userId)` compares current stats against a snapshot stored in AsyncStorage and fires a localised toast for each category that levelled up:

```ts
description: `${i18n.t(stat.category)} → ${i18n.t("level_short")} ${stat.level}`
```

The pure helper `services/helpers/rpgCalculations.ts` has no native imports and is fully unit-testable.

### 3 — Secret Badges (secretAchievementEngine.ts + constants/secretAchievements.ts)

The secret achievement catalog is a plain TypeScript array `SECRET_ACHIEVEMENTS` with entries of three condition types:

| type | Condition | Example |
|---|---|---|
| `total_preset` | User has logged a preset-named habit N times | Log "Kuntosali" 50× to unlock `"ironman"` |
| `combo_same_day` | Two or more presets logged on the same date | "Sauna" + "Kuntosali" same day |
| `any_custom` | User has at least one fully custom (non-preset) habit | Unlocks `"inventor"` |

After each habit log, `checkSecretAchievements(userId, dateStr)` is called fire-and-forget. It fetches already-unlocked IDs from `userSecretAchievements`, iterates the static catalog skipping already-unlocked entries, evaluates each condition, and inserts a row on match.

Adding new secret achievements requires **no Drizzle migration** — only editing `constants/secretAchievements.ts`.

---

## Ambient Audio System

The Ambient Audio system is split into two mutually exclusive modes managed by `store/audioStore.ts`.

| Mode | Description |
|---|---|
| **Ambient Mixer** | Up to 7 simultaneous looping tracks, each with an independent volume slider. Uses separate `createAudioPlayer` instances. |
| **Music Player** | A single music track plays at a time. Switching tracks replaces the current player. |

`activeMode: "mixer" | "player" | null` is tracked so the Hub's Music Player Widget knows which mode to control.

**Mutual exclusion rule:** When the user starts the Ambient Mixer, any playing Music Player track is automatically paused (and vice versa). The switch happens inside `audioStore` before `player.play()` is called.

**iOS silent mode / background playback:** `setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true })` is called via `ensureAudioMode()` before any first playback. This must run before `player.play()` or the device will be silent.

---

## Global Toast System

Toasts are queued and rendered by the root layout overlay in `app/_layout.tsx`.

```
service/hook calls:
  useToastStore.getState().showToast({ icon, title, description, tab })
        ↓
  toastStore queues the toast
        ↓
  root layout overlay renders and animates it
        ↓
  user taps → router.push("/(tabs)/rewards?tab=" + tab)
```

- **`isToastsEnabled`** (settingsStore) gates all toast display. When false, `showToast` is a no-op.
- **`isSoundEnabled`** (settingsStore) gates the sound effect that accompanies each toast.
- Toasts are triggered by: level-ups, goal completions, secret badge unlocks.

---

## Authentication Flow

### First-Launch Detection

On startup `authStore.initialize()` checks whether any rows exist in `users`. If none, `isFirstLaunch = true` and the app routes to the mode-selection screen.

### Personal Device Mode (Passwordless)

The user chooses "Personal Device" on first launch and enters only a username. `authService.createPersonalUser(username)` stores the sentinel constant `DUMMY_PASSWORD = "PERSONAL_DEVICE_NO_PASS"` directly in `password_hash` — no hashing is performed.

On login, `verifyUserCredentials` detects the `DUMMY_PASSWORD` sentinel and bypasses the SHA-256 comparison, granting access immediately. The **logout button is hidden** in Settings for personal accounts.

### Shared Device Mode (Password-Protected)

The user creates an account with a username and password. `authService.createUser` hashes the password with `expo-crypto` SHA-256 before inserting. Login uses the same hash comparison. The logout button is fully visible.

### Session Persistence

After successful login or registration the numeric user ID is written to `expo-secure-store` under the key `session_user_id`. On every app start, `initialize()` reads this key and re-hydrates the user object from the DB. Clearing or uninstalling the app destroys the session.

---

## Styling Architecture

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full hybrid styling rules. In brief:

- **Layout / spacing / typography** — NativeWind Tailwind classes via `className`.
- **Colors** — Always resolved at runtime via the `useThemeColors()` hook and applied as inline `style` props. Tailwind color utilities and `dark:` variants are forbidden; they trigger native cold-start crashes in Expo Router.

---

## i18n Architecture

`i18n.ts` initialises `react-i18next` with two locales (`en`, `fi`) and four namespaces:

| Namespace | Content |
|---|---|
| `common` / `translation` | Shared UI strings, tab names, general labels, category keys, RPG ranks |
| `login` | Login screen strings |
| `register` | Registration + mode-selection strings |

The default namespace is `common`. Language is auto-detected from `expo-localization` on first launch, then persisted to `AsyncStorage`. The Settings screen exposes a language picker that calls `i18n.changeLanguage()` and writes the new value to storage.

Category i18n keys stored in the DB (e.g. `cat_exercise`) are passed directly to `i18n.t()` when rendering labels or toast descriptions, ensuring all user-visible text is translated.
