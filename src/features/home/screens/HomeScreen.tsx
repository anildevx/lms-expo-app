import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../../auth/store';
import { useCoursesStore } from '../../courses/store';
import { useCourses } from '../../courses/hooks/useCourses';
import { useTheme } from '../../../hooks/useTheme';
import { useActivityTracker } from '../../../hooks/useActivityTracker';
import type { Course } from '../../../types';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { colors } = useTheme();
  const { enrolledCourses, getBookmarkCount, loadBookmarks } = useCoursesStore();
  const { data, isLoading } = useCourses(20);

  // Track user activity
  useActivityTracker();

  useEffect(() => {
    loadBookmarks();
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Get enrolled courses
  const enrolledCoursesList = useMemo(() => {
    if (!data?.courses) return [];
    return data.courses.filter(course => enrolledCourses.includes(course.id));
  }, [data?.courses, enrolledCourses]);

  // Get popular/trending courses (first 5 courses)
  const trendingCourses = useMemo(() => {
    if (!data?.courses) return [];
    return data.courses.slice(0, 5);
  }, [data?.courses]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!data?.courses) return [];
    const uniqueCategories = [...new Set(data.courses.map(c => c.category))];
    return uniqueCategories.slice(0, 6);
  }, [data?.courses]);

  const handleCoursePress = useCallback((courseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/course/${courseId}` as any);
  }, [router]);

  const handleCategoryPress = useCallback((category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/explore' as any);
  }, [router]);

  const handleSearchPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/explore' as any);
  }, [router]);

  const renderCourseCard = useCallback((course: Course, showProgress: boolean = false) => (
    <TouchableOpacity
      key={course.id}
      onPress={() => handleCoursePress(course.id)}
      className="mr-4 w-64 bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark"
      style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
    >
      <Image
        source={{ uri: course.thumbnail }}
        className="w-full h-36"
        resizeMode="cover"
      />
      {showProgress && (
        <View className="absolute top-3 right-3 bg-accent px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">In Progress</Text>
        </View>
      )}
      <View className="p-3">
        <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark mb-1" numberOfLines={1}>
          {course.title}
        </Text>
        <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2" numberOfLines={1}>
          {course.instructor.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-accent">${course.price}</Text>
          <View className="bg-primary/10 px-2 py-1 rounded">
            <Text className="text-xs text-primary dark:text-primary-dark">{course.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleCoursePress]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-base text-text-muted-light dark:text-text-muted-dark mb-1">
            {getGreeting()},
          </Text>
          <Text className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {user?.name || 'Student'} 👋
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4" style={{ backgroundColor: colors.primary }}>
            <View className="flex-1 items-center border-r border-white/20">
              <Text className="text-2xl font-bold text-white">{enrolledCourses.length}</Text>
              <Text className="text-xs text-white/80">Enrolled</Text>
            </View>
            <View className="flex-1 items-center border-r border-white/20">
              <Text className="text-2xl font-bold text-white">{getBookmarkCount()}</Text>
              <Text className="text-xs text-white/80">Bookmarks</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-white">0</Text>
              <Text className="text-xs text-white/80">Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleSearchPress}
              className="flex-1 mr-2 bg-surface-light dark:bg-surface-dark rounded-lg p-4 items-center border border-border-light dark:border-border-dark"
            >
              <Ionicons name="search" size={24} color={colors.primary} />
              <Text className="text-xs text-text-primary-light dark:text-text-primary-dark mt-2">Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/bookmarks' as any)}
              className="flex-1 mx-1 bg-surface-light dark:bg-surface-dark rounded-lg p-4 items-center border border-border-light dark:border-border-dark"
            >
              <Ionicons name="bookmark" size={24} color={colors.accent} />
              <Text className="text-xs text-text-primary-light dark:text-text-primary-dark mt-2">Saved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(tabs)/explore' as any)}
              className="flex-1 ml-2 bg-surface-light dark:bg-surface-dark rounded-lg p-4 items-center border border-border-light dark:border-border-dark"
            >
              <Ionicons name="compass" size={24} color={colors.primary} />
              <Text className="text-xs text-text-primary-light dark:text-text-primary-dark mt-2">Explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Learning */}
        {enrolledCoursesList.length > 0 && (
          <View className="mb-6">
            <View className="px-6 mb-3 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Continue Learning
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary dark:text-primary-dark">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {enrolledCoursesList.map(course => renderCourseCard(course, true))}
            </ScrollView>
          </View>
        )}

        {/* Trending Courses */}
        {!isLoading && trendingCourses.length > 0 && (
          <View className="mb-6">
            <View className="px-6 mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Trending Courses
                </Text>
                <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                  Popular picks this week 🔥
                </Text>
              </View>
              <TouchableOpacity onPress={handleSearchPress}>
                <Text className="text-sm text-primary dark:text-primary-dark">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {trendingCourses.map(course => renderCourseCard(course))}
            </ScrollView>
          </View>
        )}

        {/* Course Categories */}
        {categories.length > 0 && (
          <View className="mb-6">
            <View className="px-6 mb-3">
              <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Browse by Category
              </Text>
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                Find courses that match your interests
              </Text>
            </View>
            <View className="px-6 flex-row flex-wrap">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCategoryPress(category)}
                  className="bg-surface-light dark:bg-surface-dark rounded-lg px-4 py-3 mr-2 mb-2 border border-border-light dark:border-border-dark"
                >
                  <Text className="text-sm text-text-primary-light dark:text-text-primary-dark">
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Learning Tips */}
        <View className="px-6 mb-8">
          <View className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bulb" size={20} color={colors.accent} />
              <Text className="text-base font-bold text-text-primary-light dark:text-text-primary-dark ml-2">
                Learning Tip
              </Text>
            </View>
            <Text className="text-sm text-text-muted-light dark:text-text-muted-dark leading-5">
              Set aside 30 minutes daily for consistent learning. Small, regular sessions are more effective than long, irregular ones.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
