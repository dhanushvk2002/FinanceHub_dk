import apiClient from './apiClient';

export const forecastService = {
  getAll: (modelName) => apiClient.get('/forecasts', { params: { modelName } }),
  getById: (id) => apiClient.get(`/forecasts/${id}`),
  getAnalytics: () => apiClient.get('/forecasts/analytics'),
  create: (data) => apiClient.post('/forecasts', data),
  update: (id, data) => apiClient.put(`/forecasts/${id}`, data),
  delete: (id) => apiClient.delete(`/forecasts/${id}`),
};
