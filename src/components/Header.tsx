import React from "react";
import { useNavigate } from "react-router-dom";
import { getAssetPath } from "@/utils/assets";

interface Props {
  username: string;
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({ username, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(11,19,43,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e3060",
      }}
    >
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — clicável, volta pra home */}
        <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img
            src={getAssetPath("assets/logo-header.png")}
            alt="Checkpoint Quiz"
            style={{ height: "44px", width: "auto", objectFit: "contain", maxWidth: "200px" }}
          />
        </div>

        {/* Direita: nome do jogador + botão sair */}
        <div className="flex items-center gap-4">
          <span style={{ color: "#8899bb", fontSize: "0.75rem" }}>
            Jogador:{" "}
            <span style={{ color: "#00FF87", fontWeight: 700 }}>
              {username.toUpperCase()}
            </span>
          </span>

          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "1px solid #1e3060",
              borderRadius: "8px",
              color: "#8899bb",
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#ff4d6d";
              e.currentTarget.style.color = "#ff4d6d";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#1e3060";
              e.currentTarget.style.color = "#8899bb";
            }}
          >
            SAIR
          </button>
        </div>

      </nav>
    </header>
  );
};
