import { useQuery } from "@tanstack/react-query";
import { generateQuizApi, getQuizByIdApi } from "./quiz-api";
import type { Difficulty, Question } from "@/entities/quiz";

export type QuizData = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
};

const SHARED_OPTIONS = {
  refetchOnWindowFocus: false,
  staleTime: Infinity,
} as const;

export function useQuizById(id: string | undefined) {
  return useQuery<QuizData>({
    queryKey: ["quiz", "by-id", id],
    queryFn: async () => {
      const res = await getQuizByIdApi(id!);
      return {
        id: id!,
        topic: res.topic,
        difficulty: res.difficulty,
        questions: res.questions.map((q, i) => ({ ...q, id: i + 1 })),
      };
    },
    enabled: !!id,
    ...SHARED_OPTIONS,
  });
}

export function useGenerateQuiz(topic: string | undefined, difficulty: Difficulty) {
  return useQuery<QuizData>({
    queryKey: ["quiz", "generate", topic, difficulty],
    queryFn: async () => {
      const res = await generateQuizApi({ topic: topic!, difficulty });
      return {
        id: res.id,
        topic: res.topic,
        difficulty: res.difficulty as Difficulty,
        questions: res.questions.map((q, i) => ({ ...q, id: i + 1 })),
      };
    },
    enabled: !!topic,
    ...SHARED_OPTIONS,
  });
}
