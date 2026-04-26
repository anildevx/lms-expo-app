import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../auth/store';
import { useCoursesStore } from '../../courses/store';
import { useLogout } from '../../auth/hooks/useAuth';
import { useAvatarPicker } from '../hooks/useProfile';
import { useTheme } from '../../../hooks/useTheme';
import { useThemeStore } from '../../../lib/themeStore';
import { Button } from '../../../components/ui';

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { setThemeMode } = useThemeStore();
  const { user } = useAuthStore();
  const { bookmarkedCourses, enrolledCourses } = useCoursesStore();
  const logoutMutation = useLogout();
  const { showAvatarOptions, isUploading } = useAvatarPicker();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutMutation.mutateAsync();
          },
        },
      ]
    );
  };

  const handleThemeToggle = async () => {
    const newMode = isDark ? 'light' : 'dark';
    await setThemeMode(newMode);
  };

  const stats = [
    {
      icon: 'book',
      label: 'Enrolled',
      value: enrolledCourses.length,
      color: colors.primary,
    },
    {
      icon: 'bookmark',
      label: 'Bookmarks',
      value: bookmarkedCourses.length,
      color: colors.accent,
    },
    {
      icon: 'trophy',
      label: 'Completed',
      value: 0,
      color: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6 border-b border-border-light dark:border-border-dark">
          <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Profile
          </Text>
        </View>

        {/* Profile Info */}
        <View className="px-6 py-8 items-center">
          {/* Avatar */}
          <TouchableOpacity
            onPress={showAvatarOptions}
            disabled={isUploading}
            className="mb-4"
            activeOpacity={0.7}
          >
            <View className="relative">
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                  style={{ backgroundColor: colors.surface }}
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-4xl font-bold text-primary dark:text-primary-dark">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}

              {/* Camera Icon Badge */}
              <View
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-background-light dark:border-background-dark"
                style={{ backgroundColor: colors.primary }}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={16} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <Text className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            {user?.name || 'User'}
          </Text>
          <Text className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {/* Stats */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-around bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stat.value}
                </Text>
                <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          <Text className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-3">
            Settings
          </Text>

          <View className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-border-light dark:border-border-dark">
              <Ionicons name="notifications-outline" size={20} color={colors.textMuted} />
              <Text className="flex-1 ml-3 text-base text-text-primary-light dark:text-text-primary-dark">
                Notifications
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <View className="flex-row items-center p-4 border-b border-border-light dark:border-border-dark">
              <Ionicons name="moon-outline" size={20} color={colors.textMuted} />
              <Text className="flex-1 ml-3 text-base text-text-primary-light dark:text-text-primary-dark">
                Dark Mode
              </Text>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#cbd5e1', true: colors.primary }}
                thumbColor={isDark ? '#ffffff' : '#f1f5f9'}
                ios_backgroundColor="#cbd5e1"
              />
            </View>

            <TouchableOpacity className="flex-row items-center p-4">
              <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
              <Text className="flex-1 ml-3 text-base text-text-primary-light dark:text-text-primary-dark">
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 py-8">
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            loading={logoutMutation.isPending}
            disabled={logoutMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
