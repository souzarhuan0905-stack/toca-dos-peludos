import { api } from './api.js';

export const dashboardService = {
  resumo: () => api.get('/dashboard/resumo'),
};
