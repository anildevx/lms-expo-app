import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { updateLastActivity, scheduleInactivityReminder, cancelInactivityReminder } from '../services/notificationService';
import { logger } from '../utils/logger';

/**
 * Hook to track user activity and manage inactivity reminders
 */
export const useActivityTracker = () => {
  useEffect(() => {
    // Update activity when hook mounts
    updateLastActivity();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // User is back in the app - update activity and reschedule reminder
      logger.info('App became active - updating activity');
      await updateLastActivity();
      await scheduleInactivityReminder();
    } else if (nextAppState === 'background') {
      // User is leaving the app - schedule reminder if not already scheduled
      logger.info('App went to background - ensuring reminder is scheduled');
      await scheduleInactivityReminder();
    }
  };
};
