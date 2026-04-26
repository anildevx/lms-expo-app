import { useColorScheme as useRNColorScheme } from 'react-native';
import { colors, type ColorScheme } from '../lib/theme';
import { useThemeStore } from '../lib/themeStore';

/**
 * Hook to access theme colors based on user preference or system color scheme
 * Supports manual theme toggle and system preference
 */
export const useTheme = () => {
  const systemColorScheme = useRNColorScheme();
  const { themeMode } = useThemeStore();

  // Determine the color scheme based on user preference
  const colorScheme: ColorScheme =
    themeMode === 'system'
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  return {
    colors: colors[colorScheme],
    isDark: colorScheme === 'dark',
    colorScheme,
    themeMode,
  };
};
