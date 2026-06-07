export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type HistoryItem = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  createdAt: number;
};

export type GenerateQuizRequest = {
  topic: string;
  difficulty: Difficulty;
};

export type GenerateQuizResponse = {
  questions: Omit<Question, "id">[];
};
