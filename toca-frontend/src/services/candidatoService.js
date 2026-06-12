import { api } from './api.js';

export const candidatoService = {
  listar: () => api.get('/candidatos'),
  buscar: (id) => api.get(`/candidatos/${id}`),
  criar: (candidato) => api.post('/candidatos', candidato),
  atualizar: (id, candidato) => api.put(`/candidatos/${id}`, candidato),
  alterarStatus: (id, status) => api.patch(`/candidatos/${id}/status`, { status }),
  excluir: (id) => api.del(`/candidatos/${id}`),
  listarDocumentos: (id) => api.get(`/candidatos/${id}/documentos`),

  enviarDocumento: (id, tipoDocumento, arquivo) => {
    const form = new FormData();
    form.append('tipoDocumento', tipoDocumento);
    form.append('arquivo', arquivo);
    return api.postForm(`/candidatos/${id}/documentos`, form);
  },

  // Baixa o arquivo autenticado e dispara o download no navegador
  baixarDocumento: async (idDocumento, nomeArquivo) => {
    const resposta = await api.get(`/documentos/${idDocumento}/download`);
    const blob = await resposta.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo || 'documento';
    link.click();
    URL.revokeObjectURL(url);
  },
};
