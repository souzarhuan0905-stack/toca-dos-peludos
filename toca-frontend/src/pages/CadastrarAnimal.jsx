import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { animalService } from '../services/animalService.js';
import FormInput from '../components/FormInput.jsx';

const VAZIO = {
  nome: '', especie: 'CAO', raca: '', dtNascimento: '', peso: '', fotoUrl: '',
  vacinado: true, castrado: false, vermifugado: true, observacoes: '', status: 'DISPONIVEL',
};

export default function CadastrarAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;
  const [dados, setDados] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (editando) {
      animalService
        .buscar(id)
        .then((animal) => setDados({ ...animal, peso: animal.peso ?? '', raca: animal.raca ?? '', observacoes: animal.observacoes ?? '', dtNascimento: animal.dtNascimento ?? '', fotoUrl: animal.fotoUrl ?? '' }))
        .catch((e) => setErro(e.message));
    }
  }, [id, editando]);

  function mudar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const corpo = { ...dados, peso: dados.peso === '' ? null : Number(dados.peso), dtNascimento: dados.dtNascimento || null };
      if (editando) {
        await animalService.atualizar(id, corpo);
      } else {
        await animalService.criar(corpo);
      }
      navigate('/admin/animais');
    } catch (ex) {
      setErro(ex.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <Link to="/admin/animais" className="link-voltar">← Voltar</Link>
      <div className="pagina-cabecalho">
        <div>
          <h1>{editando ? 'Editar Animal' : 'Cadastrar Animal'}</h1>
          <p className="pagina-descricao">
            {editando ? 'Atualize as informações do animal' : 'Preencha as informações do novo animal para adoção'}
          </p>
        </div>
      </div>

      <form className="painel formulario" onSubmit={salvar}>
        <h2 className="form-secao">🐾 Dados do Animal</h2>
        <div className="form-grade">
          <FormInput rotulo="Nome" obrigatorio>
            <input value={dados.nome} onChange={(e) => mudar('nome', e.target.value)} placeholder="Nome do animal" required />
          </FormInput>
          <FormInput rotulo="Espécie" obrigatorio>
            <select value={dados.especie} onChange={(e) => mudar('especie', e.target.value)}>
              <option value="CAO">Cão</option>
              <option value="GATO">Gato</option>
            </select>
          </FormInput>
          <FormInput rotulo="Raça">
            <input value={dados.raca} onChange={(e) => mudar('raca', e.target.value)} placeholder="Ex: SRD, Golden Retriever..." />
          </FormInput>
          <FormInput rotulo="Data de Nascimento">
            <input type="date" value={dados.dtNascimento} onChange={(e) => mudar('dtNascimento', e.target.value)} />
          </FormInput>
          <FormInput rotulo="Peso (kg)">
            <input type="number" step="0.1" min="0" value={dados.peso} onChange={(e) => mudar('peso', e.target.value)} placeholder="0.0" />
          </FormInput>
          {editando && (
            <FormInput rotulo="Status">
              <select value={dados.status} onChange={(e) => mudar('status', e.target.value)}>
                <option value="DISPONIVEL">Disponível</option>
                <option value="EM_PROCESSO">Em processo</option>
                <option value="ADOTADO">Adotado</option>
              </select>
            </FormInput>
          )}
        </div>

        <h2 className="form-secao">💉 Saúde &amp; Cuidados</h2>
        <div className="form-grade form-grade-3">
          <FormInput rotulo="Vacinado?">
            <select value={dados.vacinado ? 'sim' : 'nao'} onChange={(e) => mudar('vacinado', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Castrado?">
            <select value={dados.castrado ? 'sim' : 'nao'} onChange={(e) => mudar('castrado', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
          <FormInput rotulo="Vermifugado?">
            <select value={dados.vermifugado ? 'sim' : 'nao'} onChange={(e) => mudar('vermifugado', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </FormInput>
        </div>
        <div className="form-grade">
          <FormInput rotulo="URL da foto do animal" largura="1 / -1">
            <input value={dados.fotoUrl} onChange={(e) => mudar('fotoUrl', e.target.value)} placeholder="https://... (cole o link de uma foto; se vazio, usa um ícone)" />
          </FormInput>
          {dados.fotoUrl && (
            <div className="preview-foto">
              <span className="form-rotulo">Pré-visualização</span>
              <img src={dados.fotoUrl} alt="Pré-visualização" onError={(e) => { e.target.style.opacity = '0.2'; }} />
            </div>
          )}
          <FormInput rotulo="Observações" largura="1 / -1">
            <textarea rows="3" value={dados.observacoes} onChange={(e) => mudar('observacoes', e.target.value)} placeholder="Temperamento, histórico de saúde, convivência..." />
          </FormInput>
        </div>

        {erro && <p className="alerta-erro">{erro}</p>}

        <div className="modal-acoes">
          <Link to="/admin/animais" className="botao-secundario">Cancelar</Link>
          <button type="submit" className="botao-primario" disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar Animal'}
          </button>
        </div>
      </form>
    </div>
  );
}
