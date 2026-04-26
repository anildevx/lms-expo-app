import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'rounded-md items-center justify-center flex-row';

    const sizeClasses = {
      sm: 'py-2 px-4',
      md: 'py-4 px-6',
      lg: 'py-6 px-8',
    };

    const variantClasses = {
      primary: disabled ? 'bg-gray-400' : 'bg-primary',
      secondary: disabled ? 'bg-gray-400' : 'bg-accent',
      outline: `bg-transparent border ${disabled ? 'border-gray-400' : 'border-primary'}`,
      ghost: 'bg-transparent',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const getTextClasses = () => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: disabled ? 'text-gray-400' : 'text-primary',
      ghost: disabled ? 'text-gray-400' : 'text-primary',
    };

    return `font-semibold ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary}
          size="small"
        />
      ) : (
        <Text className={getTextClasses()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
