import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/hooks/use-seo";
import { ACTUS_API_URL, FACEBOOK_URL, INSTAGRAM_URL } from "@/config/site";

type NewsCard = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  sourceName: "Instagram" | "Facebook";
};

const STORAGE_KEY = "taxi-le-havre-news-cards";
const STORAGE_TOKEN_KEY = "taxi-le-havre-actus-admin-token";

const defaultCards: NewsCard[] = [
  {
    id: "instagram-1",
    title: "Capture Instagram",
    image: "/images/actus-instagram-1.jpg",
    sourceUrl: INSTAGRAM_URL,
    sourceName: "Instagram",
  },
  {
    id: "facebook-1",
    title: "Capture Facebook",
    image: "/images/actus-facebook-1.png",
    sourceUrl: FACEBOOK_URL,
    sourceName: "Facebook",
  },
  {
    id: "instagram-2",
    title: "Capture Instagram",
    image: "/images/actus-instagram-2.png",
    sourceUrl: INSTAGRAM_URL,
    sourceName: "Instagram",
  },
];

const Actus = () => {
  const [cards, setCards] = useState<NewsCard[]>(defaultCards);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState(INSTAGRAM_URL);
  const [sourceName, setSourceName] = useState<"Instagram" | "Facebook">("Instagram");
  const [adminToken, setAdminToken] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useSEO({
    title: "Actus",
    description:
      "Actualités Taxi Le Havre: captures Facebook et Instagram, mises à jour manuelles possibles directement depuis la page.",
    canonicalPath: "/actus",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(ACTUS_API_URL, {
          headers: { Accept: "application/json" },
        });
        const result = await response.json();
        if (response.ok && result?.success === true && Array.isArray(result.items) && result.items.length > 0) {
          setCards(result.items);
          return;
        }
      } catch {
        // Fallback below.
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      try {
        const parsed = JSON.parse(raw) as NewsCard[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    setAdminToken(sessionStorage.getItem(STORAGE_TOKEN_KEY) ?? "");
    void load();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !image.trim() || !sourceUrl.trim()) {
      return;
    }

    if (!adminToken.trim()) {
      setStatusMessage("Saisissez le token admin pour publier une capture partagée.");
      return;
    }

    const payload = {
      title: title.trim(),
      image: image.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceName,
    };

    try {
      const response = await fetch(ACTUS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-Token": adminToken.trim(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || result?.success !== true || !result.item) {
        setStatusMessage(result?.error ?? "Publication impossible.");
        return;
      }

      setCards((previous) => [result.item as NewsCard, ...previous]);
      setTitle("");
      setImage("");
      setStatusMessage("Capture publiée.");
    } catch {
      setStatusMessage("Erreur réseau pendant la publication.");
    }
  };

  const removeCard = async (id: string) => {
    if (!adminToken.trim()) {
      setStatusMessage("Token admin requis pour supprimer une capture.");
      return;
    }

    try {
      const response = await fetch(ACTUS_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Admin-Token": adminToken.trim(),
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true || !Array.isArray(result.items)) {
        setStatusMessage(result?.error ?? "Suppression impossible.");
        return;
      }

      setCards(result.items as NewsCard[]);
      setStatusMessage("Capture supprimée.");
    } catch {
      setStatusMessage("Erreur réseau pendant la suppression.");
    }
  };

  const resetCards = async () => {
    if (!adminToken.trim()) {
      setStatusMessage("Token admin requis pour réinitialiser.");
      return;
    }

    const removables = cards.filter((card) => card.id.startsWith("manual-"));

    for (const card of removables) {
      await removeCard(card.id);
    }

    setCards(defaultCards);
    setStatusMessage("Réinitialisation locale effectuée.");
  };

  const saveAdminToken = () => {
    sessionStorage.setItem(STORAGE_TOKEN_KEY, adminToken.trim());
    setStatusMessage("Token admin sauvegardé pour cette session.");
  };

  return (
    <Layout>
      <PageHero title="Actualités" subtitle="Retrouvez nos dernières nouvelles et événements." />

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-card border rounded-lg px-4 py-2 font-heading font-semibold hover:shadow-md transition">
              Instagram @lehavretaxi
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-card border rounded-lg px-4 py-2 font-heading font-semibold hover:shadow-md transition">
              Facebook @taxilehavre
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {cards.map((card) => (
              <article key={card.id} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <img src={card.image} alt={card.title} className="w-full h-44 object-cover" loading="lazy" />
                <div className="p-4">
                  <p className="font-heading font-semibold mb-2">{card.title}</p>
                  <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Source: {card.sourceName}
                  </a>
                  <div className="mt-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeCard(card.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-muted rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-heading font-bold text-xl">Mettre à jour les actus (captures écran)</h2>
              <Button type="button" variant="outline" onClick={() => setIsAdminOpen((prev) => !prev)}>
                {isAdminOpen ? "Masquer admin" : "Ouvrir admin"}
              </Button>
            </div>

            {isAdminOpen && (
              <div className="border rounded-lg bg-card p-4 mb-4">
                <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="admin-token">Token admin</Label>
                    <Input
                      id="admin-token"
                      type="password"
                      value={adminToken}
                      onChange={(event) => setAdminToken(event.target.value)}
                      placeholder="Token ACTUS_ADMIN_TOKEN"
                    />
                  </div>
                  <Button type="button" onClick={saveAdminToken}>Sauvegarder</Button>
                </div>
              </div>
            )}

            <form onSubmit={addCard} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="news-title">Titre</Label>
                  <Input
                    id="news-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex: Capture Instagram du jour"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-image">URL de la capture</Label>
                  <Input
                    id="news-image"
                    type="url"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="news-source-url">Lien source</Label>
                  <Input
                    id="news-source-url"
                    type="url"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder="https://www.instagram.com/..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-source-name">Réseau</Label>
                  <select
                    id="news-source-name"
                    value={sourceName}
                    onChange={(event) => setSourceName(event.target.value as "Instagram" | "Facebook")}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">Ajouter la capture</Button>
                <Button type="button" variant="outline" onClick={resetCards}>Réinitialiser les captures</Button>
              </div>
            </form>
            {statusMessage && <p className="text-xs text-primary mt-3">{statusMessage}</p>}
            <p className="text-xs text-muted-foreground mt-4">
              Les captures sont partagées via l'API `api/news.php`. En secours, le cache navigateur est utilisé.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Actus;
