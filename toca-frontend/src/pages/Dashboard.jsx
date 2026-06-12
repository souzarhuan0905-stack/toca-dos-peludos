import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService.js';
import CardResumo from '../components/CardResumo.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const COR_ATIVIDADE = {
  CANDIDATO_CADASTRADO: 'ponto-laranja',
  CANDIDATO_APROVADO: 'ponto-verde',
  CANDIDATO_REJEITADO: 'ponto-vermelho',
  ANIMAL_CADASTRADO: 'ponto-azul',
  ADOCAO_REGISTRADA: 'ponto-laranja',
  ADOCAO_CONCLUIDA: 'ponto-verde',
  ADOCAO_CANCELADA: 'ponto-vermelho',
};

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function formatarDataHora(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardService.resumo().then(setResumo).catch((e) => setErro(e.message));
  }, []);

  const hoje = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Dashboard</h1>
          <p className="pagina-descricao">Visão geral do sistema de adoção · Hoje, {hoje}</p>
        </div>
      </div>

      {erro && <p className="alerta-erro">{erro}</p>}

      {resumo && (
        <>
          <div className="grade-cards">
            <CardResumo titulo="Total de Candidatos" valor={resumo.totalCandidatos} subtitulo="Cadastros recebidos" cor="laranja" />
            <CardResumo titulo="Adoções Realizadas" valor={resumo.adocoesConcluidas} subtitulo="Concluídas com sucesso" cor="verde" />
            <CardResumo titulo="Animais Disponíveis" valor={resumo.animaisDisponiveis} subtitulo="Prontos para adoção" cor="azul" />
            <CardResumo titulo="Pendentes de Análise" valor={resumo.candidatosPendentes} subtitulo="Aguardando aprovação" cor="amarelo" />
          </div>

          <div className="grade-dashboard">
            <section className="painel">
              <div className="painel-cabecalho">
                <h2>Últimos Candidatos</h2>
                <Link to="/admin/candidatos" className="botao-secundario">Ver todos</Link>
              </div>
              <div className="tabela-wrapper">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Candidato</th>
                      <th>CPF</th>
                      <th>Data do Cadastro</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumo.ultimosCandidatos.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.nome}</strong></td>
                        <td>{c.cpf}</td>
                        <td>{formatarData(c.dataCadastro)}</td>
                        <td><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="painel">
              <div className="painel-cabecalho">
                <h2>Atividade Recente</h2>
              </div>
              <ul className="lista-atividades">
                {resumo.atividadesRecentes.map((a) => (
                  <li key={a.id}>
                    <span className={`ponto ${COR_ATIVIDADE[a.tipo] || 'ponto-laranja'}`} />
                    <div>
                      <p>{a.descricao}</p>
                      <small>{formatarDataHora(a.dataAtividade)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
