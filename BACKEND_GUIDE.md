# 🎮 Checkpoint Quiz — Guia de Integração Backend

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  src/services/api.ts  ←  ÚNICO arquivo a mexer          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP REST
┌────────────────────▼────────────────────────────────────┐
│                 BACKEND (sua escolha)                    │
│  Node/Express · FastAPI · Django · NestJS · etc         │
│                                                          │
│  POST  /auth/register                                    │
│  POST  /auth/login       → JWT token                    │
│  POST  /auth/logout                                      │
│                                                          │
│  POST  /quiz/generate    → chama IA internamente        │
│  GET   /quiz/history                                     │
│  POST  /quiz/history                                     │
│  DELETE /quiz/history/:id                               │
└────────────────────┬────────────────────────────────────┘
          ┌──────────┴───────────┐
          ▼                      ▼
┌─────────────────┐   ┌──────────────────────┐
│   BANCO DE      │   │   IA (Anthropic)      │
│   DADOS         │   │   API Key segura      │
│   PostgreSQL    │   │   no servidor         │
│   MySQL         │   └──────────────────────┘
│   MongoDB       │
└─────────────────┘
```

---

## PASSO 1 — Variável de ambiente do Frontend

Crie um arquivo `.env` na raiz do projeto frontend:

```env
# .env (raiz do checkpoint-quiz/)
VITE_API_URL=http://localhost:8000
```

> ⚠️ Enquanto `VITE_API_URL` estiver vazio ou ausente, o app usa
> **localStorage como mock** — perfeito para desenvolver o front
> sem backend ainda.
>
> Quando você definir a variável, **todo o tráfego vai para o backend**.
> É uma chave única para ligar/desligar o backend.

---

## PASSO 2 — Endpoints que o Backend deve implementar

### Autenticação

#### `POST /auth/register`
```json
// Request body
{ "username": "player1", "password": "minhasenha" }

// Response 201
{ "token": "eyJhbGc...", "user": { "id": 1, "username": "player1" } }

// Response 409 (usuário já existe)
{ "message": "Usuário já existe." }
```

#### `POST /auth/login`
```json
// Request body
{ "username": "player1", "password": "minhasenha" }

// Response 200
{ "token": "eyJhbGc...", "user": { "id": 1, "username": "player1" } }

// Response 401
{ "message": "Usuário ou senha incorretos." }
```

#### `POST /auth/logout`
```json
// Header: Authorization: Bearer <token>
// Response 200
{ "ok": true }
```

---

### Quiz — Geração por IA

#### `POST /quiz/generate`
```json
// Header: Authorization: Bearer <token>
// Request body
{ "topic": "Segunda Guerra Mundial", "difficulty": "medium" }

// Response 200
{
  "questions": [
    {
      "text": "Em que ano começou a Segunda Guerra Mundial?",
      "options": ["1935", "1939", "1941", "1945"],
      "correctIndex": 1,
      "explanation": "A Segunda Guerra Mundial começou em 1939 com a invasão da Polônia."
    }
    // ... 4 perguntas a mais (total 5)
  ]
}
```

**Lógica interna do backend para chamar a IA:**
```javascript
// Node.js / Express — exemplo
const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/quiz/generate", authMiddleware, async (req, res) => {
  const { topic, difficulty } = req.body;
  const diffMap = { easy: "fácil", medium: "médio", hard: "difícil" };

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Gere EXATAMENTE 5 perguntas de múltipla escolha sobre "${topic}"
com dificuldade ${diffMap[difficulty]}. Responda APENAS com JSON:
[{"text":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]`
    }]
  });

  const text = message.content[0].text;
  const questions = JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, "").trim());
  res.json({ questions });
});
```

---

### Histórico de Quizzes

#### `GET /quiz/history`
```json
// Header: Authorization: Bearer <token>
// Response 200
[
  {
    "id": "uuid-aqui",
    "topic": "JavaScript",
    "difficulty": "easy",
    "score": 4,
    "total": 5,
    "createdAt": 1748000000000
  }
]
```

#### `POST /quiz/history`
```json
// Header: Authorization: Bearer <token>
// Request body
{
  "id": "uuid-aqui",
  "topic": "JavaScript",
  "difficulty": "easy",
  "score": 4,
  "total": 5,
  "createdAt": 1748000000000
}
// Response 201
{ "ok": true }
```

#### `DELETE /quiz/history/:id`
```json
// Header: Authorization: Bearer <token>
// Response 200
{ "ok": true }
```

---

## PASSO 3 — Banco de Dados

### Tabelas necessárias (SQL)

```sql
-- Usuários
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de quizzes
CREATE TABLE quiz_history (
  id         VARCHAR(36) PRIMARY KEY,  -- UUID
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  topic      VARCHAR(100) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,     -- easy | medium | hard
  score      INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  created_at BIGINT NOT NULL           -- timestamp ms
);
```

### Exemplo com MongoDB (NoSQL)

```javascript
// users collection
{
  _id: ObjectId,
  username: String,  // unique index
  password: String,  // bcrypt hash
  createdAt: Date
}

// quiz_history collection
{
  _id: String,       // UUID vindo do front
  userId: ObjectId,  // ref users
  topic: String,
  difficulty: String,
  score: Number,
  total: Number,
  createdAt: Number  // timestamp ms
}
```

---

## PASSO 4 — Segurança (checklist obrigatório)

```
✅ Nunca salvar senha em texto puro → usar bcrypt (hash + salt)
✅ JWT com expiração (ex: 7 dias)
✅ ANTHROPIC_API_KEY somente no servidor (.env do backend)
✅ Validar e sanitizar todos os inputs no backend
✅ CORS configurado para aceitar apenas o domínio do frontend
✅ Rate limiting no endpoint /quiz/generate (evitar abuso da IA)
✅ Middleware de autenticação em todas as rotas protegidas
```

---

## PASSO 5 — Resumo dos arquivos a criar/modificar

```
FRONTEND — só mexer em:
  ✏️  .env                    → adicionar VITE_API_URL

BACKEND — criar do zero:
  📁 server/
  ├── index.js / main.py      → entry point
  ├── routes/
  │   ├── auth.js             → /auth/*
  │   └── quiz.js             → /quiz/*
  ├── middleware/
  │   └── auth.js             → verifica JWT
  ├── models/
  │   ├── User.js             → modelo usuário
  │   └── QuizHistory.js      → modelo histórico
  ├── services/
  │   └── aiService.js        → chama Anthropic SDK
  └── .env                    → ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET
```

---

## Stack de Backend recomendada (Node.js)

```bash
npm install express bcryptjs jsonwebtoken cors dotenv @anthropic-ai/sdk
# + ORM de sua preferência:
npm install prisma          # PostgreSQL / MySQL / SQLite
# ou
npm install mongoose        # MongoDB
```

---

## Testando a integração

1. Backend rodando em `http://localhost:8000`
2. Adicione `VITE_API_URL=http://localhost:8000` no `.env` do front
3. Rode o front: `npm run dev`
4. Cadastre um jogador → deve criar no banco
5. Gere um quiz → deve chamar a IA pelo backend
6. Verifique o histórico → deve persistir no banco

---

## Fluxo completo de dados

```
Usuário digita tema → Home.tsx
  → apiGenerateQuiz() em api.ts
    → POST /quiz/generate no backend
      → backend chama Anthropic SDK (API key segura)
        → IA retorna 5 perguntas JSON
      → backend retorna para o front
    → front renderiza o quiz
  → usuário responde
→ apiSaveHistory() em api.ts
  → POST /quiz/history no backend
    → backend salva no banco com user_id do JWT
→ Próxima vez que abrir, GET /quiz/history carrega do banco
```
