import apiClient from './apiClient';

export const cogsService = {
  getAll: (params) => apiClient.get('/cogs', { params }),
  getById: (id) => apiClient.get(`/cogs/${id}`),
  getAnalytics: (periodId) => apiClient.get('/cogs/analytics', { params: { periodId } }),
  create: (data) => apiClient.post('/cogs', data),
  update: (id, data) => apiClient.put(`/cogs/${id}`, data),
  delete: (id) => apiClient.delete(`/cogs/${id}`),
};
