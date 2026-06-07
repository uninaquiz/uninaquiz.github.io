import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHistoryApi,
  deleteHistoryItemApi,
  saveQuizScoreApi,
} from "@/features/quiz-session/api/quiz-api";

export const HISTORY_QUERY_KEY = ["quiz", "history"] as const;

export function useHistory() {
  return useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: getHistoryApi,
  });
}

export function useSaveQuizScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) => saveQuizScoreApi(id, score),
    onSuccess: () => qc.invalidateQueries({ queryKey: HISTORY_QUERY_KEY }),
  });
}

export function useDeleteHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHistoryItemApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: HISTORY_QUERY_KEY }),
  });
}
