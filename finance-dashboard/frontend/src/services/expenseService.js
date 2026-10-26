import apiClient from './apiClient';

export const expenseService = {
  getAll: (params) => apiClient.get('/expenses', { params }),
  getById: (id) => apiClient.get(`/expenses/${id}`),
  getAnalytics: (periodId) => apiClient.get('/expenses/analytics', { params: { periodId } }),
  create: (data) => apiClient.post('/expenses', data),
  update: (id, data) => apiClient.put(`/expenses/${id}`, data),
  delete: (id) => apiClient.delete(`/expenses/${id}`),
};
