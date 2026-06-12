import { api } from './api.js';

export const animalService = {
  listar: () => api.get('/animais'),
  buscar: (id) => api.get(`/animais/${id}`),
  criar: (animal) => api.post('/animais', animal),
  atualizar: (id, animal) => api.put(`/animais/${id}`, animal),
  alterarStatus: (id, status) => api.patch(`/animais/${id}/status`, { status }),
  excluir: (id) => api.del(`/animais/${id}`),
};
