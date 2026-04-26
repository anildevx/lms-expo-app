import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#4F46E5', '#6366F1', '#818CF8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center justify-center px-8">
        {/* Animated Logo Container */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center mb-12"
        >
          {/* Icon Circle with Shadow */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-8"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View
              className="w-28 h-28 rounded-full items-center justify-center"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Ionicons name="school" size={56} color="#4F46E5" />
            </View>
          </View>

          {/* App Name */}
          <Text
            className="text-5xl font-bold text-white mb-2"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              letterSpacing: 1,
            }}
          >
            Learnly
          </Text>
        </Animated.View>

        {/* Animated Tagline */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center"
        >
          <Text
            className="text-xl text-white font-medium mb-2"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Learn. Grow. Excel.
          </Text>
          <Text className="text-sm text-white opacity-80 text-center">
            Your journey to knowledge starts here
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};
