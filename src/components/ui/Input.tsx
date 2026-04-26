import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerBorderClass = () => {
    if (error) return 'border-red-500';
    if (isFocused) return 'border-primary';
    return 'border-border-light dark:border-border-dark';
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-md border px-4 bg-gray-100 dark:bg-gray-800 ${getContainerBorderClass()}`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          className={`flex-1 py-4 text-base text-text-primary-light dark:text-text-primary-dark ${icon ? 'pl-0' : ''}`}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};
