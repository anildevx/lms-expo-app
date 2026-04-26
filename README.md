# Learnly - Learning Management System

<div align="center">
  <p><strong>A production-ready mobile LMS built with React Native Expo</strong></p>
  <p>Seamlessly blending native performance with intuitive design for an exceptional learning experience</p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Technical Decisions](#key-technical-decisions)
- [Performance Optimizations](#performance-optimizations)
- [Security Considerations](#security-considerations)
- [API Integration](#api-integration)
- [Build & Deployment](#build--deployment)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Learnly** is a feature-rich mobile Learning Management System built with React Native and Expo. It demonstrates enterprise-grade patterns including offline-first architecture, robust error handling, optimistic UI updates, and production-ready DevOps practices.

This project showcases:
- **Product Thinking**: User-centric design with intelligent features like "Continue Learning" sections
- **Engineering Depth**: Advanced caching strategies, retry mechanisms, and performance optimizations
- **Code Quality**: Modular architecture with TypeScript strict mode and comprehensive type safety
- **Real-World Mindset**: Error boundaries, edge case handling, and failure scenario management

---

## Features

### Core Functionality
- **Authentication System**
  - Secure login/registration with form validation (React Hook Form + Zod)
  - Token-based authentication with auto-refresh
  - Persistent sessions using Expo SecureStore
  - Auto-login on app restart

- **Course Catalog**
  - Scrollable course list with FlatList optimizations
  - Pull-to-refresh functionality
  - Debounced search (300ms delay)
  - Course bookmarking with local persistence
  - Optimistic UI updates

- **Course Details**
  - Complete course information display
  - Instructor profiles with avatars
  - Enroll functionality with haptic feedback
  - Related courses recommendations

- **User Profile**
  - Profile image upload (camera/gallery)
  - User information management
  - Enrolled courses tracking
  - Settings and preferences

### Advanced Features
- **Offline Support**
  - Network status detection
  - Offline data caching
  - Retry mechanisms with exponential backoff
  - Offline banner notifications

- **Performance**
  - Image lazy loading and caching
  - FlatList virtualization
  - React Query smart caching (5min stale time)
  - Skeleton loaders for perceived performance

- **User Experience**
  - Dark mode support (system-aware)
  - Haptic feedback on interactions
  - Smooth animations and transitions
  - Empty state handling with meaningful messages
  - Error boundaries with retry capabilities

- **Notifications**
  - Push notification support
  - Activity-based reminders
  - Milestone notifications (e.g., 5 bookmarks)

- **DevOps & Monitoring**
  - Sentry error tracking
  - EAS Build integration
  - Over-the-Air (OTA) updates with Expo Updates
  - Environment-based configurations

---

## Tech Stack

### Core Framework
- **React Native 0.81.5** - Cross-platform mobile development
- **Expo SDK 54** - Managed workflow with native capabilities
- **TypeScript 5.9** - Type safety and developer experience

### Navigation & Routing
- **Expo Router 6.0** - File-based routing with type safety
- **React Navigation 7.x** - Native navigation patterns

### State Management
- **Zustand 5.0** - Lightweight global state (auth, courses, theme)
- **React Query 5.100** - Server state management with caching
- **AsyncStorage 2.2** - Persistent local storage for bookmarks

### Forms & Validation
- **React Hook Form 7.73** - Performant form handling
- **Zod 4.3** - Schema validation with TypeScript inference

### Networking
- **Axios 1.15** - HTTP client with interceptors
- **Custom retry logic** - Exponential backoff for failed requests

### Styling
- **NativeWind 4.2** - Tailwind CSS for React Native
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Native Features
- **Expo SecureStore** - Encrypted token storage
- **Expo Notifications** - Push notifications
- **Expo Image Picker** - Camera and gallery access
- **Expo Haptics** - Tactile feedback
- **NetInfo** - Network status monitoring

### Performance
- **FlashList 2.0** - High-performance list rendering
- **React Native Reanimated 4.1** - Smooth animations

### DevOps & Monitoring
- **Sentry** - Error tracking and performance monitoring
- **EAS Build** - Cloud-based builds
- **Expo Updates** - Over-the-Air updates

---

## Architecture

Learnly follows a **hybrid feature-based and layered architecture** for scalability and maintainability.

```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication flow
│   ├── (tabs)/            # Main app tabs
│   ├── course/            # Course detail screens
│   └── _layout.tsx        # Root layout
│
├── features/              # Domain-driven feature modules
│   ├── auth/
│   │   ├── api/          # Auth API calls
│   │   ├── hooks/        # useAuth hook
│   │   ├── screens/      # Login/Register screens
│   │   ├── schemas.ts    # Zod validation schemas
│   │   └── store.ts      # Zustand auth store
│   │
│   ├── courses/
│   │   ├── api/          # Course API calls
│   │   ├── components/   # CourseCard, Skeleton
│   │   ├── hooks/        # useCourses hook
│   │   ├── screens/      # Explore, Bookmarks
│   │   └── store.ts      # Course state
│   │
│   ├── home/
│   │   └── screens/      # HomeScreen
│   │
│   └── profile/
│       ├── api/          # Profile API
│       ├── hooks/        # useProfile hook
│       └── screens/      # ProfileScreen
│
├── components/            # Reusable UI components
│   ├── common/           # OfflineBanner, SplashScreen
│   ├── ui/               # Button, Card, Input, SearchBar
│   └── ThemeProvider.tsx # Theme context
│
├── services/             # External service integrations
│   ├── apiClient.ts      # Axios instance
│   ├── interceptors.ts   # Request/response interceptors
│   └── notificationService.ts
│
├── lib/                  # Third-party configurations
│   ├── react-query.ts    # React Query setup
│   ├── sentry.ts         # Sentry config
│   ├── storage.ts        # AsyncStorage wrapper
│   ├── theme.ts          # Theme definitions
│   └── themeStore.ts     # Theme state
│
├── hooks/                # Custom React hooks
│   ├── useActivityTracker.ts
│   ├── useDebounce.ts
│   ├── useNetwork.ts
│   └── useTheme.ts
│
├── utils/                # Helper functions
│   ├── errorHandler.ts
│   └── logger.ts
│
├── types/                # TypeScript definitions
│   └── index.ts
│
└── constants/            # App constants
    ├── api.ts
    └── index.ts
```

### Architectural Decisions

1. **Feature-based Organization**: Each feature (auth, courses, profile) is self-contained with its own API, hooks, screens, and state.

2. **Separation of Concerns**: Clear boundaries between:
   - **Presentation** (screens/components)
   - **Business Logic** (hooks/stores)
   - **Data Access** (API layer)

3. **Single Responsibility**: Each module has one clear purpose, making the codebase maintainable and testable.

4. **Type Safety**: TypeScript strict mode ensures compile-time error catching and better developer experience.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- iOS Simulator (macOS) or Android Emulator
- Expo CLI (installed automatically)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Learnly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   EXPO_PUBLIC_API_URL=https://api.freeapi.app/
   EXPO_PUBLIC_APP_ENV=development
   EXPO_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on a device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app (development builds recommended)

### Additional Scripts

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for development
npm run build:dev:android
npm run build:dev:ios

# Build for production
npm run build:production:android
npm run build:production:ios

# OTA Updates
npm run update:production
```

---

## Project Structure

### Key Directories

- **`/app`**: Expo Router file-based routing
- **`/src/features`**: Feature modules (auth, courses, profile)
- **`/src/components`**: Reusable UI components
- **`/src/services`**: API clients and external services
- **`/src/lib`**: Third-party library configurations
- **`/src/hooks`**: Custom React hooks
- **`/assets`**: Images, fonts, and static resources

---

## Key Technical Decisions

### 1. Why Zustand over Redux?
- **Minimal boilerplate**: No actions, reducers, or middleware configuration
- **Performance**: Uses React context efficiently without unnecessary re-renders
- **Bundle size**: ~1KB vs Redux's ~20KB
- **Developer experience**: Simpler API, easier to learn

### 2. Why React Query?
- **Server state management**: Separates server state from client state
- **Automatic caching**: Smart cache invalidation and refetching
- **Offline support**: Works seamlessly with offline-first apps
- **DevTools**: Built-in debugging tools

### 3. Why NativeWind?
- **Familiar syntax**: Developers know Tailwind CSS
- **Performance**: Compile-time styles (no runtime style computation)
- **Consistency**: Same design system across web and mobile

### 4. Why AsyncStorage over MMKV?
- **Compatibility**: Works out-of-the-box with Expo managed workflow
- **Simplicity**: No native code configuration required
- **Sufficient performance**: For this use case (bookmarks, small datasets)
- **Future migration**: Can easily swap to MMKV if needed

### 5. Offline-First Strategy
- React Query's cache acts as offline storage
- Manual retry mechanisms for failed requests
- Network status detection with @react-native-community/netinfo
- User feedback via OfflineBanner component

---

## Performance Optimizations

### 1. List Rendering
- **FlashList** for course lists (40% faster than FlatList)
- `windowSize` optimization for viewport rendering
- `getItemType` for better recycling
- Memoized list items to prevent unnecessary re-renders

### 2. Image Handling
- **Expo Image** with advanced caching
- Lazy loading for off-screen images
- Placeholder images during load
- Memory-efficient image compression

### 3. State Management
- Zustand's selective subscriptions (no context re-render issues)
- React Query's structural sharing (prevents unnecessary re-renders)
- Debounced search (300ms) to reduce API calls

### 4. Code Splitting
- Expo Router's automatic code splitting
- Lazy loading of heavy components
- Tree-shaking unused code

### 5. Bundle Size
- Production builds with minification
- Hermes engine for Android (50% faster startup)
- Asset optimization (compressed images)

---

## Security Considerations

### 1. Token Storage
- **Expo SecureStore** for access/refresh tokens
- Encrypted storage using platform-specific mechanisms:
  - iOS: Keychain Services
  - Android: EncryptedSharedPreferences

### 2. API Security
- HTTPS-only communication
- Token-based authentication (JWT)
- Automatic token refresh on 401 errors
- No sensitive data in logs (production mode)

### 3. Input Validation
- Zod schemas for all user inputs
- Server-side validation (API handles this)
- XSS prevention through React Native's inherent protection

### 4. Error Handling
- Sentry for error tracking (no sensitive data logged)
- Error boundaries to prevent app crashes
- Graceful degradation on API failures

---

## API Integration

### Base URL
```
https://api.freeapi.app/
```

### Endpoints Used

**Authentication:**
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login

**Courses:**
- `GET /api/v1/public/randomproducts` - Course catalog (mapped from products)
- `GET /api/v1/public/randomusers` - Course instructors (mapped from users)

**Profile:**
- `GET /api/v1/users/current` - Current user profile
- `PATCH /api/v1/users/update-account` - Update profile

### Important API Behavior

**Registration Flow:**
- Registration endpoint does NOT return tokens
- Users must login after registration to receive tokens
- This is intentional per FreeAPI.app's authentication design

**Login Flow:**
- Returns both `accessToken` and `refreshToken`
- Tokens stored securely in SecureStore
- Auto-redirect to main app after successful login

---

## Build & Deployment

### Development Builds

```bash
# Android
npm run build:dev:android

# iOS
npm run build:dev:ios
```

### Production Builds

```bash
# Both platforms
npm run build:production

# Android only
npm run build:production:android

# iOS only
npm run build:production:ios
```

### Over-the-Air Updates

```bash
# Production update
npm run update:production

# Preview update
npm run update:preview
```

### EAS Configuration

EAS project is configured with:
- **Project ID**: `217f173f-e7f5-42f6-9d18-709d0cd429d4`
- **Owner**: `vishtechr`
- **OTA Updates**: Enabled
- **Runtime Version**: App version based

---

## Known Limitations

1. **Data Source Mapping**
   - Using `randomproducts` API as course data (no dedicated LMS API)
   - Course content is simulated (instructor names mapped from random users)

2. **Offline Functionality**
   - Only read operations work offline (cached data)
   - Write operations require network connectivity

3. **Authentication**
   - Registration doesn't return tokens (API limitation)
   - Users must login after registration

4. **Testing**
   - Unit tests not implemented (future enhancement)
   - E2E tests pending

---

## Future Enhancements

### Short-term
- [ ] Unit tests with Jest + React Native Testing Library
- [ ] E2E tests with Detox/Maestro
- [ ] Search filters (category, difficulty, price)
- [ ] Course progress tracking
- [ ] Video playback for course content

### Long-term
- [ ] Real-time chat for course discussions
- [ ] Payment integration for course purchases
- [ ] Certificates and achievements
- [ ] Social features (share, reviews, ratings)
- [ ] AI-powered course recommendations
- [ ] Multi-language support (i18n)

### DevOps
- [ ] GitHub Actions CI/CD pipeline
- [ ] Automated release notes
- [ ] Performance monitoring dashboard
- [ ] Crash-free session rate tracking

---

## License

This project is created for educational purposes as part of an assignment.

---

## Acknowledgments

- **Expo Team** - For the amazing framework and tools
- **FreeAPI.app** - For providing the backend API
- **React Native Community** - For excellent libraries and support

---

<div align="center">
  <p><strong>Learnly - Where Learning Meets Technology</strong></p>
</div>
