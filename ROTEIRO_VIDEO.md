# 🎬 Roteiro do Vídeo – Sprint 3 (3 a 5 minutos)

> Dica geral: deixe o backend (`mvn spring-boot:run`) e o frontend (`npm run dev`)
> rodando ANTES de gravar. Abra duas abas: `http://localhost:5173/` (público) e
> `http://localhost:5173/login` (admin). Grave a tela + webcam (ex.: OBS Studio,
> que é gratuito) para mostrar o rosto dos integrantes.

---

## 1️⃣ Apresentação dos integrantes (≈ 0:00 – 0:30)
**[Webcam ligada, rostos visíveis]**

> "Olá! Somos os alunos do projeto de extensão de Web Services do ENIAC:
> Felipe Marques Pereira, Luiz Gustavo Batista de Sousa e Rhuan Vinicius Camilo
> de Souza. Vamos apresentar o **Sistema de Cadastro Antecipado para Adoção –
> Toca dos Peludos**."

## 2️⃣ Cliente / Problema (≈ 0:30 – 1:00)
> "Nosso cliente é a **ONG Toca dos Peludos**, que realiza feiras de adoção de
> cães e gatos. Hoje o cadastro dos adotantes é manual e presencial: o candidato
> preenche fichas de papel e entrega documentos na hora da feira. Isso gera
> filas, perda de informações e sobrecarga dos voluntários — e a ONG só conhece
> o perfil do adotante no dia do evento, o que dificulta a triagem."

## 3️⃣ Impacto Social – quantidade de pessoas (≈ 1:00 – 1:30)
> "Uma feira de adoção de porte médio recebe entre **50 e 100 visitantes**, e a
> ONG realiza várias edições por ano — estimamos cerca de **300 cadastros
> anuais**. Com o sistema, beneficiamos diretamente esses candidatos, que fazem
> o pré-cadastro de casa, os **voluntários da equipe**, que ganham organização e
> agilidade na triagem, e indiretamente os **animais**, que encontram lares
> compatíveis com mais segurança. É uma solução de baixo custo e open source,
> que pode ser replicada por outras ONGs de proteção animal."

## 4️⃣ Demonstração do sistema – TODAS as funcionalidades (≈ 1:30 – 4:00)

**a) Formulário público "Quero Adotar" (≈ 40s)** — em `http://localhost:5173/`
- Mostre o assistente em 4 etapas: preencha os **Dados Pessoais**, depois **Seu Lar**
  (tipo de moradia, quintal, outros animais...), envie um **documento** (cite: "o
  sistema só aceita PDF, JPG ou PNG de até 5 MB — validação no navegador e no
  servidor") e conclua na **Confirmação**. Mostre a mensagem de sucesso.

**b) Login e Dashboard (≈ 30s)** — em `/login`
- Entre com `admin@tocadospeludos.org` / `admin123`. Cite a autenticação com
  **JWT** e senhas criptografadas. No Dashboard, mostre os **cards de totais**,
  os **últimos candidatos** e o **feed de atividade recente**.

**c) Candidatos (≈ 40s)**
- Mostre os **filtros** (Pendentes/Aprovados/Rejeitados) e a **busca**. Abra o
  candidato recém-criado no formulário público: detalhe os dados do lar, **baixe o
  documento enviado** e clique em **Aprovar**. Mostre o status mudando na lista.

**d) Animais (≈ 20s)**
- Mostre os cards com filtros por espécie/status e cadastre (ou edite) um animal.

**e) Adoções (≈ 40s)** — o ponto alto da regra de negócio!
- Clique em **Registrar Adoção**: só aparecem **candidatos aprovados** e **animais
  disponíveis**. Registre e mostre que o animal mudou para **"Em processo"**.
  Depois abra os detalhes e **conclua** a adoção: o animal vira **"Adotado"** —
  tudo automático no backend.

**f) Funcionários + responsividade (≈ 20s)**
- Mostre a equipe com perfis (Admin/Voluntário/Cuidador) e cite que **somente
  Admin** pode cadastrar funcionários. Por fim, reduza a janela do navegador (ou
  use o modo dispositivo do F12) para mostrar que o layout é **responsivo**.

## 5️⃣ Conclusão – Resultado esperado (≈ 4:00 – 4:40)
> "Com o sistema, a Toca dos Peludos passa a receber os cadastros **antes da
> feira**, com documentos digitalizados e informações do lar organizadas em um
> banco de dados, fazendo a triagem com mais agilidade e segurança. O resultado
> esperado é a **redução das filas e do retrabalho**, mais **adoções responsáveis**
> e um processo transparente do início ao fim. A solução foi construída como MVP
> com tecnologias gratuitas — Java com Spring Boot, API REST, SQLite e React — e
> está pronta para evoluir conforme as necessidades da ONG. Obrigado!"

---

### ✅ Checklist antes de postar
- [ ] Vídeo entre **3 e 5 minutos**
- [ ] Rosto dos integrantes aparece em algum momento
- [ ] Os 5 itens do roteiro foram cobertos
- [ ] Código compactado (`toca-dos-peludos.zip`) postado junto
