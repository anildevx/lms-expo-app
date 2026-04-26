import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourses, fetchProductById, mapToCourse } from '../api/coursesApi';
import { fetchInstructors } from '../api/coursesApi';
import { useCoursesStore } from '../store';
import { logger } from '../../../utils/logger';
import { QUERY_KEYS, CACHE_TIME } from '../../../constants';
import type { Course } from '../../../types';

/**
 * Hook to fetch courses with pagination
 */
export const useCourses = (limit: number = 10) => {
  const { bookmarkedCourses, enrolledCourses } = useCoursesStore();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.COURSES.LIST(1, limit),
    queryFn: ({ pageParam = 1 }) => fetchCourses(pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    select: (data) => {
      // Merge bookmark and enrollment status
      const coursesWithStatus = data.pages.flatMap((page) =>
        page.courses.map((course) => ({
          ...course,
          isBookmarked: bookmarkedCourses.includes(course.id),
          isEnrolled: enrolledCourses.includes(course.id),
        }))
      );
      return {
        pages: data.pages,
        pageParams: data.pageParams,
        courses: coursesWithStatus,
      };
    },
    staleTime: CACHE_TIME.MEDIUM,
  });
};

/**
 * Hook to fetch a single course by ID
 */
export const useCourse = (courseId: string) => {
  const { bookmarkedCourses, enrolledCourses } = useCoursesStore();

  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(courseId),
    queryFn: async () => {
      // Fetch product
      const product = await fetchProductById(courseId);

      // Fetch a random instructor
      const instructorsResponse = await fetchInstructors(1, 1);
      const instructor = instructorsResponse.data.data[0];

      // Map to course
      const course = mapToCourse(product, instructor);

      return {
        ...course,
        isBookmarked: bookmarkedCourses.includes(course.id),
        isEnrolled: enrolledCourses.includes(course.id),
      };
    },
    enabled: !!courseId,
    staleTime: CACHE_TIME.MEDIUM,
  });
};

/**
 * Hook to search/filter courses
 */
export const useSearchCourses = (searchQuery: string) => {
  const { data } = useCourses(50);

  if (!searchQuery.trim()) {
    return data?.courses || [];
  }

  const query = searchQuery.toLowerCase();
  return (data?.courses || []).filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.instructor.name.toLowerCase().includes(query)
  );
};

/**
 * Hook to get bookmarked courses
 */
export const useBookmarkedCourses = () => {
  const { bookmarkedCourses } = useCoursesStore();
  const { data } = useCourses(50);

  return (data?.courses || []).filter((course) =>
    bookmarkedCourses.includes(course.id)
  );
};

/**
 * Alias for useCourse hook
 */
export const useCourseById = useCourse;

/**
 * Hook to enroll in a course
 */
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  const { enrollCourse } = useCoursesStore();

  return useMutation({
    mutationFn: async (courseId: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return courseId;
    },
    onSuccess: (courseId) => {
      enrollCourse(courseId);

      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });

      logger.info('Successfully enrolled in course', { courseId });
    },
    onError: (error) => {
      logger.error('Failed to enroll in course', error);
    },
  });
};
