import apiClient from './apiClient';

export const ebitdaService = {
  getEbitda: (periodId) => apiClient.get('/ebitda', { params: { periodId } }),
};
