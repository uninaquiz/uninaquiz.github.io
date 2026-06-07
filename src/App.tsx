import React from "react";
import { Providers } from "./app/providers";
import { AppRouter } from "./app/router";

const App: React.FC = () => (
  <Providers>
    <AppRouter />
  </Providers>
);

export default App;
