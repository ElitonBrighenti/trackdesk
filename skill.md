# TRACKDESK — SKILL DE DESENVOLVIMENTO

---

## IDENTIDADE DO PROJETO

**Nome:** TrackDesk  
**Subtítulo:** Motor de Helpdesk  
**Tipo:** Plataforma SaaS de gestão de tickets e atendimento inteligente  
**Contexto:** MVP acadêmico (5º semestre ADS) com visão real de produto  
**Repositório:** Monorepo com `/frontend` e `/backend`

---

## O QUE É O TRACKDESK

O TrackDesk é uma plataforma inteligente de helpdesk que transforma conversas de WhatsApp em tickets organizados automaticamente via IA. O n8n atua como orquestrador: detecta a palavra-chave `#ticket` no WhatsApp, coleta toda a conversa, envia para um agente de IA que interpreta o contexto e retorna um JSON estruturado. Esse JSON é enviado para o backend Express, que gera o `session_id`, monta o objeto completo e persiste no Supabase.

---

## STACK DEFINITIVA

| Camada       | Tecnologia                              |
|--------------|-----------------------------------------|
| Frontend     | Next.js (App Router) + Tailwind CSS + Shadcn/ui |
| Backend      | Node.js + Express                       |
| Banco        | Supabase (PostgreSQL)                   |
| Automação    | n8n                                     |
| Mensageria   | Evolution API + WhatsApp                |

---

## ESTRUTURA DO MONOREPO

```
trackdesk/
├── frontend/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx               ← redireciona para /login
│   │   ├── login/page.jsx
│   │   ├── cadastro/page.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── kanban/page.jsx
│   │   └── configuracoes/page.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── tickets/
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   └── TicketCard.jsx
│   │   └── ui/                    ← componentes shadcn
│   ├── lib/
│   │   └── api.js                 ← funções de fetch para o backend
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── ticketsController.js
│   │   │   └── colunasController.js
│   │   ├── routes/
│   │   │   ├── tickets.js
│   │   │   └── colunas.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## VARIÁVEIS DE AMBIENTE

### Backend (`/backend/.env`)
```
SUPABASE_URL=https://znqlevqtxcygmtqavmbt.supabase.co
SUPABASE_KEY=sua_service_role_key_aqui
PORT=3001
```

### Frontend (`/frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## BANCO DE DADOS — SUPABASE

### Tabela `tickets`
| Coluna       | Tipo          | Observação                        |
|--------------|---------------|-----------------------------------|
| id           | int8          | PK gerada pelo Supabase           |
| sessao       | text          | UUID gerado pelo backend (UNIQUE) |
| created_at   | timestamptz   | Gerado automaticamente            |
| titulo       | text          |                                   |
| descricao    | text          |                                   |
| categoria    | text          |                                   |
| prioridade   | text          | Baixa / Média / Alta / Urgente    |
| status       | text          | Referencia o `nome` de uma coluna da tabela `colunas` |
| responsavel  | text          | nullable                          |
| nome         | text          | nome do cliente                   |
| contato      | text          | telefone whatsapp                 |
| email        | text          | nullable                          |
| origem       | text          | default 'whatsapp'                |

### Tabela `colunas`
| Coluna     | Tipo        | Observação                              |
|------------|-------------|-----------------------------------------|
| id         | int8        | PK gerada pelo Supabase                 |
| nome       | text        | Nome da coluna exibido no Kanban        |
| ordem      | int         | Posição da coluna da esquerda p/ direita |
| cor        | text        | Hex da cor do header, default `#6B7280` |
| created_at | timestamptz | Gerado automaticamente                  |

**Dados iniciais inseridos:**
```sql
INSERT INTO public.colunas (nome, ordem) VALUES
  ('Novo', 1),
  ('Em análise', 2),
  ('Em andamento', 3),
  ('Resolvido', 4);
```

### Tabela `clientes`
| Coluna     | Tipo        | Observação   |
|------------|-------------|--------------|
| telefone   | text        | PK           |
| created_at | timestamptz |              |
| nome       | text        |              |
| email      | text        |              |
| status     | text        |              |

### Tabela `responsavel`
| Coluna        | Tipo        | Observação |
|---------------|-------------|------------|
| id            | int8        | PK         |
| created_at    | timestamptz |            |
| nome          | text        |            |
| especialidade | text        |            |

### Tabela `sessao`
| Coluna       | Tipo        | Observação |
|--------------|-------------|------------|
| id           | int8        | PK         |
| created_at   | timestamptz |            |
| whatsapp_id  | text        |            |
| status       | text        |            |

---

## JSON DE ENTRADA (n8n → Backend)

O n8n envia este payload via `POST /api/tickets`. O backend gera o `sessao` (UUID) antes de persistir — nunca vem do n8n.

```json
{
  "titulo": "Problema no envio de SMS para operadora Vivo",
  "descricao": "Cliente informou que os disparos de SMS não estão chegando para números da operadora Vivo.",
  "responsavel": null,
  "nome": "João da Silva",
  "contato": "5549999999999",
  "email": "joao@email.com",
  "data_criacao": "2026-05-14T22:40:00.000Z",
  "prioridade": "Média",
  "categoria": "SMS",
  "status": "Backlog"
}
```

---

## ENDPOINTS DO BACKEND

| Método | Rota                        | Descrição                                        |
|--------|-----------------------------|--------------------------------------------------|
| GET    | /health                     | Health check da API                              |
| POST   | /api/tickets                | Cria ticket (chamado pelo n8n)                   |
| GET    | /api/tickets                | Lista todos os tickets                           |
| PATCH  | /api/tickets/:id/status     | Atualiza status (Kanban drag)                    |
| GET    | /api/colunas                | Lista colunas ordenadas por `ordem`              |
| POST   | /api/colunas                | Cria nova coluna                                 |
| PATCH  | /api/colunas/:id            | Edita nome, cor ou ordem de uma coluna           |
| DELETE | /api/colunas/:id            | Remove coluna (bloqueia se tiver tickets ativos) |

---

## LÓGICA DO BACKEND — CRIAÇÃO DE TICKET

```js
const criarTicket = async (req, res) => {
  const payload = req.body
  const ticket = {
    sessao: randomUUID(),          // gerado aqui, nunca pelo n8n
    origem: 'whatsapp',
    titulo: payload.titulo,
    descricao: payload.descricao,
    categoria: payload.categoria,
    prioridade: payload.prioridade,
    status: payload.status ?? 'Novo', // deve referenciar o nome de uma coluna existente
    responsavel: payload.responsavel ?? null,
    nome: payload.nome,
    contato: payload.contato,
    email: payload.email,
  }
  // created_at é gerado automaticamente pelo Supabase
  // data_criacao do payload do n8n é ignorada propositalmente
}
```

## LÓGICA DO BACKEND — COLUNAS

```js
// listarColunas — ordenado por campo ordem ASC
// criarColuna — recebe nome, ordem, cor (opcional)
// atualizarColuna — aceita nome, ordem e/ou cor
// deletarColuna — verifica tickets ativos antes de deletar
//   se existir ticket com status === nome da coluna → retorna 400
//   caso contrário → deleta e retorna 200
```

---

## DESIGN SYSTEM DO FRONTEND

### Identidade Visual
- **Cor primária:** Azul `#1E4FD8`
- **Background:** Branco `#FFFFFF` / Cinza claro `#F8F9FA`
- **Sidebar:** Fundo branco, largura fixa 220px, item ativo com fundo azul claro e texto azul
- **Tipografia:** Sistema (sans-serif nativo), pesos 400 e 600
- **Border radius:** 8px nos cards, 6px nos badges
- **Sombras:** Suaves, apenas em cards

### Badges de Prioridade
| Prioridade | Cor de fundo | Cor do texto |
|------------|-------------|--------------|
| Urgente    | `#FEE2E2`   | `#DC2626`    |
| Alta       | `#FEF3C7`   | `#D97706`    |
| Média      | `#DBEAFE`   | `#2563EB`    |
| Baixa      | `#F3F4F6`   | `#6B7280`    |

### Badges de Status
| Status       | Cor de fundo | Cor do texto |
|--------------|-------------|--------------|
| Backlog      | `#F3F4F6`   | `#6B7280`    |
| Triagem      | `#EDE9FE`   | `#7C3AED`    |
| Em análise   | `#DBEAFE`   | `#1D4ED8`    |
| Em andamento | `#FEF3C7`   | `#D97706`    |
| Resolvido    | `#D1FAE5`   | `#059669`    |

---

## PÁGINAS E COMPONENTES

### Layout Base (todas as páginas internas)
- Sidebar fixa à esquerda (220px)
- TopBar fixa no topo (altura 56px) com busca, notificações e avatar
- Conteúdo principal com padding 24px
- Botão "+ Novo Chamado" fixo no rodapé da sidebar

### Sidebar — itens de navegação
```
Dashboard
Chamados
Kanban         ← item ativo destacado
Integrações
Base de Conhecimento
Configurações
```

### Dashboard (`/dashboard`)
- 3 cards de métricas: Chamados Hoje / Resolvidos por IA / Tempo Médio de Resposta
- Gráfico de barras: Tendências de Volume de Chamados (semana)
- Feed lateral: WhatsApp ao Vivo (últimos tickets recebidos)
- Barra de status no rodapé: latência da API, status dos nós

### Kanban (`/kanban`)
- **Colunas dinâmicas** — busca as colunas via `GET /api/colunas` ordenadas pelo campo `ordem`
- Cada coluna exibe os tickets cujo `status` é igual ao `nome` da coluna
- Cada card exibe: badge de prioridade, número do ticket (`#TKT-{id}`), título, box azul claro com label "RESUMO DA IA" e a descrição, avatar com iniciais do responsável/cliente, tempo relativo
- Contador de tickets por coluna no header
- Botão "+ Adicionar coluna" no final do board
- Clique no nome da coluna para editar inline
- Drag and drop entre colunas chama `PATCH /api/tickets/:id/status`
- Hover nos cards com sombra suave

### Login (`/login`)
- Layout split: lado esquerdo azul com texto da marca + métricas, lado direito com formulário
- Campos: e-mail corporativo, senha
- Link "Esqueceu a senha?" e "Criar conta"
- Botão OAuth Google

### Cadastro (`/cadastro`)
- Mesmo layout split do login
- Campos: nome completo, e-mail corporativo, senha, confirmar senha
- Checkbox de termos
- OAuth Google e GitHub

### Configurações (`/configuracoes`)
- Foto de perfil circular com botão de câmera
- Formulário: nome completo, e-mail, empresa, cargo
- Cards laterais: Segurança, Notificações
- Botões: Descartar / Salvar Alterações

---

## REGRAS DE DESENVOLVIMENTO

### Sempre
- Usar CSS variables ou classes Tailwind — nunca inline styles com hex fixo (exceto badges de cor semântica)
- Componentes funcionais com hooks
- Chamadas de API centralizadas em `/frontend/lib/api.js`
- Variáveis de ambiente via `process.env.NEXT_PUBLIC_API_URL`
- Backend retorna sempre JSON, nunca HTML
- Tratar erros em todos os endpoints (try/catch + status code correto)

### Nunca
- Colocar a `SUPABASE_KEY` (service_role) no frontend
- Criar lógica de negócio no frontend — ela fica no backend
- Hardcodar a URL do backend no componente — usar a lib/api.js
- Usar `any` type ou ignorar erros silenciosamente

### Ordem de prioridade do MVP
1. `POST /api/tickets` funcionando e salvando no Supabase
2. `GET /api/tickets` retornando lista
3. Kanban consumindo a lista e exibindo os cards
4. `PATCH /api/tickets/:id/status` para mover entre colunas
5. Dashboard com métricas reais
6. Login/Cadastro (pode ser mockado no MVP)

---

## CONTEXTO DO FLUXO COMPLETO

```
Cliente no WhatsApp
       ↓ digita #ticket
Evolution API
       ↓ webhook
n8n (gatilho)
       ↓ captura conversa completa
Agente de IA (interpreta contexto)
       ↓ retorna JSON estruturado
POST /api/tickets (backend Express)
       ↓ gera sessao UUID + monta objeto
Supabase (persiste)
       ↓
GET /api/tickets (frontend)
       ↓
Kanban exibe o ticket
       ↓ equipe atualiza status
PATCH /api/tickets/:id/status
       ↓
Cliente recebe notificação (fase futura)
```

---

## OBSERVAÇÕES PARA O VIBE CODER

- O projeto é um MVP acadêmico — priorize funcionalidade sobre perfeição
- Não implementar autenticação JWT nesta fase — pode usar contexto simples ou sem auth
- O design de referência está nas imagens do Figma — replicar a identidade visual do TrackDesk
- O nome do produto é **TrackDesk** com o subtítulo **Motor de Helpdesk**
- O logo usa a letra "A" estilizada num quadrado azul arredondado
- Sempre que gerar um ticket pelo n8n, o campo `origem` deve ser `'whatsapp'`
- O campo `data_criacao` que o n8n envia deve ser ignorado — usar o `created_at` do Supabase

---

## BANCO DE DADOS — AMBIENTES

O projeto usa **um único banco Supabase** com duas schemas separadas:

| Schema        | Ambiente     | Branch Git |
|---------------|--------------|------------|
| `public`      | Produção     | `main`     |
| `development` | Desenvolvimento | `develop` |

O cliente Supabase seleciona a schema automaticamente via `NODE_ENV`:

```js
// backend/src/config/supabase.js
const schema = process.env.NODE_ENV === 'production' ? 'public' : 'development'
const supabase = createClient(url, key, { db: { schema } })
```

As tabelas (`tickets`, `clientes`, `responsavel`, `sessao`) existem nas duas schemas com estrutura idêntica.

---

## QUALIDADE E CONTROLE DE VERSÃO

### Estratégia de Branches

```
main        ← produção (schema: public)
develop     ← desenvolvimento (schema: development)
feat/*      ← novas funcionalidades → PR para develop
fix/*       ← correções → PR para develop
test/*      ← testes → PR para develop
refactor/*  ← melhorias → PR para develop
```

**Regras:**
- Ninguém commita direto em `main`
- `develop` recebe commits diretos no dia a dia
- PR de `develop → main` apenas em entregas estáveis
- PR de `feat/*` → `develop` quando quiser demonstrar qualidade para a matéria

### Conventional Commits

Formato obrigatório em todos os commits:
```
tipo(escopo): descrição curta
```

| Tipo       | Quando usar                        |
|------------|------------------------------------|
| `feat`     | nova funcionalidade                |
| `fix`      | correção de bug                    |
| `test`     | adicionando ou corrigindo testes   |
| `refactor` | melhoria sem mudar comportamento   |
| `docs`     | README, comentários, documentação  |
| `chore`    | configuração, dependências, CI     |

**Exemplos do projeto:**
```
feat(backend): adiciona endpoint POST /api/tickets com geração de UUID
feat(kanban): renderiza cards com badge de prioridade
fix(backend): corrige status 500 quando campo email é nulo
test(backend): adiciona teste unitário para criarTicket
chore: configura Husky e Commitizen na raiz do monorepo
```

### Ferramentas de Qualidade de Commit

**Commitizen** — transforma o commit num formulário interativo:
```bash
npm run commit   ← em vez de git commit
```

**Husky + Commitlint** — bloqueia commit se a mensagem não seguir o padrão Conventional Commits.

Configuração na raiz do monorepo (`package.json`):
```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

Arquivo `commitlint.config.js` na raiz:
```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

Hook `.husky/commit-msg`:
```bash
npx --no -- commitlint --edit $1
```

**Nota:** hook `pre-commit` de testes só é ativado quando houver testes escritos.

### GitHub Actions — CI

Arquivo `.github/workflows/ci.yml`:
- Dispara em push e PR para `develop` e `main`
- Roda `npm install && npm test` no backend
- Usa environment `development` para develop e `production` para main
- Secrets: `SUPABASE_URL` e `SUPABASE_KEY` configurados por environment no GitHub

### GitHub Environments

Configurar em **Settings → Environments** do repositório:

| Environment   | Branch | Secrets                        |
|---------------|--------|--------------------------------|
| `development` | develop | SUPABASE_URL, SUPABASE_KEY    |
| `production`  | main    | SUPABASE_URL, SUPABASE_KEY    |

### Pull Request Template

Arquivo `.github/pull_request_template.md`:
```markdown
## O que foi feito
## Tipo de mudança
- [ ] feat  - [ ] fix  - [ ] test  - [ ] refactor  - [ ] docs
## Como testar
1.
2.
## Checklist
- [ ] Segue a estrutura do SKILL.md
- [ ] Testei localmente
- [ ] Não subi nenhum .env
- [ ] Commits seguem Conventional Commits
```

### Variáveis de Ambiente Atualizadas

**Backend (`/backend/.env`):**
```
SUPABASE_URL=https://znqlevqtxcygmtqavmbt.supabase.co
SUPABASE_KEY=sua_service_role_key_aqui
PORT=3001
NODE_ENV=development
```

**Produção (GitHub Secret / servidor):**
```
NODE_ENV=production
```