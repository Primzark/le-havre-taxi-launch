interface PageHeroProps {
  title: string;
  subtitle?: string;
}

const PageHero = ({ title, subtitle }: PageHeroProps) => {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl mb-3">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHero;
