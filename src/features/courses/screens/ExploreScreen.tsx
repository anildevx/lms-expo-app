import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../hooks/useCourses';
import { CourseCard, CourseCardSkeleton } from '../components';
import { useCoursesStore } from '../store';
import { useTheme } from '../../../hooks/useTheme';
import { useDebounce } from '../../../hooks/useDebounce';
import { useActivityTracker } from '../../../hooks/useActivityTracker';
import { SearchBar } from '../../../components/ui';
import type { Course } from '../../../types';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { loadBookmarks } = useCoursesStore();

  // Track user activity
  useActivityTracker();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCourses(10);

  useEffect(() => {
    loadBookmarks();
  }, []);

  // Filter courses based on search
  const filteredCourses = React.useMemo(() => {
    if (!data?.courses) return [];
    if (!debouncedSearch.trim()) return data.courses;

    const query = debouncedSearch.toLowerCase();
    return data.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor.name.toLowerCase().includes(query)
    );
  }, [data?.courses, debouncedSearch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderCourseItem = useCallback(
    ({ item }: { item: Course }) => <CourseCard course={item} />,
    []
  );

  const renderSkeletonItem = useCallback(
    () => <CourseCardSkeleton />,
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;

    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="search-outline" size={64} color={colors.textMuted} />
        <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-4 mb-2">
          No courses found
        </Text>
        <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center px-8">
          {searchQuery ? 'Try adjusting your search' : 'Start exploring courses'}
        </Text>
      </View>
    );
  }, [isLoading, searchQuery, colors.textMuted]);

  const keyExtractor = useCallback((item: Course) => item.id, []);

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-4 mb-2">
            Oops! Something went wrong
          </Text>
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center mb-4">
            {error?.message || 'Failed to load courses'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Explore Courses
        </Text>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search courses..."
        />
      </View>

      {/* Course List */}
      {isLoading ? (
        <FlashList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeletonItem}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          drawDistance={500}
        />
      ) : (
        <FlashList
          data={filteredCourses}
          keyExtractor={keyExtractor}
          renderItem={renderCourseItem}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          drawDistance={500}
        />
      )}
    </SafeAreaView>
  );
}
