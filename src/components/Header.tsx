import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  APPLE_STORE_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  FACEBOOK_URL,
  INSTAGRAM_URL,
} from "@/config/site";

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
  const location = useLocation();

  return (
    <>
      {/* Top bar - phone CTA */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <a href={`tel:${CONTACT_PHONE_LINK}`} className="flex items-center gap-2 font-heading font-semibold hover:opacity-90 transition">
            <Phone className="h-4 w-4" />
            Appelez-nous : {CONTACT_PHONE_DISPLAY}
          </a>
          <div className="hidden md:flex items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">Facebook</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-secondary rounded-lg p-1.5">
              <span className="font-heading font-extrabold text-secondary-foreground text-lg">TAXI</span>
            </div>
            <div className="font-heading font-bold text-foreground leading-tight">
              <span className="text-sm block">Radio Taxi</span>
              <span className="text-xs text-muted-foreground">Le Havre</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${CONTACT_PHONE_LINK}`}>
                <Phone className="h-4 w-4 mr-1" /> Appeler
              </a>
            </Button>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1" /> L'App
              </a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t bg-card px-4 pb-4">
              {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={`tel:${CONTACT_PHONE_LINK}`}><Phone className="h-4 w-4 mr-1" /> Appeler</a>
              </Button>
              <Button size="sm" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-1" /> L'App</a>
              </Button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
