# Habit Tracker - Multi-User Offline-First App

A local-only habit tracker with gamification elements (achievements) built with React Native and Expo. Supports multiple users on the same device with complete data isolation.

## Features

- 🔐 **Multi-User Support** - Multiple users can use the app on the same device with isolated data
- 📱 **Offline-First** - All data stored locally using SQLite
- ✅ **Habit Tracking** - Track boolean (yes/no) and counter-based habits
- 🏆 **Achievements** - Create custom achievements with different unlock conditions
- 📊 **Streak Tracking** - Monitor consecutive days of habit completion
- 🔒 **Secure** - Password hashing with SHA-256, session management with SecureStore

## Tech Stack

- **Framework:** React Native (Expo SDK 52+)
- **Language:** TypeScript
- **Database:** Expo SQLite (Next)
- **ORM:** Drizzle ORM
- **Navigation:** Expo Router (File-based routing)
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind CSS)
- **Security:** expo-secure-store, expo-crypto
- **Icons:** Lucide React Native
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your Android device

### Installation

1. Clone the repository:
```bash
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app on your Android device

## Project Structure

```
habit-tracker/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app screens
│   │   ├── index.tsx        # Dashboard
│   │   ├── achievements.tsx
│   │   └── settings.tsx
│   └── _layout.tsx          # Root layout with auth protection
├── db/                       # Database layer
│   ├── schema.ts            # Drizzle schema definitions
│   └── index.ts             # Database initialization
├── drizzle/                  # Auto-generated migrations
├── services/                 # Business logic
│   └── achievementService.ts
├── store/                    # Zustand stores
│   └── authStore.ts
└── lib/                      # Utilities
    └── utils.ts
```

## Database Schema

### Tables

- **users** - User accounts with hashed passwords
- **habits** - User-created habits (boolean or counter type)
- **logs** - Daily habit completion records
- **achievements** - User-defined achievements
- **user_achievements** - Unlocked achievement records

All user-generated data tables include a `user_id` column to ensure data isolation.

## Key Features

### Authentication & Security

- SHA-256 password hashing
- Secure session management with expo-secure-store
- Automatic auth state restoration on app launch
- Protected routes with auth guards

### Habit Tracking

- Create boolean (yes/no) or counter habits
- Mark habits complete for any date
- Navigate between dates to view/edit past logs
- Long-press to delete habits

### Achievement System

The achievement engine supports three types of conditions:

1. **Streak** - Consecutive days of completion
2. **Total Count** - Number of completed logs
3. **Sum Value** - Sum of counter values

Achievements are automatically checked when habits are updated.

### Multi-User Data Isolation

All database queries filter by `user_id` to ensure:
- Users only see their own habits, logs, and achievements
- Cascade deletion removes all user data on account deletion
- No data leaks between users

## Security Considerations

- Passwords are hashed using SHA-256 before storage
- Plain text passwords are never stored in the database
- Session tokens stored securely using expo-secure-store
- All user data isolated by user_id with proper foreign key constraints

## Development

### Running migrations

Migrations are automatically run on app startup. To generate new migrations after schema changes:

```bash
npx drizzle-kit generate
```

### Clearing the database

To reset the database during development, uninstall and reinstall the app.

## License

MIT

## Author

Built as a demonstration of offline-first React Native architecture with Drizzle ORM and Expo.
