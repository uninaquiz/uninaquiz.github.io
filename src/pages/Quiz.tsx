import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateQuizApi } from "@/features/quiz-session/api/quiz-api";
import { useQuizSession } from "@/features/quiz-session/model/use-quiz-session";
import { useSaveHistory } from "@/features/quiz-history/api/use-history";
import { audioService } from "@/shared/lib/audio";
import { spawnConfetti } from "@/shared/lib/confetti";
import { getAssetPath } from "@/shared/lib/assets";
import type { Question, Difficulty } from "@/entities/quiz";

export const Quiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = (location.state || {}) as { topic?: string; difficulty?: Difficulty };

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);

  const saveHistory = useSaveHistory();

  useEffect(() => {
    if (!topic) { navigate("/"); return; }
    generateQuizApi({ topic, difficulty: difficulty ?? "easy" })
      .then((res) => {
        setQuestions(res.questions.map((q, i) => ({ ...q, id: i + 1 })));
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao gerar quiz");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audioService.setMuted(next);
  };

  if (!topic) return null;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 relative z-10 pt-20">
      <div className="loader-ring" />
      <p className="text-xs tracking-widest" style={{ color: "#8899bb" }}>GERANDO MASMORRA DO QUIZ...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 relative z-10 pt-20 px-4">
      <div className="text-center p-8 rounded-2xl max-w-md"
        style={{ background: "#121e3d", border: "1px solid #ff4d6d" }}>
        <p className="font-bold mb-2" style={{ color: "#ff4d6d" }}>ERRO AO GERAR QUIZ</p>
        <p className="text-sm mb-6" style={{ color: "#8899bb" }}>{error}</p>
        <button onClick={() => navigate("/")}
          className="px-6 py-3 font-bold text-sm clip-chamfer-sm"
          style={{ background: "#00FF87", color: "#0B132B", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "Montserrat" }}>
          ← VOLTAR
        </button>
      </div>
    </div>
  );

  if (!questions) return null;

  return (
    <QuizSession
      questions={questions}
      topic={topic}
      difficulty={difficulty ?? "easy"}
      muted={muted}
      onToggleMute={toggleMute}
      onSaveHistory={(item) => saveHistory.mutate(item)}
      onFinish={(score, total) => {
        if (score / total >= 0.6) spawnConfetti();
      }}
      onExit={() => navigate("/")}
    />
  );
};

// ── Inner session component ────────────────────────────────────────────────────
type QuizSessionProps = {
  questions: Question[];
  topic: string;
  difficulty: Difficulty;
  muted: boolean;
  onToggleMute: () => void;
  onSaveHistory: (item: import("@/entities/quiz").HistoryItem) => void;
  onFinish: (score: number, total: number) => void;
  onExit: () => void;
};

const QuizSession: React.FC<QuizSessionProps> = ({
  questions, topic, difficulty, muted, onToggleMute, onSaveHistory, onFinish, onExit,
}) => {
  const navigate = useNavigate();
  const { session, qIndex, score, answers, finished, selectOption, advance } =
    useQuizSession(questions, topic, difficulty);

  const handleSelect = (idx: number) => {
    const q = session.questions[qIndex];
    const correct = idx === q.correctIndex;
    selectOption(idx);
    audioService.playSFX(correct ? "correct" : "wrong");
  };

  const handleAdvance = async (dir: 1 | -1) => {
    audioService.playSFX("click");
    const historyItem = advance(dir);
    if (historyItem) {
      onFinish(historyItem.score, historyItem.total);
      onSaveHistory(historyItem);
    }
  };

  const labels = ["A", "B", "C", "D"];
  const total = session.questions.length;

  // ── Result screen ────────────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round(score / total * 100);
    const msgs: [number, string][] = [
      [80, "Impressionante! Você é um verdadeiro expert!"],
      [60, "Muito bem! Continue assim e vai dominar o assunto!"],
      [40, "Bom trabalho! Revise os erros e volte mais forte!"],
      [0,  "Não desista! Todo mestre já foi iniciante. Continue!"],
    ];
    const msg = (msgs.find(([m]) => pct >= m) ?? msgs[3])[1];

    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10 pt-20">
        <div className="relative overflow-hidden rounded-2xl p-12 text-center max-w-md w-full animate-fade-in-up top-line"
          style={{ background: "#121e3d", border: "1px solid #1e3060" }}>
          <img src={getAssetPath("assets/favicon-robot.png")} alt="Bot"
            className="w-24 h-24 mx-auto mb-5 animate-float"
            style={{ filter: "drop-shadow(0 0 24px #00FF87)" }} />
          <h2 className="text-xl font-black mb-2 tracking-wide"
            style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>CHECKPOINT ATINGIDO!</h2>
          <div className="text-6xl font-black my-3" style={{ fontFamily: "'Orbitron',sans-serif" }}>
            {score}<span style={{ color: "#00FF87" }}>/{total}</span>
          </div>
          <div className="text-2xl font-bold mb-4" style={{ color: "#00FF87", fontFamily: "'Orbitron',sans-serif" }}>{pct}%</div>
          <p className="text-sm leading-relaxed mb-2" style={{ color: "#ccc" }}>{msg}</p>
          <p className="text-xs mb-8" style={{ color: "#8899bb" }}>Checkpoint Quiz espera por você no próximo desafio.</p>
          <button onClick={() => navigate("/")}
            className="px-8 py-4 font-black text-sm tracking-wide clip-chamfer"
            style={{ background: "#00FF87", color: "#0B132B", borderRadius: "8px", border: "none", cursor: "pointer", fontFamily: "Montserrat" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#33ffaa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00FF87")}>
            ↩ NOVO DESAFIO
          </button>
        </div>
      </div>
    );
  }

  // ── Active question screen ───────────────────────────────────────────────
  const q = session.questions[qIndex];
  const answered = answers[qIndex];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 relative z-10">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,135,0.01) 2px,rgba(0,255,135,0.01) 4px)" }} />
      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest truncate max-w-[160px]"
            style={{ background: "#1a2850", border: "1px solid #1e3060", color: "#00FF87" }}>
            {session.topic.toUpperCase()}
          </div>
          <div className="flex items-center gap-1.5" style={{ fontFamily: "'Orbitron',sans-serif" }}>
            <span style={{ color: "#ffb800" }}>★</span>
            <span className="font-bold text-sm">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleMute}
              aria-label={muted ? "Ativar sons" : "Silenciar sons"}
              className="px-3 py-1.5 text-xs font-bold tracking-wide rounded transition-all"
              style={{ background: "#1a2850", border: `1px solid ${muted ? "#ff4d6d" : "#1e3060"}`, color: muted ? "#ff4d6d" : "#8899bb", cursor: "pointer", fontFamily: "Montserrat" }}>
              {muted ? "🔇" : "🔊"}
            </button>
            <button onClick={onExit}
              className="px-3 py-1.5 text-xs font-bold tracking-wide rounded transition-all"
              style={{ background: "#1a2850", border: "1px solid #1e3060", color: "#8899bb", cursor: "pointer", fontFamily: "Montserrat" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ff4d6d"; e.currentTarget.style.color = "#ff4d6d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e3060"; e.currentTarget.style.color = "#8899bb"; }}>
              ✕ SAIR
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between text-xs font-bold mb-2" style={{ color: "#8899bb" }}>
          <span>QUESTÃO {qIndex + 1}/{total}</span>
        </div>
        <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "#1a2850" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((qIndex + 1) / total) * 100}%`, background: "linear-gradient(90deg,#00cc6a,#00FF87)", boxShadow: "0 0 8px rgba(0,255,135,0.4)" }} />
        </div>

        {/* Question */}
        <div className="relative overflow-hidden rounded-2xl p-8 mb-5 top-line animate-fade-in-up"
          style={{ background: "#121e3d", border: "1px solid #1e3060" }}>
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00FF87" }}>QUESTÃO {qIndex + 1}</p>
          <p className="text-lg sm:text-xl font-bold leading-snug text-white">{q.text}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {q.options.map((opt, i) => {
            let style: React.CSSProperties = { background: "#1a2850", border: "1px solid #1e3060", color: "#fff", fontFamily: "Montserrat" };
            let faded = false;
            if (answered) {
              if (i === q.correctIndex) style = { background: "rgba(0,255,135,0.15)", border: "1px solid #00FF87", color: "#00FF87", fontFamily: "Montserrat" };
              else if (i === answered.selected) style = { background: "rgba(255,77,109,0.15)", border: "1px solid #ff4d6d", color: "#ff4d6d", fontFamily: "Montserrat" };
              else faded = true;
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={!!answered}
                className={`w-full p-4 rounded-xl text-left text-sm font-semibold leading-snug transition-all flex items-start gap-3 clip-chamfer-sm ${faded ? "opacity-30" : ""}`}
                style={{ ...style, cursor: answered ? "default" : "pointer" }}
                onMouseEnter={(e) => { if (!answered) { e.currentTarget.style.borderColor = "#00FF87"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                onMouseLeave={(e) => { if (!answered) { e.currentTarget.style.borderColor = "#1e3060"; e.currentTarget.style.transform = "none"; } }}>
                <span className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ background: "#0f1d40", color: "#8899bb", fontFamily: "'Orbitron',sans-serif" }}>{labels[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className="rounded-xl p-4 mb-5 animate-fade-in-up"
            style={{ background: "#121e3d", border: `1px solid ${answered.correct ? "#00FF87" : "#ff4d6d"}` }}>
            <p className="text-xs font-black tracking-widest mb-1"
              style={{ color: answered.correct ? "#00FF87" : "#ff4d6d", fontFamily: "'Orbitron',sans-serif" }}>
              {answered.correct ? "✓ CORRETO!" : "✗ ERRADO!"}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#aabbcc" }}>{q.explanation}</p>
          </div>
        )}

        {/* Nav */}
        <div className="flex gap-3">
          <button onClick={() => handleAdvance(-1)} disabled={qIndex === 0}
            className="px-5 py-3 font-bold text-sm tracking-wide rounded-lg transition-all clip-chamfer-sm disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "#1a2850", border: "1px solid #1e3060", color: "#fff", fontFamily: "Montserrat", cursor: qIndex > 0 ? "pointer" : "not-allowed" }}
            onMouseEnter={(e) => { if (qIndex > 0) e.currentTarget.style.borderColor = "#00FF87"; }}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3060")}>
            ← Voltar
          </button>
          <button onClick={() => handleAdvance(1)}
            className="flex-1 py-3 font-black text-sm tracking-wide rounded-lg transition-all clip-chamfer-sm"
            style={{ background: "#00FF87", color: "#0B132B", border: "none", fontFamily: "Montserrat", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#33ffaa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00FF87")}>
            {qIndex === total - 1 ? "Concluir ✓" : "Avançar →"}
          </button>
        </div>
      </div>
    </div>
  );
};
