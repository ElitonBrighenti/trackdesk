# TrackDesk — Motor de Helpdesk

Plataforma SaaS inteligente de helpdesk que transforma conversas de WhatsApp em tickets organizados automaticamente via IA.

## Stack

| Camada   | Tecnologia                                    |
| -------- | --------------------------------------------- |
| Frontend | Next.js (App Router) + Tailwind CSS + Shadcn/ui |
| Backend  | Node.js + Express                             |
| Banco    | Supabase (PostgreSQL)                         |
| Automação| n8n                                           |
| Mensageria | Evolution API + WhatsApp                    |

## Estrutura

```
trackdesk/
├── frontend/   ← Next.js App Router
├── backend/    ← Express API
├── .env.example
├── .gitignore
└── README.md
```

## Como rodar

### 1. Backend

```bash
cd backend
cp .env.example .env       # preencha SUPABASE_URL e SUPABASE_KEY
npm install
npm run dev                 # roda na porta 3001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local  # confirme NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev                 # roda na porta 3000
```

### 3. Variáveis de ambiente

Consulte o arquivo `.env.example` na raiz para ver todas as variáveis necessárias.

| Variável            | Onde usar  | Descrição                          |
| ------------------- | ---------- | ---------------------------------- |
| `SUPABASE_URL`      | Backend    | URL do projeto Supabase            |
| `SUPABASE_KEY`      | Backend    | Service Role Key do Supabase       |
| `PORT`              | Backend    | Porta da API (padrão: 3001)        |
| `NEXT_PUBLIC_API_URL` | Frontend | URL da API backend                 |

## Endpoints da API

| Método | Rota                      | Descrição                       |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/health`                 | Health check                    |
| POST   | `/api/tickets`            | Cria ticket (chamado pelo n8n)  |
| GET    | `/api/tickets`            | Lista todos os tickets          |
| PATCH  | `/api/tickets/:id/status` | Atualiza status (Kanban drag)   |

## Licença

Projeto acadêmico — 5º semestre ADS.
