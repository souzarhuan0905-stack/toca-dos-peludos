import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animalService } from '../services/animalService.js';

function calcularIdade(dtNascimento) {
  if (!dtNascimento) return '';
  const meses = (new Date().getFullYear() - new Date(dtNascimento).getFullYear()) * 12
    + (new Date().getMonth() - new Date(dtNascimento).getMonth());
  if (meses < 12) return `${Math.max(1, meses)} ${meses === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(meses / 12);
  return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

export default function LandingPage() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    animalService.listar()
      .then((lista) => setAnimais(lista.filter((a) => a.status === 'DISPONIVEL')))
      .catch(() => setAnimais([]));
  }, []);

  return (
    <div className="landing">

      {/* ===== NAVBAR ===== */}
      <header className="landing-nav">
        <span className="landing-nav-marca">🐾 Toca dos <em>Peludos</em></span>
        <div className="landing-nav-links">
          <a href="#animais">Animais</a>
          <a href="#como-funciona">Como funciona</a>
          <Link to="/adotar" className="botao-primario">Quero adotar</Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="landing-hero">
        <div className="landing-hero-conteudo">
          <span className="landing-hero-tag">🐾 ONG Toca dos Peludos</span>
          <h1>Encontre seu novo<br />melhor amigo</h1>
          <p>
            Conectamos cães e gatos resgatados com famílias amorosas.
            Faça o pré-cadastro online, envie seus documentos e aguarde
            nosso contato — simples, rápido e sem fila na feira.
          </p>
          <div className="landing-hero-acoes">
            <Link to="/adotar" className="botao-hero-primario">
              🐶 Quero adotar agora
            </Link>
            <a href="#como-funciona" className="botao-hero-secundario">
              Saiba como funciona
            </a>
          </div>
        </div>
        <div className="landing-hero-emojis" aria-hidden="true">
          <span>🐶</span>
          <span>🐱</span>
          <span>🐾</span>
        </div>
      </section>

      {/* ===== NÚMEROS ===== */}
      <section className="landing-numeros">
        <div className="landing-numero">
          <strong>300+</strong>
          <span>Adoções por ano</span>
        </div>
        <div className="landing-numero">
          <strong>100%</strong>
          <span>Online e gratuito</span>
        </div>
        <div className="landing-numero">
          <strong>{animais.length || '...'}</strong>
          <span>Animais disponíveis</span>
        </div>
        <div className="landing-numero">
          <strong>0</strong>
          <span>Fila na feira</span>
        </div>
      </section>

      {/* ===== ANIMAIS ===== */}
      <section className="landing-secao" id="animais">
        <div className="landing-secao-titulo">
          <h2>Animais esperando um lar</h2>
          <p>Todos vacinados, castrados e prontos para te amar</p>
        </div>

        {animais.length === 0 && (
          <p className="landing-vazio">Carregando animais disponíveis...</p>
        )}

        <div className="landing-grade-animais">
          {animais.map((a) => (
            <div key={a.id} className="landing-card-animal">
              <div className={`landing-card-capa capa-${a.especie === 'CAO' ? 'cao' : 'gato'}`}>
                {a.fotoUrl ? (
                  <img
                    src={a.fotoUrl}
                    alt={a.nome}
                    className="landing-card-foto"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <span className="landing-card-emoji" style={{ display: a.fotoUrl ? 'none' : 'flex' }}>
                  {a.especie === 'CAO' ? '🐶' : '🐱'}
                </span>
              </div>
              <div className="landing-card-corpo">
                <h3>{a.nome}</h3>
                <p className="texto-suave">
                  {a.especie === 'CAO' ? 'Cão' : 'Gato'} · {a.raca || 'SRD'} · {calcularIdade(a.dtNascimento)}
                </p>
                <div className="card-animal-tags" style={{ margin: '0.4rem 0' }}>
                  {a.vacinado && <span className="tag">Vacinado</span>}
                  {a.castrado && <span className="tag">Castrado</span>}
                  {a.vermifugado && <span className="tag">Vermifugado</span>}
                </div>
                {a.observacoes && <p className="landing-card-obs">"{a.observacoes}"</p>}
                <Link to="/adotar" className="botao-primario botao-largo" style={{ marginTop: '0.8rem', textAlign: 'center' }}>
                  Quero adotar {a.nome}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {animais.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/adotar" className="botao-hero-primario">
              Ver todos e iniciar cadastro →
            </Link>
          </div>
        )}
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="landing-secao landing-como" id="como-funciona">
        <div className="landing-secao-titulo">
          <h2>Como funciona a adoção</h2>
          <p>Processo 100% online — sem precisar ir à feira para se cadastrar</p>
        </div>
        <div className="landing-passos">
          <div className="landing-passo">
            <span className="passo-numero">1</span>
            <div>
              <h3>Escolha um animal</h3>
              <p>Veja os animais disponíveis e escolha aquele que combina com seu estilo de vida.</p>
            </div>
          </div>
          <div className="landing-passo-seta">→</div>
          <div className="landing-passo">
            <span className="passo-numero">2</span>
            <div>
              <h3>Preencha o formulário</h3>
              <p>Informe seus dados pessoais, as condições do seu lar e envie seus documentos digitalizados.</p>
            </div>
          </div>
          <div className="landing-passo-seta">→</div>
          <div className="landing-passo">
            <span className="passo-numero">3</span>
            <div>
              <h3>Aguarde a análise</h3>
              <p>Nossa equipe analisa seu perfil com cuidado e entra em contato para confirmar a adoção.</p>
            </div>
          </div>
          <div className="landing-passo-seta">→</div>
          <div className="landing-passo">
            <span className="passo-numero">4</span>
            <div>
              <h3>Bem-vindo ao lar! 🐾</h3>
              <p>Na feira, seu novo amigo já estará esperando por você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="landing-cta">
        <h2>Pronto para transformar a vida de um animal?</h2>
        <p>O processo é gratuito, online e leva menos de 5 minutos.</p>
        <Link to="/adotar" className="botao-hero-primario">
          🐾 Iniciar meu pré-cadastro
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <span>🐾 ONG Toca dos Peludos · Adoção responsável</span>
        <Link to="/login">Acesso administrativo</Link>
      </footer>

    </div>
  );
}
