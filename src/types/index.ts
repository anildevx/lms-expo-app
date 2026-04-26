export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// API Response types from FreeAPI
export interface RandomProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface RandomUser {
  id: number;
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    postcode: number | string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    street: {
      number: number;
      name: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

// Application types (mapped from API)
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  thumbnail: string;
  images: string[];
  price: number;
  category: string;
  isEnrolled: boolean;
  isBookmarked: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  country: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

export interface PaginatedApiResponse<T> {
  data: {
    data: T[];
    currentPageItems: number;
    limit: number;
    page: number;
    totalPages: number;
    totalItems: number;
    nextPage: boolean;
    previousPage: boolean;
  };
  message: string;
  success: boolean;
  statusCode: number;
}
