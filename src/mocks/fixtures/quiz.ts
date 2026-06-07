import type { Question, HistoryItem } from "@/entities/quiz";

export const mockQuestions: Omit<Question, "id">[] = [
  {
    text: "Qual é a capital do Brasil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte"],
    correctIndex: 2,
    explanation: "Brasília é a capital federal do Brasil desde 1960.",
  },
  {
    text: "Quanto é 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    explanation: "A soma de 2 + 2 é igual a 4.",
  },
  {
    text: "Qual linguagem é usada para estilizar páginas web?",
    options: ["HTML", "JavaScript", "Python", "CSS"],
    correctIndex: 3,
    explanation: "CSS (Cascading Style Sheets) é usada para estilização.",
  },
  {
    text: "Quem escreveu 'Dom Casmurro'?",
    options: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Carlos Drummond"],
    correctIndex: 1,
    explanation: "Dom Casmurro foi escrito por Machado de Assis, publicado em 1899.",
  },
  {
    text: "Qual é o maior planeta do Sistema Solar?",
    options: ["Terra", "Saturno", "Júpiter", "Netuno"],
    correctIndex: 2,
    explanation: "Júpiter é o maior planeta do Sistema Solar.",
  },
];

export const mockHistory: HistoryItem[] = [
  {
    id: "mock-history-1",
    topic: "Geografia",
    difficulty: "easy",
    score: 4,
    total: 5,
    createdAt: Date.now() - 86400000,
  },
];
