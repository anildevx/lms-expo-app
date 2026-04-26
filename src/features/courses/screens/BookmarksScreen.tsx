import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../hooks/useCourses';
import { CourseCard, CourseCardSkeleton } from '../components';
import { useCoursesStore } from '../store';
import { useTheme } from '../../../hooks/useTheme';
import type { Course } from '../../../types';

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const { loadBookmarks, bookmarkedCourses } = useCoursesStore();
  const { data, isLoading } = useCourses(50);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  // Filter bookmarked courses
  const bookmarkedCoursesList = (data?.courses || []).filter((course) =>
    bookmarkedCourses.includes(course.id)
  );

  const bookmarkCount = bookmarkedCourses.length;

  const renderCourseItem = useCallback(
    ({ item }: { item: Course }) => <CourseCard course={item} />,
    []
  );

  const renderSkeletonItem = useCallback(
    () => <CourseCardSkeleton />,
    []
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const renderEmpty = useCallback(() => {
    if (isLoading || isInitialLoad) return null;

    return (
      <View className="flex-1 justify-center items-center py-12 px-6">
        <Ionicons name="bookmark-outline" size={64} color={colors.textMuted} />
        <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-4 mb-2">
          No Bookmarks Yet
        </Text>
        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
          Start bookmarking courses you&apos;re interested in to see them here
        </Text>
      </View>
    );
  }, [isLoading, isInitialLoad, colors.textMuted]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-4 pb-3 border-b border-border-light dark:border-border-dark">
        <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Bookmarks
        </Text>
        {bookmarkCount > 0 && !isLoading && (
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
            {bookmarkCount} {bookmarkCount === 1 ? 'course' : 'courses'} saved
          </Text>
        )}
      </View>

      {/* Bookmarked Courses List */}
      {isLoading || isInitialLoad ? (
        <FlashList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeletonItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12 }}
          drawDistance={500}
        />
      ) : (
        <FlashList
          data={bookmarkedCoursesList}
          keyExtractor={keyExtractor}
          renderItem={renderCourseItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, flexGrow: 1 }}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          drawDistance={500}
        />
      )}
    </SafeAreaView>
  );
}
