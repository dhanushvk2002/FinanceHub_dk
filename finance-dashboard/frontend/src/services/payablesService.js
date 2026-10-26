import apiClient from './apiClient';

export const payablesService = {
  getAll: (params) => apiClient.get('/payables', { params }),
  getById: (id) => apiClient.get(`/payables/${id}`),
  getAnalytics: () => apiClient.get('/payables/analytics'),
  create: (data) => apiClient.post('/payables', data),
  update: (id, data) => apiClient.put(`/payables/${id}`, data),
  delete: (id) => apiClient.delete(`/payables/${id}`),
};
