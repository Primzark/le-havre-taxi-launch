import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Facebook, Instagram, Menu, Phone, Play, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
const ANNIVERSARY_VIDEO_URL = "/videos/50-ans-au-coeur-du-havre.mp4";
const ANNIVERSARY_BADGE_IMAGE_URL = "/images/anniversary-50-ans-badge.webp";

const socialLinks = [
  { href: INSTAGRAM_URL, label: "Instagram", Icon: Instagram },
  { href: FACEBOOK_URL, label: "Facebook", Icon: Facebook },
] as const;

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
  const [isAnniversaryOpen, setIsAnniversaryOpen] = useState(false);
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
      toast({
        title: "Recherche à préciser",
        description: "Saisissez un terme pour lancer la recherche.",
        variant: "destructive",
      });
      return;
    }

    const result = resolveMenuSearch(menuQuery);

    if (!result.route || !result.autoNavigate) {
      toast({
        title: "Recherche à préciser",
        description: `${result.message} Suggestions : ${result.suggestions.map((item) => item.label).join(", ")}.`,
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
      <div className="bg-primary text-primary-foreground">
        <div className="container py-1.5">
          <div className="hidden min-h-10 items-center gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto]">
            <a
              href={`tel:${CONTACT_PHONE_LINK}`}
              data-analytics-id="header-top-phone-desktop"
              data-analytics-location="header_top"
              data-analytics-intent="booking"
              className="inline-flex items-center gap-2 text-left font-heading text-sm font-semibold transition hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              <span>
                Centrale de réservation :{" "}
                <span
                  className={`inline-block whitespace-nowrap tabular-nums ${phoneAnimationDone ? "phone-countup-done" : "phone-countup-fade"}`}
                >
                  {animatedPhoneDisplay}
                </span>
              </span>
            </a>

            <button
              type="button"
              onClick={() => setIsAnniversaryOpen(true)}
              className="anniversary-badge justify-self-center"
              aria-label="Découvrir l'animation 50 ans au cœur du Havre"
            >
              <span className="anniversary-badge__glow" aria-hidden="true" />
              <span className="anniversary-badge__shimmer" aria-hidden="true" />
              <span className="anniversary-badge__route" aria-hidden="true" />
              <span className="anniversary-badge__dot" aria-hidden="true" />
              <img
                src={ANNIVERSARY_BADGE_IMAGE_URL}
                alt=""
                aria-hidden="true"
                width={120}
                height={120}
                className="anniversary-badge__logo"
              />
              <span className="anniversary-badge__content">
                <span className="anniversary-badge__eyebrow">1976 • 2026</span>
                <span className="anniversary-badge__title">50 ans au cœur du Havre</span>
                <span className="anniversary-badge__meta">
                  <Sparkles className="h-3.5 w-3.5" />
                  Voir l'animation anniversaire
                </span>
              </span>
              <span className="anniversary-badge__play" aria-hidden="true">
                <Play className="h-4 w-4" />
              </span>
            </button>

            <div className="flex items-center justify-self-end gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/18"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex min-h-10 flex-col items-center justify-center gap-2 lg:hidden">
            <a
              href={`tel:${CONTACT_PHONE_LINK}`}
              data-analytics-id="header-top-phone-mobile"
              data-analytics-location="header_top_mobile"
              data-analytics-intent="booking"
              className="inline-flex max-w-full items-center justify-center gap-2 text-center font-heading font-semibold transition hover:opacity-90 max-[380px]:gap-1.5 max-[380px]:text-[13px]"
            >
              <Phone className="h-4 w-4 max-[380px]:h-3.5 max-[380px]:w-3.5" />
              <span>
                <span className="max-[380px]:hidden">Centrale de réservation : </span>
                <span className="hidden max-[380px]:inline">Réservation : </span>
                <span className="inline-block whitespace-nowrap tabular-nums">
                  {CONTACT_PHONE_DISPLAY}
                </span>
              </span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAnniversaryOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/18"
              >
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                50 ans
              </button>
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/18"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-card/95 shadow-sm backdrop-blur-sm">
        <div className="container flex h-[4.35rem] items-center gap-3 overflow-visible md:h-[5.15rem]">
          <Link
            to="/"
            aria-label="Accueil Radio Taxi Le Havre"
            className="relative z-10 flex shrink-0 translate-y-[0.15rem] items-center -my-1 md:translate-y-[0.45rem] md:-my-2"
          >
            <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-white shadow-[0_16px_34px_-16px_hsl(var(--primary)/0.75)] sm:h-28 sm:w-28 md:h-32 md:w-32">
              <img
                src="/images/logo-taxi-le-havre.webp"
                alt="Radio Taxi Le Havre"
                width={1024}
                height={1024}
                className="h-full w-full object-contain p-1"
              />
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-2.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors 2xl:text-sm ${
                  isActiveLink(link.to)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleMenuSearch} className="hidden items-center gap-2 2xl:flex">
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

          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex xl:ml-0">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`tel:${CONTACT_PHONE_LINK}`}
                data-analytics-id="header-call-button-desktop"
                data-analytics-location="header_navigation"
                data-analytics-intent="booking"
                className="whitespace-nowrap"
              >
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

          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-11 w-11 shrink-0 md:hidden"
            asChild
          >
            <a
              href={`tel:${CONTACT_PHONE_LINK}`}
              aria-label={`Appeler Radio Taxi Le Havre au ${CONTACT_PHONE_DISPLAY}`}
              title={`Appeler le ${CONTACT_PHONE_DISPLAY}`}
              data-analytics-id="header-call-button-mobile"
              data-analytics-location="header_sticky_mobile"
              data-analytics-intent="booking"
            >
              <Phone className="h-5 w-5" />
            </a>
          </Button>

          <button
            className="shrink-0 rounded-md p-2 transition hover:bg-muted xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav id="mobile-nav" className="border-t bg-card xl:hidden">
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
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                    Vidéo app
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Découvrez l'application Taxi Le Havre
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Visionnez la vidéo puis téléchargez l'app en un clic.
                  </p>
                </div>
              </section>

              <div className="mt-3 flex flex-col gap-2 border-t pt-3 sm:flex-row">
                <Button variant="outline" size="sm" className="sm:flex-1" asChild>
                  <a
                    href={`tel:${CONTACT_PHONE_LINK}`}
                    data-analytics-id="header-mobile-menu-call-button"
                    data-analytics-location="mobile_menu"
                    data-analytics-intent="booking"
                  >
                    <Phone className="mr-1 h-4 w-4" /> Appeler
                  </a>
                </Button>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:flex-1" asChild>
                  <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer"><Download className="mr-1 h-4 w-4" /> L'App</a>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <Dialog open={isAnniversaryOpen} onOpenChange={setIsAnniversaryOpen}>
        <DialogContent className="anniversary-dialog w-[calc(100vw-1rem)] max-w-[980px] max-h-[calc(100dvh-1rem)] overflow-hidden border-none bg-[#0d1f34] p-0 text-white shadow-[0_32px_90px_-48px_rgba(2,6,23,0.92)] sm:w-[92vw] sm:max-h-[calc(100dvh-2rem)]">
          <DialogTitle className="sr-only">50 ans au cœur du Havre</DialogTitle>
          <div className="anniversary-dialog__layout grid max-h-[calc(100dvh-1rem)] gap-0 overflow-y-auto overscroll-contain lg:max-h-[calc(100dvh-2rem)] lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:overflow-hidden">
            <div className="anniversary-dialog__panel relative overflow-hidden bg-[linear-gradient(180deg,#0f3f78_0%,#0d1f34_100%)] p-5 pr-14 sm:p-6 sm:pr-16 lg:p-8 lg:pr-8">
              <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-secondary/35 blur-3xl" aria-hidden="true" />
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <img
                  src={ANNIVERSARY_BADGE_IMAGE_URL}
                  alt=""
                  aria-hidden="true"
                  width={160}
                  height={160}
                  className="anniversary-dialog__badge h-16 w-16 rounded-full border-4 border-white/75 bg-white object-cover shadow-xl sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                />
                <p className="anniversary-dialog__eyebrow mt-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:mt-5 sm:text-[11px] sm:tracking-[0.24em]">
                  Édition anniversaire
                </p>
                <h2 className="anniversary-dialog__title mt-3 font-heading text-2xl font-extrabold leading-tight sm:mt-4 sm:text-3xl lg:text-4xl">
                  50 ans au cœur du Havre
                </h2>
                <p className="anniversary-dialog__copy mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:mt-4 lg:text-base">
                  Découvrez la création anniversaire de Radio Taxi Le Havre et l'identité visuelle imaginée pour célébrer la coopérative depuis 1976.
                </p>
              </div>
            </div>

            <div className="anniversary-dialog__media relative min-h-[220px] overflow-hidden bg-black sm:min-h-[280px] lg:min-h-0">
              <video
                src={ANNIVERSARY_VIDEO_URL}
                poster={ANNIVERSARY_BADGE_IMAGE_URL}
                className="anniversary-dialog__video h-full max-h-[48dvh] w-full object-contain bg-black sm:max-h-[54dvh] lg:max-h-[calc(100dvh-2rem)]"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
