import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input } from "../../../components/ui";
import { useTheme } from "../../../hooks/useTheme";
import { useRegister } from "../hooks/useAuth";
import { RegisterFormData, registerSchema } from "../schemas";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error?.message || "Unable to create account. Please try again.",
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
              Create Account
            </Text>
            <Text className="text-base text-text-muted-light dark:text-text-muted-dark text-center mb-2">
              Start your learning journey today
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
                  placeholder="Choose a username"
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
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  icon={
                    <Ionicons
                      name="mail-outline"
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
                  placeholder="Create a strong password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  returnKeyType="next"
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
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
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
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
              className="mt-6"
            />
          </View>

          {/* Terms */}
          <View className="mt-6">
            <Text className="text-xs text-text-muted-light dark:text-text-muted-dark text-center leading-5">
              By creating an account, you agree to our{' '}
              <Text className="text-primary">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-primary">Privacy Policy</Text>
            </Text>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            <Text className="px-4 text-xs text-text-muted-light dark:text-text-muted-dark">
              OR
            </Text>
            <View className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          </View>

          {/* Sign In Link */}
          <View className="items-center">
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login" as any)}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Text className="text-base text-text-muted-light dark:text-text-muted-dark mr-1">
                Already have an account?
              </Text>
              <Text className="text-base text-primary font-bold">
                Sign In
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
