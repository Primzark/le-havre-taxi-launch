import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, Menu, X, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  APPLE_STORE_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  FACEBOOK_URL,
  INSTAGRAM_URL,
} from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { resolveMenuSearch } from "@/utils/menu-search";

const PHONE_ANIMATION_DURATION_MS = 1800;
const PHONE_DIGITS = CONTACT_PHONE_DISPLAY.replace(/\D/g, "");
const MENU_VIDEO_URL = "https://player.vimeo.com/video/340638002?dnt=1&title=0&byline=0&portrait=0";

const formatPhoneDisplay = (digits: string) =>
  (digits.match(/\d{1,2}/g) ?? []).join(" ");

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/circuits-touristiques", label: "Circuits touristiques" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/entreprise", label: "Entreprise" },
  { to: "/devenir-taxi", label: "Devenir taxi" },
  { to: "/actus", label: "Actus" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [animatedPhoneDisplay, setAnimatedPhoneDisplay] = useState(CONTACT_PHONE_DISPLAY);
  const [phoneAnimationDone, setPhoneAnimationDone] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setPhoneAnimationDone(true);
      return;
    }

    const animationFlagKey = "taxi-phone-countup-done";
    if (window.sessionStorage.getItem(animationFlagKey) === "1") {
      setPhoneAnimationDone(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhoneAnimationDone(true);
      window.sessionStorage.setItem(animationFlagKey, "1");
      return;
    }

    const targetValue = Number.parseInt(PHONE_DIGITS, 10);
    const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / PHONE_ANIMATION_DURATION_MS, 1);
      const currentValue = Math.floor(targetValue * easeOutCubic(progress));
      const paddedDigits = String(currentValue).padStart(PHONE_DIGITS.length, "0");

      setAnimatedPhoneDisplay(formatPhoneDisplay(paddedDigits));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      setAnimatedPhoneDisplay(CONTACT_PHONE_DISPLAY);
      setPhoneAnimationDone(true);
      window.sessionStorage.setItem(animationFlagKey, "1");
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const isActiveLink = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleMenuSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!menuQuery.trim()) {
      return;
    }

    const result = resolveMenuSearch(menuQuery);

    if (!result.route || !result.autoNavigate) {
      toast({
        title: "Recherche à préciser",
        description: `${result.message} Suggestions: ${result.suggestions.map((item) => item.label).join(", ")}.`,
        variant: "destructive",
      });
      return;
    }

    navigate(result.route);
    setMenuQuery("");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top bar - phone CTA */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex min-h-10 items-center justify-between gap-3 py-1.5 text-sm">
          <a
            href={`tel:${CONTACT_PHONE_LINK}`}
            className="inline-flex min-w-0 items-center gap-2 font-heading font-semibold transition hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            <span className="truncate">
              Centrale de réservation :{" "}
              <span
                className={`inline-block tabular-nums ${phoneAnimationDone ? "phone-countup-done" : "phone-countup-fade"}`}
              >
                {animatedPhoneDisplay}
              </span>
            </span>
          </a>
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80">Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80">Facebook</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container flex h-24 md:h-28 items-center gap-3">
          <Link to="/" aria-label="Accueil Radio Taxi Le Havre" className="shrink-0 flex items-center">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-white shadow-[0_12px_28px_-14px_hsl(var(--primary)/0.7)] sm:h-20 sm:w-20 md:h-24 md:w-24">
              <img
                src="/images/logo-ancien.png"
                alt="Radio Taxi Le Havre"
                width={1024}
                height={1024}
                className="h-full w-full object-contain p-1 md:p-1.5"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-0.5 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-2.5 py-2 rounded-md text-[13px] 2xl:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActiveLink(link.to)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleMenuSearch} className="hidden 2xl:flex items-center gap-2">
            <label htmlFor="menu-search" className="sr-only">Recherche menu</label>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="menu-search"
                type="search"
                value={menuQuery}
                onChange={(event) => setMenuQuery(event.target.value)}
                placeholder="Service, tarif, station ou circuit"
                className="h-9 pl-9"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">OK</Button>
          </form>

          <div className="ml-auto hidden md:flex items-center gap-2 xl:ml-0 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${CONTACT_PHONE_LINK}`} className="whitespace-nowrap">
                <Phone className="h-4 w-4 2xl:mr-1" />
                <span className="hidden 2xl:inline">Appeler</span>
              </a>
            </Button>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap">
                <Download className="h-4 w-4 2xl:mr-1" />
                <span className="hidden 2xl:inline">L'App</span>
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="ml-auto md:ml-0 xl:hidden p-2 rounded-md hover:bg-muted transition shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav id="mobile-nav" className="xl:hidden border-t bg-card">
            <div className="container py-4">
              <form onSubmit={handleMenuSearch} className="flex items-center gap-2">
                <label htmlFor="menu-search-mobile" className="sr-only">Recherche menu</label>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="menu-search-mobile"
                    type="search"
                    value={menuQuery}
                    onChange={(event) => setMenuQuery(event.target.value)}
                    placeholder="Service, tarif, station ou circuit"
                    className="h-10 pl-9"
                  />
                </div>
                <Button type="submit" size="sm" variant="outline" className="h-10 px-4">OK</Button>
              </form>

              <div className="mt-3 grid gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActiveLink(link.to)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <section
                className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_34px_-24px_hsl(var(--primary)/0.8)]"
                aria-label="Vidéo de présentation de l'application"
              >
                <div className="relative aspect-video bg-muted">
                  <iframe
                    title="Application Taxi Le Havre"
                    src={MENU_VIDEO_URL}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-1.5 px-3 py-3">
                  <p className="inline-flex rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
                    Video App
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Decouvrez l'application Taxi Le Havre
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Visionnez la video puis telechargez l'app en un clic.
                  </p>
                </div>
              </section>

              <div className="mt-3 flex flex-col gap-2 border-t pt-3 sm:flex-row">
                <Button variant="outline" size="sm" className="sm:flex-1" asChild>
                  <a href={`tel:${CONTACT_PHONE_LINK}`}><Phone className="h-4 w-4 mr-1" /> Appeler</a>
                </Button>
                <Button size="sm" className="sm:flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-1" /> L'App</a>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
