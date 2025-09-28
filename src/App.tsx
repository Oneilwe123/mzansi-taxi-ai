import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { EmergencyButton } from "@/components/EmergencyButton";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // If user signs out, redirect to home
        if (event === 'SIGNED_OUT') {
          window.location.href = '/';
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
  <Navigation 
    isAuthenticated={isAuthenticated}
    onSignIn={() => window.location.href = '/auth'}
    onSignOut={handleSignOut}
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

  {/* Emergency button always visible */}
  <EmergencyButton />
</BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;