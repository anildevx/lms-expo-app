import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { AppProviders } from '../src/lib/providers';
import { useThemeStore } from '../src/lib/themeStore';
import { initializeNotifications, setupNotificationListeners } from '../src/services/notificationService';
import { OfflineBanner } from '../src/components/common';
import { initSentry } from '../src/lib/sentry';
import '../src/styles/global.css';

// Initialize Sentry
initSentry();

function RootLayout() {
  const { loadThemePreference, themeMode } = useThemeStore();

  useEffect(() => {
    loadThemePreference();

    // Initialize notifications
    initializeNotifications();

    // Setup notification listeners
    const cleanup = setupNotificationListeners();

    return cleanup;
  }, []);

  return (
    <AppProviders>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProviders>
  );
}

export default Sentry.wrap(RootLayout);
