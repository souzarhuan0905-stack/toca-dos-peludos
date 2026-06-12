import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import QueroAdotar from '../pages/QueroAdotar.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Candidatos from '../pages/Candidatos.jsx';
import NovoCandidato from '../pages/NovoCandidato.jsx';
import Animais from '../pages/Animais.jsx';
import CadastrarAnimal from '../pages/CadastrarAnimal.jsx';
import Adocoes from '../pages/Adocoes.jsx';
import Funcionarios from '../pages/Funcionarios.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Área pública */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/adotar" element={<QueroAdotar />} />
        <Route path="/login" element={<Login />} />

        {/* Painel administrativo (protegido por JWT) */}
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="candidatos" element={<Candidatos />} />
          <Route path="candidatos/novo" element={<NovoCandidato />} />
          <Route path="animais" element={<Animais />} />
          <Route path="animais/novo" element={<CadastrarAnimal />} />
          <Route path="animais/:id/editar" element={<CadastrarAnimal />} />
          <Route path="adocoes" element={<Adocoes />} />
          <Route path="funcionarios" element={<Funcionarios />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
