import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

/**
 * Initialize Sentry
 */
export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not found. Skipping Sentry initialization.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,

    // Set environment based on the build profile
    environment: process.env.EXPO_PUBLIC_ENV || 'development',

    // Enable auto session tracking
    enableAutoSessionTracking: true,

    // Session timeout (default: 30 seconds)
    sessionTrackingIntervalMillis: 10000,

    // Enable native crash handling
    enableNativeCrashHandling: true,

    // Enable automatic breadcrumbs
    enableAutoPerformanceTracing: true,

    // Capture 100% of transactions for performance monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Add app version and build number
    release: `${Constants.expoConfig?.slug}@${Constants.expoConfig?.version}`,
    dist: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode?.toString(),

    beforeSend(event, hint) {
      if (__DEV__) {
        console.log('Sentry Event (dev):', event);
        return null;
      }

      return event;
    },

    // Integrations
    integrations: [
      // Replay integration for session replay
      // new Sentry.BrowserTracing(),
    ],
  });
};

export default Sentry;
