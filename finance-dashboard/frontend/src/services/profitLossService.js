import apiClient from './apiClient';

export const profitLossService = {
  getReport: (periodId) => apiClient.get('/profit-loss', { params: { periodId } }),
};
