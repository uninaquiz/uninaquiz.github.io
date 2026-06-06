import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetHistory, apiDeleteHistory, HistoryItem } from "@/services/api";

type Difficulty = "easy" | "medium" | "hard";
interface Props { username: string; }

export const Home: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    apiGetHistory(username).then(setHistory).catch(console.error);
  }, [username]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    navigate("/quiz", { state: { topic: topic.trim(), difficulty } });
  };

  const handleDelete = async (id: string) => {
    await apiDeleteHistory(username, id).catch(console.error);
    setHistory(h => h.filter(x => x.id !== id));
  };

  const diffConfig: Record<Difficulty, { label: string; active: React.CSSProperties }> = {
    easy:   { label: "Fácil",   active: { background: "#003322", borderColor: "#00FF87", color: "#00FF87" } },
    medium: { label: "Médio",   active: { background: "#332200", borderColor: "#ffb800", color: "#ffb800" } },
    hard:   { label: "Difícil", active: { background: "#330011", borderColor: "#ff4d6d", color: "#ff4d6d" } },
  };
  const diffBadge: Record<Difficulty, React.CSSProperties> = {
    easy:   { background: "#003322", color: "#00FF87" },
    medium: { background: "#332200", color: "#ffb800" },
    hard:   { background: "#330011", color: "#ff4d6d" },
  };

  const goToQuiz = (item: HistoryItem) => {
    navigate("/quiz", { state: { topic: item.topic, difficulty: item.difficulty } });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 relative z-10">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00FF87" }}>
            BEM-VINDO, {username.toUpperCase()}!
          </p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight"
            style={{ fontFamily: "'Orbitron',sans-serif" }}>
            ENTRE NA <span style={{ color: "#00FF87" }}>ARENA</span><br />DO QUIZ
          </h1>
          <p className="text-sm leading-relaxed max-w-lg mx-auto mb-8" style={{ color: "#8899bb" }}>
            Digite o tema do seu desafio, escolha a dificuldade e deixe a IA gerar um quiz personalizado.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[["01","Digite o tema"],["02","Escolha a dificuldade"],["03","Responda e pontue"]].map(([n,t]) => (
              <div key={n} className="clip-chamfer-sm px-5 py-4 w-44 text-center"
                style={{ background: "#121e3d", border: "1px solid #1e3060" }}>
                <div className="text-2xl font-black mb-1" style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>{n}</div>
                <div className="text-xs" style={{ color: "#8899bb" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generator */}
        <div className="relative overflow-hidden rounded-2xl mb-8 p-8 top-line"
          style={{ background: "#121e3d", border: "1px solid #1e3060" }}>
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00FF87" }}>⚡ GERAR NOVO QUIZ</p>
          <input
            id="topicInput"
            type="text" value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            placeholder="Digite o tema do seu próximo desafio..."
            maxLength={80}
            className="w-full px-4 py-3.5 rounded-lg text-sm outline-none mb-5 clip-chamfer"
            style={{ background: "#0f1d40", border: "1px solid #1e3060", color: "#fff", fontFamily: "Montserrat" }}
            onFocus={e => e.target.style.borderColor = "#00FF87"}
            onBlur={e => e.target.style.borderColor = "#1e3060"}
          />

          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00FF87" }}>DIFICULDADE</p>
          <div className="flex gap-3 mb-6">
            {(["easy","medium","hard"] as Difficulty[]).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all clip-chamfer-sm"
                style={difficulty === d
                  ? { ...diffConfig[d].active, border: "1px solid", fontFamily: "Montserrat" }
                  : { background: "#0f1d40", border: "1px solid #1e3060", color: "#8899bb", fontFamily: "Montserrat" }}>
                {diffConfig[d].label}
              </button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={!topic.trim()}
            className="w-full py-4 font-black text-sm tracking-wide transition-all clip-chamfer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#00FF87", color: "#0B132B", borderRadius: "8px", fontFamily: "Montserrat", border: "none", cursor: topic.trim() ? "pointer" : "not-allowed" }}
            onMouseEnter={e => { if (topic.trim()) { (e.currentTarget.style.background="#33ffaa"); (e.currentTarget.style.boxShadow="0 0 30px rgba(0,255,135,0.35)"); } }}
            onMouseLeave={e => { (e.currentTarget.style.background="#00FF87"); (e.currentTarget.style.boxShadow="none"); }}>
            ⚔ GERAR MASMORRA DO QUIZ
          </button>
        </div>

        {/* History */}
        <div className="rounded-2xl p-6" style={{ background: "#121e3d", border: "1px solid #1e3060" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest" style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>⏱ CHECKPOINT HISTORY</span>
            <div className="flex-1 h-px" style={{ background: "#1e3060" }} />
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: "#8899bb" }}>Nenhum quiz jogado ainda. Hora de começar!</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {[...history].reverse().map(item => (
                // Fix 6: role="button" + tabIndex + onKeyDown para acessibilidade
                <div key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToQuiz(item)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") goToQuiz(item); }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: "#0f1d40", border: "1px solid #1e3060" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#00FF87")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e3060")}>
                  <div>
                    <div className="font-bold text-sm text-white">{item.topic}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#8899bb" }}>
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")} • {item.total} questões
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={diffBadge[item.difficulty]}>
                      {diffConfig[item.difficulty].label.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>
                      {item.score ?? "—"}/{item.total}
                    </span>
                    {/* Fix 5: aria-label no botão deletar */}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      aria-label={`Excluir histórico: ${item.topic}`}
                      style={{ color: "#8899bb", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ff4d6d")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#8899bb")}
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
