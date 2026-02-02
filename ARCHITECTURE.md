# Project Architecture Overview

## 📁 Directory Structure

```
habit-tracker/
│
├── 📱 app/                          # Expo Router screens
│   ├── _layout.tsx                 # Root layout (auth protection)
│   ├── (auth)/                     # Public routes
│   │   ├── _layout.tsx
│   │   ├── login.tsx              # Login screen
│   │   └── register.tsx           # Registration screen
│   └── (tabs)/                     # Protected routes
│       ├── _layout.tsx            # Tab navigation
│       ├── index.tsx              # Dashboard (habit tracking)
│       ├── achievements.tsx       # Achievement management
│       └── settings.tsx           # User settings
│
├── 🗄️ db/                          # Database layer
│   ├── schema.ts                  # Drizzle schema (5 tables)
│   └── index.ts                   # DB initialization & migrations
│
├── 🔄 drizzle/                     # Auto-generated migrations
│   ├── 0000_*.sql                 # SQL migration files
│   ├── migrations.js              # Migration loader
│   └── meta/                      # Migration metadata
│
├── 🏪 store/                       # State management
│   └── authStore.ts               # Zustand auth store
│
├── ⚙️ services/                    # Business logic
│   └── achievementService.ts      # Achievement engine
│
├── 🛠️ lib/                         # Utilities
│   └── utils.ts                   # Helper functions
│
├── 🎨 assets/                      # Images & icons
│
├── 📝 Configuration Files
│   ├── drizzle.config.ts          # Drizzle ORM config
│   ├── metro.config.js            # Metro bundler (SQL support)
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── tsconfig.json              # TypeScript config
│   ├── app.json                   # Expo config
│   ├── package.json               # Dependencies
│   └── babel.config.js            # Babel config
│
└── 📚 Documentation
    ├── README.md                  # Project overview
    ├── IMPLEMENTATION.md          # Implementation details
    └── TESTING.md                 # Testing guide
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     User Interaction                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 React Components (UI)                    │
│  • Login/Register                                        │
│  • Dashboard (Habit List)                                │
│  • Achievements                                          │
│  • Settings                                              │
└──────────────────────┬──────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
┌──────────────────┐    ┌──────────────────┐
│  Zustand Store   │    │  Direct DB Ops   │
│  (Auth State)    │    │  (Habits, Logs)  │
└────────┬─────────┘    └─────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│         expo-secure-store               │
│      (Session Persistence)              │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Drizzle ORM Layer               │
│  • Type-safe queries                    │
│  • User filtering                       │
│  • Joins & relationships                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Expo SQLite (Next)              │
│  • Local database storage               │
│  • ACID transactions                    │
│  • Foreign keys & constraints           │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Device Local Storage               │
│      (habit_tracker.db)                 │
└─────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
App Launch
    │
    ▼
┌──────────────────┐
│ Root Layout      │
│ (_layout.tsx)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Run Database Migrations      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Initialize Auth Store        │
│ • Check SecureStore          │
│ • Load user if session found│
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Session     [No
 Found]      Session]
    │         │
    │         ▼
    │    ┌─────────────┐
    │    │ Login/      │
    │    │ Register    │
    │    └──────┬──────┘
    │           │
    │           ▼
    │    ┌──────────────────┐
    │    │ Hash Password    │
    │    │ (SHA-256)        │
    │    └──────┬───────────┘
    │           │
    │           ▼
    │    ┌──────────────────┐
    │    │ Verify/Create    │
    │    │ User in DB       │
    │    └──────┬───────────┘
    │           │
    │           ▼
    │    ┌──────────────────┐
    │    │ Save Session to  │
    │    │ SecureStore      │
    │    └──────┬───────────┘
    │           │
    └───────────┴──────┐
                       ▼
                ┌──────────────┐
                │ Dashboard    │
                │ (Protected)  │
                └──────────────┘
```

## 🏆 Achievement Engine Flow

```
User Toggles Habit
        │
        ▼
┌──────────────────────┐
│ Update Log in DB     │
│ (completed = true)   │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────────┐
│ Call checkAchievements()       │
│ (userId, habitId)              │
└──────────┬─────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│ Fetch Locked Achievements      │
│ WHERE user_id = userId         │
│   AND linked_habit = habitId   │
│   AND NOT unlocked             │
└──────────┬─────────────────────┘
           │
           ▼
    ┌──────┴──────┐
    │             │
    ▼             ▼
[For Each Achievement]
    │
    ├─► Rule Type: STREAK
    │   └─► Check consecutive days
    │       └─► Query logs DESC by date
    │           └─► Count unbroken chain
    │
    ├─► Rule Type: TOTAL_COUNT
    │   └─► Count completed logs
    │       └─► Apply date filter if needed
    │           └─► Compare to target
    │
    └─► Rule Type: SUM_VALUE
        └─► Sum log values
            └─► Apply date filter if needed
                └─► Compare to target
                │
                ▼
        ┌───────────────┐
        │ Target Met?   │
        └───┬───────┬───┘
            │       │
          YES      NO
            │       │
            ▼       ▼
    ┌───────────┐ [Skip]
    │ Insert    │
    │ into      │
    │ user_     │
    │ achieve   │
    │ ments     │
    └───────────┘
```

## 🔒 Data Security Layers

```
┌─────────────────────────────────────────┐
│          Application Layer              │
│  • Input validation                     │
│  • Form sanitization                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         Authentication Layer            │
│  • SHA-256 password hashing             │
│  • Secure session tokens                │
│  • expo-secure-store encryption         │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         Authorization Layer             │
│  • User ID filtering (EVERY query)      │
│  • Row-level security via user_id       │
│  • No cross-user data access            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  • Foreign key constraints              │
│  • CASCADE DELETE on user removal       │
│  • NOT NULL constraints                 │
│  • Unique constraints (username)        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         Storage Layer                   │
│  • Local SQLite file                    │
│  • Device-level encryption (OS)         │
│  • No network transmission              │
└─────────────────────────────────────────┘
```

## 📊 Database Relationships

```
         users
           │
           │ (1:N)
           ├──────────────┐
           │              │
           ▼              ▼
        habits      achievements
           │              │
     (1:N) │              │ (M:N via user_achievements)
           │              │
           ▼              ▼
         logs      user_achievements
                          │
                          │ (references)
                          ▼
                    achievements
```

## 🎨 UI Component Hierarchy

```
App
├── RootLayout (_layout.tsx)
│   ├── AuthGroup (auth)
│   │   ├── Login
│   │   └── Register
│   │
│   └── TabsGroup (tabs)
│       ├── TabLayout
│       │   ├── Dashboard (index)
│       │   │   ├── Header
│       │   │   ├── DateSelector
│       │   │   ├── HabitList
│       │   │   │   └── HabitCard
│       │   │   └── AddHabitForm
│       │   │
│       │   ├── Achievements
│       │   │   ├── Header
│       │   │   ├── UnlockedSection
│       │   │   │   └── AchievementCard
│       │   │   ├── LockedSection
│       │   │   │   └── AchievementCard
│       │   │   └── AddAchievementForm
│       │   │
│       │   └── Settings
│       │       ├── Header
│       │       ├── AccountInfo
│       │       ├── ActionsSection
│       │       └── DangerZone
│       │
│       └── TabBar
│           ├── DashboardTab
│           ├── AchievementsTab
│           └── SettingsTab
```

## 🚀 Execution Flow on App Start

```
1. index.ts
   └─► Registers Expo Router entry

2. app/_layout.tsx
   ├─► Run database migrations
   ├─► Initialize auth store
   ├─► Check session in SecureStore
   │   ├─► If found: Load user → Redirect to /(tabs)
   │   └─► If not: Redirect to /(auth)/login
   └─► Render appropriate route group

3a. /(auth)/login.tsx (if not authenticated)
    └─► User enters credentials
        └─► Hash password → Query DB → Save session
            └─► Redirect to /(tabs)

3b. /(tabs)/index.tsx (if authenticated)
    ├─► Load user's habits
    ├─► Load logs for selected date
    ├─► Render habit list
    └─► Listen for user interactions
        └─► On habit toggle
            ├─► Update/Insert log
            └─► Check achievements
```

## 🔄 State Management Strategy

```
┌──────────────────────────────┐
│      Zustand Store           │
│  • User session data         │
│  • Auth state (loading,      │
│    authenticated)            │
│  • Global actions (login,    │
│    logout, register)         │
└──────────────────────────────┘
           │
           │ (provides)
           ▼
┌──────────────────────────────┐
│    React Components          │
│  • Local state (forms,       │
│    UI toggles)               │
│  • useEffect for DB queries  │
│  • Direct DB access for      │
│    CRUD operations           │
└──────────────────────────────┘
```

**Why this approach?**
- Auth state is global (needed across screens)
- Habit/Achievement data is screen-specific
- No need for complex global state
- Keeps components simple and focused
- Direct DB queries provide fresh data

## 🧩 Key Design Patterns

### 1. Repository Pattern (Implicit)
- Database operations in components
- Drizzle ORM provides abstraction
- Could be extracted to repositories if needed

### 2. Service Layer
- `achievementService.ts` handles complex logic
- Separates business rules from UI

### 3. Provider Pattern
- Zustand provides auth context
- Available to all components via hooks

### 4. Compound Components
- Forms built with reusable parts
- Modal-like overlays for adding items

### 5. Optimistic UI
- Immediate feedback on toggles
- Background achievement checks

## 📦 Dependency Graph

```
Core Dependencies:
├── expo (Framework)
├── react-native (UI)
├── expo-router (Navigation)
├── expo-sqlite (Database)
├── drizzle-orm (ORM)
├── zustand (State)
├── nativewind (Styling)
├── expo-crypto (Security)
├── expo-secure-store (Security)
├── lucide-react-native (Icons)
└── date-fns (Dates)

Dev Dependencies:
├── drizzle-kit (Migrations)
├── typescript (Types)
└── tailwindcss (Styling)
```

## 🎯 Performance Optimizations

1. **Database Indexing**
   - Composite index on (habit_id, date) for logs

2. **Lazy Loading**
   - Screens loaded on-demand via Expo Router

3. **Memoization** (Potential)
   - Could add useMemo for expensive calculations
   - useCallback for event handlers

4. **Local-First Architecture**
   - No network latency
   - Instant interactions
   - Always available

## 🔮 Extensibility Points

1. **Add New Achievement Types**
   - Extend `ruleType` enum in schema
   - Add handler in `achievementService.ts`

2. **Add Habit Properties**
   - Update schema
   - Generate migration
   - Update UI forms

3. **Add Analytics**
   - Create analytics service
   - Track events in components

4. **Add Cloud Sync**
   - Create sync service
   - Add API layer
   - Handle conflicts

This architecture provides a solid foundation for growth while maintaining simplicity and type safety throughout.
