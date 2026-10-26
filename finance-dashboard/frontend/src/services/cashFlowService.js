import apiClient from './apiClient';

export const cashFlowService = {
  getReport: (periodId) => apiClient.get('/cash-flow', { params: { periodId } }),
  getRecords: (params) => apiClient.get('/cash-flow/records', { params }),
  createRecord: (record) => apiClient.post('/cash-flow/records', record),
  updateRecord: (id, record) => apiClient.put(`/cash-flow/records/${id}`, record),
  deleteRecord: (id) => apiClient.delete(`/cash-flow/records/${id}`),
};
