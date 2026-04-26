import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCourse, useEnrollCourse } from '../../src/features/courses/hooks/useCourses';
import { useCoursesStore } from '../../src/features/courses/store';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/ui';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { toggleBookmark, bookmarkedCourses, enrolledCourses } = useCoursesStore();
  const { data: course, isLoading, isError, error } = useCourse(id || '');
  const enrollMutation = useEnrollCourse();

  const bookmarked = course ? bookmarkedCourses.includes(course.id) : false;
  const enrolled = course ? enrolledCourses.includes(course.id) : false;

  const handleBookmarkPress = () => {
    if (!course) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleBookmark(course.id);
  };

  const handleEnrollPress = async () => {
    if (!course) return;

    try {
      await enrollMutation.mutateAsync(course.id);

      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Enrollment Successful!',
          `You can now access "${course.title}" course content.`,
          [{ text: 'OK' }]
        );
      }, 100);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to enroll in course');
    }
  };

  const handleViewContent = () => {
    if (!course) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/course/${course.id}/content` as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark mt-4">
            Loading course details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !course) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mt-4 mb-2">
            Course Not Found
          </Text>
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark text-center mb-4">
            {error?.message || 'Unable to load course details'}
          </Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBookmarkPress} className="p-2">
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={bookmarked ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        <Image
          source={{ uri: course.thumbnail || 'https://via.placeholder.com/400x300' }}
          className="w-full h-64"
          resizeMode="cover"
        />

        {/* Content */}
        <View className="p-6">
          {/* Category & Price */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-primary dark:text-primary-dark">
                {course.category}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-accent">
              ${course.price}
            </Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            {course.title}
          </Text>

          {/* Instructor */}
          <View className="flex-row items-center mb-6 p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <Image
              source={{ uri: course.instructor.avatar || 'https://via.placeholder.com/50' }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">
                Instructor
              </Text>
              <Text className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
                {course.instructor.name}
              </Text>
              <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {course.instructor.location} • {course.instructor.country}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              About This Course
            </Text>
            <Text className="text-base text-text-muted-light dark:text-text-muted-dark leading-6">
              {course.description}
            </Text>
          </View>

          {/* Course Details */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
              Course Details
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="folder-outline" size={20} color={colors.textMuted} />
                <Text className="text-sm text-text-muted-light dark:text-text-muted-dark ml-3">
                  Category: {course.category}
                </Text>
              </View>

              <View className="flex-row items-center mt-3">
                <Ionicons name="images-outline" size={20} color={colors.textMuted} />
                <Text className="text-sm text-text-muted-light dark:text-text-muted-dark ml-3">
                  {course.images.length} course materials
                </Text>
              </View>

              {enrolled && (
                <View className="flex-row items-center mt-3">
                  <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                  <Text className="text-sm font-semibold text-accent ml-3">
                    You are enrolled in this course
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="px-6 py-4 border-t border-border-light dark:border-border-dark">
        {enrolled ? (
          <Button
            title="View Course Content"
            onPress={handleViewContent}
            className="w-full"
          />
        ) : (
          <Button
            title="Enroll Now"
            onPress={handleEnrollPress}
            loading={enrollMutation.isPending}
            disabled={enrollMutation.isPending}
            className="w-full"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
