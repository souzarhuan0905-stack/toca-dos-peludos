-- ============================================================
-- Sistema de Cadastro Antecipado para Adoção – Toca dos Peludos
-- Script de criação do banco de dados (SQLite)
-- Arquivo: schema_toca_dos_peludos.sql
-- Uso: sqlite3 toca_dos_peludos.db < schema_toca_dos_peludos.sql
--      (ou colocar em src/main/resources/schema.sql no Spring Boot)
-- ============================================================

-- SQLite não ativa chaves estrangeiras por padrão
PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- Tabela: candidatos
-- Armazena dados pessoais + informações do lar (etapas 1 e 2
-- do formulário público "Quero Adotar")
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidatos (
    id_candidato            INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_candidato          VARCHAR(120) NOT NULL,
    cpf_candidato           CHAR(11)     NOT NULL UNIQUE,
    dt_nascimento_candidato DATE         NOT NULL,
    email_candidato         VARCHAR(120) NOT NULL,
    telefone_candidato      CHAR(13),
    endereco_candidato      VARCHAR(255),

    -- Informações do lar (etapa 2)
    tipo_moradia            VARCHAR(30),          -- CASA, APARTAMENTO, CHACARA, OUTRO
    possui_quintal          BOOLEAN DEFAULT 0,
    possui_espaco_externo   BOOLEAN DEFAULT 0,
    tem_outros_animais      BOOLEAN DEFAULT 0,
    criancas_em_casa        BOOLEAN DEFAULT 0,
    horas_em_casa_por_dia   VARCHAR(20),
    tem_cerca_ou_tela       BOOLEAN DEFAULT 0,
    descricao_ambiente      TEXT,
    id_animal_desejado      INTEGER,
    nome_animal_desejado    VARCHAR(80),

    -- Regra de negócio 1: todo candidato novo inicia PENDENTE
    status_candidato        VARCHAR(10) NOT NULL DEFAULT 'PENDENTE'
                            CHECK (status_candidato IN ('PENDENTE','APROVADO','REJEITADO')),
    data_cadastro           DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para busca por nome, CPF, e-mail e filtro por status (tela 6.3)
CREATE INDEX IF NOT EXISTS idx_candidatos_nome   ON candidatos (nome_candidato);
CREATE INDEX IF NOT EXISTS idx_candidatos_email  ON candidatos (email_candidato);
CREATE INDEX IF NOT EXISTS idx_candidatos_status ON candidatos (status_candidato);

-- ------------------------------------------------------------
-- Tabela: documentos
-- Metadados dos arquivos enviados (o arquivo físico fica na
-- pasta uploads/ do servidor, nunca dentro do banco)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documentos (
    id_documento       INTEGER PRIMARY KEY AUTOINCREMENT,
    id_candidato       INTEGER      NOT NULL,
    tipo_documento     VARCHAR(40)  NOT NULL,   -- IDENTIDADE, COMPROVANTE_RESIDENCIA, OUTRO
    nome_original      VARCHAR(255) NOT NULL,
    nome_arquivo_salvo VARCHAR(255) NOT NULL,   -- nome único gerado pelo servidor (UUID + extensão)
    caminho_arquivo    VARCHAR(500) NOT NULL,
    mime_type          VARCHAR(100),            -- application/pdf, image/jpeg, image/png
    tamanho_bytes      INTEGER,
    data_upload        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_candidato) REFERENCES candidatos (id_candidato) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documentos_candidato ON documentos (id_candidato);

-- ------------------------------------------------------------
-- Tabela: animais
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS animais (
    id_animal           INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_animal         VARCHAR(80) NOT NULL,
    especie             VARCHAR(10) NOT NULL
                        CHECK (especie IN ('CAO','GATO')),
    raca                VARCHAR(60),
    dt_nascimento_animal DATE,                  -- ou idade aproximada calculada no frontend
    peso                DECIMAL(5,2),
    status_animal       VARCHAR(12) NOT NULL DEFAULT 'DISPONIVEL'
                        CHECK (status_animal IN ('DISPONIVEL','EM_PROCESSO','ADOTADO')),
    vacinado            BOOLEAN DEFAULT 0,
    castrado            BOOLEAN DEFAULT 0,
    vermifugado         BOOLEAN DEFAULT 0,
    foto_url            VARCHAR(500),
    observacoes         TEXT
);

CREATE INDEX IF NOT EXISTS idx_animais_especie ON animais (especie);
CREATE INDEX IF NOT EXISTS idx_animais_status  ON animais (status_animal);

-- ------------------------------------------------------------
-- Tabela: funcionarios
-- Também é a tabela de login do painel administrativo
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS funcionarios (
    id_funcionario           INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_funcionario         VARCHAR(120) NOT NULL,
    cpf_funcionario          CHAR(11)     NOT NULL UNIQUE,
    dt_nascimento_funcionario DATE,
    -- Regra de negócio 3: e-mail de funcionário deve ser único
    email_funcionario        VARCHAR(120) NOT NULL UNIQUE,
    senha_hash               VARCHAR(100) NOT NULL,   -- hash BCrypt, nunca senha em texto puro
    perfil_funcionario       VARCHAR(12)  NOT NULL DEFAULT 'VOLUNTARIO'
                             CHECK (perfil_funcionario IN ('ADMIN','VOLUNTARIO','CUIDADOR'))
);

-- ------------------------------------------------------------
-- Tabela: adocoes
-- Relaciona candidato + animal + funcionário responsável
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS adocoes (
    id_adocao      INTEGER PRIMARY KEY AUTOINCREMENT,
    id_candidato   INTEGER NOT NULL,
    id_animal      INTEGER NOT NULL,
    id_funcionario INTEGER,
    data_adocao    DATE DEFAULT CURRENT_DATE,
    status_adocao  VARCHAR(12) NOT NULL DEFAULT 'EM_ANDAMENTO'
                   CHECK (status_adocao IN ('EM_ANDAMENTO','CONCLUIDA','CANCELADA')),
    FOREIGN KEY (id_candidato)   REFERENCES candidatos   (id_candidato),
    FOREIGN KEY (id_animal)      REFERENCES animais      (id_animal),
    FOREIGN KEY (id_funcionario) REFERENCES funcionarios (id_funcionario)
);

CREATE INDEX IF NOT EXISTS idx_adocoes_candidato ON adocoes (id_candidato);
CREATE INDEX IF NOT EXISTS idx_adocoes_animal    ON adocoes (id_animal);
CREATE INDEX IF NOT EXISTS idx_adocoes_status    ON adocoes (status_adocao);

-- ------------------------------------------------------------
-- Tabela: atividades (suporte ao dashboard e ao histórico)
-- Registra eventos: CANDIDATO_CADASTRADO, CANDIDATO_APROVADO,
-- CANDIDATO_REJEITADO, ANIMAL_CADASTRADO, ADOCAO_REGISTRADA,
-- ADOCAO_CONCLUIDA, ADOCAO_CANCELADA
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS atividades (
    id_atividade   INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_atividade VARCHAR(30)  NOT NULL,
    descricao      VARCHAR(255) NOT NULL,       -- ex.: "Candidato Maria Silva cadastrado"
    id_candidato   INTEGER,                     -- referências opcionais para rastreio
    id_animal      INTEGER,
    id_adocao      INTEGER,
    data_atividade DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_candidato) REFERENCES candidatos (id_candidato) ON DELETE SET NULL,
    FOREIGN KEY (id_animal)    REFERENCES animais    (id_animal)    ON DELETE SET NULL,
    FOREIGN KEY (id_adocao)    REFERENCES adocoes    (id_adocao)    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_atividades_data ON atividades (data_atividade);

-- ------------------------------------------------------------
-- Observação sobre o usuário administrador inicial:
-- NÃO insira a senha por SQL, pois o hash BCrypt deve ser gerado
-- pelo backend. O Spring Boot criará automaticamente o admin
-- padrão na primeira execução (classe config/SeedAdmin.java):
--   e-mail: admin@tocadospeludos.org
--   senha:  admin123  (trocar após a apresentação)
-- ------------------------------------------------------------
