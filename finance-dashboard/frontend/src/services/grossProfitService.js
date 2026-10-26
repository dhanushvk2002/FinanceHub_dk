import apiClient from './apiClient';

export const grossProfitService = {
  getGrossProfit: (periodId) => apiClient.get('/gross-profit', { params: { periodId } }),
};
