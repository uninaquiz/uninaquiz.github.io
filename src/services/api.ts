/**
 * ============================================================
 * api.ts — Camada de serviço HTTP
 * ============================================================
 * 
 * ESTADO ATUAL: Mockado com localStorage
 * PARA CONECTAR AO BACKEND: troque a baseURL e implemente os
 * métodos abaixo chamando seus endpoints REST reais.
 * 
 * Endpoints esperados do backend:
 * 
 *   POST   /auth/register        body: { username, password }
 *   POST   /auth/login           body: { username, password }  → { token, user }
 *   POST   /auth/logout
 *
 *   POST   /quiz/generate        body: { topic, difficulty }   → { questions[] }
 *   GET    /quiz/history         header: Authorization: Bearer <token>
 *   POST   /quiz/history         body: { quizId, topic, difficulty, score, total, questions[] }
 *   DELETE /quiz/history/:id
 * ============================================================
 */

const BASE_URL = import.meta.env.VITE_API_URL || "";  // ex: http://localhost:8000

// Token JWT em memória (não persiste entre reloads intencionalmente)
let authToken: string | null = sessionStorage.getItem("cq_token");

function setToken(t: string | null) {
  authToken = t;
  if (t) sessionStorage.setItem("cq_token", t);
  else sessionStorage.removeItem("cq_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Erro ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export async function apiRegister(username: string, password: string) {
  if (BASE_URL) {
    const data = await request<{ token: string; user: { username: string } }>(
      "POST", "/auth/register", { username, password }
    );
    setToken(data.token);
    return data.user.username;
  }
  // MOCK local
  const users: Record<string, string> = JSON.parse(localStorage.getItem("cq_users") || "{}");
  if (users[username]) throw new Error("Usuário já existe.");
  users[username] = password;
  localStorage.setItem("cq_users", JSON.stringify(users));
  return username;
}

export async function apiLogin(username: string, password: string) {
  if (BASE_URL) {
    const data = await request<{ token: string; user: { username: string } }>(
      "POST", "/auth/login", { username, password }
    );
    setToken(data.token);
    return data.user.username;
  }
  // MOCK local
  const users: Record<string, string> = JSON.parse(localStorage.getItem("cq_users") || "{}");
  if (!users[username] || users[username] !== password) throw new Error("Usuário ou senha incorretos.");
  return username;
}

export async function apiLogout() {
  if (BASE_URL) await request("POST", "/auth/logout").catch(() => {});
  setToken(null);
}

// ── Quiz geração (IA) ─────────────────────────────────────────
export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function apiGenerateQuiz(
  topic: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<GeneratedQuestion[]> {
  if (BASE_URL) {
    // Quando o backend existir, ele chama a IA internamente (seguro — API key no servidor)
    const data = await request<{ questions: GeneratedQuestion[] }>(
      "POST", "/quiz/generate", { topic, difficulty }
    );
    return data.questions;
  }
  // MOCK: chama Anthropic direto do browser (dev only — não expor em produção!)
  return generateViaAnthropicDirect(topic, difficulty);
}

async function generateViaAnthropicDirect(
  topic: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<GeneratedQuestion[]> {
  const diffMap = { easy: "fácil (básico)", medium: "médio (intermediário)", hard: "difícil (avançado)" };
  const prompt = `Você é um gerador de quiz gamificado. Gere EXATAMENTE 5 perguntas de múltipla escolha sobre: "${topic}" com dificuldade ${diffMap[difficulty]}.

Responda APENAS com JSON válido, sem markdown, sem texto extra:
[{"text":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]

correctIndex é 0-3. Nível ${diffMap[difficulty]}.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error("Falha na API de IA (" + res.status + ")");
  const data = await res.json();
  const text = data.content.map((c: any) => c.text || "").join("");
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  if (!Array.isArray(parsed) || parsed.length < 5) throw new Error("Resposta inválida da IA");
  return parsed.slice(0, 5);
}

// ── Histórico ─────────────────────────────────────────────────
export interface HistoryItem {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  total: number;
  createdAt: number;
}

export async function apiGetHistory(username: string): Promise<HistoryItem[]> {
  if (BASE_URL) {
    return request<HistoryItem[]>("GET", "/quiz/history");
  }
  // MOCK local
  return JSON.parse(localStorage.getItem("cq_history_" + username) || "[]");
}

export async function apiSaveHistory(username: string, item: HistoryItem): Promise<void> {
  if (BASE_URL) {
    await request("POST", "/quiz/history", item);
    return;
  }
  // MOCK local
  const key = "cq_history_" + username;
  const h: HistoryItem[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = h.findIndex(x => x.id === item.id);
  if (idx >= 0) h[idx] = item; else h.push(item);
  localStorage.setItem(key, JSON.stringify(h));
}

export async function apiDeleteHistory(username: string, id: string): Promise<void> {
  if (BASE_URL) {
    await request("DELETE", `/quiz/history/${id}`);
    return;
  }
  // MOCK local
  const key = "cq_history_" + username;
  const h: HistoryItem[] = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify(h.filter(x => x.id !== id)));
}
