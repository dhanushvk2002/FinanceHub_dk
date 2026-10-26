import apiClient from './apiClient';

export const receivablesService = {
  getAll: (params) => apiClient.get('/receivables', { params }),
  getById: (id) => apiClient.get(`/receivables/${id}`),
  getAnalytics: () => apiClient.get('/receivables/analytics'),
  create: (data) => apiClient.post('/receivables', data),
  update: (id, data) => apiClient.put(`/receivables/${id}`, data),
  delete: (id) => apiClient.delete(`/receivables/${id}`),
};
