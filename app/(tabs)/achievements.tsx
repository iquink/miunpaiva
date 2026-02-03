import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { eq, sql } from 'drizzle-orm';
import { Award, Lock, Plus, X, Trash2 } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../db';
import {
  achievements,
  userAchievements,
  achievementCriteria,
  habits,
  type Achievement,
  type Habit,
  type AchievementCriterion,
} from '../../db/schema';

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
  criteriaList: AchievementCriterion[];
}

interface CriterionForm {
  habitId: number | null;
  ruleType: 'streak' | 'total_count' | 'sum_value';
  targetValue: string;
  daysPeriod: string;
}

export default function AchievementsScreen() {
  const user = useAuthStore((state) => state.user);
  const [allAchievements, setAllAchievements] = useState<AchievementWithStatus[]>([]);
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [criteriaForms, setCriteriaForms] = useState<CriterionForm[]>([]);

  const loadAchievements = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch user's habits
      const fetchedHabits = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, user.id));

      setUserHabits(fetchedHabits);

      // Fetch achievements for current user
      const fetchedAchievements = await db
        .select()
        .from(achievements)
        .where(eq(achievements.userId, user.id));

      // Fetch unlocked achievements
      const unlocked = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, user.id));

      const unlockedMap = new Map(
        unlocked.map((ua) => [ua.achievementId, ua.unlockedAt])
      );

      // Fetch criteria for each achievement
      const achievementsWithData: AchievementWithStatus[] = [];

      for (const ach of fetchedAchievements) {
        const criteria = await db
          .select()
          .from(achievementCriteria)
          .where(eq(achievementCriteria.achievementId, ach.id));

        achievementsWithData.push({
          ...ach,
          unlocked: unlockedMap.has(ach.id),
          unlockedAt: unlockedMap.get(ach.id),
          criteriaList: criteria,
        });
      }

      setAllAchievements(achievementsWithData);
    } catch (error) {
      console.error('Error loading achievements:', error);
      Alert.alert('Error', 'Failed to load achievements');
    }
  }, [user]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAchievements();
    setRefreshing(false);
  };

  const addCriterionForm = () => {
    setCriteriaForms([
      ...criteriaForms,
      {
        habitId: null,
        ruleType: 'streak',
        targetValue: '',
        daysPeriod: '0',
      },
    ]);
  };

  const removeCriterionForm = (index: number) => {
    setCriteriaForms(criteriaForms.filter((_, i) => i !== index));
  };

  const updateCriterionForm = (index: number, updates: Partial<CriterionForm>) => {
    const updated = [...criteriaForms];
    updated[index] = { ...updated[index], ...updates };
    setCriteriaForms(updated);
  };

  const handleAddAchievement = async () => {
    if (!user || !title.trim()) {
      Alert.alert('Error', 'Please enter an achievement title');
      return;
    }

    if (criteriaForms.length === 0) {
      Alert.alert('Error', 'Please add at least one criterion');
      return;
    }

    // Validate all criteria
    for (const criterion of criteriaForms) {
      if (!criterion.habitId || !criterion.targetValue) {
        Alert.alert('Error', 'Please fill in all criterion fields');
        return;
      }
    }

    try {
      // Create achievement
      const [newAchievement] = await db
        .insert(achievements)
        .values({
          userId: user.id,
          title: title.trim(),
          description: description.trim() || null,
        })
        .returning();

      // Create all criteria
      for (const criterion of criteriaForms) {
        await db.insert(achievementCriteria).values({
          achievementId: newAchievement.id,
          habitId: criterion.habitId!,
          ruleType: criterion.ruleType,
          targetValue: parseInt(criterion.targetValue, 10),
          daysPeriod: parseInt(criterion.daysPeriod, 10),
        });
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCriteriaForms([]);
      setShowAddForm(false);

      await loadAchievements();
    } catch (error) {
      console.error('Error creating achievement:', error);
      Alert.alert('Error', 'Failed to create achievement');
    }
  };

  const deleteAchievement = async (achievementId: number) => {
    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this achievement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.delete(achievements).where(eq(achievements.id, achievementId));
              await loadAchievements();
            } catch (error) {
              console.error('Error deleting achievement:', error);
              Alert.alert('Error', 'Failed to delete achievement');
            }
          },
        },
      ]
    );
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case 'streak':
        return 'Day Streak';
      case 'total_count':
        return 'Total Count';
      case 'sum_value':
        return 'Sum Value';
      default:
        return type;
    }
  };

  const getHabitName = (habitId: number) => {
    return userHabits.find((h) => h.id === habitId)?.title || 'Unknown Habit';
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pb-4 pt-12">
        <Text className="text-2xl font-bold text-gray-900">Achievements</Text>
        <Text className="mt-1 text-gray-600">Track your milestones</Text>
      </View>

      {/* Achievements List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {allAchievements.length === 0 ? (
          <View className="mt-8 items-center">
            <Text className="text-gray-500">No achievements yet. Create your first one!</Text>
          </View>
        ) : (
          <>
            {/* Unlocked Achievements */}
            <Text className="mb-3 text-sm font-semibold uppercase text-gray-500">
              Unlocked
            </Text>
            {allAchievements.filter((a) => a.unlocked).length === 0 ? (
              <Text className="mb-4 text-gray-400">No unlocked achievements yet</Text>
            ) : (
              allAchievements
                .filter((a) => a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 p-4"
                  >
                    <View className="flex-row items-start">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                        <Award color="white" size={24} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900">
                          {achievement.title}
                        </Text>
                        {achievement.description && (
                          <Text className="mt-1 text-xs text-gray-600">
                            {achievement.description}
                          </Text>
                        )}
                        <View className="mt-2">
                          {achievement.criteriaList.map((criterion, idx) => (
                            <Text key={idx} className="text-xs text-gray-500">
                              • {getHabitName(criterion.habitId)}:{' '}
                              {getRuleTypeLabel(criterion.ruleType)} {criterion.targetValue}
                              {criterion.daysPeriod > 0 &&
                                ` (${criterion.daysPeriod} days)`}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}

            {/* Locked Achievements */}
            <Text className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500">
              Locked
            </Text>
            {allAchievements.filter((a) => !a.unlocked).length === 0 ? (
              <Text className="text-gray-400">All achievements unlocked!</Text>
            ) : (
              allAchievements
                .filter((a) => !a.unlocked)
                .map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    onLongPress={() => deleteAchievement(achievement.id)}
                    className="mb-3 rounded-xl bg-gray-200 p-4"
                  >
                    <View className="flex-row items-start">
                      <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-400">
                        <Lock color="white" size={24} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-700">
                          {achievement.title}
                        </Text>
                        {achievement.description && (
                          <Text className="mt-1 text-xs text-gray-500">
                            {achievement.description}
                          </Text>
                        )}
                        <View className="mt-2">
                          {achievement.criteriaList.map((criterion, idx) => (
                            <Text key={idx} className="text-xs text-gray-500">
                              • {getHabitName(criterion.habitId)}:{' '}
                              {getRuleTypeLabel(criterion.ruleType)} {criterion.targetValue}
                              {criterion.daysPeriod > 0 &&
                                ` (${criterion.daysPeriod} days)`}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </>
        )}
      </ScrollView>

      {/* Add Achievement Button */}
      {!showAddForm && (
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        >
          <Plus color="white" size={28} />
        </TouchableOpacity>
      )}

      {/* Add Achievement Form */}
      {showAddForm && (
        <ScrollView className="max-h-[500px] border-t border-gray-200 bg-white p-6">
          <Text className="mb-4 text-lg font-bold text-gray-900">New Achievement</Text>

          <TextInput
            className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Achievement title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            className="mb-4 rounded-lg border border-gray-300 px-4 py-3"
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
          />

          {/* Criteria Forms */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-gray-700">
              Criteria (All must be met)
            </Text>

            {criteriaForms.map((criterion, index) => (
              <View key={index} className="mb-3 rounded-lg border border-gray-300 p-3">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-medium text-gray-700">Criterion {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeCriterionForm(index)}>
                    <Trash2 color="#ef4444" size={18} />
                  </TouchableOpacity>
                </View>

                {/* Habit Selection */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                  {userHabits.map((habit) => (
                    <TouchableOpacity
                      key={habit.id}
                      onPress={() => updateCriterionForm(index, { habitId: habit.id })}
                      className={`mr-2 rounded-lg border px-3 py-2 ${
                        criterion.habitId === habit.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          criterion.habitId === habit.id ? 'text-blue-500' : 'text-gray-600'
                        }`}
                      >
                        {habit.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Rule Type */}
                <View className="mb-2 flex-row gap-2">
                  {(['streak', 'total_count', 'sum_value'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => updateCriterionForm(index, { ruleType: type })}
                      className={`flex-1 rounded-lg border py-2 ${
                        criterion.ruleType === type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-center text-xs ${
                          criterion.ruleType === type ? 'text-blue-500' : 'text-gray-600'
                        }`}
                      >
                        {getRuleTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Target & Period */}
                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Target"
                    value={criterion.targetValue}
                    onChangeText={(val) => updateCriterionForm(index, { targetValue: val })}
                    keyboardType="numeric"
                  />
                  <TextInput
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Days (0=all)"
                    value={criterion.daysPeriod}
                    onChangeText={(val) => updateCriterionForm(index, { daysPeriod: val })}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addCriterionForm}
              className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 py-3"
            >
              <Text className="text-center font-semibold text-blue-500">+ Add Criterion</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setShowAddForm(false);
                setTitle('');
                setDescription('');
                setCriteriaForms([]);
              }}
              className="flex-1 rounded-lg border border-gray-300 py-3"
            >
              <Text className="text-center font-semibold text-gray-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddAchievement}
              className="flex-1 rounded-lg bg-blue-500 py-3"
            >
              <Text className="text-center font-semibold text-white">Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
