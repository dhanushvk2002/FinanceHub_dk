import apiClient from './apiClient';

export const gstService = {
  getAll: (params) => apiClient.get('/gst-invoices', { params }),
  getById: (id) => apiClient.get(`/gst-invoices/${id}`),
  getAnalytics: () => apiClient.get('/gst-invoices/analytics'),
  create: (data) => apiClient.post('/gst-invoices', data),
  update: (id, data) => apiClient.put(`/gst-invoices/${id}`, data),
  delete: (id) => apiClient.delete(`/gst-invoices/${id}`),
};
