import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '../lib/themeStore';

/**
 * ThemeProvider component that syncs app theme with NativeWind
 * Allows manual theme control
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const { themeMode } = useThemeStore();

  useEffect(() => {
    const targetScheme =
      themeMode === 'system'
        ? (systemColorScheme ?? 'light')
        : themeMode;

    if (colorScheme !== targetScheme) {
      setColorScheme(targetScheme);
    }
  }, [themeMode, systemColorScheme, colorScheme, setColorScheme]);

  return <>{children}</>;
}
