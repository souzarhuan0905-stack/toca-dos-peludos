# 🐾 Sistema de Cadastro Antecipado para Adoção – Toca dos Peludos

Projeto de Extensão – **Web Services** (ENIAC) · Sprint 3 (aplicação funcional)

**Integrantes do grupo**

| Nome | RA |
|---|---|
| Felipe Marques Pereira | 202682024 |
| Luiz Gustavo Batista de Sousa | 229372024 |
| Rhuan Vinicius Camilo de Souza | 241212024 |

Aplicação web responsiva para a ONG fictícia **Toca dos Peludos**: candidatos à adoção
preenchem um pré-cadastro online (dados pessoais, informações do lar e documentos
digitalizados) e a equipe da ONG gerencia tudo em um painel administrativo com
autenticação.

---

##  Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend / API REST | Java 17 · Spring Boot 3 (Web, Data JPA, Security, Validation) |
| Banco de dados | SQLite (arquivo `toca_dos_peludos.db`, criado automaticamente) |
| Autenticação | JWT (HS256) + senhas com BCrypt |
| Upload de arquivos | Multipart no servidor (pasta `uploads/`, PDF/JPG/PNG, máx. 5 MB) |
| Frontend | React 18 + Vite + React Router (HTML, CSS e JS) |

---

##  Como executar

### Pré-requisitos
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -version`)
- **Node.js 18+** (`node -v`)

### 1. Backend (porta 8080)
```bash
cd toca-backend
mvn spring-boot:run
```
Na primeira execução o banco SQLite é criado e populado com **dados fictícios de
demonstração** (funcionários, animais, candidatos e adoções).

### 2. Frontend (porta 5173)
```bash
cd toca-frontend
npm install
npm run dev
```

### 3. Acessar
| Página | URL |
|---|---|
| Formulário público "Quero Adotar" | http://localhost:5173/ |
| Login do painel administrativo | http://localhost:5173/login |

###  Credenciais de teste (senha de todos: `admin123`)
| E-mail | Perfil |
|---|---|
| admin@tocadospeludos.org | Admin |
| felipe@tocadospeludos.org | Admin |
| luiz@tocadospeludos.org | Voluntário |
| rhuan@tocadospeludos.org | Cuidador |

> Apenas perfis **Admin** podem cadastrar/editar funcionários (regra de negócio
> aplicada também na API, via Spring Security).

---

##  Funcionalidades

**Área pública**
- Formulário "Quero Adotar" em 4 etapas: Dados Pessoais → Seu Lar → Documentos → Confirmação
- Upload controlado de documentos (PDF/JPG/PNG, máx. 5 MB, validação no cliente e no servidor)

**Painel administrativo (autenticado)**
- **Dashboard**: totais de candidatos, adoções concluídas, animais disponíveis,
  pendentes de análise, últimos candidatos e feed de atividade recente
- **Candidatos**: lista com filtros (Todos/Pendentes/Aprovados/Rejeitados), busca por
  nome/CPF/e-mail, detalhes completos, download dos documentos e mudança de status
- **Animais**: cards com filtros por espécie e status, cadastro e edição
- **Adoções**: histórico, registro de nova adoção (somente candidato aprovado +
  animal disponível), conclusão e cancelamento — o status do animal muda
  automaticamente (Disponível → Em processo → Adotado)
- **Funcionários**: gestão da equipe com perfis (Admin/Voluntário/Cuidador)

**Principais regras de negócio (no backend)**
1. Candidato novo sempre inicia **PENDENTE**
2. CPF de candidato e e-mail de funcionário são **únicos**
3. Upload: somente PDF/JPG/PNG e até **5 MB**
4. Animal **ADOTADO** não pode entrar em nova adoção
5. Registrar adoção → animal **EM_PROCESSO**; concluir → **ADOTADO**; cancelar → volta a **DISPONÍVEL**
6. Endpoints protegidos por **JWT**; escrita em `/api/funcionarios` exige perfil **ADMIN**

---

## 🔌 Principais endpoints da API

| Método | Endpoint | Acesso |
|---|---|---|
| POST | `/api/auth/login` | Público |
| POST | `/api/candidatos` | Público (formulário Quero Adotar) |
| POST | `/api/candidatos/{id}/documentos` | Público (upload) |
| GET | `/api/candidatos` · `/api/animais` · `/api/adocoes` · `/api/funcionarios` | Autenticado |
| PATCH | `/api/candidatos/{id}/status` · `/api/adocoes/{id}/status` | Autenticado |
| GET | `/api/documentos/{id}/download` | Autenticado |
| POST/PUT/DELETE | `/api/funcionarios/**` | Somente ADMIN |
| GET | `/api/dashboard/resumo` | Autenticado |

---

##  Estrutura de pastas

```
toca-dos-peludos/
├── README.md
├── ROTEIRO_VIDEO.md            ← roteiro sugerido para o vídeo (3–5 min)
├── schema_toca_dos_peludos.sql ← script SQL de referência do banco
├── toca-backend/               ← API REST (Spring Boot)
│   └── src/main/java/br/com/tocadospeludos/
│       ├── controller/  ├── service/  ├── repository/
│       ├── model/       ├── dto/      ├── security/
│       ├── exception/   └── config/   (carga inicial de dados)
└── toca-frontend/              ← Aplicação React (Vite)
    └── src/
        ├── pages/  ├── components/  ├── services/
        ├── routes/ └── styles/
```

---

##  Solução de problemas

- **"mvn não é reconhecido"** → instale o Maven e adicione ao PATH (ou use o wrapper da sua IDE / IntelliJ / VS Code com extensão Java).
- **Porta 8080 ou 5173 ocupada** → encerre o processo em uso ou ajuste `server.port` (backend) / `vite.config.js` (frontend).
- **Quero recomeçar com o banco limpo** → pare o backend e apague o arquivo `toca-backend/toca_dos_peludos.db` (e a pasta `uploads/`). Na próxima execução tudo é recriado com os dados de demonstração.
- **Erro de CORS** → use o frontend via `npm run dev` em `http://localhost:5173` (origem já liberada no backend).
