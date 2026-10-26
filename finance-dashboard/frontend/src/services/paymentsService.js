import apiClient from './apiClient';

export const paymentsService = {
  getAll: (params) => apiClient.get('/payments', { params }),
  getById: (id) => apiClient.get(`/payments/${id}`),
  getAnalytics: () => apiClient.get('/payments/analytics'),
  create: (data) => apiClient.post('/payments', data),
  update: (id, data) => apiClient.put(`/payments/${id}`, data),
  delete: (id) => apiClient.delete(`/payments/${id}`),
};
