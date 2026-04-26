import apiClient from '../../../services/apiClient';
import type { PaginatedApiResponse, RandomProduct, RandomUser, Course, Instructor } from '../../../types';
import { API_ENDPOINTS } from '../../../constants';

/**
 * Fetch random products (courses)
 */
export const fetchProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedApiResponse<RandomProduct>> => {
  const response = await apiClient.get<PaginatedApiResponse<RandomProduct>>(
    API_ENDPOINTS.PUBLIC.COURSES,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Fetch random users (instructors)
 */
export const fetchInstructors = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedApiResponse<RandomUser>> => {
  const response = await apiClient.get<PaginatedApiResponse<RandomUser>>(
    API_ENDPOINTS.PUBLIC.INSTRUCTORS,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id: string): Promise<RandomProduct> => {
  const response = await apiClient.get<PaginatedApiResponse<RandomProduct>>(
    API_ENDPOINTS.PUBLIC.COURSES,
    {
      params: { page: 1, limit: 100 },
    }
  );
  const product = response.data.data.data.find(p => p.id.toString() === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

/**
 * Map RandomProduct and RandomUser to Course
 */
export const mapToCourse = (product: RandomProduct, instructor: RandomUser): Course => {
  // Generate a description from category and title
  const description = `Learn all about ${product.title}. This comprehensive course covers everything you need to know about ${product.category}. Perfect for beginners and advanced learners alike.`;

  return {
    id: product.id.toString(),
    title: product.title,
    description,
    thumbnail: product.thumbnail,
    images: product.images,
    price: product.price,
    category: product.category,
    instructor: {
      id: instructor.id.toString(),
      name: `${instructor.name.first} ${instructor.name.last}`,
      email: instructor.email,
      avatar: instructor.picture.large,
      location: `${instructor.location.city}, ${instructor.location.state}`,
      country: instructor.location.country,
    },
    isEnrolled: false,
    isBookmarked: false,
  };
};

/**
 * Fetch courses with instructors
 */
export const fetchCourses = async (
  page: number = 1,
  limit: number = 10
): Promise<{ courses: Course[]; hasMore: boolean; totalPages: number }> => {
  const [productsResponse, instructorsResponse] = await Promise.all([
    fetchProducts(page, limit),
    fetchInstructors(1, 50),
  ]);

  const products = productsResponse.data.data;
  const instructors = instructorsResponse.data.data;

  // Map products to courses with random instructors
  const courses = products.map((product, index) => {
    const randomInstructor = instructors[index % instructors.length];
    return mapToCourse(product, randomInstructor);
  });

  return {
    courses,
    hasMore: productsResponse.data.nextPage,
    totalPages: productsResponse.data.totalPages,
  };
};
