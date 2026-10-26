import axios from 'axios';
import { notificationService, parseCreationNotification } from './notificationService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    // If a new record was posted/created successfully, dispatch a bell icon notification
    if (response.config && response.config.method?.toLowerCase() === 'post') {
      try {
        const url = response.config.url || '';
        let reqData = {};
        if (typeof response.config.data === 'string') {
          reqData = JSON.parse(response.config.data || '{}');
        } else if (response.config.data) {
          reqData = response.config.data;
        }
        const resData = response.data?.data || response.data || {};
        const parsed = parseCreationNotification(url, reqData, resData);
        notificationService.addRecordNotification(parsed);
      } catch (err) {
        console.error('Failed to dispatch creation notification:', err);
      }
    }
    // Return the response data body directly (ApiResponse unwrapping)
    return response.data;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred while contacting the financial server.';
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
