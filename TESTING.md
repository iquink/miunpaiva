# Testing Guide - Habit Tracker

This guide provides step-by-step instructions to test all features of the Multi-User Habit Tracker application.

## Prerequisites

1. Expo Go app installed on Android device
2. Development server running (`npm start`)
3. Device and computer on same network

## Test Scenarios

### 1. User Registration & Authentication

#### Test 1.1: Register New User
1. Open app in Expo Go
2. Should see Login screen
3. Tap "Sign Up" link
4. Enter username: `testuser1`
5. Enter password: `password123`
6. Confirm password: `password123`
7. Tap "Sign Up"
8. ✅ Should redirect to Dashboard
9. ✅ Should see "Welcome, testuser1!"

#### Test 1.2: Password Validation
1. On Register screen
2. Enter username: `u1` (too short)
3. Enter password: `123` (too short)
4. Tap "Sign Up"
5. ✅ Should show error: "Username must be at least 3 characters"

#### Test 1.3: Duplicate Username
1. On Register screen
2. Enter username: `testuser1` (already exists)
3. Enter password: `password123`
4. Tap "Sign Up"
5. ✅ Should show error: "Username already exists"

#### Test 1.4: Login
1. Navigate to Login screen
2. Enter username: `testuser1`
3. Enter password: `password123`
4. Tap "Sign In"
5. ✅ Should redirect to Dashboard

#### Test 1.5: Wrong Password
1. On Login screen
2. Enter username: `testuser1`
3. Enter password: `wrongpassword`
4. Tap "Sign In"
5. ✅ Should show error: "Invalid username or password"

#### Test 1.6: Session Persistence
1. Login as `testuser1`
2. Close app (swipe away)
3. Reopen app
4. ✅ Should automatically show Dashboard (no login required)

### 2. Habit Management

#### Test 2.1: Create Boolean Habit
1. On Dashboard, tap "+" button
2. Enter habit name: "Morning Meditation"
3. Keep "Yes/No" selected
4. Tap "Add"
5. ✅ Should see habit in list
6. ✅ Habit should show as not completed (gray circle with X)

#### Test 2.2: Create Counter Habit
1. On Dashboard, tap "+" button
2. Enter habit name: "Push-ups"
3. Select "Counter"
4. Tap "Add"
5. ✅ Should see habit in list

#### Test 2.3: Complete Habit
1. Tap on "Morning Meditation" habit
2. ✅ Should turn green
3. ✅ Should show checkmark
4. Tap again
5. ✅ Should toggle back to gray/incomplete

#### Test 2.4: Delete Habit
1. Long-press on "Morning Meditation"
2. ✅ Should show confirmation dialog
3. Tap "Delete"
4. ✅ Habit should be removed from list

#### Test 2.5: Date Navigation
1. Create a habit: "Daily Journal"
2. Mark it complete for today
3. Tap left arrow to go to yesterday
4. ✅ Habit should show as not completed
5. Mark it complete
6. Tap right arrow to return to today
7. ✅ Should show today's completion status

#### Test 2.6: Pull to Refresh
1. Pull down on habit list
2. ✅ Should show refresh indicator
3. ✅ List should reload

### 3. Multi-User Data Isolation

#### Test 3.1: Second User Registration
1. Logout from settings
2. Register new user: `testuser2` / `password123`
3. Create habit: "Read Books"
4. Mark it complete
5. ✅ Should see only "Read Books" (not testuser1's habits)

#### Test 3.2: Verify Data Isolation
1. Logout
2. Login as `testuser1`
3. ✅ Should NOT see "Read Books"
4. ✅ Should only see testuser1's habits

#### Test 3.3: Switch Between Users
1. Logout
2. Login as `testuser2`
3. ✅ Should see testuser2's data
4. Logout
5. Login as `testuser1`
6. ✅ Should see testuser1's data

### 4. Achievements System

#### Test 4.1: Create Achievement
1. Navigate to Achievements tab
2. Tap "+" button
3. Enter title: "7 Day Streak"
4. Select "Day Streak" as rule type
5. Enter target value: `7`
6. Select a habit from the list
7. Tap "Add"
8. ✅ Should appear in "Locked" section

#### Test 4.2: Achievement for Total Count
1. Create achievement: "100 Completions"
2. Select "Total Count"
3. Target: `100`
4. Link to a habit
5. Tap "Add"
6. ✅ Should appear as locked

#### Test 4.3: Delete Achievement
1. Long-press on any achievement
2. ✅ Should show confirmation
3. Tap "Delete"
4. ✅ Should be removed

#### Test 4.4: Achievement Unlocking (Streak)
1. Create habit: "Exercise"
2. Create achievement: "3 Day Streak", type: Streak, target: 3
3. Link to "Exercise" habit
4. Mark "Exercise" complete for today
5. Change date to yesterday, mark complete
6. Change date to 2 days ago, mark complete
7. Return to today, toggle the habit again to trigger check
8. Go to Achievements tab
9. ✅ Achievement should be in "Unlocked" section
10. ✅ Should have gold/yellow background

#### Test 4.5: Achievement Unlocking (Total Count)
1. Create habit: "Water"
2. Create achievement: "10 Times", type: Total Count, target: 10
3. Link to "Water" habit
4. Complete the habit 10 times (toggle on/off, change dates)
5. ✅ Achievement should unlock after 10th completion

### 5. Settings & Account Management

#### Test 5.1: View Account Info
1. Navigate to Settings tab
2. ✅ Should display current username
3. ✅ Should show user ID
4. ✅ Should show member since date

#### Test 5.2: Logout
1. On Settings screen, tap "Logout"
2. ✅ Should show confirmation dialog
3. Tap "Logout"
4. ✅ Should redirect to Login screen
5. Try to go back
6. ✅ Should stay on Login screen (can't access tabs)

#### Test 5.3: Delete Account
1. Login as a test user
2. Create some habits and achievements
3. Go to Settings
4. Scroll to "Danger Zone"
5. Tap "Delete Account"
6. ✅ Should show warning about permanent deletion
7. Tap "Delete"
8. ✅ Should redirect to Login screen
9. ✅ Should show success message
10. Try to login with deleted credentials
11. ✅ Should fail with "Invalid username or password"

### 6. Edge Cases & Error Handling

#### Test 6.1: Empty States
1. Register brand new user
2. ✅ Dashboard should show "No habits yet"
3. ✅ Achievements should show "No achievements yet"

#### Test 6.2: Network Independence
1. Enable airplane mode
2. Open app
3. ✅ App should work normally (offline-first)
4. Create habits, mark complete
5. ✅ All features should work

#### Test 6.3: Form Cancellation
1. Tap "+" to add habit
2. Enter some text
3. Tap "Cancel"
4. ✅ Form should close
5. ✅ Text should be cleared
6. Tap "+" again
7. ✅ Form should be empty

#### Test 6.4: Long Habit Names
1. Create habit with very long name (50+ characters)
2. ✅ Should display properly without overflow
3. ✅ Should be tappable

#### Test 6.5: Special Characters
1. Create habit: "Coffee ☕ & Tea 🍵"
2. ✅ Should save and display emojis correctly

### 7. UI/UX Testing

#### Test 7.1: Tab Navigation
1. Tap Dashboard tab
2. ✅ Should show dashboard
3. Tap Achievements tab
4. ✅ Should show achievements
5. Tap Settings tab
6. ✅ Should show settings
7. ✅ Active tab should be highlighted

#### Test 7.2: Loading States
1. Watch for loading indicator during app launch
2. ✅ Should show spinner while initializing database
3. ✅ Should transition smoothly to login/dashboard

#### Test 7.3: Visual Feedback
1. Tap any button
2. ✅ Should show visual response (opacity/color change)
3. Mark habit complete
4. ✅ Should animate color change
5. ✅ Icon should change from X to checkmark

### 8. Data Persistence

#### Test 8.1: App Restart
1. Create habits and mark some complete
2. Create achievements
3. Close app completely
4. Reopen app
5. ✅ All data should persist
6. ✅ Completion states should be preserved
7. ✅ Unlocked achievements should remain unlocked

#### Test 8.2: Date-Specific Logs
1. Mark habit complete for today
2. Navigate to yesterday
3. ✅ Should show as not complete
4. Mark complete for yesterday
5. Go back to today
6. ✅ Today's completion should still be there

## Performance Testing

### Test P.1: Large Dataset
1. Create 20+ habits
2. Mark various habits complete over 30+ days
3. Create 10+ achievements
4. Navigate through app
5. ✅ Should remain responsive
6. ✅ Scrolling should be smooth

### Test P.2: Rapid Interactions
1. Quickly toggle habit completion on/off multiple times
2. ✅ Should handle all taps
3. ✅ Final state should be correct

## Security Testing

### Test S.1: Session Hijacking Prevention
1. Login as user1
2. Note session in secure store (dev only)
3. ✅ Cannot manually access other user data without proper login

### Test S.2: Password Verification
1. Check database (dev only)
2. ✅ Passwords should be hashed (not plain text)
3. ✅ Hash should be consistent for same password

### Test S.3: Cascade Deletion
1. Create user with habits, logs, and achievements
2. Delete account
3. Check database (dev only)
4. ✅ All related records should be deleted

## Success Criteria

All tests should pass with ✅ marks. Any failures should be documented and addressed.

## Reporting Issues

If you encounter issues:
1. Note the test number (e.g., Test 2.3)
2. Describe expected vs actual behavior
3. Include device info and Expo Go version
4. Check console logs for errors

## Additional Manual Testing

- Test on different Android versions
- Test with different screen sizes
- Test with system theme changes (light/dark)
- Test with different date formats
- Test accessibility features (TalkBack)

---

**Happy Testing! 🎉**
