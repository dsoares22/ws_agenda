# 📅 WS Agenda Online

Sistema web de agendamento de atendimentos desenvolvido para a disciplina de **Programação Web**.

---

## 🎯 Objetivo do Sistema

O **WS Agenda Online** é um sistema de gerenciamento de atendimentos para a empresa **WS Consultoria**. Ele permite que colaboradores autenticados cadastrem, visualizem, editem e excluam agendamentos de visitas a clientes, além de acompanhar indicadores gerais pelo dashboard.

---

## 🛠️ Tecnologias Utilizadas

### Front-end

| Tecnologia | Versão | Descrição                              |
| ---------- | ------ | -------------------------------------- |
| Vue.js     | 3.x    | Framework JavaScript progressivo       |
| Vue Router | 5.x    | Roteamento de páginas (SPA)            |
| Pinia      | 3.x    | Gerenciamento de estado (autenticação) |
| Axios      | 1.x    | Requisições HTTP para a API            |
| Bootstrap  | 5.x    | Estilização e componentes visuais      |
| Vite       | 8.x    | Bundler e servidor de desenvolvimento  |

### Back-end

| Tecnologia  | Versão | Descrição                                     |
| ----------- | ------ | --------------------------------------------- |
| Node.js     | 20+    | Ambiente de execução JavaScript               |
| Express     | 4.x    | Framework para criação da API REST            |
| Supabase JS | 2.x    | Cliente para banco de dados e autenticação    |
| dotenv      | 16.x   | Gerenciamento de variáveis de ambiente        |
| nodemon     | 3.x    | Reinicialização automática em desenvolvimento |

### Banco de Dados

| Tecnologia            | Descrição                                                     |
| --------------------- | ------------------------------------------------------------- |
| Supabase (PostgreSQL) | Banco de dados relacional na nuvem com autenticação integrada |

---

## ✅ Funcionalidades Implementadas

- 🔐 **Autenticação** — Login e logout com Supabase Auth; sessão gerenciada pelo Pinia
- 🛡️ **Proteção de rotas** — Redirecionamento automático para o login quando não autenticado
- 📊 **Dashboard** — Indicadores de atendimentos (hoje, semana, por responsável)
- 📋 **Listagem de atendimentos** — Tabela com status colorido e ações de editar/excluir
- ➕ **Cadastro de atendimento** — Formulário com validação de campos obrigatórios
- ✏️ **Edição de atendimento** — Mesmo formulário reutilizado para edição
- 🗑️ **Exclusão de atendimento** — Com confirmação antes de deletar
- 👤 **Responsáveis** — Seleção de responsável no formulário com dados do banco

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `responsaveis`

| Campo | Tipo | Descrição                          |
| ----- | ---- | ---------------------------------- |
| id    | uuid | Chave primária                     |
| nome  | text | Nome do responsável                |
| tipo  | text | Tipo (ex: Corretora, Colaboradora) |

### Tabela `atendimentos`

| Campo           | Tipo | Descrição                        |
| --------------- | ---- | -------------------------------- |
| id              | uuid | Chave primária                   |
| nome_cliente    | text | Nome do cliente                  |
| telefone        | text | Telefone de contato              |
| endereco_visita | text | Endereço da visita               |
| data            | date | Data do atendimento              |
| horario         | time | Horário do atendimento           |
| responsavel_id  | uuid | FK para responsaveis             |
| status          | text | Agendado / Concluído / Cancelado |
| observacoes     | text | Observações opcionais            |

### Tabela `clientes`

| Campo      | Tipo      | Descrição           |
| ---------- | --------- | ------------------- |
| id         | uuid      | Chave primária      |
| nome       | text      | Nome do cliente     |
| telefone   | text      | Telefone de contato |
| endereco   | text      | Endereço do cliente |
| created_at | timestamp | Data de criação     |

### View `dashboard_indicadores`

View SQL no Supabase que calcula os totais exibidos no dashboard.

---

## 🗂️ Estrutura do Projeto

```
agendaOnline/
├── backend/
│   ├── server.js               # Ponto de entrada do servidor
│   ├── package.json
│   ├── .env                    # Variáveis de ambiente (não versionar)
│   └── src/
│       ├── app.js              # Configuração do Express e rotas
│       ├── config/
│       │   └── supabase.js     # Conexão com o Supabase
│       ├── controllers/
│       │   ├── atendimentoController.js
│       │   └── responsavelController.js
│       └── routes/
│           ├── atendimentoRoutes.js
│           └── responsavelRoutes.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env                    # Variáveis de ambiente (não versionar)
    └── src/
        ├── main.js             # Inicialização do Vue + Pinia + Router
        ├── App.vue             # Componente raiz
        ├── components/
        │   ├── AppHeader.vue   # Navbar com navegação e logout
        │   └── StatusBadge.vue # Badge colorido de status
        ├── pages/
        │   ├── LoginPage.vue
        │   ├── DashboardPage.vue
        │   ├── AtendimentosPage.vue
        │   └── FormPage.vue    # Cadastro e edição
        ├── router/
        │   └── index.js        # Rotas e guard de autenticação
        ├── services/
        │   └── api.js          # Chamadas HTTP com Axios
        └── stores/
            └── authStore.js    # Estado de autenticação com Pinia
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 20 ou superior
- Conta no [Supabase](https://supabase.com) com as tabelas criadas

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/agendaOnline.git
cd agendaOnline
```

### 2. Configure o Back-end

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-service-role-key
PORT=3000
```

Inicie o servidor:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### 3. Configure o Front-end

```bash
cd ../frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:3000
```

Inicie o front-end:

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

---

## 🖥️ Telas do Sistema

### 🔐LOGIN

<img width="2142" height="1845" alt="Captura de Tela 2026-06-08 às 02 17 18" src="https://github.com/user-attachments/assets/8c6eb732-adfd-4825-9057-00c4e9eedb59" />

### 📊DASHBOARD

<img width="2136" height="1983" alt="Captura de Tela 2026-06-08 às 02 16 47" src="https://github.com/user-attachments/assets/e7b59853-1719-48de-a799-ea8e28780c02" />

### 📋ATENDIMENTOS

<img width="2148" height="1920" alt="Captura de Tela 2026-06-08 às 02 16 54" src="https://github.com/user-attachments/assets/d4ed22a0-df80-431f-9fc1-8d1404e3113a" />

### ➕NOVO ATENDIMENTO

<img width="2102" height="1823" alt="Captura de Tela 2026-06-08 às 02 16 57" src="https://github.com/user-attachments/assets/631b7aba-a1c4-48b4-aa21-250c838955df" />

### ✏️EDITAR ATENDIMENTO

<img width="2106" height="1815" alt="Imagem 08-06-2026 às 02 23" src="https://github.com/user-attachments/assets/58102dd7-cdec-48c1-b693-2589a06675bf" />

### 🗑️EXCLUIR ATENDIMENTO

<img width="2101" height="1797" alt="Imagem 08-06-2026 às 02 23 (1)" src="https://github.com/user-attachments/assets/4d76a816-87f0-4f5b-9622-ecb520e8ec8e" />

### 🗄️TABELAS USADAS

<img width="1280" height="920" alt="image" src="https://github.com/user-attachments/assets/f5cc0849-f6e0-429d-babb-f199da70d469" />

---

## 👨‍💻 Integrantes da Equipe

| Nome                    | GitHub                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| Davi Silva Soares       | [@dsoares22](https://github.com/dsoares22)                       |
| João Pedro Lima Barbosa | [@JoaoPedroLimaBarbosa](https://github.com/JoaoPedroLimaBarbosa) |

---

## 📌 Endpoints da API

| Método | Rota                      | Descrição                   |
| ------ | ------------------------- | --------------------------- |
| GET    | `/`                       | Status da API               |
| GET    | `/atendimentos`           | Lista todos os atendimentos |
| GET    | `/atendimentos/dashboard` | Indicadores do dashboard    |
| GET    | `/atendimentos/:id`       | Busca atendimento por ID    |
| POST   | `/atendimentos`           | Cria novo atendimento       |
| PUT    | `/atendimentos/:id`       | Atualiza atendimento        |
| DELETE | `/atendimentos/:id`       | Remove atendimento          |
| GET    | `/responsaveis`           | Lista todos os responsáveis |
