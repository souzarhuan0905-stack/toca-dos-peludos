import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getUsuario, logout } from '../services/authService.js';

export default function Navbar() {
  const usuario = getUsuario();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  function sair() {
    logout();
    navigate('/login');
  }

  const iniciais = usuario
    ? usuario.nome
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className="navbar">
      <Link to="/admin" className="navbar-marca">
        🐾 Toca dos <span>Peludos</span>
      </Link>

      <button className="navbar-hamburger" onClick={() => setAberto(!aberto)} aria-label="Abrir menu">
        ☰
      </button>

      <nav className={`navbar-links ${aberto ? 'aberto' : ''}`}>
        <NavLink to="/admin" end onClick={() => setAberto(false)}>Dashboard</NavLink>
        <NavLink to="/admin/candidatos" onClick={() => setAberto(false)}>Candidatos</NavLink>
        <NavLink to="/admin/animais" onClick={() => setAberto(false)}>Animais</NavLink>
        <NavLink to="/admin/adocoes" onClick={() => setAberto(false)}>Adoções</NavLink>
        <NavLink to="/admin/funcionarios" onClick={() => setAberto(false)}>Funcionários</NavLink>
        <a href="/" target="_blank" rel="noreferrer" className="navbar-publico">🔗 Cadastro Público</a>
      </nav>

      <div className="navbar-usuario">
        <span className="navbar-avatar">{iniciais}</span>
        <span className="navbar-nome">{usuario ? usuario.nome.split(' ')[0] : ''}</span>
        <button className="navbar-sair" onClick={sair}>Sair</button>
      </div>
    </header>
  );
}
