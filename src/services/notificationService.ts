import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

const LAST_ACTIVITY_KEY = '@learnly_last_activity';
const NOTIFICATION_SHOWN_5_BOOKMARKS = '@learnly_notification_5_bookmarks';
const INACTIVITY_NOTIFICATION_ID = 'inactivity_reminder';

/**
 * Notification Service
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('Notification permission denied');
      return false;
    }

    logger.info('Notification permission granted');
    return true;
  } catch (error) {
    logger.error('Error requesting notification permissions', error);
    return false;
  }
};

/**
 * Set up notification channels
 */
export const setupNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    try {
      // Milestone notifications channel
      await Notifications.setNotificationChannelAsync('milestones', {
        name: 'Milestones',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
        sound: 'default',
        description: 'Notifications for learning milestones and achievements',
      });

      // Reminder notifications channel
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#22C55E',
        sound: 'default',
        description: 'Reminders to continue your learning journey',
      });

      logger.info('Notification channels created successfully');
    } catch (error) {
      logger.error('Error creating notification channels', error);
    }
  }
};

/**
 * Send a local notification
 */
const sendNotification = async (
  title: string,
  body: string,
  data?: any,
  channelId?: string
) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      logger.warn('Cannot send notification - permission not granted');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Send immediately
      ...(Platform.OS === 'android' && channelId ? { identifier: channelId } : {}),
    });

    logger.info('Notification sent', { title, body, notificationId });
    return notificationId;
  } catch (error) {
    logger.error('Error sending notification', error);
    return null;
  }
};

/**
 * Show notification after 5 bookmarks
 */
export const notifyFiveBookmarksMilestone = async () => {
  try {
    // Check if we've already shown this notification
    const hasShown = await AsyncStorage.getItem(NOTIFICATION_SHOWN_5_BOOKMARKS);
    if (hasShown === 'true') {
      logger.info('5 bookmarks notification already shown');
      return;
    }

    await sendNotification(
      'Great Progress!',
      "You've bookmarked 5 courses! Keep exploring and building your learning path.",
      { type: 'milestone', milestone: '5_bookmarks' },
      'milestones'
    );

    // Mark as shown
    await AsyncStorage.setItem(NOTIFICATION_SHOWN_5_BOOKMARKS, 'true');
    logger.info('5 bookmarks milestone notification sent');
  } catch (error) {
    logger.error('Error showing 5 bookmarks notification', error);
  }
};

/**
 * Reset the 5 bookmarks notification flag
 */
export const reset5BookmarksNotification = async () => {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_SHOWN_5_BOOKMARKS);
    logger.info('5 bookmarks notification flag reset');
  } catch (error) {
    logger.error('Error resetting 5 bookmarks notification', error);
  }
};

/**
 * Update last activity timestamp
 */
export const updateLastActivity = async () => {
  try {
    const timestamp = Date.now();
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, timestamp.toString());
    logger.info('Last activity updated', { timestamp });
  } catch (error) {
    logger.error('Error updating last activity', error);
  }
};

/**
 * Schedule inactivity reminder (24 hours from now)
 */
export const scheduleInactivityReminder = async () => {
  try {
    // Cancel existing inactivity reminder
    await cancelInactivityReminder();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      logger.warn('Cannot schedule reminder - permission not granted');
      return;
    }

    // Schedule notification for 24 hours from now
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Continue Learning!',
        body: "It's been a while! Come back and continue your learning journey.",
        data: { type: 'inactivity_reminder' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 24 * 60 * 60, // 24 hours
        channelId: Platform.OS === 'android' ? 'reminders' : undefined,
      },
      identifier: INACTIVITY_NOTIFICATION_ID,
    });

    logger.info('Inactivity reminder scheduled', { notificationId, in: '24 hours' });
  } catch (error) {
    logger.error('Error scheduling inactivity reminder', error);
  }
};

/**
 * Cancel scheduled inactivity reminder
 */
export const cancelInactivityReminder = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(INACTIVITY_NOTIFICATION_ID);
    logger.info('Inactivity reminder cancelled');
  } catch (error) {
    // Notification might not exist
    logger.info('No inactivity reminder to cancel');
  }
};

/**
 * Check if user has been inactive for 24 hours and send reminder
 */
export const checkInactivityAndNotify = async () => {
  try {
    const lastActivityStr = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) {
      // No activity recorded yet, update it
      await updateLastActivity();
      return;
    }

    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);

    logger.info('Checking inactivity', { hoursSinceActivity });

    if (hoursSinceActivity >= 24) {
      await sendNotification(
        '📚 We Miss You!',
        "It's been 24 hours since your last visit. Come back to continue learning!",
        { type: 'inactivity_reminder' },
        'reminders'
      );
      // Update last activity
      await updateLastActivity();
    }
  } catch (error) {
    logger.error('Error checking inactivity', error);
  }
};

/**
 * Initialize notification service
 */
export const initializeNotifications = async () => {
  try {
    logger.info('Initializing notification service');

    // Request permissions
    await requestNotificationPermissions();

    // Setup channels (Android)
    await setupNotificationChannels();

    // Update last activity
    await updateLastActivity();

    // Schedule inactivity reminder
    await scheduleInactivityReminder();

    logger.info('Notification service initialized successfully');
  } catch (error) {
    logger.error('Error initializing notification service', error);
  }
};

/**
 * Handle notification tap
 */
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const data = response.notification.request.content.data;
  logger.info('Notification tapped', { data });

  // Handle different notification types
  if (data.type === 'milestone') {
    logger.info('Milestone notification tapped', { milestone: data.milestone });
  } else if (data.type === 'inactivity_reminder') {
    logger.info('Inactivity reminder tapped');
  }
};

/**
 * Set up notification listeners
 */
export const setupNotificationListeners = () => {
  // Handle notification received while app is in foreground
  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    logger.info('Notification received in foreground', {
      title: notification.request.content.title,
    });
  });

  // Handle notification tap
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    handleNotificationResponse
  );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};
