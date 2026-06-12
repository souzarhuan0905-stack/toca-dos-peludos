import { useEffect, useMemo, useState } from 'react';
import { funcionarioService } from '../services/funcionarioService.js';
import { getUsuario } from '../services/authService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';
import FormInput from '../components/FormInput.jsx';

const VAZIO = { nome: '', cpf: '', email: '', dtNascimento: '', perfil: 'VOLUNTARIO', senha: '' };

function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function Funcionarios() {
  const usuario = getUsuario();
  const ehAdmin = usuario && usuario.perfil === 'ADMIN';
  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [erroModal, setErroModal] = useState('');

  function carregar() {
    funcionarioService.listar().then(setFuncionarios).catch((e) => setErro(e.message));
  }

  useEffect(carregar, []);

  const filtrados = useMemo(() => {
    const texto = busca.trim().toLowerCase();
    if (!texto) return funcionarios;
    return funcionarios.filter(
      (f) => f.nome.toLowerCase().includes(texto) || f.email.toLowerCase().includes(texto)
    );
  }, [funcionarios, busca]);

  function abrirNovo() {
    setEditandoId(null);
    setDados(VAZIO);
    setErroModal('');
    setModal(true);
  }

  function abrirEdicao(funcionario) {
    setEditandoId(funcionario.id);
    setDados({
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      dtNascimento: funcionario.dtNascimento || '',
      perfil: funcionario.perfil,
      senha: '',
    });
    setErroModal('');
    setModal(true);
  }

  function mudar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErroModal('');
    try {
      const corpo = {
        ...dados,
        cpf: dados.cpf.replace(/\D/g, ''),
        dtNascimento: dados.dtNascimento || null,
        senha: dados.senha || null,
      };
      if (editandoId) {
        await funcionarioService.atualizar(editandoId, corpo);
      } else {
        await funcionarioService.criar(corpo);
      }
      setModal(false);
      carregar();
    } catch (ex) {
      setErroModal(ex.message);
    }
  }

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Funcionários</h1>
          <p className="pagina-descricao">Gerencie a equipe administrativa da ONG</p>
        </div>
        {ehAdmin && (
          <button className="botao-primario" onClick={abrirNovo}>+ Novo Funcionário</button>
        )}
      </div>

      {erro && <p className="alerta-erro">{erro}</p>}
      {!ehAdmin && (
        <p className="texto-suave">ℹ️ Apenas funcionários com perfil <strong>Admin</strong> podem cadastrar ou editar a equipe.</p>
      )}

      <section className="painel">
        <div className="painel-cabecalho">
          <h2>Equipe Ativa</h2>
          <input
            className="campo-busca"
            placeholder="🔍 Buscar funcionário..."
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
                <th>Perfil</th>
                <th>Data Nasc.</th>
                {ehAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.nome}</strong></td>
                  <td>{f.cpf}</td>
                  <td>{f.email}</td>
                  <td><StatusBadge status={f.perfil} /></td>
                  <td>{formatarData(f.dtNascimento)}</td>
                  {ehAdmin && (
                    <td className="celula-acoes">
                      <button className="botao-secundario" onClick={() => abrirEdicao(f)}>Editar</button>
                    </td>
                  )}
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={ehAdmin ? 6 : 5} className="tabela-vazia">Nenhum funcionário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        titulo={editandoId ? 'Editar Funcionário' : 'Novo Funcionário'}
        aberto={modal}
        aoFechar={() => setModal(false)}
        largura={520}
      >
        <form className="form-coluna" onSubmit={salvar}>
          <FormInput rotulo="Nome Completo" obrigatorio>
            <input value={dados.nome} onChange={(e) => mudar('nome', e.target.value)} required />
          </FormInput>
          <FormInput rotulo="CPF" obrigatorio>
            <input value={dados.cpf} onChange={(e) => mudar('cpf', e.target.value)} maxLength="14" required />
          </FormInput>
          <FormInput rotulo="E-mail" obrigatorio>
            <input type="email" value={dados.email} onChange={(e) => mudar('email', e.target.value)} required />
          </FormInput>
          <FormInput rotulo="Data de Nascimento">
            <input type="date" value={dados.dtNascimento} onChange={(e) => mudar('dtNascimento', e.target.value)} />
          </FormInput>
          <FormInput rotulo="Perfil" obrigatorio>
            <select value={dados.perfil} onChange={(e) => mudar('perfil', e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="VOLUNTARIO">Voluntário</option>
              <option value="CUIDADOR">Cuidador</option>
            </select>
          </FormInput>
          <FormInput rotulo={editandoId ? 'Nova senha (opcional)' : 'Senha de acesso'} obrigatorio={!editandoId}>
            <input
              type="password"
              value={dados.senha}
              onChange={(e) => mudar('senha', e.target.value)}
              placeholder={editandoId ? 'Deixe em branco para manter a atual' : 'Senha do funcionário'}
              required={!editandoId}
            />
          </FormInput>
          {erroModal && <p className="alerta-erro">{erroModal}</p>}
          <div className="modal-acoes">
            <button type="button" className="botao-secundario" onClick={() => setModal(false)}>Cancelar</button>
            <button type="submit" className="botao-primario">{editandoId ? 'Salvar Alterações' : 'Cadastrar'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
