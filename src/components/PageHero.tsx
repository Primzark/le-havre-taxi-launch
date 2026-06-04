import { Link, useLocation } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

type BreadcrumbItem = {
  label: string;
  to?: string;
};

const staticBreadcrumbLabels: Record<string, string> = {
  "/services": "Services",
  "/circuits-touristiques": "Circuits touristiques",
  "/tarifs": "Tarifs",
  "/entreprise": "Entreprise",
  "/avis-clients": "Avis clients",
  "/devenir-taxi": "Devenir taxi",
  "/actus": "Actualités",
  "/contact": "Nous contacter",
  "/mentions-legales": "Mentions légales",
  "/politique-confidentialite": "Politique de confidentialité",
};

const normalizePathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
};

const buildBreadcrumbs = (pathname: string, title: string): BreadcrumbItem[] => {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return [];
  }

  const serviceMatch = normalizedPath.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    return [
      { label: "Accueil", to: "/" },
      { label: "Services", to: "/services" },
      { label: title },
    ];
  }

  const tourMatch = normalizedPath.match(/^\/circuits-touristiques\/([^/]+)$/);
  if (tourMatch) {
    return [
      { label: "Accueil", to: "/" },
      { label: "Circuits touristiques", to: "/circuits-touristiques" },
      { label: title },
    ];
  }

  return [
    { label: "Accueil", to: "/" },
    { label: staticBreadcrumbLabels[normalizedPath] ?? title },
  ];
};

const PageHero = ({ title, subtitle, backgroundImage }: PageHeroProps) => {
  const location = useLocation();
  const breadcrumbs = buildBreadcrumbs(location.pathname, title);
  const showBreadcrumb = breadcrumbs.length > 0;

  return (
    <section className="relative overflow-hidden text-primary-foreground">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      )}

      <div
        className={`absolute inset-0 ${
          backgroundImage
            ? "bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70"
            : "bg-gradient-to-br from-primary via-primary to-primary/85"
        }`}
      />
      <div className="absolute -top-20 left-[8%] h-52 w-52 rounded-full bg-secondary/30 blur-3xl" />
      <div className="absolute -bottom-20 right-[10%] h-64 w-64 rounded-full bg-primary-foreground/15 blur-3xl" />

      <div className="container relative py-16 md:py-24">
        <div className={`max-w-3xl ${backgroundImage ? "rounded-2xl border border-white/20 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-sm" : ""}`}>
          {showBreadcrumb && (
            <nav aria-label="Fil d'Ariane" className="mb-3 text-sm opacity-85">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {breadcrumbs.map((breadcrumb, index) => {
                  const isCurrent = index === breadcrumbs.length - 1;

                  return (
                    <li key={`${breadcrumb.label}-${index}`} className="flex items-center gap-2">
                      {index > 0 && <span aria-hidden="true">/</span>}
                      {breadcrumb.to && !isCurrent ? (
                        <Link to={breadcrumb.to} className="hover:opacity-100 underline-offset-2 hover:underline">
                          {breadcrumb.label}
                        </Link>
                      ) : (
                        <span aria-current={isCurrent ? "page" : undefined}>{breadcrumb.label}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl mb-3">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
