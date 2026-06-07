import { useState, useCallback } from "react";
import type { Question, Difficulty, HistoryItem } from "@/entities/quiz";

type AnswerState = { selected: number; correct: boolean };

type QuizSession = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  createdAt: number;
};

type UseQuizSessionReturn = {
  session: QuizSession | null;
  qIndex: number;
  score: number;
  answers: (AnswerState | null)[];
  finished: boolean;
  selectOption: (idx: number) => void;
  advance: (dir: 1 | -1) => HistoryItem | null;
};

export function useQuizSession(
  questions: Question[],
  topic: string,
  difficulty: Difficulty,
): UseQuizSessionReturn {
  const [session] = useState<QuizSession>(() => ({
    id: crypto.randomUUID(),
    topic,
    difficulty,
    questions,
    createdAt: Date.now(),
  }));

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(AnswerState | null)[]>(
    Array(questions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);

  const selectOption = useCallback(
    (idx: number) => {
      if (answers[qIndex]) return;
      const correct = idx === session.questions[qIndex].correctIndex;
      setAnswers((prev) => {
        const updated = [...prev];
        updated[qIndex] = { selected: idx, correct };
        return updated;
      });
      if (correct) setScore((s) => s + 1);
    },
    [answers, qIndex, session.questions]
  );

  // Returns a HistoryItem when the quiz finishes, null otherwise
  const advance = useCallback(
    (dir: 1 | -1): HistoryItem | null => {
      const next = qIndex + dir;
      if (next < 0) return null;

      if (next >= session.questions.length) {
        const finalScore = answers.filter((a) => a?.correct).length;
        setFinished(true);
        return {
          id: session.id,
          topic: session.topic,
          difficulty: session.difficulty,
          score: finalScore,
          total: session.questions.length,
          createdAt: session.createdAt,
        };
      }

      setQIndex(next);
      return null;
    },
    [qIndex, session, answers]
  );

  return { session, qIndex, score, answers, finished, selectOption, advance };
}
