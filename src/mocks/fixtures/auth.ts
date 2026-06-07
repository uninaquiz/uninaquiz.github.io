import type { AuthSession } from "@/entities/user";

export const mockAuthSession: AuthSession = {
  token: "mock-jwt-token",
  user: { username: "jogador" },
};
