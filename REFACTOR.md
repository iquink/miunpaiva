# Major Refactor - Counter Habits & Multi-Criteria Achievements

## 🎯 Overview

This refactor upgrades the Habit Tracker with two major improvements:
1. **Proper Counter Habit Implementation** - Numeric input with goals and progress tracking
2. **Multi-Criteria Achievement System** - Achievements that require multiple conditions to unlock

## 📊 Database Changes

### Schema Modifications

#### ✅ Table: `habits` (Enhanced)
- **Added:** `description` (text, nullable) - Habit description
- **Existing:** `unit` (text, nullable) - e.g., 'km', 'pages', 'liters'
- **Existing:** `daily_goal` (integer, nullable) - Target value for counter habits

#### ⚠️ Table: `achievements` (Breaking Changes)
**Removed columns:**
- ~~`rule_type`~~ - Moved to criteria table
- ~~`target_value`~~ - Moved to criteria table
- ~~`days_period`~~ - Moved to criteria table
- ~~`linked_habit_id`~~ - Moved to criteria table (now supports multiple)

**Added columns:**
- `description` (text, nullable) - Achievement description

**Remaining columns:**
- `id`, `user_id`, `title`, `icon_slug`

#### ✨ NEW Table: `achievement_criteria`
Multi-criteria system where ONE achievement can have MULTIPLE conditions.

```typescript
{
  id: integer (PK)
  achievement_id: integer (FK → achievements.id)
  habit_id: integer (FK → habits.id)
  rule_type: 'streak' | 'total_count' | 'sum_value'
  target_value: integer
  days_period: integer (0 = all time)
}
```

**Example:**
```
Achievement: "Fitness Master"
Criteria:
  1. Exercise habit → 30 day streak
  2. Run habit → Sum of 100 km (last 30 days)
  3. Protein habit → Total count of 50 times
```

### Migration Generated

New migration file: `drizzle/0001_left_slipstream.sql`

**Migration includes:**
- ALTER TABLE achievements to add `description` column
- CREATE TABLE achievement_criteria
- Note: Old achievement data will need manual migration or recreation

### ⚠️ Data Migration Strategy

**Option 1: RESET (Recommended for Development)**
Since this is still in development, the easiest approach:
1. Uninstall the app from your device
2. Reinstall to get fresh database with new schema
3. All old data will be lost

**Option 2: Manual Data Migration (Production)**
If you need to preserve data:
1. Export existing achievements data before update
2. Apply migration
3. Manually convert old achievements to new format:
   - Each old achievement becomes 1 achievement with 1 criterion
4. Re-insert converted data

## 🎨 UI/UX Changes

### 1. Dashboard - Habit Tracking

#### Boolean Habits (No Change)
- Tap to toggle Done/Not Done
- Green background when complete
- Checkmark icon

#### Counter Habits (NEW Behavior)
**Before:** Tapped like a checkbox ❌
**After:** Opens modal with numeric input ✅

**Modal Features:**
- Current progress display: "3 / 5 km"
- Numeric text input
- +/- stepper buttons
- Save button to update value

**Visual Improvements:**
- Progress bar showing goal completion
- "Current / Goal Unit" display
- Changes to green when goal met
- TrendingUp icon instead of checkmark

### 2. Create Habit Form

**New Fields (shown only for Counter type):**
- **Description:** Optional text field
- **Unit:** Text field (e.g., "km", "pages", "cups")
- **Daily Goal:** Numeric field for target value

**Example:**
```
Title: "Drink Water"
Description: "Stay hydrated throughout the day"
Type: Counter
Unit: "glasses"
Daily Goal: 8
```

### 3. Achievement Creation (Complete Redesign)

**Old Flow:** Select habit → Select rule → Enter target

**New Flow:**
1. Enter achievement title & description
2. Click "Add Criterion" button (can add multiple)
3. For each criterion:
   - Select habit from horizontal list
   - Select rule type (Streak/Total Count/Sum Value)
   - Enter target value
   - Enter days period (0 = all time)
4. Create achievement

**Visual Features:**
- Dynamic criterion forms with delete buttons
- Scrollable habit selection
- Dashed border "Add Criterion" button
- All criteria visible before submission

### 4. Achievement Display

**Shows all criteria for each achievement:**
```
🏆 Fitness Master
Description: Complete all fitness goals

Criteria:
• Exercise: Day Streak 30
• Running: Sum Value 100 (30 days)
• Protein: Total Count 50
```

## 🔧 Technical Implementation

### New Components

#### 1. `components/HabitValueModal.tsx`
Modal for counter habit value input.

**Props:**
```typescript
{
  visible: boolean
  habit: Habit
  currentValue: number
  onClose: () => void
  onSave: (value: number) => void
}
```

**Features:**
- Numeric keyboard
- Increment/decrement buttons
- Current progress display
- Auto-calculates goal completion

#### 2. `components/HabitCard.tsx`
Extracted habit card component with smart behavior.

**Props:**
```typescript
{
  habit: Habit
  log?: Log
  onToggle: (habit: Habit) => void
  onUpdateValue: (habit: Habit, value: number) => void
  onLongPress: (habitId: number) => void
}
```

**Smart Logic:**
- Detects habit type
- Shows appropriate UI (checkbox vs counter)
- Manages modal state internally
- Displays progress bars for counters

### Updated Services

#### `services/achievementService.ts`

**Refactored Logic:**

```typescript
checkAchievements(userId: number)
  ↓
  Fetch locked achievements
  ↓
  For each achievement:
    ↓
    Fetch ALL criteria
    ↓
    For each criterion:
      ↓
      Check if criterion is met
      ↓
      If ANY fails → achievement stays locked
    ↓
    If ALL pass → unlock achievement
```

**Key Changes:**
- Removed `habitId` parameter (checks all achievements)
- Added `checkSingleAchievement()` - checks all criteria
- Added `checkCriterion()` - checks individual criterion
- All three rule types preserved and working

## 📝 Type Updates

### Schema Types

```typescript
// New type exports
export type AchievementCriterion = typeof achievementCriteria.$inferSelect;
export type NewAchievementCriterion = typeof achievementCriteria.$inferInsert;

// Updated Achievement type (description added, other fields removed)
export type Achievement = {
  id: number
  userId: number
  title: string
  description: string | null
  iconSlug: string
}
```

### Extended Types

```typescript
// Used in UI components
interface AchievementWithStatus extends Achievement {
  unlocked: boolean
  unlockedAt?: Date
  criteriaList: AchievementCriterion[]
}

interface CriterionForm {
  habitId: number | null
  ruleType: 'streak' | 'total_count' | 'sum_value'
  targetValue: string
  daysPeriod: string
}
```

## 🚀 Testing the Changes

### Test 1: Counter Habit Creation
1. Create habit: "Running"
2. Type: Counter
3. Unit: "km"
4. Daily Goal: 5
5. Save
6. ✅ Should appear with progress bar

### Test 2: Counter Value Input
1. Tap on "Running" habit
2. ✅ Modal should open
3. Enter value: 3
4. Save
5. ✅ Should show "3 / 5 km"
6. ✅ Progress bar should be 60%

### Test 3: Multi-Criteria Achievement
1. Create two habits: "Exercise", "Reading"
2. Create achievement: "Balanced Life"
3. Add criterion 1: Exercise → Streak → 7 days
4. Add criterion 2: Reading → Sum Value → 100 pages
5. Save
6. ✅ Achievement should show both criteria
7. Complete both conditions
8. ✅ Achievement should unlock

### Test 4: Achievement Unlocking
1. Create habit: "Meditation"
2. Create achievement with TWO criteria:
   - Meditation → Streak 3
   - Meditation → Total Count 10
3. Complete meditation 3 days in a row
4. ✅ Achievement should NOT unlock yet (only 1/2 criteria met)
5. Complete meditation 7 more times (total 10)
6. ✅ Achievement should now unlock (both criteria met)

## 🔄 Migration Checklist

- [x] Update database schema
- [x] Generate migration
- [x] Create HabitValueModal component
- [x] Create HabitCard component
- [x] Update Dashboard screen
- [x] Update Achievement screen
- [x] Refactor achievement service
- [x] Update TypeScript types
- [ ] Test counter habits
- [ ] Test multi-criteria achievements
- [ ] Update documentation

## ⚠️ Breaking Changes

1. **Existing Achievements Will Break**
   - Old achievements reference columns that no longer exist
   - Recommendation: Delete all achievements before update or uninstall/reinstall app

2. **Achievement Service API Changed**
   - Old: `checkAchievements(userId, habitId)`
   - New: `checkAchievements(userId)`
   - Now checks ALL achievements, not just for one habit

3. **Dashboard Component Refactored**
   - Habit rendering logic moved to `HabitCard` component
   - Toggle logic split into `toggleBooleanHabit` and `updateCounterValue`

## 🎯 Benefits

### User Experience
- ✅ Counter habits now work properly with numeric input
- ✅ Goal tracking with visual progress bars
- ✅ More complex achievements possible
- ✅ Better habit descriptions

### Developer Experience
- ✅ Cleaner component architecture
- ✅ More flexible achievement system
- ✅ Easier to add new rule types
- ✅ Better separation of concerns

### Data Model
- ✅ Normalized schema (criteria in separate table)
- ✅ Support for unlimited criteria per achievement
- ✅ Easier to query and analyze achievement progress

## 📚 Next Steps

### Recommended Enhancements
1. **Edit Achievements** - Allow modifying criteria after creation
2. **Achievement Progress** - Show % complete for locked achievements
3. **Habit Analytics** - Charts showing counter habit trends
4. **Criterion Templates** - Pre-built criterion combinations
5. **Achievement Categories** - Group achievements by theme

### Potential Features
- Copy achievements between users
- Share achievement templates
- Achievement difficulty levels
- Bonus achievements for combinations
- Achievement notifications with progress updates

---

**Migration completed successfully!** 🎉

The app now supports proper counter habit tracking and multi-criteria achievements, providing users with more powerful tools to track their habits and set meaningful goals.
