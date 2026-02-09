import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Tarifs from "./pages/Tarifs";
import Entreprise from "./pages/Entreprise";
import DevenirTaxi from "./pages/DevenirTaxi";
import Actus from "./pages/Actus";
import Contact from "./pages/Contact";
import Links from "./pages/Links";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/circuits-touristiques" element={<Tours />} />
          <Route path="/circuits-touristiques/:id" element={<TourDetail />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/entreprise" element={<Entreprise />} />
          <Route path="/devenir-taxi" element={<DevenirTaxi />} />
          <Route path="/actus" element={<Actus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/liens" element={<Links />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
