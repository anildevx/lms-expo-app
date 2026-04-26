import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import { useAuthStore } from '../features/auth/store';
import { STORAGE_KEYS } from '../constants/api';

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;
const NETWORK_ERROR_RETRY_DELAY = 2000;

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Get auth token from SecureStore
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        logger.debug('API Request', {
          url: config.url,
          method: config.method,
        });

        return config;
      } catch (error) {
        logger.error('Request interceptor error', error);
        return config;
      }
    },
    (error) => {
      logger.error('Request error', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      logger.debug('API Response', {
        url: response.config.url,
        status: response.status,
      });
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as any;

      // Initialize retry counter
      if (!config || !config.retry) {
        config.retry = 0;
      }

      // Determine if error is retryable
      const isNetworkError = !error.response && error.code === 'ECONNABORTED';
      const isServerError = error.response && error.response.status >= 500;
      const isTimeoutError = error.code === 'ECONNABORTED';
      const isRetryable = isNetworkError || isServerError || isTimeoutError;

      // Retry logic
      if (config.retry < MAX_RETRIES && isRetryable) {
        config.retry += 1;

        // Check network status before retrying
        const netState = await NetInfo.fetch();
        const isConnected = netState.isConnected && netState.isInternetReachable;

        if (!isConnected) {
          logger.warn('Network unavailable - not retrying', {
            url: config.url,
          });
          const appError = handleError(error);
          return Promise.reject(appError);
        }

        // Calculate delay
        const baseDelay = isNetworkError ? NETWORK_ERROR_RETRY_DELAY : RETRY_DELAY_BASE;
        const delay = baseDelay * Math.pow(2, config.retry - 1);

        logger.warn(`Retrying request (${config.retry}/${MAX_RETRIES})`, {
          url: config.url,
          delay: `${delay}ms`,
          reason: isNetworkError ? 'network' : isServerError ? 'server' : 'timeout',
        });

        await new Promise((resolve) => setTimeout(resolve, delay));

        return axiosInstance(config);
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        logger.warn('Unauthorized - logging out user');

        try {
          // Clear tokens from SecureStore
          await Promise.all([
            SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
            SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
          ]);

          // Clear auth state
          useAuthStore.getState().logout();

          // Navigate to login screen
          router.replace('/(auth)/login');
        } catch (logoutError) {
          logger.error('Error during logout', logoutError);
        }
      }

      const appError = handleError(error);
      logger.error('API Error', {
        url: config?.url,
        status: error.response?.status,
        message: appError.message,
      });

      return Promise.reject(appError);
    }
  );
};
