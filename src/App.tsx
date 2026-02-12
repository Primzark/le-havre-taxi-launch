import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Tarifs from "./pages/Tarifs";
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
          <Route path="/entreprise" element={<Navigate to="/" replace />} />
          <Route path="/devenir-taxi" element={<Navigate to="/" replace />} />
          <Route path="/actus" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/taxi-le-havre" element={<Navigate to="/" replace />} />
          <Route path="/circuits-touristique" element={<Navigate to="/circuits-touristiques/1" replace />} />
          <Route path="/circuits-touristique-etretat-circuit-de-laiguille" element={<Navigate to="/circuits-touristiques/2" replace />} />
          <Route path="/circuits-touristique-la-normandie" element={<Navigate to="/circuits-touristiques/3" replace />} />
          <Route path="/circuits-touristique-mont-st-michel" element={<Navigate to="/circuits-touristiques/4" replace />} />
          <Route path="/circuits-touristiques-honfleur" element={<Navigate to="/circuits-touristiques/5" replace />} />
          <Route path="/circuits-touristique-rouen" element={<Navigate to="/circuits-touristiques/6" replace />} />
          <Route path="/giverny" element={<Navigate to="/circuits-touristiques/7" replace />} />
          <Route path="/circuits-touristique-la-cote-dalbatre" element={<Navigate to="/circuits-touristiques/8" replace />} />
          <Route path="/circuits-touristique-la-cote-fleurie" element={<Navigate to="/circuits-touristiques/9" replace />} />
          <Route path="/les-plages-du-debarquement" element={<Navigate to="/circuits-touristiques/10" replace />} />
          <Route path="/circuits-touristique-paris-ville-lumiere" element={<Navigate to="/circuits-touristiques/11" replace />} />
          <Route path="/circuits-touristique-le-chateau-de-versailles" element={<Navigate to="/circuits-touristiques/12" replace />} />
          <Route path="/navette-aeroport" element={<Navigate to="/services" replace />} />
          <Route path="/mariage" element={<Navigate to="/services" replace />} />
          <Route path="/navette-transport-sanitaire" element={<Navigate to="/services" replace />} />
          <Route path="/navette-classe-affaire" element={<Navigate to="/services" replace />} />
          <Route path="/navette-transport-scolaire" element={<Navigate to="/services" replace />} />
          <Route path="/transport-professionnel-et-entreprise" element={<Navigate to="/services" replace />} />
          <Route path="/personne-a-mobilite-reduite" element={<Navigate to="/services" replace />} />
          <Route path="/nous-contact" element={<Navigate to="/" replace />} />
          <Route path="/nous-contacter" element={<Navigate to="/" replace />} />
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
