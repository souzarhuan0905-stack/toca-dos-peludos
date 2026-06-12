import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/admin');
    } catch (ex) {
      setErro(ex.message || 'E-mail ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-pagina">
      <div className="login-card">
        <h1 className="login-marca">🐾 Toca dos <span>Peludos</span></h1>
        <p className="login-subtitulo">Painel Administrativo · Acesso Restrito</p>

        <form onSubmit={entrar} className="login-form">
          <label className="form-campo">
            <span className="form-rotulo">E-mail do funcionário</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tocadospeludos.org"
              required
            />
          </label>

          <label className="form-campo">
            <span className="form-rotulo">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {erro && <p className="alerta-erro">{erro}</p>}

          <button type="submit" className="botao-primario botao-largo" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar no sistema'}
          </button>
        </form>

        <p className="login-rodape">
          Sistema exclusivo para funcionários da ONG Toca dos Peludos
        </p>
        <Link to="/" className="login-voltar">← Voltar ao cadastro público</Link>
      </div>
    </div>
  );
}
