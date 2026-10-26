import apiClient from './apiClient';

export const refundsService = {
  getAll: (params) => apiClient.get('/refunds', { params }),
  getById: (id) => apiClient.get(`/refunds/${id}`),
  getAnalytics: () => apiClient.get('/refunds/analytics'),
  create: (data) => apiClient.post('/refunds', data),
  update: (id, data) => apiClient.put(`/refunds/${id}`, data),
  delete: (id) => apiClient.delete(`/refunds/${id}`),
};
