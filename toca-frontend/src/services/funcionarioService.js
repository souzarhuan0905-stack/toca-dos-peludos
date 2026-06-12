import { api } from './api.js';

export const funcionarioService = {
  listar: () => api.get('/funcionarios'),
  buscar: (id) => api.get(`/funcionarios/${id}`),
  criar: (funcionario) => api.post('/funcionarios', funcionario),
  atualizar: (id, funcionario) => api.put(`/funcionarios/${id}`, funcionario),
  excluir: (id) => api.del(`/funcionarios/${id}`),
};
