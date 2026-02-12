import { Link, useLocation } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHero = ({ title, subtitle, backgroundImage }: PageHeroProps) => {
  const location = useLocation();
  const showBreadcrumb = location.pathname !== "/";

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
              <Link to="/" className="hover:opacity-100 underline-offset-2 hover:underline">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <span aria-current="page">{title}</span>
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
