import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidatoService } from '../services/candidatoService.js';
import { animalService } from '../services/animalService.js';
import FormInput from '../components/FormInput.jsx';
import FileUpload from '../components/FileUpload.jsx';

const ETAPAS = ['Escolha o Animal', 'Dados Pessoais', 'Seu Lar', 'Documentos', 'Confirmação'];

const VAZIO = {
  nome: '', cpf: '', dtNascimento: '', email: '', telefone: '', endereco: '',
  tipoMoradia: '', possuiQuintal: false, possuiEspacoExterno: false,
  temOutrosAnimais: false, criancasEmCasa: false, horasEmCasaPorDia: 'Menos de 4h',
  temCercaOuTela: false, descricaoAmbiente: '',
};

function calcularIdade(dtNascimento) {
  if (!dtNascimento) return '';
  const nascimento = new Date(dtNascimento);
  const meses = (new Date().getFullYear() - nascimento.getFullYear()) * 12
    + (new Date().getMonth() - nascimento.getMonth());
  if (meses < 12) return `${Math.max(1, meses)} ${meses === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

export default function QueroAdotar() {
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState(VAZIO);
  const [animais, setAnimais] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [docIdentidade, setDocIdentidade] = useState(null);
  const [docResidencia, setDocResidencia] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    animalService.listar()
      .then((lista) => setAnimais(lista.filter((a) => a.status === 'DISPONIVEL')))
      .catch(() => setAnimais([]));
  }, []);

  function mudar(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function validarEtapa() {
    setErro('');
    if (etapa === 0 && !animalSelecionado) {
      setErro('Selecione um animal para continuar.');
      return false;
    }
    if (etapa === 1) {
      if (!dados.nome || !dados.cpf || !dados.dtNascimento || !dados.email) {
        setErro('Preencha todos os campos obrigatórios antes de continuar.');
        return false;
      }
    }
    if (etapa === 2 && !dados.tipoMoradia) {
      setErro('Selecione o tipo de moradia.');
      return false;
    }
    if (etapa === 3 && !docIdentidade) {
      setErro('Envie pelo menos o documento de identidade.');
      return false;
    }
    return true;
  }

  function avancar() {
    if (validarEtapa()) setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1));
  }

  function voltar() {
    setErro('');
    setEtapa((e) => Math.max(e - 1, 0));
  }

  async function enviar() {
    setErro('');
    setEnviando(true);
    try {
      const candidato = await candidatoService.criar({
        ...dados,
        cpf: dados.cpf.replace(/\D/g, ''),
        idAnimalDesejado: animalSelecionado.id,
        nomeAnimalDesejado: animalSelecionado.nome,
      });
      if (docIdentidade) {
        await candidatoService.enviarDocumento(candidato.id, 'IDENTIDADE', docIdentidade);
      }
      if (docResidencia) {
        await candidatoService.enviarDocumento(candidato.id, 'COMPROVANTE_RESIDENCIA', docResidencia);
      }
      setConcluido(true);
    } catch (ex) {
      setErro(ex.message);
    } finally {
      setEnviando(false);
    }
  }

  if (concluido) {
    return (
      <div className="publico-pagina">
        <header className="publico-hero">
          <h1>Quero Adotar!</h1>
        </header>
        <div className="wizard-card sucesso-card">
          <span className="sucesso-icone">🎉</span>
          <h2>Cadastro enviado com sucesso!</h2>
          <p>
            A equipe da ONG Toca dos Peludos analisará suas informações e entrará em contato.
          </p>
          <button className="botao-primario" onClick={() => window.location.reload()}>
            Fazer novo cadastro
          </button>
        </div>
        <footer className="publico-rodape">
          <Link to="/login">Acesso administrativo</Link>
        </footer>
      </div>
    );
  }

  return (
    <div className="publico-pagina">
      <header className="publico-hero">
        <span className="publico-marca">🐾 Toca dos <em>Peludos</em></span>
        <h1>Quero Adotar!</h1>
        <p>Preencha o formulário de pré-cadastro para participar da feira de adoção da ONG Toca dos Peludos</p>
      </header>

      <div className="wizard-card">
        {/* Abas de etapas */}
        <div className="wizard-abas">
          {ETAPAS.map((nome, i) => (
            <span key={nome} className={`wizard-aba ${i === etapa ? 'ativa' : ''} ${i < etapa ? 'feita' : ''}`}>
              {i < etapa ? '✓' : i + 1} {nome}
            </span>
          ))}
        </div>

        {etapa > 0 && etapa < 4 && (
          <p className="wizard-aviso">
            ✅ {etapa === 1
              ? `Animal escolhido: ${animalSelecionado?.nome} · Agora preencha seus dados pessoais.`
              : etapa === 2
              ? 'Dados pessoais preenchidos! Agora conte sobre o ambiente onde o animal irá viver.'
              : 'Informações do lar salvas! Agora envie seus documentos digitalizados.'}
          </p>
        )}

        {/* ETAPA 0 — Escolha do animal */}
        {etapa === 0 && (
          <>
            <h2 className="form-secao">🐾 Animais disponíveis para adoção</h2>
            {animais.length === 0 && (
              <p className="texto-suave">Carregando animais disponíveis...</p>
            )}
            <div className="grade-animais-publico">
              {animais.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`card-animal-publico ${animalSelecionado?.id === a.id ? 'selecionado' : ''}`}
                  onClick={() => setAnimalSelecionado(a)}
                >
                  <div className={`card-animal-emoji-pub capa-${a.especie === 'CAO' ? 'cao' : 'gato'}`}>
                    {a.fotoUrl ? (
                      <img
                        src={a.fotoUrl}
                        alt={a.nome}
                        className="card-animal-foto-pub"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <span style={{ display: a.fotoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      {a.especie === 'CAO' ? '🐶' : '🐱'}
                    </span>
                    {animalSelecionado?.id === a.id && (
                      <span className="check-selecionado">✓</span>
                    )}
                  </div>
                  <div className="card-animal-pub-info">
                    <strong>{a.nome}</strong>
                    <span>{a.especie === 'CAO' ? 'Cão' : 'Gato'} · {a.raca || 'SRD'}</span>
                    <span>{calcularIdade(a.dtNascimento)}</span>
                    <div className="card-animal-tags">
                      {a.vacinado && <span className="tag">Vacinado</span>}
                      {a.castrado && <span className="tag">Castrado</span>}
                      {a.vermifugado && <span className="tag">Vermifugado</span>}
                    </div>
                    {a.observacoes && (
                      <p className="card-pub-obs">"{a.observacoes}"</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {animalSelecionado && (
              <p className="wizard-aviso" style={{ marginTop: '1rem' }}>
                ✅ Você escolheu: <strong>{animalSelecionado.nome}</strong>
              </p>
            )}
          </>
        )}

        {/* ETAPA 1 — Dados pessoais */}
        {etapa === 1 && (
          <div className="form-grade">
            <FormInput rotulo="Nome Completo" obrigatorio largura="1 / -1">
              <input value={dados.nome} onChange={(e) => mudar('nome', e.target.value)} placeholder="Seu nome completo" />
            </FormInput>
            <FormInput rotulo="CPF" obrigatorio>
              <input value={dados.cpf} onChange={(e) => mudar('cpf', e.target.value)} placeholder="Somente números" maxLength="14" />
            </FormInput>
            <FormInput rotulo="Data de Nascimento" obrigatorio>
              <input type="date" value={dados.dtNascimento} onChange={(e) => mudar('dtNascimento', e.target.value)} />
            </FormInput>
            <FormInput rotulo="E-mail" obrigatorio>
              <input type="email" value={dados.email} onChange={(e) => mudar('email', e.target.value)} placeholder="email@exemplo.com" />
            </FormInput>
            <FormInput rotulo="Telefone">
              <input value={dados.telefone} onChange={(e) => mudar('telefone', e.target.value)} placeholder="(00) 00000-0000" />
            </FormInput>
            <FormInput rotulo="Endereço" largura="1 / -1">
              <input value={dados.endereco} onChange={(e) => mudar('endereco', e.target.value)} placeholder="Rua, número, bairro, cidade/UF" />
            </FormInput>
          </div>
        )}

        {/* ETAPA 2 — Informações do lar */}
        {etapa === 2 && (
          <>
            <h2 className="form-secao">🏠 Informações do Lar</h2>
            <div className="form-grade">
              <FormInput rotulo="Tipo de Moradia" obrigatorio>
                <select value={dados.tipoMoradia} onChange={(e) => mudar('tipoMoradia', e.target.value)}>
                  <option value="">Selecione...</option>
                  <option value="CASA">Casa</option>
                  <option value="APARTAMENTO">Apartamento</option>
                  <option value="CHACARA">Chácara / Sítio</option>
                </select>
              </FormInput>
              <FormInput rotulo="Possui espaço externo?">
                <select value={dados.possuiEspacoExterno ? 'sim' : 'nao'} onChange={(e) => mudar('possuiEspacoExterno', e.target.value === 'sim')}>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </FormInput>
              <FormInput rotulo="Tem quintal?">
                <select value={dados.possuiQuintal ? 'sim' : 'nao'} onChange={(e) => mudar('possuiQuintal', e.target.value === 'sim')}>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </FormInput>
              <FormInput rotulo="Tem outros animais?">
                <select value={dados.temOutrosAnimais ? 'sim' : 'nao'} onChange={(e) => mudar('temOutrosAnimais', e.target.value === 'sim')}>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </FormInput>
              <FormInput rotulo="Crianças em casa?">
                <select value={dados.criancasEmCasa ? 'sim' : 'nao'} onChange={(e) => mudar('criancasEmCasa', e.target.value === 'sim')}>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
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
              <FormInput rotulo="Conte-nos mais sobre seu lar" largura="1 / -1">
                <textarea rows="3" value={dados.descricaoAmbiente} onChange={(e) => mudar('descricaoAmbiente', e.target.value)} placeholder="Descreva o ambiente, a rotina da família e por que deseja adotar..." />
              </FormInput>
            </div>
          </>
        )}

        {/* ETAPA 3 — Documentos */}
        {etapa === 3 && (
          <>
            <h2 className="form-secao">📎 Documentos Digitalizados</h2>
            <p className="texto-suave">Envie arquivos em PDF, JPG ou PNG com até 5 MB cada.</p>
            <FileUpload rotulo="Documento de identidade (RG ou CNH)" obrigatorio arquivo={docIdentidade} aoSelecionar={setDocIdentidade} />
            <FileUpload rotulo="Comprovante de residência" arquivo={docResidencia} aoSelecionar={setDocResidencia} />
          </>
        )}

        {/* ETAPA 4 — Confirmação */}
        {etapa === 4 && (
          <>
            <h2 className="form-secao">✅ Confirme seus dados</h2>
            <div className="detalhe-grade">
              <p><strong>Animal de interesse:</strong> {animalSelecionado?.nome} ({animalSelecionado?.especie === 'CAO' ? 'Cão' : 'Gato'} · {animalSelecionado?.raca || 'SRD'})</p>
              <p><strong>Nome:</strong> {dados.nome}</p>
              <p><strong>CPF:</strong> {dados.cpf}</p>
              <p><strong>E-mail:</strong> {dados.email}</p>
              <p><strong>Telefone:</strong> {dados.telefone || '—'}</p>
              <p><strong>Moradia:</strong> {dados.tipoMoradia}</p>
              <p><strong>Horas em casa/dia:</strong> {dados.horasEmCasaPorDia}</p>
              <p><strong>Identidade:</strong> {docIdentidade ? docIdentidade.name : '—'}</p>
              <p><strong>Comp. residência:</strong> {docResidencia ? docResidencia.name : '—'}</p>
            </div>
            <p className="texto-suave" style={{ marginTop: '0.8rem' }}>
              Ao enviar, você concorda que a ONG Toca dos Peludos utilize estes dados para análise do processo de adoção.
            </p>
          </>
        )}

        {erro && <p className="alerta-erro">{erro}</p>}

        <div className="wizard-acoes">
          {etapa > 0 && (
            <button className="botao-secundario" onClick={voltar}>← Voltar</button>
          )}
          {etapa < ETAPAS.length - 1 && (
            <button className="botao-primario" onClick={avancar}>Continuar →</button>
          )}
          {etapa === ETAPAS.length - 1 && (
            <button className="botao-primario" onClick={enviar} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar cadastro 🐾'}
            </button>
          )}
        </div>
      </div>

      <footer className="publico-rodape">
        <Link to="/login">Acesso administrativo</Link>
      </footer>
    </div>
  );
}
