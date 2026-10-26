import apiClient from './apiClient';

export const dashboardService = {
  getSummary: (params = {}) => apiClient.get('/dashboard/summary', { params }),
  getPeriods: () => apiClient.get('/periods'),
};
