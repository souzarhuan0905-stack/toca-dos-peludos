import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { candidatoService } from '../services/candidatoService.js';
import FormInput from '../components/FormInput.jsx';

const VAZIO = {
  nome: '', cpf: '', dtNascimento: '', email: '', telefone: '', endereco: '',
  tipoMoradia: 'CASA', possuiQuintal: false, possuiEspacoExterno: false,
  temOutrosAnimais: false, criancasEmCasa: false, horasEmCasaPorDia: '4h a 8h',
  temCercaOuTela: false, descricaoAmbiente: '',
};

export default function NovoCandidato() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function mudar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await candidatoService.criar({ ...dados, cpf: dados.cpf.replace(/\D/g, '') });
      navigate('/admin/candidatos');
    } catch (ex) {
      setErro(ex.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <Link to="/admin/candidatos" className="link-voltar">← Voltar</Link>
      <div className="pagina-cabecalho">
        <div>
          <h1>Novo Candidato</h1>
          <p className="pagina-descricao">Preencha os dados para cadastrar um candidato à adoção</p>
        </div>
      </div>

      <form className="painel formulario" onSubmit={salvar}>
        <h2 className="form-secao">👤 Dados Pessoais</h2>
        <div className="form-grade">
          <FormInput rotulo="Nome Completo" obrigatorio largura="1 / -1">
            <input value={dados.nome} onChange={(e) => mudar('nome', e.target.value)} placeholder="Nome completo do candidato" required />
          </FormInput>
          <FormInput rotulo="CPF" obrigatorio>
            <input value={dados.cpf} onChange={(e) => mudar('cpf', e.target.value)} placeholder="Somente números" maxLength="14" required />
          </FormInput>
          <FormInput rotulo="Data de Nascimento" obrigatorio>
            <input type="date" value={dados.dtNascimento} onChange={(e) => mudar('dtNascimento', e.target.value)} required />
          </FormInput>
          <FormInput rotulo="E-mail" obrigatorio>
            <input type="email" value={dados.email} onChange={(e) => mudar('email', e.target.value)} placeholder="email@exemplo.com" required />
          </FormInput>
          <FormInput rotulo="Telefone">
            <input value={dados.telefone} onChange={(e) => mudar('telefone', e.target.value)} placeholder="(00) 00000-0000" />
          </FormInput>
          <FormInput rotulo="Endereço" largura="1 / -1">
            <input value={dados.endereco} onChange={(e) => mudar('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade/UF" />
          </FormInput>
        </div>

        <h2 className="form-secao">🏠 Informações do Ambiente</h2>
        <div className="form-grade">
          <FormInput rotulo="Tipo de Moradia">
            <select value={dados.tipoMoradia} onChange={(e) => mudar('tipoMoradia', e.target.value)}>
              <option value="CASA">Casa</option>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="CHACARA">Chácara / Sítio</option>
            </select>
          </FormInput>
          <FormInput rotulo="Tem Quintal?">
            <select value={dados.possuiQuintal ? 'sim' : 'nao'} onChange={(e) => mudar('possuiQuintal', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Possui espaço externo?">
            <select value={dados.possuiEspacoExterno ? 'sim' : 'nao'} onChange={(e) => mudar('possuiEspacoExterno', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Tem outros animais?">
            <select value={dados.temOutrosAnimais ? 'sim' : 'nao'} onChange={(e) => mudar('temOutrosAnimais', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Crianças em casa?">
            <select value={dados.criancasEmCasa ? 'sim' : 'nao'} onChange={(e) => mudar('criancasEmCasa', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Horas em casa por dia">
            <select value={dados.horasEmCasaPorDia} onChange={(e) => mudar('horasEmCasaPorDia', e.target.value)}>
              <option>Menos de 4h</option>
              <option>4h a 8h</option>
              <option>8h ou mais</option>
            </select>
          </FormInput>
          <FormInput rotulo="Tem cercas ou telas?">
            <select value={dados.temCercaOuTela ? 'sim' : 'nao'} onChange={(e) => mudar('temCercaOuTela', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Conte-nos mais sobre o lar" largura="1 / -1">
            <textarea rows="3" value={dados.descricaoAmbiente} onChange={(e) => mudar('descricaoAmbiente', e.target.value)} placeholder="Descreva o ambiente, a rotina da família e por que deseja adotar..." />
          </FormInput>
        </div>

        {erro && <p className="alerta-erro">{erro}</p>}

        <div className="modal-acoes">
          <Link to="/admin/candidatos" className="botao-secundario">Cancelar</Link>
          <button type="submit" className="botao-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Cadastrar Candidato'}
          </button>
        </div>
      </form>
    </div>
  );
}
