import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  Facebook,
  ImagePlus,
  Instagram,
  Loader2,
  ShieldCheck,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSEO } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
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

type SocialProfile = {
  href: string;
  label: string;
  handle: string;
  description: string;
  icon: LucideIcon;
  surfaceClass: string;
  iconClass: string;
  chipClass: string;
};

const STORAGE_KEY = "taxi-le-havre-news-cards";
const JSON_ACCEPT_HEADERS = { Accept: "application/json" } as const;
const JSON_REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

const socialProfiles: SocialProfile[] = [
  {
    href: INSTAGRAM_URL,
    label: "Instagram",
    handle: "@lehavretaxi",
    description: "Captures terrain, coulisses et infos utiles du groupement publiées dans un format rapide à lire.",
    icon: Instagram,
    surfaceClass: "from-rose-50 via-white to-amber-50",
    iconClass: "bg-slate-950 text-white",
    chipClass: "bg-rose-500/10 text-rose-700",
  },
  {
    href: FACEBOOK_URL,
    label: "Facebook",
    handle: "@TaxiLeHavre",
    description: "Communiqués, relais de service et temps forts du réseau centralisés en un seul point d'accès.",
    icon: Facebook,
    surfaceClass: "from-sky-50 via-white to-cyan-50",
    iconClass: "bg-[#1877F2] text-white",
    chipClass: "bg-sky-500/10 text-sky-700",
  },
];

const sourceAppearance: Record<
  SocialSource,
  {
    icon: LucideIcon;
    badgeClass: string;
    summary: string;
  }
> = {
  Instagram: {
    icon: Instagram,
    badgeClass: "border-rose-200/80 bg-rose-50 text-rose-700",
    summary: "Visuels, alertes terrain et coulisses relayés depuis Instagram pour une lecture immédiate.",
  },
  Facebook: {
    icon: Facebook,
    badgeClass: "border-sky-200/80 bg-sky-50 text-sky-700",
    summary: "Annonces réseau, rappels utiles et publications de service relayés depuis Facebook.",
  },
};

const defaultCards: NewsCard[] = [
  {
    id: "instagram-1",
    title: "BÉTON LE HAVRE 2025",
    image: "/images/actus-instagram-1.webp",
    sourceUrl: INSTAGRAM_URL,
    sourceName: "Instagram",
  },
  {
    id: "facebook-1",
    title: "Profil Facebook TaxiLeHavre",
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

const formatPublishedDate = (value?: string) => {
  if (!value) {
    return "Mise à jour récente";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Mise à jour récente";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
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
              "actualites taxi le havre",
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

  const manualCardsCount = useMemo(
    () => cards.filter((card) => card.id.startsWith("manual-")).length,
    [cards],
  );

  const latestCard = cards[0] ?? null;
  const secondaryCards = cards.slice(1);
  const sourceCount = useMemo(() => {
    const count = new Set(cards.map((card) => card.sourceName)).size;
    return count > 0 ? count : socialProfiles.length;
  }, [cards]);
  const latestPublishedLabel = useMemo(
    () => formatPublishedDate(latestCard?.created_at),
    [latestCard?.created_at],
  );
  const isStatusPositive = /active|fermée|publiée|supprimée|réinitialisées|téléversée/i.test(statusMessage);

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
      setStatusMessage("Format non supporte. Televersez une image WebP.");
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
        title={adminMode ? "Gestion des Actus" : "Actualités"}
        subtitle={
          adminMode
            ? "Pilotez le flux social publié sur le site depuis une interface plus lisible et plus rapide à utiliser."
            : "Les dernières infos du groupement, rassemblées dans un feed plus clair depuis Instagram et Facebook."
        }
        backgroundImage="/images/home-catene.webp"
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_42%,#eef2ff_100%)] py-14 md:py-18">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_54%)]" />
        <div className="absolute -left-14 top-28 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />

        <div className="container relative max-w-6xl">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_-42px_rgba(15,23,42,0.38)] backdrop-blur md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_34%)]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Feed social
                </div>

                <h2 className="mt-5 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
                  Une page actus plus nette, plus éditoriale, plus simple à parcourir.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Toutes les publications utiles du groupement sont recentrées ici avec une hiérarchie claire:
                  une actu mise en avant, un feed plus propre et des accès directs vers nos réseaux.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Publications</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-slate-950">{cards.length}</p>
                    <p className="mt-1 text-sm text-slate-500">Cartes visibles dans le feed.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Réseaux</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-slate-950">{sourceCount}</p>
                    <p className="mt-1 text-sm text-slate-500">Sources reliées en un seul écran.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Dernière date</p>
                    <p className="mt-2 font-heading text-lg font-bold text-slate-950">{latestPublishedLabel}</p>
                    <p className="mt-1 text-sm text-slate-500">Repère rapide sur la fraîcheur du feed.</p>
                  </div>
                </div>

                {latestCard && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-950 px-4 py-3 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.75)]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                      <BadgeCheck className="h-3.5 w-3.5 text-amber-300" />
                      À la une
                    </div>
                    <p className="text-sm text-white/85 md:text-base">
                      <span className="font-semibold text-white">{latestCard.title}</span>
                      {" "}est actuellement la publication mise en avant.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {socialProfiles.map((profile) => (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group overflow-hidden rounded-[24px] border border-slate-200/80 bg-gradient-to-br p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]",
                    profile.surfaceClass,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]", profile.chipClass)}>
                        {profile.label}
                      </span>
                      <p className="mt-3 font-heading text-2xl font-bold text-slate-950">{profile.handle}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.description}</p>
                    </div>
                    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg", profile.iconClass)}>
                      <profile.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4 text-sm font-semibold text-slate-700">
                    <span>Voir le profil</span>
                    <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              ))}

              {!adminMode && (
                <div className="actus-anniversary-banner relative overflow-hidden rounded-[24px] border border-white/10 bg-black p-6 text-white shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
                  <span className="actus-anniversary-shimmer" aria-hidden="true" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Anniversaire</p>
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                    <p className="actus-anniversary-title font-heading text-4xl font-extrabold leading-none md:text-6xl">
                      50 Ans
                    </p>
                    <p className="pb-1 text-sm font-medium text-white/75 md:text-base">1976-2026</p>
                  </div>
                  <p className="mt-2 text-sm text-white/80 md:text-base">Radio Taxi Le Havre</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mur des publications</p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">Actualités à la une</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Un flux plus lisible, avec une carte principale pour la dernière actu et des accès directs vers la source.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                {latestPublishedLabel}
              </div>
            </div>

            {isLoadingCards ? (
              <div className="mt-6 space-y-5">
                <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_26px_70px_-42px_rgba(15,23,42,0.35)] animate-pulse">
                  <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.9fr)]">
                    <div className="min-h-[320px] bg-slate-200" />
                    <div className="space-y-4 p-6 md:p-8">
                      <div className="h-4 w-28 rounded-full bg-slate-200" />
                      <div className="h-10 rounded-2xl bg-slate-200" />
                      <div className="h-4 rounded-full bg-slate-200" />
                      <div className="h-4 w-5/6 rounded-full bg-slate-200" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="h-20 rounded-2xl bg-slate-200" />
                        <div className="h-20 rounded-2xl bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.35)] animate-pulse"
                    >
                      <div className="h-56 bg-slate-200" />
                      <div className="space-y-3 p-5">
                        <div className="h-4 w-24 rounded-full bg-slate-200" />
                        <div className="h-6 rounded-xl bg-slate-200" />
                        <div className="h-4 rounded-full bg-slate-200" />
                        <div className="h-10 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : cards.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white/85 p-10 text-center shadow-sm">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Camera className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-slate-950">
                  Aucune actualité publiée pour le moment.
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                  {adminMode
                    ? "Connectez-vous en admin pour publier une actu et remettre le feed en mouvement."
                    : "Retrouvez aussi nos dernières infos directement sur Instagram et Facebook en attendant la prochaine publication."}
                </p>

                {!adminMode && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {socialProfiles.map((profile) => (
                      <a
                        key={profile.label}
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                      >
                        <profile.icon className="h-4 w-4" aria-hidden="true" />
                        Voir {profile.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6">
                {latestCard && (
                  <article className="group overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_34px_90px_-45px_rgba(15,23,42,0.42)]">
                    <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
                      <div className="relative min-h-[320px] overflow-hidden bg-slate-950">
                        <img
                          src={latestCard.image}
                          alt={latestCard.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-sm">
                            <BadgeCheck className="h-3.5 w-3.5 text-amber-500" />
                            Dernière publication
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur",
                              sourceAppearance[latestCard.sourceName].badgeClass,
                            )}
                          >
                            {(() => {
                              const SourceIcon = sourceAppearance[latestCard.sourceName].icon;
                              return <SourceIcon className="h-3.5 w-3.5" aria-hidden="true" />;
                            })()}
                            {latestCard.sourceName}
                          </span>
                        </div>

                        <div className="absolute bottom-5 left-5 right-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">Feed principal</p>
                          <h3 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
                            {latestCard.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Publication mise en avant
                          </p>
                          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                            {sourceAppearance[latestCard.sourceName].summary}
                          </p>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Source</p>
                              <p className="mt-2 font-heading text-xl font-bold text-slate-950">
                                {latestCard.sourceName}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Publication</p>
                              <p className="mt-2 font-heading text-xl font-bold text-slate-950">
                                {formatPublishedDate(latestCard.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                          <a
                            href={latestCard.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                          >
                            Ouvrir sur {latestCard.sourceName}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>

                          {adminMode && isAdmin && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCard(latestCard.id)}
                              className="h-11 rounded-full border-slate-200 px-4 text-slate-700 hover:bg-slate-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {secondaryCards.length > 0 && (
                  <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {secondaryCards.map((card) => {
                      const sourceMeta = sourceAppearance[card.sourceName];
                      const SourceIcon = sourceMeta.icon;

                      return (
                        <article
                          key={card.id}
                          className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_22px_60px_-42px_rgba(15,23,42,0.38)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_-40px_rgba(15,23,42,0.42)]"
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

                            <div className="absolute left-4 top-4">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur",
                                  sourceMeta.badgeClass,
                                )}
                              >
                                <SourceIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                {card.sourceName}
                              </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                                {formatPublishedDate(card.created_at)}
                              </p>
                              <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-white">
                                {card.title}
                              </h3>
                            </div>
                          </div>

                          <div className="p-5">
                            <p className="text-sm leading-relaxed text-slate-600">{sourceMeta.summary}</p>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                              <a
                                href={card.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-primary"
                              >
                                Voir sur {card.sourceName}
                                <ArrowUpRight className="h-4 w-4" />
                              </a>

                              {adminMode && isAdmin && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCard(card.id)}
                                  className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </Button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {adminMode && (
            <div className="mt-14 overflow-hidden rounded-[30px] border border-slate-900/10 bg-slate-950 text-white shadow-[0_34px_90px_-42px_rgba(15,23,42,0.7)]">
              <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
                <div className="border-b border-white/10 p-6 md:p-8 xl:border-b-0 xl:border-r xl:border-white/10">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                      isAdmin
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-white/75",
                    )}
                  >
                    {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                  {isAdmin ? "Session active" : "Accès protégé"}
                  </div>

                  <h2 className="mt-4 font-heading text-2xl font-bold">Gestion des actus</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Ajoutez, téléversez et nettoyez les captures publiées sur le site sans perdre le contrôle du flux.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Actus visibles</p>
                      <p className="mt-2 font-heading text-2xl font-bold">{cards.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Captures manuelles</p>
                      <p className="mt-2 font-heading text-2xl font-bold">{manualCardsCount}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/70">Connecté : {adminUsername}</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isAuthLoading}
                        className="mt-4 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      >
                        Deconnexion
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} className="mt-6 grid gap-3">
                      <Input
                        value={loginUsername}
                        onChange={(event) => setLoginUsername(event.target.value)}
                        autoComplete="username"
                        placeholder="Identifiant admin"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                      />
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        autoComplete="current-password"
                        placeholder="Mot de passe"
                        className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                      />
                      <Button
                        type="submit"
                        disabled={isAuthLoading}
                        className="h-11 rounded-xl bg-white text-slate-950 hover:bg-white/90"
                      >
                        {isAuthLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connexion...
                          </>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                    </form>
                  )}

                  {statusMessage && (
                    <div
                      className={cn(
                        "mt-6 rounded-2xl border px-4 py-3 text-sm",
                        isStatusPositive
                          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                          : "border-amber-300/25 bg-amber-300/10 text-amber-100",
                      )}
                    >
                      {statusMessage}
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  {!isAdmin ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                        Workflow de publication
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-bold">Trois etapes pour alimenter le feed</h3>
                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <ShieldCheck className="h-5 w-5 text-emerald-300" />
                          <p className="mt-4 font-heading text-lg font-bold">1. Connexion</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Ouvrez une session admin pour activer les actions d'ajout et de suppression.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <ImagePlus className="h-5 w-5 text-amber-300" />
                          <p className="mt-4 font-heading text-lg font-bold">2. Visuel WebP</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Chargez une image ou renseignez directement son URL pour préparer la carte.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <Sparkles className="h-5 w-5 text-sky-300" />
                          <p className="mt-4 font-heading text-lg font-bold">3. Publication</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Titre, source, lien: la carte part en tête du feed dès qu'elle est validée.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={addCard} className="grid gap-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                          Publication
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold">Composer une nouvelle actu</h3>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="space-y-2">
                            <Label htmlFor="news-title" className="text-white/80">Titre</Label>
                            <Input
                              id="news-title"
                              value={title}
                              onChange={(event) => setTitle(event.target.value)}
                              placeholder="Ex: Info circulation week-end"
                              required
                              className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                            />
                          </div>

                          <div className="mt-4 space-y-2">
                            <Label htmlFor="news-source-name" className="text-white/80">Réseau</Label>
                            <select
                              id="news-source-name"
                              value={sourceName}
                              onChange={(event) => setSourceName(event.target.value as SocialSource)}
                              className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-white outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10"
                            >
                              <option value="Instagram">Instagram</option>
                              <option value="Facebook">Facebook</option>
                            </select>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="space-y-2">
                            <Label htmlFor="news-image" className="text-white/80">URL image</Label>
                            <Input
                              id="news-image"
                              value={image}
                              onChange={(event) => setImage(event.target.value)}
                              placeholder="/uploads/actus/... .webp ou https://... .webp"
                              required
                              className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                            />
                          </div>

                          <div className="mt-4 space-y-2">
                            <Label htmlFor="news-source-url" className="text-white/80">Lien source</Label>
                            <Input
                              id="news-source-url"
                              type="url"
                              value={sourceUrl}
                              onChange={(event) => setSourceUrl(event.target.value)}
                              placeholder="https://www.instagram.com/..."
                              required
                              className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <div className="space-y-2">
                            <Label htmlFor="news-image-file" className="text-white/80">Téléverser une image</Label>
                            <Input
                              id="news-image-file"
                              type="file"
                              accept="image/webp"
                              onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                              className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white file:text-white placeholder:text-white/35 focus-visible:ring-white/20"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={uploadSelectedImage}
                          disabled={isUploading || !uploadFile}
                          className="h-11 rounded-xl border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Téléversement...
                            </>
                          ) : (
                            <>
                              <ImagePlus className="h-4 w-4" />
                              Téléverser
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-white text-slate-950 hover:bg-white/90">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Publication...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Ajouter la capture
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetCards}
                          className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          Réinitialiser les captures manuelles ({manualCardsCount})
                        </Button>
                      </div>
                    </form>
                  )}

                  <p className="mt-6 text-xs leading-relaxed text-white/40">
                    Les actus sont gérées via `api/news.php`, l'authentification via `api/admin.php` et les images via `api/upload.php`.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Actus;
