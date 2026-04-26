import { QueryClient } from '@tanstack/react-query';
import { logger } from '../utils/logger';

/**
 * Retry delay
 * @param attemptIndex
 */
const retryDelay = (attemptIndex: number) => {
  const delay = Math.min(1000 * Math.pow(2, attemptIndex), 30000);
  logger.info('Query retry delay', { attemptIndex, delay });
  return delay;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries up to 3 times
      retryDelay, // Exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Auto-refetch when network reconnects
      // Network mode - use cache when offline
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 3, // Retry failed mutations up to 3 times
      retryDelay, // Exponential backoff
      networkMode: 'online', // Mutations require network
    },
  },
});
