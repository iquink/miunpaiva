# Manual Testing Guide — Gamified Habit Tracker

Step-by-step test cases for all user-facing features. Run these after every significant change to verify nothing has regressed. For automated unit tests, see `services/__tests__/`.

---

## Prerequisites

1. A physical Android or iOS device (or emulator) with the app installed.
2. Development server running (`npx expo run:android` or `npx expo run:ios`).
3. Start from a **fresh account** unless the test case states otherwise.

---

## 1. Authentication

### 1.1 Personal Mode — Passwordless Onboarding
1. Open the app for the first time (or after a full data wipe).
2. On the Welcome screen, tap **"Continue without password"**.
3. Enter a username (e.g. `Alice`).
4. Tap **Get Started**.
5. ✅ App navigates directly to the Hub — no password was required.
6. ✅ The Logout button is **not** visible in Settings.

### 1.2 Shared Mode — Password Registration
1. On the Welcome screen tap **"Create Account"**.
2. Enter username `testuser1`, password `password123`, confirm password `password123`.
3. Tap **Sign Up**.
4. ✅ App navigates to the Hub.

### 1.3 Password Validation
1. On the Register screen enter username `u` and password `abc`.
2. Tap **Sign Up**.
3. ✅ Error message is shown — registration is blocked.

### 1.4 Duplicate Username
1. Register `testuser1` (see 1.2).
2. Log out and try to register `testuser1` again.
3. ✅ Error "Username already taken" is displayed.

### 1.5 Login — Correct Credentials
1. Log out from `testuser1`.
2. Enter username `testuser1`, password `password123`, tap **Sign In**.
3. ✅ App navigates to Hub.

### 1.6 Login — Wrong Password
1. Enter username `testuser1`, password `wrongpass`.
2. ✅ Error "Invalid username or password" is displayed.

### 1.7 Session Persistence
1. Log in as `testuser1`.
2. Close the app completely (swipe away).
3. Re-open the app.
4. ✅ App goes directly to Hub without asking for credentials.

---

## 2. Habit Management (Tasks Tab)

### 2.1 Create Boolean Habit
1. Tap the **+** button on the Tasks tab.
2. Enter title "Morning Walk", choose category **Exercise**, schedule **Daily**.
3. Leave Unit and Goal empty.
4. Tap **Save**.
5. ✅ "Morning Walk" appears in today's habit list.
6. ✅ Card shows an uncompleted state.

### 2.2 Create Counter Habit
1. Tap **+**, enter title "Drink Water", category **Nutrition**, schedule **Daily**.
2. Set Unit to `L` and Daily Goal to `2`.
3. Tap **Save**.
4. ✅ "Drink Water" appears with a counter widget.

### 2.3 Complete Boolean Habit
1. Tap the "Morning Walk" card.
2. ✅ Card turns highlighted / shows a checkmark.
3. Tap again.
4. ✅ Card reverts to incomplete state.

### 2.4 Log Counter Habit
1. Tap the "Drink Water" card.
2. A value picker opens — enter `1.5` and confirm.
3. ✅ Card shows progress toward the 2 L goal.

### 2.5 Habit Details & Edit
1. Long-press "Morning Walk" (or use the three-dot menu).
2. ✅ Habit Details modal opens with stats and options.
3. Tap **Edit**, change the title to "Evening Walk", tap **Save**.
4. ✅ Habit appears with the updated title.

### 2.6 Delete Habit
1. Open Habit Details for "Evening Walk".
2. Tap **Delete** and confirm.
3. ✅ Habit is removed from the list.

### 2.7 Date Navigation
1. Create "Daily Journal" habit, complete it for today.
2. Tap the left arrow to go to yesterday.
3. ✅ "Daily Journal" shows as incomplete for yesterday.
4. Complete it for yesterday, then navigate back to today.
5. ✅ Today's completion state is unchanged.

### 2.8 Time of Day Sections
1. Create three habits assigned to Morning, Afternoon, and Evening respectively.
2. ✅ Habits are grouped under correct section headers in the Tasks list.

### 2.9 Preset Catalog
1. Tap **+**, choose the **"Choose Preset"** tab.
2. Select category **Daily Routines** and preset **Brush Teeth**.
3. Tap **Save**.
4. ✅ Habit is created with the localised preset name.

---

## 3. Gamification — Rewards Tab

### 3.1 Create Custom Goal (Goals tab)
1. Navigate to **Rewards → Goals**.
2. Tap **+**, enter title "7-Day Walker", pick an icon.
3. Add a criterion: Habit = "Morning Walk", Rule Type = **Streak**, Target = `7`.
4. Tap **Save**.
5. ✅ Goal appears in the **Locked** section.

### 3.2 Unlock a Custom Goal
1. Create habit "Push-ups" and goal "10 Push-ups", criterion: Total Count = `10`.
2. Complete "Push-ups" on 10 different dates (use date navigation).
3. After the 10th completion, navigate to **Rewards → Goals**.
4. ✅ "10 Push-ups" appears in the **Unlocked** section with a golden glow.

### 3.3 Missed Goal
1. Create a habit with an end date set to yesterday.
2. Create a goal with a criterion linked to that habit (target not yet reached).
3. ✅ After the habit's end date passes the goal shows in the **Missed** section.

### 3.4 Secret Badges (Badges tab)
1. Create and complete the preset habit "Walking" at least once.
2. ✅ After the first completion the badge **"First Step" 🥾** is unlocked.
3. ✅ The Rewards tab icon shows an unread badge dot.
4. Open **Rewards → Badges**.
5. ✅ The dot disappears; the badge is marked as seen.

### 3.5 RPG Stats (Levels tab)
1. Complete several **Exercise** category habits on multiple days.
2. Navigate to **Rewards → Levels**.
3. ✅ The **Exercise** stat card shows a level above 1 with a non-zero progress bar.

### 3.6 Level-Up Toast — Localisation
1. Open **DevTools** (tap Settings logo 5×), use **RPG Boost** to force a level-up.
2. ✅ A toast appears with the translated category name (e.g. "Exercise" in English, "Liikunta" in Finnish) and the localised "Lv X" label.
3. ✅ Tapping the toast navigates to **Rewards → Levels**.

### 3.7 Toast Queue — Level-Up + Achievement Together
1. Set up conditions so that completing one habit both levels up a stat AND unlocks a goal.
2. Complete that habit.
3. ✅ Both a level-up toast and a goal-achieved toast are queued and displayed sequentially — not simultaneously.

---

## 4. Relax — Ambient Mixer & Music Player

### 4.1 Ambient Mixer Playback
1. Navigate to **Relax → Mixer**.
2. Tap **Play**.
3. Drag the **Rain** slider to 70%.
4. ✅ Rain sound plays at the set volume.
5. Drag the **Piano** slider to 40%.
6. ✅ Both Rain and Piano play simultaneously.

### 4.2 Mixer — Volume Memory
1. Set Rain at 60%, Fire at 30% in the Mixer.
2. Navigate away and return to the Relax tab.
3. ✅ Slider positions are restored to 60% and 30%.

### 4.3 Music Player Playback
1. Navigate to **Relax → Music**.
2. Tap **Guitar Piece 1**.
3. ✅ Guitar Piece 1 starts playing; the play/pause button shows a pause icon.
4. Tap **Guitar Piece 2**.
5. ✅ Guitar Piece 2 starts; Guitar Piece 1 stops.

### 4.4 Mixer vs Music — Mutual Exclusion
1. Start the Ambient Mixer (Rain at 50%).
2. Switch to the Music tab and tap **Guitar Piece 1**.
3. ✅ Rain sound stops. Guitar Piece 1 plays.
4. Switch back to the Mixer tab and tap **Play**.
5. ✅ Guitar Piece 1 stops. Mixer resumes.

### 4.5 Background Playback
1. Start the Mixer on the Relax tab.
2. Lock the device screen.
3. ✅ Mixer audio continues playing.
4. Unlock and return to the app.
5. ✅ Mixer play state is consistent with what was playing.

### 4.6 Music Player Widget on Hub
1. Start Guitar Piece 1 on the Relax tab.
2. Navigate to the **Hub**.
3. ✅ The Music Player Widget shows the active track and a pause button.
4. Tap the pause button on the Hub.
5. ✅ Music pauses without leaving the Hub.

---

## 5. Settings

### 5.1 Language Switch
1. Go to **Settings → Language** and select **Finnish**.
2. ✅ All visible labels switch to Finnish immediately.
3. Close and reopen the app.
4. ✅ Finnish is still selected.

### 5.2 Color Theme
1. Go to **Settings → Color Theme** and select **Forest**.
2. ✅ Accent colors throughout the app change to the green Forest palette.

### 5.3 Toast Toggle
1. Go to **Settings → Notifications & Feedback**, disable **Pop-up Toasts**.
2. Complete a habit that would normally trigger a level-up toast.
3. ✅ No toast appears.
4. Re-enable Pop-up Toasts.
5. ✅ Toasts appear again on the next qualifying action.

### 5.4 Sound Toggle
1. Ensure Toasts are enabled.
2. Disable **Sound Effects** in Settings.
3. Trigger a toast (complete a habit or use DevTools Test Toast).
4. ✅ Toast appears silently, no sound plays.
5. Re-enable Sound Effects.
6. ✅ Next toast plays a sound.

### 5.5 Logout (Shared Mode)
1. While logged in as a password-mode user, tap **Log Out** in Settings.
2. ✅ Confirmation dialog appears.
3. Confirm logout.
4. ✅ App navigates to the Login screen. Hub is no longer accessible without login.

### 5.6 Delete Account
1. Create a test account with habits and achievements.
2. Go to **Settings → Danger Zone → Delete Account**.
3. ✅ Warning dialog confirms permanent deletion.
4. Confirm.
5. ✅ App navigates to Welcome/Login screen.
6. ✅ Attempting to log in with the deleted credentials fails.

---

## 6. DevTools

> Access DevTools by tapping the logo at the bottom of Settings 5 times quickly.

### 6.1 Test Toast Button
1. Open the DevTools tab.
2. Tap **Test Global Toast**.
3. ✅ A sample toast appears at the bottom of the screen.
4. ✅ Toast text uses the current app language (not hardcoded English).

### 6.2 Generate Mock Data
1. Tap **Generate Habits** (or equivalent generator button).
2. Navigate to the Tasks tab.
3. ✅ A set of pre-seeded habits appears.

### 6.3 RPG Boost
1. Tap **RPG Boost**.
2. Navigate to **Rewards → Levels**.
3. ✅ At least one RPG Stat has levelled up.
4. ✅ A level-up toast was shown with the translated category and "Lv X" label.

### 6.4 Database Wipe
1. Tap **Wipe Database** and confirm.
2. ✅ All habits, logs, goals, and badges are removed.
3. ✅ The app returns to a clean state (no data in any tab).

---

## 7. Edge Cases & Offline Behaviour

### 7.1 Offline Operation
1. Enable Airplane Mode on the device.
2. Open the app and perform normal habit logging.
3. ✅ All features work without any network error.

### 7.2 App Restart — Data Persistence
1. Create habits and mark some complete.
2. Force-close the app and reopen.
3. ✅ All data persists; completion states are preserved.

### 7.3 Long Habit Names
1. Create a habit with a 60-character title.
2. ✅ Title displays without overflow or layout breakage.

### 7.4 Special Characters & Emojis
1. Create a habit titled "Coffee ☕ & Tea 🍵".
2. ✅ Emojis display correctly; the habit saves and loads without issues.

### 7.5 Rapid Toggling
1. Tap a boolean habit on/off 10 times quickly.
2. ✅ The app handles all taps gracefully; the final state is correct.

---

## 8. Accessibility & Visuals

### 8.1 Dark Mode
1. Switch the device to Dark Mode.
2. ✅ All screens use dark backgrounds and light text — no hard-coded white/black remnants.

### 8.2 Theme Consistency
1. Switch Color Theme to **Ocean**.
2. Open every tab (Hub, Tasks, Rewards, Relax, Settings).
3. ✅ Accent colors are consistent across all screens.

---

*Any failures should be reported with: test number, expected vs actual behaviour, device model, and OS version.*
