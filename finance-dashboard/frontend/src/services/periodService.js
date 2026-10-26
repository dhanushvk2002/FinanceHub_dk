import apiClient from './apiClient';

export const periodService = {
  getAll: () => apiClient.get('/periods'),
};
