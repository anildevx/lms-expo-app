import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const THEME_STORAGE_KEY = '@learnly_theme_preference';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  loadThemePreference: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'system',

  setThemeMode: async (mode: ThemeMode) => {
    try {
      set({ themeMode: mode });
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      logger.info('Theme preference saved', { mode });
    } catch (error) {
      logger.error('Failed to save theme preference', error);
    }
  },

  loadThemePreference: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        set({ themeMode: savedMode as ThemeMode });
        logger.info('Theme preference loaded', { mode: savedMode });
      }
    } catch (error) {
      logger.error('Failed to load theme preference', error);
    }
  },
}));
