import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidatoService } from '../services/candidatoService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';

const FILTROS = [
  { chave: 'TODOS', rotulo: 'Todos' },
  { chave: 'PENDENTE', rotulo: 'Pendentes' },
  { chave: 'APROVADO', rotulo: 'Aprovados' },
  { chave: 'REJEITADO', rotulo: 'Rejeitados' },
];

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

function simNao(valor) {
  return valor ? 'Sim' : 'Não';
}

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [erro, setErro] = useState('');

  function carregar() {
    candidatoService.listar().then(setCandidatos).catch((e) => setErro(e.message));
  }

  useEffect(carregar, []);

  const filtrados = useMemo(() => {
    return candidatos.filter((c) => {
      const passaFiltro = filtro === 'TODOS' || c.status === filtro;
      const texto = busca.trim().toLowerCase();
      const passaBusca =
        !texto ||
        c.nome.toLowerCase().includes(texto) ||
        c.cpf.includes(texto) ||
        (c.email || '').toLowerCase().includes(texto);
      return passaFiltro && passaBusca;
    });
  }, [candidatos, filtro, busca]);

  function contar(chave) {
    if (chave === 'TODOS') return candidatos.length;
    return candidatos.filter((c) => c.status === chave).length;
  }

  async function abrirDetalhes(candidato) {
    setSelecionado(candidato);
    try {
      setDocumentos(await candidatoService.listarDocumentos(candidato.id));
    } catch {
      setDocumentos([]);
    }
  }

  async function mudarStatus(id, status) {
    try {
      await candidatoService.alterarStatus(id, status);
      setSelecionado(null);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Candidatos</h1>
          <p className="pagina-descricao">Gerencie os candidatos à adoção cadastrados no sistema</p>
        </div>
        <Link to="/admin/candidatos/novo" className="botao-primario">+ Novo Candidato</Link>
      </div>

      {erro && <p className="alerta-erro">{erro}</p>}

      <div className="chips">
        {FILTROS.map((f) => (
          <button
            key={f.chave}
            className={`chip ${filtro === f.chave ? 'chip-ativo' : ''}`}
            onClick={() => setFiltro(f.chave)}
          >
            {f.rotulo} ({contar(f.chave)})
          </button>
        ))}
      </div>

      <section className="painel">
        <div className="painel-cabecalho">
          <h2>Lista de Candidatos</h2>
          <input
            className="campo-busca"
            placeholder="🔍 Buscar por nome, CPF ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Data Nasc.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.nome}</strong></td>
                  <td>{c.cpf}</td>
                  <td>{c.email}</td>
                  <td>{c.telefone || '—'}</td>
                  <td>{formatarData(c.dtNascimento)}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="celula-acoes">
                    <button className="botao-secundario" onClick={() => abrirDetalhes(c)}>Ver</button>
                    {c.status === 'PENDENTE' && (
                      <button className="botao-primario botao-mini" onClick={() => mudarStatus(c.id, 'APROVADO')}>
                        Aprovar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan="7" className="tabela-vazia">Nenhum candidato encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal titulo="Detalhes do Candidato" aberto={!!selecionado} aoFechar={() => setSelecionado(null)}>
        {selecionado && (
          <div>
            <div className="detalhe-topo">
              <h3>{selecionado.nome}</h3>
              <StatusBadge status={selecionado.status} />
            </div>

            <h4 className="detalhe-secao">🐾 Animal de Interesse</h4>
            <div className="detalhe-grade">
              <p>
                <strong>Animal escolhido:</strong>{' '}
                {selecionado.nomeAnimalDesejado
                  ? <span className="badge badge-aprovado">{selecionado.nomeAnimalDesejado}</span>
                  : <em className="texto-suave">Não informado</em>}
              </p>
            </div>

            <h4 className="detalhe-secao">👤 Dados Pessoais</h4>
            <div className="detalhe-grade">
              <p><strong>CPF:</strong> {selecionado.cpf}</p>
              <p><strong>Nascimento:</strong> {formatarData(selecionado.dtNascimento)}</p>
              <p><strong>E-mail:</strong> {selecionado.email}</p>
              <p><strong>Telefone:</strong> {selecionado.telefone || '—'}</p>
              <p style={{ gridColumn: '1 / -1' }}><strong>Endereço:</strong> {selecionado.endereco || '—'}</p>
            </div>

            <h4 className="detalhe-secao">🏠 Informações do Lar</h4>
            <div className="detalhe-grade">
              <p><strong>Tipo de moradia:</strong> {selecionado.tipoMoradia || '—'}</p>
              <p><strong>Possui quintal:</strong> {simNao(selecionado.possuiQuintal)}</p>
              <p><strong>Espaço externo:</strong> {simNao(selecionado.possuiEspacoExterno)}</p>
              <p><strong>Outros animais:</strong> {simNao(selecionado.temOutrosAnimais)}</p>
              <p><strong>Crianças em casa:</strong> {simNao(selecionado.criancasEmCasa)}</p>
              <p><strong>Horas em casa/dia:</strong> {selecionado.horasEmCasaPorDia || '—'}</p>
              <p><strong>Cercas ou telas:</strong> {simNao(selecionado.temCercaOuTela)}</p>
            </div>
            {selecionado.descricaoAmbiente && (
              <p className="detalhe-texto">“{selecionado.descricaoAmbiente}”</p>
            )}

            <h4 className="detalhe-secao">📎 Documentos Enviados</h4>
            {documentos.length === 0 && <p className="texto-suave">Nenhum documento enviado.</p>}
            <ul className="lista-documentos">
              {documentos.map((d) => (
                <li key={d.id}>
                  <span>📄 {d.tipoDocumento} · {d.nomeOriginal}</span>
                  <button
                    className="botao-secundario"
                    onClick={() => candidatoService.baixarDocumento(d.id, d.nomeOriginal)}
                  >
                    Baixar
                  </button>
                </li>
              ))}
            </ul>

            <div className="modal-acoes">
              <button className="botao-perigo" onClick={() => mudarStatus(selecionado.id, 'REJEITADO')}>
                Rejeitar
              </button>
              <button className="botao-secundario" onClick={() => mudarStatus(selecionado.id, 'PENDENTE')}>
                Marcar Pendente
              </button>
              <button className="botao-primario" onClick={() => mudarStatus(selecionado.id, 'APROVADO')}>
                Aprovar Candidato
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
