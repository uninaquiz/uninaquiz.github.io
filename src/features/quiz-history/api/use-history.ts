import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHistoryApi,
  deleteHistoryItemApi,
  saveHistoryItemApi,
} from "@/features/quiz-session/api/quiz-api";
import type { HistoryItem } from "@/entities/quiz";

export const HISTORY_QUERY_KEY = ["quiz", "history"] as const;

export function useHistory() {
  return useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: getHistoryApi,
  });
}

export function useSaveHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: HistoryItem) => saveHistoryItemApi(item),
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
