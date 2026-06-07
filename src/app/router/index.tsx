import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { Header } from "@/widgets/header/ui/Header";
import { Home } from "@/pages/Home";
import { Quiz } from "@/pages/Quiz";
import { LoginPage } from "@/pages/Login";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen text-white" style={{ background: "#0B132B" }}>
      {user && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/quiz"
          element={
            <AuthGuard>
              <Quiz />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
