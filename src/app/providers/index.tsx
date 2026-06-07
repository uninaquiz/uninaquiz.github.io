import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { env } from "@/shared/config/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

type ProvidersProps = { children: React.ReactNode };

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={env.baseUrl}>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);
