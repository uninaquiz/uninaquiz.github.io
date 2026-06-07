import { env } from "@/shared/config/env";

let _token: string | null = sessionStorage.getItem("cq_token");

export function setAuthToken(t: string | null): void {
  _token = t;
  if (t) sessionStorage.setItem("cq_token", t);
  else sessionStorage.removeItem("cq_token");
}

export async function httpRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? `Erro ${res.status}`);
  }

  return res.json() as Promise<T>;
}
