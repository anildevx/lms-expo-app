import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../hooks/useTheme';
import { useCoursesStore } from '../store';
import type { Course } from '../../../types';

interface CourseCardProps {
  course: Course;
}

const CourseCardComponent: React.FC<CourseCardProps> = ({ course }) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { toggleBookmark, bookmarkedCourses } = useCoursesStore();

  // Memoize bookmark status
  const bookmarked = useMemo(
    () => bookmarkedCourses.includes(course.id),
    [bookmarkedCourses, course.id]
  );

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/course/${course.id}` as any);
  }, [course.id, router]);

  const handleBookmarkPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleBookmark(course.id);
  }, [course.id, toggleBookmark]);

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark"
      style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
    >
      {/* Course Image */}
      <View className="relative">
        <Image
          source={{ uri: course.thumbnail || 'https://via.placeholder.com/400x200' }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Bookmark Button */}
        <TouchableOpacity
          onPress={handleBookmarkPress}
          className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full p-2"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>

        {/* Category Badge */}
        <View className="absolute bottom-3 left-3 bg-primary dark:bg-primary-dark px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {course.category}
          </Text>
        </View>
      </View>

      {/* Course Info */}
      <View className="p-4">
        {/* Instructor */}
        <View className="flex-row items-center mb-2">
          <Image
            source={{ uri: course.instructor.avatar || 'https://via.placeholder.com/40' }}
            className="w-6 h-6 rounded-full mr-2"
          />
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {course.instructor.name}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2" numberOfLines={2}>
          {course.title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark mb-3" numberOfLines={2}>
          {course.description}
        </Text>

        {/* Footer */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={16} color={colors.accent} />
            <Text className="text-base font-bold text-accent ml-1">
              ${course.price}
            </Text>
          </View>

          {course.isEnrolled && (
            <View className="bg-accent/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold text-accent">
                Enrolled
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export const CourseCard = React.memo(CourseCardComponent);
