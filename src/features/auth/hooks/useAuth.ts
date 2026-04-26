import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store';
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from '../api/authApi';
import { logger } from '../../../utils/logger';
import { STORAGE_KEYS, QUERY_KEYS } from '../../../constants';

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens securely
        if (accessToken && typeof accessToken === 'string') {
          await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        }
        if (refreshToken && typeof refreshToken === 'string') {
          await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        // Update store
        setToken(accessToken);
        setUser({
          id: user._id,
          email: user.email,
          name: user.username,
          avatar: user.avatar?.url,
        });

        logger.info('Login successful', { email: user.email });

        // Navigate to main app
        router.replace('/(tabs)' as any);
      }
    },
    onError: (error) => {
      console.log('[useLogin] Login error:', error);
      logger.error('Login failed', error);
    },
  });
};

/**
 * Register mutation hook
 */
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const { user } = response.data;

        logger.info('Registration successful', { email: user.email });

        Alert.alert(
          'Registration Successful!',
          'Your account has been created. Please login to continue.',
          [
            {
              text: 'Login',
              onPress: () => {
                router.replace('/(auth)/login' as any);
              },
            },
          ],
          { cancelable: false }
        );
      }
    },
    onError: (error) => {
      logger.error('Registration failed', error);
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      // Clear tokens
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

      // Clear store
      logout();

      // Clear bookmarks from courses store and storage
      const { useCoursesStore } = await import('../../courses/store');
      await useCoursesStore.getState().clearBookmarks();

      // Clear all queries
      queryClient.clear();

      logger.info('Logout successful');

      // Navigate to auth screen
      router.replace('/(auth)/login' as any);
    },
    onError: async (error) => {
      logger.error('Logout failed', error);

      // Clear tokens anyway
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      logout();

      // Clear bookmarks
      const { useCoursesStore } = await import('../../courses/store');
      await useCoursesStore.getState().clearBookmarks();

      router.replace('/(auth)/login' as any);
    },
  });
};

/**
 * Get current user query hook
 */
export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.CURRENT_USER,
    queryFn: async () => {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        setUser({
          id: response.data._id,
          email: response.data.email,
          name: response.data.username,
          avatar: response.data.avatar?.url,
        });
      }
      return response.data;
    },
    enabled: false,
  });
};

/**
 * Check authentication status
 */
export const useAuthCheck = () => {
  const { setToken, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['authCheck'],
    queryFn: async () => {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

        if (!token) {
          return { isAuthenticated: false };
        }

        setToken(token);

        // Fetch current user
        const response = await getCurrentUser();
        if (response.success && response.data) {
          setUser({
            id: response.data._id,
            email: response.data.email,
            name: response.data.username,
            avatar: response.data.avatar?.url,
          });
          return { isAuthenticated: true };
        }

        return { isAuthenticated: false };
      } catch (error) {
        logger.error('Auth check failed', error);
        return { isAuthenticated: false };
      }
    },
    retry: false,
  });
};
