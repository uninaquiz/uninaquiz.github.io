import { httpRequest } from "@/shared/api";
import type { GenerateQuizRequest, GenerateQuizResponse, GetQuizByIdResponse } from "@/entities/quiz";

export async function generateQuizApi(req: GenerateQuizRequest): Promise<GenerateQuizResponse> {
  return httpRequest<GenerateQuizResponse>("POST", "/quiz/generate", req);
}

export async function getQuizByIdApi(id: string): Promise<GetQuizByIdResponse> {
  return httpRequest<GetQuizByIdResponse>("GET", `/quiz/${id}`);
}

export async function getHistoryApi() {
  return httpRequest<import("@/entities/quiz").HistoryItem[]>("GET", "/quiz/history");
}

export async function saveQuizScoreApi(id: string, score: number): Promise<void> {
  await httpRequest("POST", "/quiz/history", { id, score });
}

export async function deleteHistoryItemApi(id: string): Promise<void> {
  await httpRequest("DELETE", `/quiz/history/${id}`);
}
