import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { serviceLegacyRedirects } from "./data/services";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Tours = lazy(() => import("./pages/Tours"));
const TourDetail = lazy(() => import("./pages/TourDetail"));
const Tarifs = lazy(() => import("./pages/Tarifs"));
const Entreprise = lazy(() => import("./pages/Entreprise"));
const DevenirTaxi = lazy(() => import("./pages/DevenirTaxi"));
const Actus = lazy(() => import("./pages/Actus"));
const Contact = lazy(() => import("./pages/Contact"));
const Links = lazy(() => import("./pages/Links"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

const RouteFallback = () => (
  <div className="min-h-[35vh]">
    <div className="container py-16">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded-md bg-muted" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteScrollManager />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/circuits-touristiques" element={<Tours />} />
            <Route path="/circuits-touristiques/:id" element={<TourDetail />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/entreprise" element={<Entreprise />} />
            <Route path="/devenir-taxi" element={<DevenirTaxi />} />
            <Route path="/actus" element={<Actus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/nous-contact" element={<Navigate to="/" replace />} />
            <Route path="/nous-contacter" element={<Navigate to="/" replace />} />
            {serviceLegacyRedirects.map((redirect) => (
              <Route key={redirect.from} path={redirect.from} element={<Navigate to={redirect.to} replace />} />
            ))}
            <Route path="/liens" element={<Links />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
