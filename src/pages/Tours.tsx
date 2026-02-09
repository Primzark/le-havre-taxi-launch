import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";

export const toursData = [
  { id: 1, name: "Le Havre", duration: "1h30", price: 80 },
  { id: 2, name: "Etretat", duration: "3h00", price: 170 },
  { id: 3, name: "Beautiful Normandie", duration: "8h00", price: 380 },
  { id: 4, name: "The Mont Saint Michel", duration: "10h00", price: 550 },
  { id: 5, name: "Honfleur", duration: "3h00", price: 140 },
  { id: 6, name: "Rouen", duration: "6h00", price: 360 },
  { id: 7, name: "Giverny", duration: "6h00", price: 420 },
  { id: 8, name: "La côte d'Albâtre, Bénédictine Museum", duration: "4h00", price: 250 },
  { id: 9, name: "La côte Fleurie", duration: "5h00", price: 250 },
  { id: 10, name: "The Landing Beaches", duration: "8h00", price: 550 },
  { id: 11, name: 'Paris "Ville Lumière"', duration: "10h00", price: 580 },
  { id: 12, name: "The Palace of Versailles", duration: "8h00", price: 500 },
  { id: 13, name: "Lisieux", duration: "6h00", price: 350 },
];

const Tours = () => {
  return (
    <Layout>
      <PageHero title="Circuits touristiques" subtitle="13 circuits découverte pour explorer la Normandie et au-delà." />

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toursData.map((tour) => (
              <Link
                key={tour.id}
                to={`/circuits-touristiques/${tour.id}`}
                className="group bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">[Image du circuit]</span>
                </div>
                <div className="p-5">
                  <h2 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                    N°{tour.id} — {tour.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">Durée : {tour.duration}</p>
                  <p className="font-heading font-bold text-primary text-xl">{tour.price} €</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-sm text-center mt-10 max-w-2xl mx-auto">
            Price for 1 to 4 people, excluding additional costs (additional passengers and luggage). Museum entrance fees, meals, etc. are not included in the price.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
