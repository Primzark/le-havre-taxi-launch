export type ClientReview = {
  id: string;
  source: string;
  author: string;
  quote: string;
  avatar: string;
};

export const clientReviews: ClientReview[] = [
  {
    id: "camille-lucas",
    source: "Avis Google",
    author: "Camille Lucas",
    quote:
      "Le chauffeur est arrivé à l'heure! Très agréable et polis à la discussion. Très serviable, j'étais en béquilles avec des difficultés à marcher et le chauffeur m'a aidé avec mes sacs. Je recommande là 100%.",
    avatar: "/images/reviews/camille-lucas.png",
  },
  {
    id: "niels",
    source: "Avis Google",
    author: "Niels",
    quote:
      "Très bien, demande au dernier moment et pourtant ponctuel et efficace, prix raisonnable Merci",
    avatar: "/images/reviews/niels.png",
  },
  {
    id: "raph-lm",
    source: "Avis Google",
    author: "Raph LM",
    quote:
      "J'ai appelé à minuit pour réserver un taxi à 6h15 le lendemain. Tout simplement parfait, à l'heure!",
    avatar: "/images/reviews/raph-lm.png",
  },
  {
    id: "duriezjeanmichel",
    source: "Pages Jaunes",
    author: "duriezjeanmichel",
    quote:
      "Service parfait ! J'ai commandé un taxi le 1er janvier à 10h et il était devant chez moi 5 minutes après. Le chauffeur était très sympathique.",
    avatar: "/images/reviews/duriezjeanmichel.png",
  },
  {
    id: "jeani-a",
    source: "TripAdVisor",
    author: "Jeani A",
    quote: "Wonderful driver made a wonderful day !",
    avatar: "/images/reviews/jeani-a.png",
  },
  {
    id: "jordanam227",
    source: "TripAdvisor",
    author: "Jordanam227",
    quote:
      "Excellent company, this company is very good service on time pickup and driver very professorial cab need and clean best price",
    avatar: "/images/reviews/jordanam227.png",
  },
];
