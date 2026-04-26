import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { API_BASE_URL, API_TIMEOUT } from '../constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors
setupInterceptors(apiClient);

export default apiClient;
