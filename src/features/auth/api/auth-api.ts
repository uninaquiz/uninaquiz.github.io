import { httpRequest, setAuthToken } from "@/shared/api";
import type { AuthSession, User } from "@/entities/user";

export async function loginApi(username: string, password: string): Promise<User> {
  const data = await httpRequest<AuthSession>("POST", "/auth/login", { username, password });
  setAuthToken(data.token);
  return data.user;
}

export async function registerApi(username: string, password: string): Promise<User> {
  const data = await httpRequest<AuthSession>("POST", "/auth/register", { username, password });
  setAuthToken(data.token);
  return data.user;
}

export async function logoutApi(): Promise<void> {
  await httpRequest("POST", "/auth/logout").catch(() => {});
  setAuthToken(null);
}
