import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Home from "./pages/Home";
import RoutesPage from "./pages/Routes";
import Alerts from "./pages/Alerts";
import TrainAI from "./pages/TrainAI";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation 
            isAuthenticated={isAuthenticated}
            onSignIn={() => window.location.href = '/auth'}
            onSignOut={() => setIsAuthenticated(false)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/train-ai" element={<TrainAI />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth" element={<Auth onAuthenticate={setIsAuthenticated} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;