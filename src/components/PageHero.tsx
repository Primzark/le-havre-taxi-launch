import { Link, useLocation } from "react-router-dom";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

const PageHero = ({ title, subtitle }: PageHeroProps) => {
  const location = useLocation();
  const showBreadcrumb = location.pathname !== "/";

  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container">
        {showBreadcrumb && (
          <nav aria-label="Fil d'ariane" className="mb-3 text-sm opacity-85">
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
    </section>
  );
};

export default PageHero;
