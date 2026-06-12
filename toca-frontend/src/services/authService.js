import { api } from './api.js';

export async function login(email, senha) {
  const dados = await api.post('/auth/login', { email, senha });
  localStorage.setItem('token', dados.token);
  localStorage.setItem(
    'usuario',
    JSON.stringify({ id: dados.id, nome: dados.nome, email: dados.email, perfil: dados.perfil })
  );
  return dados;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function getUsuario() {
  const dados = localStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
}

export function isAutenticado() {
  return !!localStorage.getItem('token');
}
