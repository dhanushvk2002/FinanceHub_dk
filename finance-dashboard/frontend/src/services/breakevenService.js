import apiClient from './apiClient';

export const breakevenService = {
  getAll: () => apiClient.get('/breakeven'),
  getById: (id) => apiClient.get(`/breakeven/${id}`),
  create: (data) => apiClient.post('/breakeven', data),
  update: (id, data) => apiClient.put(`/breakeven/${id}`, data),
  delete: (id) => apiClient.delete(`/breakeven/${id}`),
};
