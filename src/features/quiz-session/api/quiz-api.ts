import { httpRequest } from "@/shared/api";
import type { GenerateQuizRequest, GenerateQuizResponse, HistoryItem } from "@/entities/quiz";

export async function generateQuizApi(req: GenerateQuizRequest): Promise<GenerateQuizResponse> {
  return httpRequest<GenerateQuizResponse>("POST", "/quiz/generate", req);
}

export async function getHistoryApi(): Promise<HistoryItem[]> {
  return httpRequest<HistoryItem[]>("GET", "/quiz/history");
}

export async function saveHistoryItemApi(item: HistoryItem): Promise<void> {
  await httpRequest("POST", "/quiz/history", item);
}

export async function deleteHistoryItemApi(id: string): Promise<void> {
  await httpRequest("DELETE", `/quiz/history/${id}`);
}
