# AI_CONTEXT.md — LLM Onboarding Document

> Load this file at the start of every new session to instantly understand the project.
> Manual test cases are in `docs/MANUAL_TESTING.md`. The user-facing guide is in `docs/USER_MANUAL.md`.

---

## 1. Project Identity

**Gamified Habit Tracker** — A React Native (Expo) mobile app that lets users build habits, track streaks, earn secret badges and RPG stat levels, and relax with an ambient audio mixer. Target audience: care-home residents and individuals wanting a gentle, rewarding routine tracker.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | React Native 0.76, Expo SDK 52 |
| Routing | Expo Router v4 (file-based) |
| Database | SQLite via `expo-sqlite` + Drizzle ORM |
| Migrations | `drizzle-orm/expo-sqlite/migrator`, SQL files in `drizzle/` |
| State | Zustand (no Redux) |
| i18n | `react-i18next` + `i18next`, locale files in `locales/en.ts`, `locales/fi.ts` |
| Styling | NativeWind (Tailwind CSS for React Native) + `global.css` |
| Audio | `expo-audio` (`createAudioPlayer`, `setAudioModeAsync`) |
| Push Notifications | `expo-notifications` |
| Auth persistence | `expo-secure-store` (stores user ID) |
| Theming | Custom CSS vars (`global.css`), `useColorScheme()` from NativeWind |
| Testing | Jest + `ts-jest` |

---

## 3. Architecture Overview — Strict Layering

```
┌─────────────────────────────────────────────┐
│  app/(tabs)/*.tsx  ←  UI LAYER              │
│  components/**/*.tsx                        │
│   • Pure rendering, animations, local UI    │
│     state (useState) only.                  │
│   • ZERO direct DB calls.                   │
└──────────────┬──────────────────────────────┘
               │ calls
┌──────────────▼──────────────────────────────┐
│  hooks/*.ts  ←  CONNECTOR LAYER             │
│   • Bridge between UI and services/stores.  │
│   • May call service functions.             │
│   • May read/write to Zustand stores.       │
│   • ZERO direct drizzle-orm queries.        │
└──────────────┬──────────────────────────────┘
               │ calls
┌──────────────▼──────────────────────────────┐
│  services/*.ts  ←  BUSINESS LOGIC LAYER     │
│   • ALL drizzle-orm queries live here.      │
│   • All gamification engines live here.     │
│   • Exported as plain async functions.      │
└──────────────┬──────────────────────────────┘
               │ reads/writes
┌──────────────▼──────────────────────────────┐
│  db/schema.ts + drizzle/migrations/         │
│   • Single source of truth for DB shape.    │
└─────────────────────────────────────────────┘

  store/*.ts  ←  GLOBAL CLIENT STATE
   • Zustand stores for auth, settings, theme,
     audio, toast notifications, dev logs.
   • NOT for DB data — that lives in hooks.
```

### Rules to enforce in every PR
1. **TSX files** — rendering + local UI state only. No `db.select()` or `db.insert()` ever.
2. **Hooks** — connect UI to services. No Drizzle imports.
3. **Services** — only place where Drizzle queries run.
4. **Stores** — pure client state (persisted via AsyncStorage or SecureStore).

---

## 4. File Structure

```
app/
  _layout.tsx           — Root layout: DB migrations, auth redirect, toast overlay
  (auth)/               — login.tsx, register.tsx (unauthenticated routes)
  (tabs)/               — Main tab bar (authenticated)
    index.tsx           — Hub dashboard
    tasks.tsx           — Daily habit tracker
    rewards.tsx         — Achievements / Badges / RPG Levels
    relax.tsx           — Ambient Audio screen (Mixer + Music)
    settings.tsx        — User settings
    devtools.tsx        — Internal developer tools (hidden by default)

components/
  achievements/         — AchievementCard, AchievementSection, CriteriaBuilder,
                          CreateAchievementForm, FilterToggle, RPGCard, RPGStatsList,
                          SecretCard, RewardsTabBar, GoalsTabContent,
                          BadgesTabContent, LevelsTabContent
  devtools/             — DebugTerminal, DevActionButton, GeneratorCard
  habits/               — ActionBottomSheet, CreateHabitForm, DatePaginator,
                          HabitCard, HabitDetailsModal, HabitSelector,
                          HabitValueModal, TimeSectionHeader
  hub/                  — DailyProgressWidget, MusicPlayerWidget,
                          PersonalGoalsWidget, RPGLevelsWidget, SecretBadgesWidget
  relax/                — RelaxTabBar, MixerPanel, PlayerPanel
  settings/             — UserInfoSection, LanguageSelector, ThemeSelector,
                          ColorThemeSelector, LogoutSection, DangerZoneSection,
                          FeedbackSection
  ui/                   — ScreenHeader, IconButton, EmptyState, …

docs/                   — Project documentation (this folder)
  AI_CONTEXT.md         — LLM onboarding (this file)
  ARCHITECTURE.md       — DB design, auth flow, gamification internals
  CONTRIBUTING.md       — Styling rules, i18n conventions, PR checklist
  USER_MANUAL.md        — End-user feature guide
  MANUAL_TESTING.md     — Step-by-step manual test cases for all features

hooks/
  useAchievements.ts    — Achievement CRUD + status enrichment
  useDashboard.ts       — Composes useHabits; adds date nav + modal state
  useDevTools.ts        — Dev tool actions (all DB ops delegated to services)
  useHabits.ts          — Habits + logs for a date; add/toggle/delete/notify
  useHubRewards.ts      — Hub dashboard badges/rpg/goals widgets
  useHubStats.ts        — Today's habit completion ratio for Hub
  useRewardsFeed.ts     — Combined RPG + Secret achievement feed
  useThemeColors.ts     — Returns current theme color tokens

services/
  achievementService.ts    — Custom goal CRUD + multi-criteria unlock engine
  authService.ts           — User create/verify/delete (SHA-256 or DUMMY_PASSWORD)
  devGeneratorService.ts   — Mock data generators (habits, logs, RPG boost)
  devService.ts            — DB wipe + notification flag reset
  habitService.ts          — All habit/log CRUD; fires achievement checks
  hubService.ts            — Aggregated dashboard query
  notificationService.ts   — expo-notifications scheduling/cancelling
  rpgService.ts            — Level calculation + level-up toast notifications
  secretAchievementEngine.ts — Preset-count-based secret badge checker

  helpers/
    achievementLogic.ts    — Pure functions (combo condition checks) — tested
    rpgCalculations.ts     — calculateLevelData, getRankKey — tested

store/
  authStore.ts       — user, isAuthenticated, initialize/login/logout
  settingsStore.ts   — isToastsEnabled, isSoundEnabled (AsyncStorage)
  themeStore.ts      — activeTheme: "default"|"forest"|"ocean"|"coffee"
  audioStore.ts      — Ambient Mixer + Music Player state and AudioPlayer instances
  toastStore.ts      — showToast({icon, title, description, tab})
  devLogStore.ts     — In-memory log lines for DebugTerminal

db/
  schema.ts          — All table definitions + TypeScript type exports
  index.ts           — drizzle() instance + useDatabaseMigrations()
  seedPresets.ts     — Idempotent preset catalog seeder

constants/
  secretAchievements.ts  — SECRET_ACHIEVEMENTS_CATALOG (static, ~40+ entries)

utils/
  habitScheduler.ts  — shouldShowHabit(habit, date): boolean
  habitUtils.ts      — Misc habit helpers
  dateUtils.ts       — Date formatting helpers

locales/
  en.ts, fi.ts       — All i18n strings (flat object, namespace "common")
```

---

## 5. Database Schema Summary

### `users`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| username | TEXT UNIQUE | |
| password_hash | TEXT | SHA-256 or `DUMMY_PASSWORD` for personal mode |
| created_at | TIMESTAMP | |

### `habits`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| user_id | INTEGER FK → users | CASCADE DELETE |
| title | TEXT | |
| type | TEXT | `"boolean"` \| `"counter"` |
| daily_goal | INTEGER | null for boolean habits |
| unit | TEXT | null for boolean habits |
| category | TEXT | i18n key e.g. `"cat_exercise"` |
| frequency | TEXT | `"daily"` \| `"weekly"` \| `"once"` |
| frequency_days | TEXT | JSON `[0..6]` for weekly |
| target_date | TIMESTAMP | for `once` habits |
| end_date | TIMESTAMP | optional end for daily/weekly |
| preset_name | TEXT | i18n key e.g. `"preset_walking"` |
| time_of_day | TEXT | `morning`, `late_morning`, `afternoon`, `evening`, `all_day` |
| is_notifications_enabled | BOOLEAN | |
| notification_id | TEXT | OS notification ID(s) |

### `logs`
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| habit_id | INTEGER FK → habits | CASCADE DELETE |
| date | TEXT | `YYYY-MM-DD` |
| value | INTEGER | count for counter; 0/1 for boolean |
| completed | BOOLEAN | |
- Index: `(habit_id, date)`

### `achievements` (Custom Goals)
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| user_id | INTEGER FK → users | CASCADE DELETE |
| title, description | TEXT | |
| icon_slug | TEXT | `"medal"` \| `"trophy"` \| `"flower"` |

### `achievement_criteria`
| Column | Type | Notes |
|---|---|---|
| achievement_id | FK → achievements | CASCADE DELETE |
| habit_id | FK → habits | CASCADE DELETE |
| rule_type | TEXT | `"streak"` \| `"total_count"` \| `"sum_value"` |
| target_value | INTEGER | |
| days_period | INTEGER | 0 = all-time |

### `user_achievements` — which custom goals a user has unlocked

### `user_secret_achievements`
| Column | Notes |
|---|---|
| secret_achievement_id | String key from `SECRET_ACHIEVEMENTS_CATALOG` |
| is_viewed | Used for unread badge count on Hub |

### `preset_categories` + `preset_items` — habit preset catalog (seeded)

---

## 6. Core Features

### Hub Dashboard (`app/(tabs)/index.tsx`)
Five widgets stacked in a ScrollView:
1. **DailyProgressWidget** — today's completion ring (useHubStats)
2. **PersonalGoalsWidget** — custom goal count (useHubRewards)
3. **SecretBadgesWidget** — recent unread badges (useHubRewards)
4. **RPGLevelsWidget** — top category levels (useHubRewards)
5. **MusicPlayerWidget** — global audio play/pause (useAudioStore)

### RPG Leveling System
- Formula: `level = Math.floor(Math.sqrt(totalCompletedLogs)) + 1`
- 7 stat categories map to habit categories (`cat_exercise`, `cat_nutrition`, `cat_daily_routines`, `cat_daily_rhythm`, `cat_cleaning`, `cat_responsibilities`, `cat_group_activities`)
- Level-up fires a toast notification (fire-and-forget via `checkAndNotifyLevelUps`)
- Toast description is fully localised: `${i18n.t(stat.category)} → ${i18n.t("level_short")} ${newLevel}`
- Rank names: Novice → Adept → Master → Expert → Hero → Legend
- Thresholds: Novice <5, Adept 5–9, Master 10–14, Expert 15–19, Hero 20–24, Legend 25+

### Secret Badge Engine (`secretAchievementEngine.ts`)
- Static catalog of ~40+ badges in `constants/secretAchievements.ts`
- Condition types: `total_preset` (complete preset X N times), `combo_same_day`, `any_custom`
- Engine runs fire-and-forget after every `toggleBooleanHabitLog` / `updateCounterHabitLog`
- `markBadgesAsViewed(userId)` is called when Badges tab gains focus

### Custom Goals Engine (`achievementService.ts`)
- Multi-criteria: ALL criteria must be met
- Rule types: `streak` (consecutive days), `total_count` (N completions [optionally in last D days]), `sum_value` (sum of log values)
- Achievement becomes "missed" if linked habits have expired

### Ambient Audio System (`store/audioStore.ts`)
- **Ambient Mixer mode**: up to 7 simultaneous looping tracks (rain, fire, birds, morning, guitar, piano, piano2). Volume per track via `createAudioPlayer`.
- **Music Player mode**: single music track (guitar1, guitar2). One active at a time.
- **Mutual exclusion**: Only one mode plays at a time — switching modes automatically pauses the other.
- `activeMode: "mixer" | "player" | null` tracked for the Hub widget.
- Background + silent mode: `setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true })`.
- `ensureAudioMode()` must run before `player.play()` or iOS will be silent.

### Global Toast / Gamification Overlay
- `useToastStore.showToast({ icon, title, description, tab })` — queued toast displayed by root layout overlay
- Triggers: habit completion (via achievement/RPG checks), level-ups, badge unlocks, goal completions
- `tab` field is a deep-link hint: tapping a toast navigates to `/(tabs)/rewards?tab=badges` etc.
- Toasts can be disabled globally via `settingsStore.isToastsEnabled`
- Sound effects can be disabled via `settingsStore.isSoundEnabled`
- DevTools "Test Toast" button fires a sample toast for manual verification

---

## 7. Authentication

- **Personal mode** (default): one user, no password. `passwordHash = DUMMY_PASSWORD`. Session stored in SecureStore.
- **Password mode** (optional): SHA-256 hashed via `expo-crypto`.
- On app launch, `authStore.initialize()` reads SecureStore, restores session, fires `syncUserNotifications`.
- `DUMMY_PASSWORD` constant exported from `authService.ts` — used to detect personal accounts in UI.

---

## 8. Notifications

- `scheduleHabitNotification(habit)` — schedules a daily or weekly OS notification, returns notification ID.
- ID stored in `habits.notification_id` (JSON array for weekly).
- `syncUserNotifications(userId)` — called on login to cancel any stale notifications and reschedule active ones.
- `clearAllDeviceNotifications()` — called on logout.

---

## 9. Crucial Developer Rules & Gotchas

### SQLite Integer IDs
- Drizzle returns integers from SQLite as `number | bigint` depending on query type.
- **Always cast with `Number()`** before comparisons: `Number(h.id) === Number(crit.habitId)`.
- Failing to do so causes silent mismatches (`1n !== 1`).

### TouchableWithoutFeedback inside horizontal FlatList
- Horizontal FlatList captures touch events on Android. Wrap items in `TouchableWithoutFeedback` with `onPressIn` instead of `onPress` to avoid swallowing scroll events.

### Date format
- All DB date strings are `YYYY-MM-DD` (no time). Use `format(date, "yyyy-MM-dd")` from `date-fns`.
- `habit.targetDate` / `habit.endDate` are `Date | null` (Drizzle mode: "timestamp" = Unix epoch stored as integer).

### Fire-and-forget pattern
- Achievement checks, secret achievement checks, and RPG level-up checks are called fire-and-forget after every log mutation:
```ts
checkAchievements(userId).catch(...)
checkSecretAchievements(userId, dateStr).catch(...)
checkAndNotifyLevelUps(userId).catch(...)
```
- This keeps the UI response instantaneous.

### Audio mode must be set before first play
- `ensureAudioMode()` (called inside `audioStore`) sets `playsInSilentMode: true` and `shouldPlayInBackground: true`. This must run before `player.play()` or iOS will be silent.

### NativeWind + color tokens
- Colors come from CSS vars defined in `global.css` (light/dark + theme variants).
- `useThemeColors()` hook returns a typed object — always use this, never hardcode hex colors.
- Theme (default/forest/ocean/coffee) is stored in `themeStore`. Light/dark mode from native `useColorScheme()`.

### Preset catalog keys
- Category labels: `cat_exercise`, `cat_nutrition`, etc. (i18n keys, stored in DB).
- Preset item names: `preset_walking`, `preset_gym`, etc. (i18n keys, stored in DB).
- `seedPresets.ts` detects and removes legacy Finnish string rows on first run.

### Developer Mode Easter Egg
- Tap the logo at the bottom of the Settings screen 5 times quickly to unlock the DevTools tab.
- `authStore.isDeveloperMode` controls visibility of the DevTools tab in `_layout.tsx`.

### Tab navigation deep-link
- Deep-link to specific reward tab: `router.push("/(tabs)/rewards?tab=badges")`
- Deep-link to habit details: `router.push("/(tabs)/tasks?openModalId=42")`
- Push notification data includes `habitId` for deep-link on tap.

---

## 10. Testing

Tests live in `services/__tests__/`. Run with:
```bash
npx jest --no-coverage
```

| File | Coverage |
|---|---|
| `rpgCalculations.test.ts` | `calculateLevelData`, `getRankKey` — full boundary tests |
| `achievementLogic.test.ts` | `checkComboSameDayCondition`, `SECRET_ACHIEVEMENTS_CATALOG` integrity |

**39 tests, 0 failures.**

Manual test cases for all UI features are in `docs/MANUAL_TESTING.md`.

Business logic helpers are in `services/helpers/` (pure functions, no DB) — this is intentional to keep them testable without mocking Drizzle.

---

## 11. Build & Run

```bash
# Start dev server
npx expo start

# Android (emulator or device)
npx expo run:android

# Run tests
npx jest

# Generate new migration after schema change
npx drizzle-kit generate
```

Migrations are bundled via `drizzle/migrations.js` and applied automatically by `useDatabaseMigrations()` called in `app/_layout.tsx`.
