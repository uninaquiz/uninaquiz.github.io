import type { User } from "@/entities/user";

export function makeUser(overrides?: Partial<User>): User {
  return {
    username: "jogador_teste",
    ...overrides,
  };
}
