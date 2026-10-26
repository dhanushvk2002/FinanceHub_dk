import apiClient from './apiClient';

export const revenueService = {
  getAll: (params) => apiClient.get('/revenue', { params }),
  getById: (id) => apiClient.get(`/revenue/${id}`),
  getAnalytics: (periodId) => apiClient.get('/revenue/analytics', { params: { periodId } }),
  create: (data) => apiClient.post('/revenue', data),
  update: (id, data) => apiClient.put(`/revenue/${id}`, data),
  delete: (id) => apiClient.delete(`/revenue/${id}`),
};
