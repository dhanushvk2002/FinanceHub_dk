import apiClient from './apiClient';

export const taxComplianceService = {
  getAll: (params) => apiClient.get('/tax-compliance', { params }),
  getById: (id) => apiClient.get(`/tax-compliance/${id}`),
  getAnalytics: () => apiClient.get('/tax-compliance/analytics'),
  create: (data) => apiClient.post('/tax-compliance', data),
  update: (id, data) => apiClient.put(`/tax-compliance/${id}`, data),
  delete: (id) => apiClient.delete(`/tax-compliance/${id}`),
};
