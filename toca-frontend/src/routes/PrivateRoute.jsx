import { Navigate, Outlet } from 'react-router-dom';
import { isAutenticado } from '../services/authService.js';
import Navbar from '../components/Navbar.jsx';

// Regra de negócio 4: apenas usuários autenticados acessam o painel
export default function PrivateRoute() {
  if (!isAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-conteudo">
        <Outlet />
      </main>
    </div>
  );
}
