# 🎮 Checkpoint Quiz

Quiz gamificado com geração de perguntas por IA.

## Rodar localmente

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Conectar ao Backend

1. Copie `.env.example` para `.env`
2. Defina `VITE_API_URL=http://localhost:8000`
3. Leia **BACKEND_GUIDE.md** para criar o servidor

## Modo sem backend (mock)
Deixe `VITE_API_URL` vazio — o app usa localStorage automaticamente.

## Stack
React 19 · TypeScript · Vite · Tailwind CSS · Anthropic API
