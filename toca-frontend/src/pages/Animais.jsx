import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Modal from '../components/Modal.jsx';

const FILTROS = [
  { chave: 'TODOS', rotulo: 'Todos' },
  { chave: 'CAO', rotulo: 'Cães' },
  { chave: 'GATO', rotulo: 'Gatos' },
  { chave: 'DISPONIVEL', rotulo: 'Disponíveis' },
  { chave: 'EM_PROCESSO', rotulo: 'Em processo' },
];

function calcularIdade(dtNascimento) {
  if (!dtNascimento) return 'idade não informada';
  const nascimento = new Date(dtNascimento);
  const hoje = new Date();
  let meses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth());
  if (meses < 1) meses = 1;
  if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

export default function Animais() {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [selecionado, setSelecionado] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    animalService.listar().then(setAnimais).catch((e) => setErro(e.message));
  }, []);

  const filtrados = useMemo(() => {
    return animais.filter((a) => {
      if (filtro === 'TODOS') return true;
      if (filtro === 'CAO' || filtro === 'GATO') return a.especie === filtro;
      return a.status === filtro;
    });
  }, [animais, filtro]);

  function contar(chave) {
    if (chave === 'TODOS') return animais.length;
    if (chave === 'CAO' || chave === 'GATO') return animais.filter((a) => a.especie === chave).length;
    return animais.filter((a) => a.status === chave).length;
  }

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Animais</h1>
          <p className="pagina-descricao">Gerencie os animais disponíveis para adoção</p>
        </div>
        <Link to="/admin/animais/novo" className="botao-primario">+ Cadastrar Animal</Link>
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

      <div className="grade-animais">
        {filtrados.map((a) => (
          <article key={a.id} className="card-animal">
            <div className={`card-animal-capa capa-${a.especie === 'CAO' ? 'cao' : 'gato'}`}>
              {a.fotoUrl ? (
                <img
                  src={a.fotoUrl}
                  alt={a.nome}
                  className="card-animal-foto"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <span className="card-animal-emoji" style={{ display: a.fotoUrl ? 'none' : 'flex' }}>{a.especie === 'CAO' ? '🐶' : '🐱'}</span>
              <span className="card-animal-status"><StatusBadge status={a.status} /></span>
            </div>
            <div className="card-animal-corpo">
              <h3>{a.nome}</h3>
              <p className="texto-suave">
                {a.especie === 'CAO' ? 'Cão' : 'Gato'} · {a.raca || 'SRD'} · {calcularIdade(a.dtNascimento)}
              </p>
              <div className="card-animal-tags">
                {a.vacinado && <span className="tag">Vacinado</span>}
                {a.castrado && <span className="tag">Castrado</span>}
                {a.vermifugado && <span className="tag">Vermifugado</span>}
              </div>
              <button className="botao-secundario botao-largo" onClick={() => setSelecionado(a)}>
                Ver detalhes
              </button>
            </div>
          </article>
        ))}
        {filtrados.length === 0 && <p className="tabela-vazia">Nenhum animal encontrado.</p>}
      </div>

      <Modal titulo="Detalhes do Animal" aberto={!!selecionado} aoFechar={() => setSelecionado(null)} largura={560}>
        {selecionado && (
          <div>
            <div className="detalhe-topo">
              <h3>{selecionado.especie === 'CAO' ? '🐶' : '🐱'} {selecionado.nome}</h3>
              <StatusBadge status={selecionado.status} />
            </div>
            {selecionado.fotoUrl && (
              <img
                src={selecionado.fotoUrl}
                alt={selecionado.nome}
                className="detalhe-foto-animal"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="detalhe-grade">
              <p><strong>ID:</strong> AN{String(selecionado.id).padStart(4, '0')}</p>
              <p><strong>Espécie:</strong> {selecionado.especie === 'CAO' ? 'Cão' : 'Gato'}</p>
              <p><strong>Raça:</strong> {selecionado.raca || 'SRD'}</p>
              <p><strong>Idade:</strong> {calcularIdade(selecionado.dtNascimento)}</p>
              <p><strong>Peso:</strong> {selecionado.peso ? `${selecionado.peso} kg` : '—'}</p>
              <p><strong>Vacinado:</strong> {selecionado.vacinado ? 'Sim' : 'Não'}</p>
              <p><strong>Castrado:</strong> {selecionado.castrado ? 'Sim' : 'Não'}</p>
              <p><strong>Vermifugado:</strong> {selecionado.vermifugado ? 'Sim' : 'Não'}</p>
            </div>
            {selecionado.observacoes && <p className="detalhe-texto">“{selecionado.observacoes}”</p>}
            <div className="modal-acoes">
              <button className="botao-primario" onClick={() => navigate(`/admin/animais/${selecionado.id}/editar`)}>
                ✏️ Editar Animal
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
