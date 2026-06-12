import { useEffect, useMemo, useState } from 'react';
import { adocaoService } from '../services/adocaoService.js';
import { candidatoService } from '../services/candidatoService.js';
import { animalService } from '../services/animalService.js';
import { funcionarioService } from '../services/funcionarioService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import FormInput from '../components/FormInput.jsx';

function fid(prefixo, id) {
  return `${prefixo}${String(id).padStart(4, '0')}`;
}

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function Adocoes() {
  const [adocoes, setAdocoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalNova, setModalNova] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [nova, setNova] = useState({ idCandidato: '', idAnimal: '', idFuncionario: '' });
  const [erro, setErro] = useState('');
  const [erroModal, setErroModal] = useState('');

  function carregar() {
    adocaoService.listar().then(setAdocoes).catch((e) => setErro(e.message));
  }

  useEffect(carregar, []);

  async function abrirModalNova() {
    setErroModal('');
    setNova({ idCandidato: '', idAnimal: '', idFuncionario: '' });
    try {
      const [cands, anims, funcs] = await Promise.all([
        candidatoService.listar(),
        animalService.listar(),
        funcionarioService.listar(),
      ]);
      // Regra de negócio: apenas candidatos APROVADOS e animais não adotados
      setCandidatos(cands.filter((c) => c.status === 'APROVADO'));
      setAnimais(anims.filter((a) => a.status === 'DISPONIVEL'));
      setFuncionarios(funcs);
      setModalNova(true);
    } catch (e) {
      alert(e.message);
    }
  }

  async function registrar() {
    setErroModal('');
    if (!nova.idCandidato || !nova.idAnimal) {
      setErroModal('Selecione o candidato e o animal.');
      return;
    }
    try {
      await adocaoService.registrar({
        idCandidato: Number(nova.idCandidato),
        idAnimal: Number(nova.idAnimal),
        idFuncionario: nova.idFuncionario ? Number(nova.idFuncionario) : null,
      });
      setModalNova(false);
      carregar();
    } catch (e) {
      setErroModal(e.message);
    }
  }

  async function mudarStatus(id, status) {
    try {
      await adocaoService.alterarStatus(id, status);
      setDetalhe(null);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  const filtradas = useMemo(() => {
    const texto = busca.trim().toLowerCase();
    if (!texto) return adocoes;
    return adocoes.filter(
      (a) =>
        fid('AD', a.id).toLowerCase().includes(texto) ||
        a.candidato.nome.toLowerCase().includes(texto) ||
        a.animal.nome.toLowerCase().includes(texto)
    );
  }, [adocoes, busca]);

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Adoções</h1>
          <p className="pagina-descricao">Registro de todas as adoções realizadas</p>
        </div>
        <button className="botao-primario" onClick={abrirModalNova}>+ Registrar Adoção</button>
      </div>

      {erro && <p className="alerta-erro">{erro}</p>}

      <section className="painel">
        <div className="painel-cabecalho">
          <h2>Histórico de Adoções</h2>
          <input
            className="campo-busca"
            placeholder="🔍 Buscar por ID, candidato ou animal..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="tabela-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th>ID Adoção</th>
                <th>Animal</th>
                <th>Candidato (CPF)</th>
                <th>Aprovado por</th>
                <th>Data da Adoção</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((a) => (
                <tr key={a.id}>
                  <td><span className="badge badge-id">{fid('AD', a.id)}</span></td>
                  <td><strong>{a.animal.nome}</strong> · {fid('AN', a.animal.id)}</td>
                  <td>{a.candidato.nome} · {a.candidato.cpf}</td>
                  <td>{a.funcionario ? a.funcionario.nome : '—'}</td>
                  <td>{formatarData(a.dataAdocao)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td className="celula-acoes">
                    <button className="botao-secundario" onClick={() => setDetalhe(a)}>Detalhes</button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan="7" className="tabela-vazia">Nenhuma adoção encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: registrar adoção */}
      <Modal titulo="Registrar Adoção" aberto={modalNova} aoFechar={() => setModalNova(false)} largura={520}>
        <div className="form-coluna">
          <FormInput rotulo="Candidato aprovado" obrigatorio>
            <select value={nova.idCandidato} onChange={(e) => setNova({ ...nova, idCandidato: e.target.value })}>
              <option value="">Selecione...</option>
              {candidatos.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} · {c.cpf}</option>
              ))}
            </select>
          </FormInput>
          <FormInput rotulo="Animal disponível" obrigatorio>
            <select value={nova.idAnimal} onChange={(e) => setNova({ ...nova, idAnimal: e.target.value })}>
              <option value="">Selecione...</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>{a.nome} · {fid('AN', a.id)}</option>
              ))}
            </select>
          </FormInput>
          <FormInput rotulo="Funcionário responsável">
            <select value={nova.idFuncionario} onChange={(e) => setNova({ ...nova, idFuncionario: e.target.value })}>
              <option value="">Selecione...</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </FormInput>
          {candidatos.length === 0 && (
            <p className="texto-suave">⚠️ Não há candidatos aprovados. Aprove um candidato antes de registrar a adoção.</p>
          )}
          {erroModal && <p className="alerta-erro">{erroModal}</p>}
          <div className="modal-acoes">
            <button className="botao-secundario" onClick={() => setModalNova(false)}>Cancelar</button>
            <button className="botao-primario" onClick={registrar}>Registrar Adoção</button>
          </div>
        </div>
      </Modal>

      {/* Modal: detalhes da adoção */}
      <Modal titulo="Detalhes da Adoção" aberto={!!detalhe} aoFechar={() => setDetalhe(null)} largura={520}>
        {detalhe && (
          <div>
            <div className="detalhe-topo">
              <h3>{fid('AD', detalhe.id)} · {detalhe.animal.nome}</h3>
              <StatusBadge status={detalhe.status} />
            </div>
            <div className="detalhe-grade">
              <p><strong>Animal:</strong> {detalhe.animal.nome} ({fid('AN', detalhe.animal.id)})</p>
              <p><strong>Espécie:</strong> {detalhe.animal.especie === 'CAO' ? 'Cão' : 'Gato'}</p>
              <p><strong>Candidato:</strong> {detalhe.candidato.nome}</p>
              <p><strong>CPF:</strong> {detalhe.candidato.cpf}</p>
              <p><strong>Aprovado por:</strong> {detalhe.funcionario ? detalhe.funcionario.nome : '—'}</p>
              <p><strong>Data:</strong> {formatarData(detalhe.dataAdocao)}</p>
            </div>
            {detalhe.status === 'EM_ANDAMENTO' && (
              <div className="modal-acoes">
                <button className="botao-perigo" onClick={() => mudarStatus(detalhe.id, 'CANCELADA')}>
                  Cancelar Adoção
                </button>
                <button className="botao-primario" onClick={() => mudarStatus(detalhe.id, 'CONCLUIDA')}>
                  ✅ Concluir Adoção
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
