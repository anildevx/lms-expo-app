import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const CourseCardSkeleton: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="mb-4 bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
      {/* Image Skeleton */}
      <Animated.View
        style={{ opacity }}
        className="w-full h-48 bg-gray-300 dark:bg-gray-700"
      />

      {/* Content Skeleton */}
      <View className="p-4">
        {/* Instructor Row */}
        <View className="flex-row items-center mb-2">
          <Animated.View
            style={{ opacity }}
            className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"
          />
          <Animated.View
            style={{ opacity }}
            className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded"
          />
        </View>

        {/* Title */}
        <Animated.View
          style={{ opacity }}
          className="w-full h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"
        />
        <Animated.View
          style={{ opacity }}
          className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded mb-3"
        />

        {/* Description */}
        <Animated.View
          style={{ opacity }}
          className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1"
        />
        <Animated.View
          style={{ opacity }}
          className="w-5/6 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"
        />

        {/* Price */}
        <Animated.View
          style={{ opacity }}
          className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded"
        />
      </View>
    </View>
  );
};
