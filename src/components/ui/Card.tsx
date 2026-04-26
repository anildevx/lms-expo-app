import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
}

/**
 * Card Component
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'rounded-md p-4 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark';
  const elevatedClasses = variant === 'elevated' ? 'shadow-md' : '';

  return (
    <View className={`${baseClasses} ${elevatedClasses} ${className}`}>
      {children}
    </View>
  );
};
