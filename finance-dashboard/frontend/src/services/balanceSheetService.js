import apiClient from './apiClient';

export const balanceSheetService = {
  getReport: (periodId) => apiClient.get('/balance-sheet', { params: { periodId } }),
  getAllItems: (periodId) => apiClient.get('/balance-sheet/items', { params: { periodId } }),
  createItem: (item) => apiClient.post('/balance-sheet/items', item),
  updateItem: (id, item) => apiClient.put(`/balance-sheet/items/${id}`, item),
  deleteItem: (id) => apiClient.delete(`/balance-sheet/items/${id}`),
};
