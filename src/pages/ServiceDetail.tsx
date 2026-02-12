import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_LINK } from "@/config/site";
import { getServiceBySlug } from "@/data/services";
import { useSEO } from "@/hooks/use-seo";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  useSEO(
    service
      ? {
          title: service.title,
          description: service.seoDescription,
          canonicalPath: `/services/${service.slug}`,
        }
      : {
          title: "Service introuvable",
          description: "Le service demande est introuvable.",
          canonicalPath: "/services",
          robots: "noindex, follow",
        },
  );

  if (!service) {
    return <NotFound />;
  }

  return (
    <Layout>
      <PageHero title={service.title} subtitle={service.heroSubtitle} backgroundImage={service.imageSrc} />

      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 left-[8%] h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 right-[10%] h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="container relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <article className="space-y-6">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl border p-6 shadow-sm">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-accent-foreground">
                <service.icon className="h-4 w-4" />
                <span className="text-xs font-semibold">Service dedie</span>
              </div>
              <h3 className="font-heading font-bold text-2xl mb-3">Ce service en detail</h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {service.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-sm rounded-2xl border p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-xl mb-4">Points cles</h3>
              <ul className="space-y-3">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="bg-card/95 backdrop-blur-sm rounded-2xl border p-6 shadow-lg h-fit lg:sticky lg:top-24">
            <h3 className="font-heading font-semibold text-xl mb-2">Reserver ce service</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Contactez la centrale pour planifier votre course ou obtenir une estimation rapide.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <a href={`tel:${CONTACT_PHONE_LINK}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Nous contacter</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/services">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux services
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
