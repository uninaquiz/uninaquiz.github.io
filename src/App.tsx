import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { Login } from "./pages/Login";

const App: React.FC = () => {
  const [loggedUser, setLoggedUser] = React.useState<string | null>(() => {
    return sessionStorage.getItem("cq_user");
  });

  const handleLogin = (user: string) => {
    sessionStorage.setItem("cq_user", user);
    setLoggedUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cq_user");
    setLoggedUser(null);
  };

  if (!loggedUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen text-white" style={{ background: "#0B132B" }}>
        <Header username={loggedUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home username={loggedUser} />} />
          <Route path="/quiz" element={<Quiz username={loggedUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
