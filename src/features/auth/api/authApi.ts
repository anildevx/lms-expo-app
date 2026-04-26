import apiClient from "../../../services/apiClient";
import type { ApiResponse } from "../../../types";
import { LoginFormData, RegisterFormData } from "../schemas";
import { API_ENDPOINTS } from "../../../constants";

export interface AuthUser {
  _id: string;
  email: string;
  username: string;
  avatar?: {
    url: string;
    localPath: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

/**
 * Login user
 */
export const loginUser = async (
  credentials: LoginFormData,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      username: credentials.username,
      password: credentials.password,
    },
  );
  console.log("[loginUser] Login attempt:", response.data);
  return response.data;
};

/**
 * Register new user
 */
export const registerUser = async (
  data: RegisterFormData,
): Promise<ApiResponse<RegisterResponse>> => {
  const payload = {
    email: data.email,
    username: data.username,
    password: data.password,
    user: "student", // Default role for new users
  };
  const response = await apiClient.post<ApiResponse<RegisterResponse>>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload,
  );
  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT,
  );
  return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<ApiResponse<AuthUser>> => {
  const response = await apiClient.get<ApiResponse<AuthUser>>(
    API_ENDPOINTS.AUTH.CURRENT_USER,
  );
  return response.data;
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (): Promise<
  ApiResponse<{ accessToken: string }>
> => {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  );
  return response.data;
};
