import { api } from './api.js';

export const adocaoService = {
  listar: () => api.get('/adocoes'),
  buscar: (id) => api.get(`/adocoes/${id}`),
  registrar: (adocao) => api.post('/adocoes', adocao),
  alterarStatus: (id, status) => api.patch(`/adocoes/${id}/status`, { status }),
};
