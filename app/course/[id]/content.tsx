import React, { useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import WebView from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useTheme } from '../../../src/hooks/useTheme';
import { useAuthStore } from '../../../src/features/auth/store';
import { useCourseById } from '../../../src/features/courses/hooks/useCourses';
import { logger } from '../../../src/utils/logger';

/**
 * Course Content WebView Screen
 * Displays embedded course content
 */
export default function CourseContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  const { data: course, isLoading } = useCourseById(id || '');
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Load HTML content
  useEffect(() => {
    const loadHtmlContent = async () => {
      try {
        const asset = Asset.fromModule(require('../../../src/assets/course-content.html'));
        await asset.downloadAsync();

        // Read the HTML file content
        const response = await fetch(asset.localUri || asset.uri);
        const html = await response.text();

        setHtmlContent(html);
        logger.info('HTML content loaded successfully');
      } catch (error) {
        logger.error('Failed to load HTML content', error);
        // Fallback HTML
        setHtmlContent('<html><body><h1 style="text-align:center; margin-top:50px;">Failed to load content</h1></body></html>');
      }
    };
    loadHtmlContent();
  }, []);

  // Send course data to WebView when loaded
  useEffect(() => {
    if (course && webViewRef.current && !loading) {
      sendMessageToWebView({
        type: 'COURSE_DATA',
        courseTitle: course.title,
        courseDescription: course.description,
        instructorName: course.instructor.name,
        duration: '8 hours',
        category: course.category,
      });

      // Send theme
      sendMessageToWebView({
        type: 'THEME_CHANGE',
        isDark: isDark,
      });

      // Send user info
      if (user) {
        sendMessageToWebView({
          type: 'USER_INFO',
          userName: user.name,
        });
      }
    }
  }, [course, loading, isDark, user]);

  // Send message to WebView
  const sendMessageToWebView = (message: any) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
      logger.info('Sent message to WebView', message);
    }
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      logger.info('Received message from WebView', data);

      switch (data.type) {
        case 'WEBVIEW_READY':
          logger.info('WebView is ready');
          setLoading(false);
          break;

        case 'CONTINUE_LEARNING':
          Alert.alert(
            'Continue Learning',
            'Ready to proceed to the next lesson!',
            [
              { text: 'Stay Here', style: 'cancel' },
              {
                text: 'Continue',
                onPress: () => {
                  logger.info('User chose to continue learning');
                },
              },
            ]
          );
          break;

        case 'PLAY_LESSON':
          Alert.alert(
            'Play Lesson',
            `Starting Lesson ${data.lessonNumber}...`,
            [{ text: 'OK' }]
          );
          logger.info('Playing lesson', { lessonNumber: data.lessonNumber });
          break;

        default:
          logger.warn('Unknown message type from WebView', data);
      }
    } catch (error) {
      logger.error('Error handling WebView message', error);
    }
  };

  // Handle navigation state changes
  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  // Handle back navigation
  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light dark:bg-background-dark"
        edges={['top']}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Course Content',
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background-light dark:bg-background-dark"
      edges={['top']}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: course?.title || 'Course Content',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => webViewRef.current?.reload()}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="refresh" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1">
        {htmlContent ? (
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            onMessage={handleWebViewMessage}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              logger.error('WebView error', nativeEvent);
              Alert.alert('Error', 'Failed to load course content');
            }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            injectedJavaScriptBeforeContentLoaded={`
              window.courseId = "${id}";
              window.userId = "${user?.id || 'guest'}";
              true;
            `}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {loading && htmlContent && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
