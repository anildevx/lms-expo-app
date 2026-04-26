import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../../../components/ui';
import { useTheme } from '../../../hooks/useTheme';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, LoginFormData } from '../schemas';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    try {
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.message || 'Invalid credentials. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background-light dark:bg-background-dark"
      edges={['top', 'bottom']}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        extraHeight={150}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-6">
          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name="school" size={40} color="#FFFFFF" />
            </View>
            <Text className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-text-muted-light mb-8 dark:text-text-muted-dark text-center">
              Sign in to continue your learning journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  autoComplete="username"
                  returnKeyType="next"
                  icon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.textMuted}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  icon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={colors.textMuted}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              className="mt-6"
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            <Text className="px-4 text-xs text-text-muted-light dark:text-text-muted-dark">
              OR
            </Text>
            <View className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          </View>

          {/* Sign Up Link */}
          <View className="items-center">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register' as any)}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="text-base text-text-muted-light dark:text-text-muted-dark mr-1">
                Don't have an account?
              </Text>
              <Text className="text-base text-primary font-bold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Tagline */}
          <View className="mt-12 items-center pb-6">
            <Text className="text-xs text-text-muted-light dark:text-text-muted-dark">
              Learn. Grow. Excel.
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
