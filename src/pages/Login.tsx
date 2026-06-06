import React, { useState } from "react";
import { getAssetPath } from "@/utils/assets";
import { apiLogin, apiRegister } from "@/services/api";

interface Props {
  onLogin: (user: string) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (user.trim().length < 3) { setError("Usuário precisa ter mínimo 3 caracteres."); return false; }
    if (pass.length < 6) { setError("Senha precisa ter mínimo 6 caracteres."); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (mode === "register" && pass !== pass2) { setError("As senhas não conferem."); return; }
    setLoading(true); setError("");
    try {
      const username = mode === "login"
        ? await apiLogin(user.trim(), pass)
        : await apiRegister(user.trim(), pass);
      onLogin(username);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "#0f1d40", border: "1px solid #1e3060",
    color: "#fff", fontFamily: "Montserrat", borderRadius: "8px",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-sm relative overflow-hidden rounded-2xl top-line"
        style={{ background: "#121e3d", border: "1px solid #1e3060", boxShadow: "0 0 60px rgba(0,255,135,0.08), 0 20px 40px rgba(0,0,0,0.5)" }}>
        <div className="p-8">
          <img src={getAssetPath("assets/favicon-robot.png")} alt="Bot"
            className="w-20 h-20 mx-auto mb-5 animate-float"
            style={{ filter: "drop-shadow(0 0 16px #00FF87)" }} />
          <h1 className="text-center text-xl mb-1" style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>
            {mode === "login" ? "PLAYER LOGIN" : "NOVO JOGADOR"}
          </h1>
          <p className="text-center text-xs mb-7" style={{ color: "#8899bb" }}>
            {mode === "login" ? "Entre na arena, Jogador!" : "Crie sua conta e entre na arena!"}
          </p>

          <div className="space-y-4">
            {[
              { label: "USUÁRIO", value: user, set: setUser, type: "text", placeholder: "seu_nick" },
              { label: "SENHA", value: pass, set: setPass, type: "password", placeholder: "mín. 6 caracteres" },
              ...(mode === "register" ? [{ label: "CONFIRMAR SENHA", value: pass2, set: setPass2, type: "password", placeholder: "repita a senha" }] : []),
            ].map(({ label, value, set, type, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-bold mb-1.5 tracking-widest" style={{ color: "#00FF87" }}>{label}</label>
                <input
                  type={type} value={value}
                  onChange={e => { set(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 text-sm outline-none transition-all clip-chamfer"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#00FF87"}
                  onBlur={e => e.target.style.borderColor = "#1e3060"}
                />
              </div>
            ))}

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 font-bold text-sm tracking-wide transition-all clip-chamfer disabled:opacity-50"
              style={{ background: "#00FF87", color: "#0B132B", borderRadius: "8px", fontFamily: "Montserrat", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget.style.background = "#33ffaa"); (e.currentTarget.style.boxShadow = "0 0 24px rgba(0,255,135,0.35)"); } }}
              onMouseLeave={e => { (e.currentTarget.style.background = "#00FF87"); (e.currentTarget.style.boxShadow = "none"); }}>
              {loading ? "Aguarde..." : mode === "login" ? "▶ ENTRAR NA ARENA" : "✦ CADASTRAR JOGADOR"}
            </button>

            <p className="text-center text-xs" style={{ color: "#8899bb" }}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
              <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setPass(""); setPass2(""); }}
                className="font-bold" style={{ color: "#00FF87", background: "none", border: "none", cursor: "pointer" }}>
                {mode === "login" ? "Cadastrar Jogador" : "Fazer Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
