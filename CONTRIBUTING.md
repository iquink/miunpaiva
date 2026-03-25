# Contributing

Thank you for contributing to the Habit Tracker. Please read this guide before opening a pull request. The rules below exist to prevent hard-to-debug crashes in Expo Router and to keep the codebase consistent.

---

## Styling Rules (Critical)

This project uses a **hybrid styling approach**. The two halves are not interchangeable; mixing them causes native cold-start crashes.

### Layout, Spacing, and Typography — NativeWind

Use NativeWind Tailwind class names via the `className` prop for everything that does not involve a color:

```tsx
// Good
<View className="flex-1 px-4 mt-6">
  <Text className="text-lg font-semibold mb-2">Title</Text>
</View>
```

Utility classes for dimensions, padding, margin, flex layout, font size, font weight, and border radius are all fine.

### Colors — Inline Styles Only (STRICTLY ENFORCED)

**Tailwind color utilities (`bg-white`, `text-black`, `bg-gray-100`, etc.) and `dark:` modifier classes are STRICTLY FORBIDDEN.**

Reason: Expo Router's cold-start rendering path processes inline styles before the NativeWind runtime is ready. Any Tailwind color class resolves to nothing and the component renders with a transparent or black background, crashing the visible layout on first open.

**Always** resolve colors through the `useThemeColors` hook and apply them as React Native inline `style` props:

```tsx
import { useThemeColors } from '@/hooks/useThemeColors';

export function MyComponent() {
  const colors = useThemeColors();

  return (
    <View
      className="flex-1 px-4"
      style={{ backgroundColor: colors.surface }}
    >
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

Available color tokens from `useThemeColors()`:

| Token | Usage |
|---|---|
| `colors.background` | Screen background |
| `colors.surface` | Card / modal background |
| `colors.primary` | Primary action color |
| `colors.primaryForeground` | Text on primary-colored backgrounds |
| `colors.text` | Main body text |
| `colors.textSecondary` | Muted / secondary text |
| `colors.border` | Dividers and borders |
| `colors.success` | Positive states |
| `colors.warning` | Warning states |
| `colors.error` | Error states |

The hook reads the active theme from `themeStore` and the system color scheme, and returns the correct hex values for both light and dark mode automatically.

---

## Internationalisation (i18n)

### Namespace Architecture

Translations live in `locales/en.ts` and `locales/fi.ts`. Each file exports named objects that map to `react-i18next` namespaces:

| Namespace | Exported as | Contents |
|---|---|---|
| `common` | default export | Shared strings: tab names, buttons, status labels |
| `login` | named `login` export | Login screen strings |
| `register` | named `register` export | Registration + mode-selection strings |

### Using Translations in a Component

Import `useTranslation` and declare the namespaces you need:

```tsx
import { useTranslation } from 'react-i18next';

export function DashboardScreen() {
  // Load multiple namespaces; the first in the array is the default for this call
  const { t } = useTranslation(['common', 'login']);

  return <Text>{t('dashboard')}</Text>;           // resolved from 'common'
  //     <Text>{t('login:button')}</Text>          // explicit namespace prefix
}
```

When a component only needs one namespace you can pass a string directly:

```tsx
const { t } = useTranslation('login');
```

### Adding New Strings

1. Add the key and English value to `locales/en.ts` in the appropriate namespace object.
2. Add the Finnish translation to `locales/fi.ts` under the same key.
3. If the string belongs to a new screen with its own namespace, export it as a named export and register it in `i18n.ts` under both the `en` and `fi` resource objects.

Do not use hardcoded English strings in component JSX except for temporary debugging code that will be removed before merging.

---

## Adding Secret Achievements

Secret achievements live entirely in `constants/secretAchievements.ts`. The database never stores their definitions — only the unlock state (user ID + string ID + timestamp).

### Step-by-step

1. Open `constants/secretAchievements.ts`.
2. Append a new entry to the `SECRET_ACHIEVEMENTS` array.
3. Choose an `id` string that is unique, lowercase, and URL-safe (e.g. `"night_owl"`).
4. Pick a `type` and fill in the matching `condition` shape:

**`total_preset`** — unlock after logging a specific preset-named habit N times:

```ts
{
  id: "night_owl",
  icon: "🦉",
  type: "total_preset",
  condition: { presetName: "Iltatoimet", target: 30 },
}
```

**`combo_same_day`** — unlock when two or more preset habits are both logged on the same calendar day:

```ts
{
  id: "morning_champion",
  icon: "🌅",
  type: "combo_same_day",
  condition: { presetNames: ["Aamujumppa", "Hampaiden pesu"] },
}
```

**`any_custom`** — unlock as soon as the user has created at least one custom (non-preset) habit:

```ts
{
  id: "inventor",
  icon: "💡",
  type: "any_custom",
  condition: {},
}
```

5. Add translation keys for the new achievement's title and description in both `locales/en.ts` and `locales/fi.ts` under the `common` namespace, using the pattern `secret_achievements.<id>.title` and `secret_achievements.<id>.description`.
6. **No database migration is needed.** The engine reads the catalog at runtime; the database only records which catalog IDs have been unlocked.

### How the engine works

After every habit log, `services/secretAchievementEngine.ts` calls `checkSecretAchievements(userId, dateStr)`. The function:

1. Queries `userSecretAchievements` for already-unlocked IDs.
2. Iterates `SECRET_ACHIEVEMENTS`, skipping already-unlocked entries.
3. Evaluates the condition with a targeted SQL query or pure helper function.
4. Inserts a `userSecretAchievements` row when the condition is met.

The call is fire-and-forget; errors are swallowed so a bug in a new achievement cannot break habit logging.

---

## Database Migrations

After changing `db/schema.ts`, regenerate and commit the migration:

```bash
npx drizzle-kit generate
```

Commit the new file under `drizzle/` together with your schema change in the same pull request. Migrations run automatically on app start and are not reversible in production.

---

## Running Tests

```bash
npm test               # run all tests once
npm test -- --watch    # watch mode
```

Pure helper functions in `services/helpers/` must have corresponding test files in `services/__tests__/`. Do not import native modules (`expo-sqlite`, `expo-crypto`, etc.) inside helper files — keep them dependency-free so tests run in the Node environment without mocking.

---

## Pull Request Checklist

- [ ] No hardcoded color values in JSX — all colors applied via `useThemeColors()` inline `style` props.
- [ ] No Tailwind color classes or `dark:` modifiers anywhere in component files.
- [ ] New user-visible strings added to both `locales/en.ts` and `locales/fi.ts`.
- [ ] New secret achievements added only to the static catalog (no migration).
- [ ] Schema changes accompanied by a generated and committed Drizzle migration.
- [ ] Pure business logic extracted to `services/helpers/` with unit tests.
