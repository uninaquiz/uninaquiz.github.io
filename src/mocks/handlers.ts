import { http, HttpResponse } from "msw";
import { mockAuthSession } from "./fixtures/auth";
import { mockQuestions, mockHistory } from "./fixtures/quiz";

const history = [...mockHistory];

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post("/auth/login", () =>
    HttpResponse.json(mockAuthSession)
  ),

  http.post("/auth/register", () =>
    HttpResponse.json(mockAuthSession)
  ),

  http.post("/auth/logout", () =>
    HttpResponse.json({})
  ),

  // ── Quiz ──────────────────────────────────────────────────────────────────
  http.post("/quiz/generate", () =>
    HttpResponse.json({ questions: mockQuestions })
  ),

  http.get("/quiz/history", () =>
    HttpResponse.json([...history])
  ),

  http.post("/quiz/history", async ({ request }) => {
    const item = await request.json();
    const idx = history.findIndex((h) => h.id === (item as { id: string }).id);
    if (idx >= 0) history[idx] = item as (typeof history)[0];
    else history.push(item as (typeof history)[0]);
    return HttpResponse.json({});
  }),

  http.delete("/quiz/history/:id", ({ params }) => {
    const idx = history.findIndex((h) => h.id === params.id);
    if (idx >= 0) history.splice(idx, 1);
    return HttpResponse.json({});
  }),
];
