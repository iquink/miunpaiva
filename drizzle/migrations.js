// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_certain_sinister_six.sql';
import m0001 from './0001_left_slipstream.sql';
import m0002 from './0002_optimal_fat_cobra.sql';
import m0003 from './0003_slow_doctor_faustus.sql';
import m0004 from './0004_secret_achievements.sql';
import m0005 from './0005_time_of_day.sql';
import m0006 from './0006_notifications.sql';
import m0007 from './0007_lowly_robin_chapel.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007
    }
  }
  