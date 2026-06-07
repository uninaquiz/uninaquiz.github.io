import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { Input } from "@/shared/ui/atoms";
import { Button } from "@/shared/ui/atoms";
import { getAssetPath } from "@/shared/lib/assets";

type Mode = "login" | "register";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (username.trim().length < 3) {
      setError("Usuário precisa ter mínimo 3 caracteres.");
      return false;
    }
    if (password.length < 6) {
      setError("Senha precisa ter mínimo 6 caracteres.");
      return false;
    }
    if (mode === "register" && password !== password2) {
      setError("As senhas não conferem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const user =
        mode === "login"
          ? await loginApi(username.trim(), password)
          : await registerApi(username.trim(), password);
      setUser(user);
      navigate("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
    setPassword("");
    setPassword2("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div
        className="w-full max-w-sm relative overflow-hidden rounded-2xl top-line"
        style={{
          background: "#121e3d",
          border: "1px solid #1e3060",
          boxShadow: "0 0 60px rgba(0,255,135,0.08), 0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div className="p-8">
          <img
            src={getAssetPath("assets/favicon-robot.png")}
            alt="Bot"
            className="w-20 h-20 mx-auto mb-5 animate-float"
            style={{ filter: "drop-shadow(0 0 16px #00FF87)" }}
          />
          <h1
            className="text-center text-xl mb-1"
            style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}
          >
            {mode === "login" ? "PLAYER LOGIN" : "NOVO JOGADOR"}
          </h1>
          <p className="text-center text-xs mb-7" style={{ color: "#8899bb" }}>
            {mode === "login"
              ? "Entre na arena, Jogador!"
              : "Crie sua conta e entre na arena!"}
          </p>

          <div className="space-y-4">
            <Input
              id="username"
              label="USUÁRIO"
              type="text"
              value={username}
              placeholder="seu_nick"
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Input
              id="password"
              label="SENHA"
              type="password"
              value={password}
              placeholder="mín. 6 caracteres"
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {mode === "register" && (
              <Input
                id="password2"
                label="CONFIRMAR SENHA"
                type="password"
                value={password2}
                placeholder="repita a senha"
                onChange={(e) => { setPassword2(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            )}

            {error && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,77,109,0.1)",
                  border: "1px solid rgba(255,77,109,0.3)",
                  color: "#ff4d6d",
                }}
              >
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              isLoading={loading}
              onClick={handleSubmit}
              style={{ width: "100%" }}
            >
              {mode === "login" ? "▶ ENTRAR NA ARENA" : "✦ CADASTRAR JOGADOR"}
            </Button>

            <p className="text-center text-xs" style={{ color: "#8899bb" }}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
              <button
                onClick={switchMode}
                className="font-bold"
                style={{
                  color: "#00FF87",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {mode === "login" ? "Cadastrar Jogador" : "Fazer Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
