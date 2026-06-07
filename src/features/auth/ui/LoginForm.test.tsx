import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { LoginForm } from "./LoginForm";
import { useAuthStore } from "@/features/auth/model/auth-store";

function renderLoginForm() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it("renders login fields and submit button", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar na arena/i })).toBeInTheDocument();
  });

  it("shows validation error for short username", async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/usuário/i), "ab");
    await userEvent.type(screen.getByLabelText(/^senha$/i), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /entrar na arena/i }));
    expect(screen.getByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/usuário/i), "jogador");
    await userEvent.type(screen.getByLabelText(/^senha$/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /entrar na arena/i }));
    expect(screen.getByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  it("shows server error on failed login", async () => {
    server.use(
      http.post("/auth/login", () =>
        HttpResponse.json({ message: "Usuário ou senha incorretos." }, { status: 401 })
      )
    );
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/usuário/i), "jogador");
    await userEvent.type(screen.getByLabelText(/^senha$/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /entrar na arena/i }));
    expect(await screen.findByText(/usuário ou senha incorretos/i)).toBeInTheDocument();
  });

  it("sets user in auth store on successful login", async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/usuário/i), "jogador");
    await userEvent.type(screen.getByLabelText(/^senha$/i), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /entrar na arena/i }));
    await waitFor(() => {
      expect(useAuthStore.getState().user).not.toBeNull();
      expect(useAuthStore.getState().user?.username).toBe("jogador");
    });
  });

  it("switches to register mode and shows confirm password field", async () => {
    renderLoginForm();
    await userEvent.click(screen.getByRole("button", { name: /cadastrar jogador/i }));
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar jogador/i })).toBeInTheDocument();
  });

  it("shows error when passwords do not match in register mode", async () => {
    renderLoginForm();
    await userEvent.click(screen.getByRole("button", { name: /cadastrar jogador/i }));
    await userEvent.type(screen.getByLabelText(/usuário/i), "novousuario");
    await userEvent.type(screen.getByLabelText(/^senha$/i), "senha123");
    await userEvent.type(screen.getByLabelText(/confirmar senha/i), "diferente");
    await userEvent.click(screen.getByRole("button", { name: /cadastrar jogador/i }));
    expect(screen.getByText(/senhas não conferem/i)).toBeInTheDocument();
  });
});
