import { http, HttpResponse } from "msw";
import { mockAuthSession } from "./fixtures/auth";
import { mockQuestions, mockHistory } from "./fixtures/quiz";

type HistoryEntry = typeof mockHistory[number];
type ScoreUpdate = { id: string; score: number };

const history: HistoryEntry[] = [...mockHistory];
const quizStore = new Map<string, { topic: string; difficulty: string; questions: typeof mockQuestions }>();

export const handlers = [
  http.post("/api/auth/login", () =>
    HttpResponse.json(mockAuthSession)
  ),

  http.post("/api/auth/register", () =>
    HttpResponse.json(mockAuthSession)
  ),

  http.post("/api/auth/logout", () =>
    HttpResponse.json({})
  ),

  http.post("/api/quiz/generate", async ({ request }) => {
    const body = await request.json() as { topic: string; difficulty: string };
    const id = crypto.randomUUID();
    const entry: HistoryEntry = {
      id,
      topic: body.topic,
      difficulty: body.difficulty as HistoryEntry["difficulty"],
      score: 0,
      total: mockQuestions.length,
      createdAt: Date.now(),
    };
    history.push(entry);
    quizStore.set(id, { topic: body.topic, difficulty: body.difficulty, questions: mockQuestions });
    return HttpResponse.json({
      id,
      topic: body.topic,
      difficulty: body.difficulty,
      total: mockQuestions.length,
      questions: mockQuestions,
    });
  }),

  http.get("/api/quiz/history", () =>
    HttpResponse.json([...history])
  ),

  http.get("/api/quiz/:id", ({ params }) => {
    const entry = history.find((h) => h.id === params.id);
    if (!entry) return new HttpResponse(null, { status: 404 });
    const stored = quizStore.get(params.id as string);
    return HttpResponse.json({
      id: entry.id,
      topic: entry.topic,
      difficulty: entry.difficulty,
      score: entry.score,
      total: entry.total,
      questions: stored?.questions ?? mockQuestions,
      createdAt: entry.createdAt,
    });
  }),

  http.post("/api/quiz/history", async ({ request }) => {
    const body = await request.json() as ScoreUpdate;
    const idx = history.findIndex((h) => h.id === body.id);
    if (idx >= 0) history[idx] = { ...history[idx], score: body.score };
    return HttpResponse.json({ ok: true });
  }),

  http.delete("/api/quiz/history/:id", ({ params }) => {
    const idx = history.findIndex((h) => h.id === params.id);
    if (idx >= 0) history.splice(idx, 1);
    return HttpResponse.json({ ok: true });
  }),
];

