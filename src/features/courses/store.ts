import { create } from 'zustand';
import { storage, storageKeys } from '../../lib/storage';
import { logger } from '../../utils/logger';
import { notifyFiveBookmarksMilestone, reset5BookmarksNotification } from '../../services/notificationService';

interface CoursesState {
  bookmarkedCourses: string[];
  enrolledCourses: string[];
  loadBookmarks: () => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  isBookmarked: (courseId: string) => boolean;
  getBookmarkCount: () => number;
  clearBookmarks: () => Promise<void>;
  enrollCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

// Load bookmarks from AsyncStorage
const loadBookmarksFromStorage = async (): Promise<string[]> => {
  try {
    const bookmarksString = await storage.getString(storageKeys.BOOKMARKS);
    return bookmarksString ? JSON.parse(bookmarksString) : [];
  } catch (error) {
    logger.error('Failed to load bookmarks from storage', error);
    return [];
  }
};

// Save bookmarks to AsyncStorage
const saveBookmarksToStorage = async (bookmarks: string[]) => {
  try {
    await storage.set(storageKeys.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (error) {
    logger.error('Failed to save bookmarks to storage', error);
  }
};

export const useCoursesStore = create<CoursesState>((set, get) => ({
  bookmarkedCourses: [],
  enrolledCourses: [],

  loadBookmarks: async () => {
    const bookmarks = await loadBookmarksFromStorage();
    set({ bookmarkedCourses: bookmarks });
  },

  toggleBookmark: async (courseId) => {
    const state = get();
    const isCurrentlyBookmarked = state.bookmarkedCourses.includes(courseId);
    const newBookmarks = isCurrentlyBookmarked
      ? state.bookmarkedCourses.filter((id) => id !== courseId)
      : [...state.bookmarkedCourses, courseId];

    set({ bookmarkedCourses: newBookmarks });

    // Save to storage
    await saveBookmarksToStorage(newBookmarks);

    logger.info(
      `Bookmark ${isCurrentlyBookmarked ? 'removed' : 'added'}`,
      { courseId, totalBookmarks: newBookmarks.length }
    );

    // Check for 5 bookmarks milestone
    if (!isCurrentlyBookmarked && newBookmarks.length === 5) {
      logger.info('User reached 5 bookmarks milestone');
      await notifyFiveBookmarksMilestone();
    }

    // Reset notification flag if bookmarks drop below 5
    if (isCurrentlyBookmarked && newBookmarks.length < 5) {
      await reset5BookmarksNotification();
    }
  },

  isBookmarked: (courseId) => {
    return get().bookmarkedCourses.includes(courseId);
  },

  getBookmarkCount: () => get().bookmarkedCourses.length,

  clearBookmarks: async () => {
    // Clear from state
    set({ bookmarkedCourses: [] });

    // Clear from storage
    await storage.delete(storageKeys.BOOKMARKS);

    logger.info('Bookmarks cleared from storage');
  },

  enrollCourse: (courseId) => {
    set((state) => {
      if (state.enrolledCourses.includes(courseId)) {
        return state;
      }
      logger.info('Course enrolled', { courseId });
      return {
        enrolledCourses: [...state.enrolledCourses, courseId],
      };
    });
  },

  isEnrolled: (courseId) => {
    return get().enrolledCourses.includes(courseId);
  },
}));
