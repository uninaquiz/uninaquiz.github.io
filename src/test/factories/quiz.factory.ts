import type { Question, HistoryItem, Difficulty } from "@/entities/quiz";

let _qId = 0;

export function makeQuestion(overrides?: Partial<Question>): Question {
  return {
    id: ++_qId,
    text: `Pergunta de teste ${_qId}`,
    options: ["Opção A", "Opção B", "Opção C", "Opção D"],
    correctIndex: 0,
    explanation: "Explicação de teste.",
    ...overrides,
  };
}

export function makeHistoryItem(overrides?: Partial<HistoryItem>): HistoryItem {
  return {
    id: `test-id-${Math.random().toString(36).slice(2)}`,
    topic: "Matemática",
    difficulty: "easy" as Difficulty,
    score: 3,
    total: 5,
    createdAt: Date.now(),
    ...overrides,
  };
}
