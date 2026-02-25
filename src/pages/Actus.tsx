import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Facebook, Instagram, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/hooks/use-seo";
import {
  ACTUS_API_URL,
  ACTUS_UPLOAD_API_URL,
  ADMIN_API_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PRIMARY_DOMAIN,
} from "@/config/site";

type SocialSource = "Instagram" | "Facebook";

type NewsCard = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  sourceName: SocialSource;
  created_at?: string;
};

type SessionResponse = {
  success?: boolean;
  authenticated?: boolean;
  username?: string;
  error?: string;
};

type NewsResponse = {
  success?: boolean;
  items?: NewsCard[];
  item?: NewsCard;
  error?: string;
};

const STORAGE_KEY = "taxi-le-havre-news-cards";
const JSON_ACCEPT_HEADERS = { Accept: "application/json" } as const;
const JSON_REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

const socialProfiles: Array<{ href: string; label: string; handle: string; icon: LucideIcon }> = [
  { href: INSTAGRAM_URL, label: "Instagram", handle: "@lehavretaxi", icon: Instagram },
  { href: FACEBOOK_URL, label: "Facebook", handle: "@taxilehavre", icon: Facebook },
];

const defaultCards: NewsCard[] = [
  {
    id: "instagram-1",
    title: "Publication Instagram",
    image: "/images/actus-instagram-1.webp",
    sourceUrl: INSTAGRAM_URL,
    sourceName: "Instagram",
  },
  {
    id: "facebook-1",
    title: "Publication Facebook",
    image: "/images/actus-facebook-1.webp",
    sourceUrl: FACEBOOK_URL,
    sourceName: "Facebook",
  },
];

const isHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const isWebpImageReference = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return false;
  }

  const normalized = trimmed.split("?")[0].split("#")[0].toLowerCase();
  return normalized.endsWith(".webp");
};

type ActusProps = {
  adminMode?: boolean;
};

const Actus = ({ adminMode = false }: ActusProps) => {
  const [cards, setCards] = useState<NewsCard[]>(defaultCards);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState(INSTAGRAM_URL);
  const [sourceName, setSourceName] = useState<SocialSource>("Instagram");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const actusSEO = useMemo(
    () =>
      adminMode
        ? {
            title: "Gestion des actus",
            description: "Interface d'administration des actualités Radio Taxi Le Havre.",
            canonicalPath: "/gestion-actus",
            robots: "noindex, nofollow",
            ogImage: "/images/home-catene.webp",
            keywords: ["gestion actus taxi le havre", "admin actus taxi le havre"],
            breadcrumbs: false as const,
          }
        : {
            title: "Actus",
            description:
              "Retrouvez les actualités Radio Taxi Le Havre publiées depuis Instagram et Facebook.",
            canonicalPath: "/actus",
            ogImage: "/images/home-catene.webp",
            keywords: [
              "actualités taxi le havre",
              "instagram taxi le havre",
              "facebook taxi le havre",
              "infos circulation le havre taxi",
            ],
            structuredData: {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Actualités Taxi Le Havre",
              url: `${PRIMARY_DOMAIN}/actus`,
              inLanguage: "fr-FR",
            },
          },
    [adminMode],
  );

  useSEO(actusSEO);

  const manualCardsCount = useMemo(() => cards.filter((card) => card.id.startsWith("manual-")).length, [cards]);

  const requireAdmin = (message: string) => {
    if (isAdmin) {
      return true;
    }

    setStatusMessage(message);
    return false;
  };

  const resetPublishForm = () => {
    setTitle("");
    setImage("");
    setSourceUrl(INSTAGRAM_URL);
    setSourceName("Instagram");
  };

  const loadCards = async () => {
    setIsLoadingCards(true);

    try {
      const response = await fetch(ACTUS_API_URL, {
        headers: JSON_ACCEPT_HEADERS,
        credentials: "same-origin",
      });
      const result = (await response.json()) as NewsResponse;

      if (response.ok && result?.success === true && Array.isArray(result.items)) {
        const merged = result.items.length > 0 ? result.items : defaultCards;
        setCards(merged);
        return;
      }

      throw new Error(result?.error || "Unable to load news");
    } catch {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setCards(defaultCards);
        setIsLoadingCards(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as NewsCard[];
        setCards(Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCards);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setCards(defaultCards);
      }
    } finally {
      setIsLoadingCards(false);
    }
  };

  const refreshSession = async () => {
    try {
      const response = await fetch(ADMIN_API_URL, {
        headers: JSON_ACCEPT_HEADERS,
        credentials: "same-origin",
      });

      const result = (await response.json()) as SessionResponse;
      if (response.ok && result?.success === true && result.authenticated) {
        setIsAdmin(true);
        setAdminUsername(result.username || "admin");
        return;
      }
    } catch {
      // Ignore session fetch issues in UI.
    }

    setIsAdmin(false);
    setAdminUsername("");
  };

  useEffect(() => {
    void Promise.all([loadCards(), refreshSession()]);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setStatusMessage("Renseignez l'identifiant et le mot de passe.");
      return;
    }

    setIsAuthLoading(true);

    try {
      const response = await fetch(ADMIN_API_URL, {
        method: "POST",
        headers: JSON_REQUEST_HEADERS,
        credentials: "same-origin",
        body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword }),
      });

      const result = (await response.json()) as SessionResponse;
      if (!response.ok || result?.success !== true || !result.authenticated) {
        setStatusMessage(result?.error || "Connexion admin impossible.");
        return;
      }

      setIsAdmin(true);
      setAdminUsername(result.username || loginUsername.trim());
      setLoginPassword("");
      setStatusMessage("Connexion admin active.");
    } catch {
      setStatusMessage("Erreur réseau pendant la connexion admin.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setStatusMessage("");

    try {
      await fetch(ADMIN_API_URL, {
        method: "DELETE",
        headers: JSON_ACCEPT_HEADERS,
        credentials: "same-origin",
      });
    } catch {
      // Ignore network failure; local state still resets.
    }

    setIsAdmin(false);
    setAdminUsername("");
    setStatusMessage("Session admin fermée.");
  };

  const uploadSelectedImage = async () => {
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour téléverser une image.")) {
      return;
    }

    if (!uploadFile) {
      setStatusMessage("Sélectionnez une image à téléverser.");
      return;
    }

    if (uploadFile.type && uploadFile.type !== "image/webp") {
      setStatusMessage("Format non supporté. Téléversez une image WebP.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", uploadFile);

      const response = await fetch(ACTUS_UPLOAD_API_URL, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      const result = (await response.json()) as { success?: boolean; url?: string; error?: string };
      if (!response.ok || result?.success !== true || !result.url) {
        setStatusMessage(result?.error || "Téléversement impossible.");
        return;
      }

      setImage(result.url);
      setUploadFile(null);
      setStatusMessage("Image téléversée. URL renseignée automatiquement.");
    } catch {
      setStatusMessage("Erreur réseau pendant le téléversement.");
    } finally {
      setIsUploading(false);
    }
  };

  const addCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour publier une capture.")) {
      return;
    }

    if (!title.trim() || !image.trim() || !sourceUrl.trim()) {
      setStatusMessage("Titre, image et lien source sont obligatoires.");
      return;
    }

    if (!isHttpUrl(sourceUrl.trim())) {
      setStatusMessage("Lien source invalide. Utilisez une URL http(s).");
      return;
    }

    if (!image.trim().startsWith("/") && !isHttpUrl(image.trim())) {
      setStatusMessage("Image invalide. Utilisez une URL http(s) ou un chemin /uploads/... ou /images/...");
      return;
    }

    if (!isWebpImageReference(image)) {
      setStatusMessage("Image invalide. Utilisez une image au format .webp.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      image: image.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceName,
    };

    try {
      const response = await fetch(ACTUS_API_URL, {
        method: "POST",
        headers: JSON_REQUEST_HEADERS,
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as NewsResponse;
      if (!response.ok || result?.success !== true || !result.item) {
        setStatusMessage(result?.error || "Publication impossible.");
        return;
      }

      setCards((previous) => [result.item as NewsCard, ...previous]);
      resetPublishForm();
      setStatusMessage("Capture publiée.");
    } catch {
      setStatusMessage("Erreur réseau pendant la publication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCard = async (id: string, askConfirmation = true) => {
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour supprimer une capture.")) {
      return;
    }

    if (askConfirmation && !window.confirm("Confirmer la suppression de cette capture ?")) {
      return;
    }

    try {
      const response = await fetch(ACTUS_API_URL, {
        method: "DELETE",
        headers: JSON_REQUEST_HEADERS,
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });

      const result = (await response.json()) as NewsResponse;
      if (!response.ok || result?.success !== true || !Array.isArray(result.items)) {
        setStatusMessage(result?.error || "Suppression impossible.");
        return;
      }

      setCards(result.items as NewsCard[]);
      setStatusMessage("Capture supprimée.");
    } catch {
      setStatusMessage("Erreur réseau pendant la suppression.");
    }
  };

  const resetCards = async () => {
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour réinitialiser.")) {
      return;
    }

    const manualCards = cards.filter((card) => card.id.startsWith("manual-"));
    if (manualCards.length === 0) {
      setStatusMessage("Aucune capture manuelle à supprimer.");
      return;
    }

    for (const card of manualCards) {
      await removeCard(card.id, false);
    }

    await loadCards();
    setStatusMessage("Captures manuelles réinitialisées.");
  };

  return (
    <Layout>
      <PageHero
        title="Actualités"
        subtitle="Les dernières infos du groupement, en provenance de nos réseaux sociaux."
        backgroundImage="/images/home-catene.webp"
      />

      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {socialProfiles.map((profile) => (
              <a
                key={profile.label}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border bg-card px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <profile.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                    {profile.label}
                  </span>
                  <span className="block truncate font-heading font-semibold">
                    {profile.handle}
                  </span>
                </span>
              </a>
            ))}
          </div>

          {!adminMode && (
            <div className="actus-anniversary-banner relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-black p-6 text-white shadow-[0_20px_45px_-28px_rgba(0,0,0,0.7)]">
              <span className="actus-anniversary-shimmer" aria-hidden="true" />
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Anniversaire
              </p>
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="actus-anniversary-title font-heading text-4xl font-extrabold leading-none md:text-6xl">
                  50 Ans
                </p>
                <p className="pb-1 text-sm font-medium text-white/75 md:text-base">
                  1976-2026
                </p>
              </div>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Radio Taxi Le Havre
              </p>
            </div>
          )}

          {isLoadingCards ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-card border rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="w-full h-44 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="bg-card border rounded-xl p-8 text-center mb-10">
              <p className="font-heading font-semibold">Aucune actualité publiée pour le moment.</p>
              <p className="text-sm text-muted-foreground mt-2">
                {adminMode
                  ? "Connectez-vous en admin pour publier une actu."
                  : "Retrouvez aussi nos dernières infos sur Facebook et Instagram."}
              </p>
            </div>
          ) : (
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
                      Voir sur {card.sourceName}
                    </a>
                    {adminMode && isAdmin && (
                      <div className="mt-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => removeCard(card.id)}>
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {adminMode && (
            <div className="bg-muted rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <h2 className="font-heading font-bold text-xl">Gestion des actus</h2>
                {isAdmin ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Connecté : {adminUsername}</span>
                    <Button type="button" variant="outline" onClick={handleLogout} disabled={isAuthLoading}>
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Connexion admin requise pour ajouter ou supprimer une actu.</span>
                )}
              </div>

              {!isAdmin && (
                <form onSubmit={handleLogin} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-6">
                  <Input
                    value={loginUsername}
                    onChange={(event) => setLoginUsername(event.target.value)}
                    autoComplete="username"
                    placeholder="Identifiant admin"
                  />
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Mot de passe"
                  />
                  <Button type="submit" disabled={isAuthLoading}>
                    {isAuthLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              )}

              {isAdmin && (
                <form onSubmit={addCard} className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">Titre</Label>
                      <Input
                        id="news-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ex: Info circulation week-end"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-source-name">Réseau</Label>
                      <select
                        id="news-source-name"
                        value={sourceName}
                        onChange={(event) => setSourceName(event.target.value as SocialSource)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-image">URL image</Label>
                      <Input
                        id="news-image"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                        placeholder="/uploads/actus/... .webp ou https://... .webp"
                        required
                      />
                    </div>
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
                  </div>

                  <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="news-image-file">Téléverser une image</Label>
                      <Input
                        id="news-image-file"
                        type="file"
                        accept="image/webp"
                        onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={uploadSelectedImage} disabled={isUploading || !uploadFile}>
                      {isUploading ? "Téléversement..." : "Téléverser"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Publication..." : "Ajouter la capture"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetCards}>
                      Réinitialiser les captures manuelles ({manualCardsCount})
                    </Button>
                  </div>
                </form>
              )}

              {statusMessage && <p className="text-sm text-primary mt-4">{statusMessage}</p>}
              <p className="text-xs text-muted-foreground mt-4">
                Les actus sont gérées via `api/news.php`, l'authentification via `api/admin.php` et les images via `api/upload.php`.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Actus;
