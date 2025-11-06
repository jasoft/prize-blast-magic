import { useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ManageParticipants from "./pages/ManageParticipants";
import Lottery from "./pages/Lottery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const basename = useMemo(() => {
    const url = new URL(import.meta.env.BASE_URL, window.location.origin);
    const trimmed = url.pathname.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manage" element={<ManageParticipants />} />
            <Route path="/lottery" element={<Lottery />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
