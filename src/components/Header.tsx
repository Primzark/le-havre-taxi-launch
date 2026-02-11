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
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
        title: "Recherche a preciser",
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
            <span className="truncate">Centrale de reservation : {CONTACT_PHONE_DISPLAY}</span>
          </a>
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80">Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="transition hover:opacity-80">Facebook</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container flex h-16 items-center gap-3">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <div className="bg-secondary rounded-lg p-1.5">
              <span className="font-heading font-extrabold text-secondary-foreground text-lg">TAXI</span>
            </div>
            <div className="font-heading font-bold text-foreground leading-tight">
              <span className="text-sm block">Radio Taxi</span>
              <span className="text-xs text-muted-foreground">Le Havre</span>
            </div>
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
