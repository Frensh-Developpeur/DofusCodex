import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import ConnectionGate from "./components/ConnectionGate";
import UpdateFinishSplash from "./components/UpdateFinishSplash";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // API data barely changes; cache aggressively.
      gcTime: 1000 * 60 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* HashRouter so deep links work from file:// in production. */}
      <HashRouter>
        {/* Garde-fou réseau : l'app est 100% online → on ne monte App qu'une fois la
            connexion confirmée. C'est ConnectionGate qui retire le splash #app-loader. */}
        <ConnectionGate>
          <App />
        </ConnectionGate>
        {/* Splash « mise à jour terminée » — au-dessus de tout, même pendant le test réseau. */}
        <UpdateFinishSplash />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
