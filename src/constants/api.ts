/**
 * API Configuration Constants
 * Central place for all API endpoints and configuration
 */

/**
 * API Base URL
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.freeapi.app/';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/users/login',
    REGISTER: '/api/v1/users/register',
    LOGOUT: '/api/v1/users/logout',
    CURRENT_USER: '/api/v1/users/current-user',
    REFRESH_TOKEN: '/api/v1/users/refresh-token',
  },

  // Public endpoints
  PUBLIC: {
    // Course data
    COURSES: '/api/v1/public/randomproducts',

    // Instructor data
    INSTRUCTORS: '/api/v1/public/randomusers',
  },

  // User endpoints
  USER: {
    UPDATE_AVATAR: '/api/v1/users/avatar',
  },
} as const;

/**
 * API Request Timeouts
 */
export const API_TIMEOUT = {
  DEFAULT: 10000,
  FILE_UPLOAD: 30000,
} as const;

/**
 * API Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Storage Keys
 * Keys used for AsyncStorage and SecureStore
 */
export const STORAGE_KEYS = {
  // Secure storage (SecureStore)
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',

  // Regular storage (AsyncStorage)
  BOOKMARKS: 'bookmarks',
  ENROLLED_COURSES: 'enrolledCourses',
  THEME: 'theme',
  ONBOARDING_COMPLETE: 'onboardingComplete',
} as const;

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: ['auth', 'currentUser'],
  },
  COURSES: {
    LIST: (page: number, limit: number) => ['courses', 'list', page, limit],
    DETAIL: (id: string) => ['courses', 'detail', id],
    BOOKMARKS: ['courses', 'bookmarks'],
  },
  INSTRUCTORS: {
    LIST: (page: number, limit: number) => ['instructors', 'list', page, limit],
  },
} as const;

/**
 * Cache Times for React Query
 */
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000,  // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
} as const;
