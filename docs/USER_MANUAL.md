# User Manual — Gamified Habit Tracker

Welcome to your personal habit tracker! This app turns building healthy routines into a rewarding game. Every habit you complete earns you experience points, unlocks Badges, and levels up your Progress Stats.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Daily Tasks — Building Your Habits](#2-daily-tasks--building-your-habits)
3. [Achievements — The Gamification System](#3-achievements--the-gamification-system)
4. [Relax — Ambient Sounds & Music](#4-relax--ambient-sounds--music)
5. [Hub — Your Personal Dashboard](#5-hub--your-personal-dashboard)
6. [Settings](#6-settings)
7. [Tips & Tricks](#7-tips--tricks)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Getting Started

### First Launch — Creating Your Account

When you open the app for the first time, you will see the **Welcome screen**.

**Personal Mode (Recommended)**
Tap **"Continue without password"** and enter your name. Your progress is saved locally on this device — no account or internet connection required.

**Password Mode**
If you share the device with others, tap **"Create Account"** and set a username and password. Each user has their own separate habits and progress.

### Your First Habit
Once you're in, head to the **Tasks** tab (the checklist icon at the bottom). Tap the **+** button in the bottom-right corner to create your first habit.

---

## 2. Daily Tasks — Building Your Habits

The **Tasks** tab is your daily command centre. Every day, your scheduled habits appear here ready to be completed.

### Navigating Days
At the top of the screen you'll see a **date bar** with left and right arrows. Tap the arrows to browse past or future days, or tap the date itself to jump to any specific day with the date picker.

### Creating a Habit

Tap the **+** button to open the habit creation form.

| Field | What to enter |
|---|---|
| **Title** | What you want to do (e.g. "Morning Walk") |
| **Description** | Optional notes |
| **Category** | Choose from presets like Exercise, Nutrition, Daily Routines, etc. |
| **Preset** | Pick a predefined habit template (optional) |
| **Schedule** | Daily, Weekly (pick which days), or Once (pick a target date) |
| **End Date** | Optional — leave empty for a forever habit |
| **Time of Day** | Morning, Late Morning, Afternoon, Evening, or All Day |
| **Unit & Goal** | For counter habits (e.g. "2 L of water") — leave blank for simple yes/no habits |
| **Reminder** | Enable to receive a push notification |

> **Boolean vs Counter habits:** If you leave the Unit and Goal fields empty, the habit is a simple **yes/no tick**. If you fill them in (e.g. Unit: "km", Goal: "5"), it becomes a **counter** where you tap to enter how much you did.

Tap **Save** to create the habit.

### Completing Habits

**Boolean (yes/no) habit:** Tap the habit card. It will turn highlighted to show it's complete. Tap again to undo.

**Counter habit:** Tap the card to open a value picker. Enter today's count (e.g. 2.5 L of water) and confirm. The card shows your progress toward the daily goal.

### Habit Details
Long-press a habit card (or tap the three-dot menu) to open **Habit Details**. Here you can view stats, edit the habit, toggle its reminder, or delete it.

### Time Sections
Habits are automatically grouped into sections by their scheduled time of day — **Morning**, **Late Morning**, **Afternoon**, **Evening**, and **All Day** — so you can tackle them in the right order.

### Pull to Refresh
Pull down on the habits list to refresh data from the database.

---

## 3. Achievements — The Gamification System

The **Achievements** tab is where the game lives. It has three sections accessible via the tab bar at the top: **Goals**, **Badges**, and **Progress**.

### Goals — Custom Personal Achievements

Create your own personal milestones.

**To create a goal:**
1. Tap the **+** button on the Goals tab.
2. Give it a title, description, and choose an icon (medal 🥇, trophy 🏆, or flower 🌸).
3. Add one or more **criteria** — each criterion links to one of your habits and sets a rule:
   - **Streak:** Complete the habit N days in a row.
   - **Total Count:** Complete the habit N times total (optionally within the last D days).
   - **Sum Value:** Accumulate a total value of N (useful for counter habits like steps or water).
4. All criteria must be met simultaneously for the goal to unlock.

Once a goal is achieved, it appears in the **Unlocked** section with a golden glow. Goals where the linked habits have expired (past their end date) appear as **Missed**.

**Long-press** any goal card to delete it.


### Badges — Milestone Achievements

Badges are surprise achievements you earn by repeating specific preset habits. You won't know exactly how to earn them until you do — they appear automatically when you hit a hidden milestone.

Examples:
- Walk regularly enough times and you'll earn hiking badges 🌳🧭🗺️
- Visit the gym often enough for fitness badges 💪
- Complete your morning routines consistently for daily rhythm badges ☀️

New, unread badges show up with a notification dot on the Achievements tab icon. Opening the Badges section marks them all as seen.

### Progress — Leveling System

Every habit category has its own **Progress Stat** that levels up as you complete habits in that category.

**Habit Categories → Progress Stats:**
| Category | Stat |
|---|---|
| Exercise | Strength |
| Nutrition | Vitality |
| Daily Routines | Discipline |
| Daily Rhythm | Balance |
| Cleaning | Order |
| Responsibilities | Wisdom |
| Group Activities | Charisma |

**Level Formula:** `Level = floor(√completed) + 1`

This means early levels come fast and later levels require sustained consistency.

**Rank Titles:**
| Levels | Rank |
|---|---|
| 1–4 | Novice |
| 5–9 | Adept |
| 10–14 | Master |
| 15–19 | Expert |
| 20–24 | Hero |
| 25+ | Legend |

Each stat card shows your current level, rank title, progress bar to the next level, and last activity date.

### Celebratory Toasts

Whenever you unlock something special — a goal, a badge, or a level-up — a **pop-up notification** (toast) slides in from the bottom of the screen. Tap it to jump straight to the relevant reward in the Achievements tab.

You can control whether toasts appear and whether they play a sound in **Settings → Notifications & Feedback**.

---

## 4. Relax — Ambient Sounds & Music

The **Relax** tab is your personal soundscape. Use it for focus, meditation, or winding down. It has two modes selectable at the top: **Ambient Sounds** and **Music**.

### Ambient Soundscape

The **Ambient Sounds** lets you blend up to 7 ambient sound loops simultaneously:

| Sound | Icon |
|---|---|
| Rain | 🌧 |
| Fire (crackling) | 🔥 |
| Birds / Wind | 🌬 |
| Morning Ambiance | ☀️ |
| Acoustic Guitar | 🎵 |
| Piano Melody 1 | 🎹 |
| Piano Melody 2 | 🎧 |

**How to use:**
1. Tap **Play** at the top to start playback.
2. Drag the slider under each sound to set its volume (0% = off, 100% = full).
3. Mix and match — for example: Rain at 60% + Fire at 40% + Piano at 30% for a cozy study atmosphere.
4. Tap **Pause** to mute everything at once.

> Audio continues playing in the background and through silent mode on iPhone, so you can lock your screen and keep listening.

### Music — Background Tracks

The **Music Player** plays a single background music track at a time.

Tap a track card to start playing it. The play/pause button on the right lets you pause and resume. Tap a different track to switch.

Currently available:
- Guitar Piece 1
- Guitar Piece 2

> **Mutual Exclusion:** Starting a Music track automatically pauses the Ambient Sounds, and starting the Ambient Sounds automatically pauses Music — only one audio mode plays at a time.

### Mini Player on Hub

A compact **Music Player Widget** on the Hub dashboard lets you play/pause whichever audio mode was last active without leaving the Hub screen.

---

## 5. Hub — Your Personal Dashboard

The **Hub** (home tab) gives you a bird's-eye view of your progress at a glance.

### Daily Progress Widget
A circular progress ring showing how many of today's habits you've completed vs. total. Tap to go to the Tasks screen.

### Personal Goals Widget
Shows your total custom goals and how many you've unlocked. Tap to jump to the Goals tab.

### Badges Widget
Displays your most recently earned badges and the count of unread ones. Tap to jump to the Badges tab.

### Progress Widget
Shows your top 3 Progress Stat levels (sorted by level, then progress). Tap to jump to the Progress tab.

### Music Player Widget
A quick control to play or pause your last active audio source (Ambient Sounds or Music Player). Tap to toggle, or visit the Relax tab for full controls.

---

## 6. Settings

Access Settings via the gear icon in the tab bar.

### Profile
Displays your username, user ID, and account creation date.

### Language
Switch the app language between **English** and **Finnish**.

### Appearance
- **Theme Mode:** Choose Light or Dark (follows your system setting by default).
- **Color Theme:** Select one of four accent color palettes — Default (blue), Forest (green), Ocean (teal), or Coffee (warm brown).

### Notifications & Feedback
- **Pop-up Toasts:** Toggle the celebratory toast notifications on/off.
- **Sound Effects:** Toggle the sound that plays with each toast (only available when Toasts are enabled).

### Account
- **Log Out:** Signs you out (your data stays on the device).
- **Delete Account:** Permanently removes your account and all associated habits and data. This action cannot be undone.

---

## 7. Tips & Tricks

**Start small.** Create 2–3 boolean habits first. Once completing them feels natural, add counter habits.

**Use Time of Day.** Assigning a time slot to each habit groups them in the Tasks screen, making it easy to work through morning habits, then afternoon habits in order.

**Build streaks for badges.** Many Badges are tied to specific preset habits. Use the built-in presets (Walking, Gym, Hydration, etc.) to unlock themed badge collections.

**Mix audio for focus.** Try Rain at 50% + Piano at 40% while working. The Ambient Sounds remembers your volumes between sessions.

**Check the Hub every morning.** The Daily Progress ring is a powerful visual motivator — seeing it fill up throughout the day encourages you to complete "just one more."

**Unlock Developer Mode (for testing).** Tap the logo at the bottom of the Settings screen 5 times quickly to reveal the internal DevTools tab. This lets you generate mock data, reset the database, and test notifications.

---

## 8. Troubleshooting

**Toasts don't appear when I level up or earn a badge.**
Open **Settings → Notifications & Feedback** and make sure **Pop-up Toasts** is toggled on.

**No sound plays with toasts.**
Toasts require Toasts to be enabled first. In **Settings → Notifications & Feedback**, verify both **Pop-up Toasts** and **Sound Effects** are on. Also check your device's media volume.

**Audio doesn't play in the Relax tab.**
Tap the **Play** button at the top of the Ambient Sounds panel. If you recently switched from Music to Ambient Sounds (or vice versa), the previous mode was automatically paused — just tap Play again.

**My habits from yesterday don't appear today.**
Only habits scheduled for today's date and frequency appear. Use the date arrows at the top of the Tasks screen to navigate back to the correct day.

**The app seems to forget my progress after reinstalling.**
All data is stored locally on this device. Uninstalling the app permanently deletes all habits, logs, and achievements. There is no cloud backup.

---

*Happy habit building! 🌟*
