import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { serviceLegacyRedirects } from "./data/services";
import { ACTUS_ADMIN_PATH } from "./config/site";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Tarifs from "./pages/Tarifs";
import Entreprise from "./pages/Entreprise";
import AvisClients from "./pages/AvisClients";
import DevenirTaxi from "./pages/DevenirTaxi";
import Actus from "./pages/Actus";
import Contact from "./pages/Contact";
import Links from "./pages/Links";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouteScrollManager = () => {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP" || hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash, navigationType]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/circuits-touristiques" element={<Tours />} />
          <Route path="/circuits-touristiques/:id" element={<TourDetail />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/entreprise" element={<Entreprise />} />
          <Route path="/avis-clients" element={<AvisClients />} />
          <Route path="/devenir-taxi" element={<DevenirTaxi />} />
          <Route path="/actus" element={<Actus />} />
          <Route path={ACTUS_ADMIN_PATH} element={<Actus adminMode />} />
          <Route path="/gestion-actus" element={<Navigate to="/actus" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nous-contact" element={<Navigate to="/contact" replace />} />
          <Route path="/nous-contacter" element={<Navigate to="/contact" replace />} />
          {serviceLegacyRedirects.map((redirect) => (
            <Route key={redirect.from} path={redirect.from} element={<Navigate to={redirect.to} replace />} />
          ))}
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
