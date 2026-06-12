// Cliente HTTP central: injeta o token JWT e padroniza o tratamento de erros.
const BASE = '/api';

export function getToken() {
  return localStorage.getItem('token');
}

async function requisicao(caminho, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const resposta = await fetch(BASE + caminho, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  if (resposta.status === 401 && !caminho.startsWith('/auth/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!resposta.ok) {
    let mensagem = 'Erro na comunicação com o servidor.';
    try {
      const erro = await resposta.json();
      if (erro && erro.mensagem) mensagem = erro.mensagem;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204) return null;
  const tipo = resposta.headers.get('content-type') || '';
  return tipo.includes('application/json') ? resposta.json() : resposta;
}

export const api = {
  get: (caminho) => requisicao(caminho),
  post: (caminho, body) => requisicao(caminho, { method: 'POST', body }),
  put: (caminho, body) => requisicao(caminho, { method: 'PUT', body }),
  patch: (caminho, body) => requisicao(caminho, { method: 'PATCH', body }),
  del: (caminho) => requisicao(caminho, { method: 'DELETE' }),
  postForm: (caminho, formData) =>
    requisicao(caminho, { method: 'POST', body: formData, isForm: true }),
};
