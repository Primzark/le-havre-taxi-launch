import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ACTUS_API_URL,
  ACTUS_UPLOAD_API_URL,
  ADMIN_API_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PRIMARY_DOMAIN,
} from "@/config/site";
import { useSEO } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Camera,
  Eye,
  Facebook,
  Filter,
  FolderKanban,
  ImagePlus,
  Instagram,
  LayoutDashboard,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

type SocialSource = "Instagram" | "Facebook";
type FeedFilter = "Tous" | SocialSource | "Manuelles";
type AdminSection = "overview" | "compose" | "board";

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
  badgeClass: string;
  iconClass: string;
};

type SourceAppearance = {
  icon: LucideIcon;
  badgeClass: string;
  summary: string;
  laneClass: string;
  buttonClass: string;
};

type AdminBoardColumn = {
  id: string;
  label: string;
  description: string;
  cards: NewsCard[];
  accentClass: string;
  emptyMessage: string;
};

type MetricCardProps = {
  eyebrow: string;
  value: string | number;
  caption: string;
  valueClassName?: string;
  className?: string;
};

type FilterChipProps = {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
};

type FeedCardProps = {
  card: NewsCard;
  index: number;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
};

type KanbanCardProps = {
  card: NewsCard;
  onPreview: (card: NewsCard) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
};

type ActusProps = {
  adminMode?: boolean;
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
    description: "Coulisses terrain, événements du Havre et prises de parole courtes publiées en direct.",
    icon: Instagram,
    surfaceClass: "from-rose-50 via-white to-amber-50",
    badgeClass: "bg-rose-500/10 text-rose-700",
    iconClass: "bg-slate-950 text-white",
  },
  {
    href: FACEBOOK_URL,
    label: "Facebook",
    handle: "@TaxiLeHavre",
    description: "Relais de service, annonces du réseau et publications utiles regroupées dans le même flux.",
    icon: Facebook,
    surfaceClass: "from-sky-50 via-white to-cyan-50",
    badgeClass: "bg-sky-500/10 text-sky-700",
    iconClass: "bg-[#1877F2] text-white",
  },
];

const sourceAppearance: Record<SocialSource, SourceAppearance> = {
  Instagram: {
    icon: Instagram,
    badgeClass: "border-rose-200/80 bg-rose-50 text-rose-700",
    summary: "Visuels, alertes terrain et coulisses remontés depuis Instagram pour un balayage plus rapide.",
    laneClass: "from-rose-500/15 via-transparent to-transparent",
    buttonClass: "border-rose-200/80 bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  Facebook: {
    icon: Facebook,
    badgeClass: "border-sky-200/80 bg-sky-50 text-sky-700",
    summary: "Communiqués du réseau et rappels utiles relayés depuis Facebook dans un format plus éditorial.",
    laneClass: "from-sky-500/15 via-transparent to-transparent",
    buttonClass: "border-sky-200/80 bg-sky-50 text-sky-700 hover:bg-sky-100",
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

const feedSpanPattern = [
  "md:col-span-2 md:row-span-3",
  "md:row-span-2",
  "md:row-span-2",
  "xl:col-span-2 md:row-span-2",
  "md:row-span-3",
  "md:col-span-2 md:row-span-2",
] as const;

const isManualCard = (card: NewsCard) => card.id.startsWith("manual-");

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

const MetricCard = ({ eyebrow, value, caption, valueClassName, className }: MetricCardProps) => (
  <div className={cn("rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-sm", className)}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
    <p className={cn("mt-3 font-heading text-3xl font-extrabold text-slate-950", valueClassName)}>{value}</p>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">{caption}</p>
  </div>
);

const FilterChip = ({ label, count, isActive, onClick }: FilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex shrink-0 items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300",
      isActive
        ? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.65)]"
        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950",
    )}
  >
    <span>{label}</span>
    <span
      className={cn(
        "inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs",
        isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500",
      )}
    >
      {count}
    </span>
  </button>
);

const FeedCard = ({ card, index, onDelete, showDelete = false }: FeedCardProps) => {
  const sourceMeta = sourceAppearance[card.sourceName];
  const SourceIcon = sourceMeta.icon;

  return (
    <article
      className={cn(
        "group relative isolate flex h-full min-h-[290px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_90px_-42px_rgba(15,23,42,0.62)] md:min-h-0",
        feedSpanPattern[index % feedSpanPattern.length],
      )}
    >
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.1)_0%,rgba(2,6,23,0.58)_55%,rgba(2,6,23,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_22%)] opacity-70 transition duration-500 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
              <SourceIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {card.sourceName}
            </span>
            {isManualCard(card) && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                Manuel
              </span>
            )}
          </div>

          {showDelete && onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete(card.id)}
              className="h-9 rounded-full border-white/20 bg-white/10 px-3 text-white hover:bg-white/20 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
            {formatPublishedDate(card.created_at)}
          </p>
          <h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-white md:text-[2rem]">
            {card.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/78 md:text-base">{sourceMeta.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-slate-100"
            >
              Voir sur {card.sourceName}
              <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

const KanbanCard = ({ card, onPreview, onDelete, showDelete = false }: KanbanCardProps) => {
  const sourceMeta = sourceAppearance[card.sourceName];
  const SourceIcon = sourceMeta.icon;

  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
      <div className="relative overflow-hidden rounded-[20px]">
        <img src={card.image} alt={card.title} loading="lazy" className="h-44 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur",
              sourceMeta.badgeClass,
            )}
          >
            <SourceIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {card.sourceName}
          </span>
          {isManualCard(card) && (
            <span className="inline-flex rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Manuel
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {formatPublishedDate(card.created_at)}
          </p>
          <h3 className="mt-2 font-heading text-xl font-bold leading-tight text-white">{card.title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{sourceMeta.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPreview(card)}
          className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>
        <Button variant="outline" size="sm" asChild className={cn("rounded-full", sourceMeta.buttonClass)}>
          <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="h-4 w-4" />
            Source
          </a>
        </Button>
        {showDelete && onDelete && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(card.id)}
            className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        )}
      </div>
    </article>
  );
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
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("Tous");
  const [activeAdminSection, setActiveAdminSection] = useState<AdminSection>("overview");
  const [previewCard, setPreviewCard] = useState<NewsCard | null>(null);

  const deferredFilter = useDeferredValue(activeFilter);

  const actusSEO = useMemo(
    () =>
      adminMode
        ? {
            title: "Gestion des actus",
            description: "Dashboard d'administration des actualités Radio Taxi Le Havre.",
            canonicalPath: "/gestion-actus",
            robots: "noindex, nofollow",
            ogImage: "/images/home-catene.webp",
            keywords: ["gestion actus taxi le havre", "dashboard actus taxi le havre"],
            breadcrumbs: false as const,
          }
        : {
            title: "Actus",
            description:
              "Retrouvez les actualités Radio Taxi Le Havre publiées depuis Instagram et Facebook dans un feed plus éditorial.",
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

  const latestCard = cards[0] ?? null;
  const manualCardsCount = useMemo(
    () => cards.filter((card) => isManualCard(card)).length,
    [cards],
  );
  const instagramCount = useMemo(
    () => cards.filter((card) => card.sourceName === "Instagram").length,
    [cards],
  );
  const facebookCount = useMemo(
    () => cards.filter((card) => card.sourceName === "Facebook").length,
    [cards],
  );
  const sourceCount = useMemo(() => {
    const count = new Set(cards.map((card) => card.sourceName)).size;
    return count > 0 ? count : socialProfiles.length;
  }, [cards]);
  const latestPublishedLabel = useMemo(
    () => formatPublishedDate(latestCard?.created_at),
    [latestCard?.created_at],
  );
  const isStatusPositive = /active|fermée|publiée|supprimée|réinitialisées|téléversée/i.test(statusMessage);

  const filteredCards = useMemo(() => {
    switch (deferredFilter) {
      case "Instagram":
        return cards.filter((card) => card.sourceName === "Instagram");
      case "Facebook":
        return cards.filter((card) => card.sourceName === "Facebook");
      case "Manuelles":
        return cards.filter((card) => isManualCard(card));
      default:
        return cards;
    }
  }, [cards, deferredFilter]);

  const featuredCard = filteredCards[0] ?? null;
  const feedCards = useMemo(
    () => filteredCards.filter((card) => card.id !== featuredCard?.id),
    [featuredCard?.id, filteredCards],
  );

  const filterOptions = useMemo(
    () => [
      { label: "Tous", value: "Tous" as const, count: cards.length },
      { label: "Instagram", value: "Instagram" as const, count: instagramCount },
      { label: "Facebook", value: "Facebook" as const, count: facebookCount },
      { label: "Manuelles", value: "Manuelles" as const, count: manualCardsCount },
    ],
    [cards.length, facebookCount, instagramCount, manualCardsCount],
  );

  const adminBoardColumns = useMemo<AdminBoardColumn[]>(
    () => [
      {
        id: "featured",
        label: "A la une",
        description: "Publication qui porte l'ouverture de la page et la carte hero.",
        cards: latestCard ? [latestCard] : [],
        accentClass: "from-amber-500/20 via-white to-white",
        emptyMessage: "Le slot hero est vide pour le moment.",
      },
      {
        id: "instagram",
        label: "Instagram",
        description: "Flux visuel terrain, événements et prises de parole rapides.",
        cards: cards.filter((card) => card.sourceName === "Instagram" && card.id !== latestCard?.id),
        accentClass: "from-rose-500/20 via-white to-white",
        emptyMessage: "Aucune publication Instagram supplémentaire.",
      },
      {
        id: "facebook",
        label: "Facebook",
        description: "Communiqués de réseau et messages de service relayés sur Facebook.",
        cards: cards.filter((card) => card.sourceName === "Facebook" && card.id !== latestCard?.id),
        accentClass: "from-sky-500/20 via-white to-white",
        emptyMessage: "Aucune publication Facebook supplémentaire.",
      },
    ],
    [cards, latestCard],
  );

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
    setUploadFile(null);
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

  const handleAdminSectionChange = (section: AdminSection) => {
    setActiveAdminSection(section);

    const target = document.getElementById(`admin-${section}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFilterChange = (nextFilter: FeedFilter) => {
    startTransition(() => {
      setActiveFilter(nextFilter);
    });
  };

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
      setActiveAdminSection("board");
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
      setPreviewCard((current) => (current?.id === id ? null : current));
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

    const manualCards = cards.filter((card) => isManualCard(card));
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

  const openDraftPreview = () => {
    setPreviewCard({
      id: "draft-preview",
      title: title.trim() || "Capture en préparation",
      image:
        image.trim()
        || (sourceName === "Instagram" ? defaultCards[0].image : defaultCards[1].image),
      sourceUrl:
        sourceUrl.trim()
        || (sourceName === "Instagram" ? INSTAGRAM_URL : FACEBOOK_URL),
      sourceName,
      created_at: new Date().toISOString(),
    });
  };

  const previewSourceMeta = previewCard ? sourceAppearance[previewCard.sourceName] : null;
  const previewSourceIcon = previewCard ? previewSourceMeta?.icon : null;

  return (
    <Layout>
      <PageHero
        title={adminMode ? "Gestion des Actus" : "Actualités"}
        subtitle={
          adminMode
            ? "Un dashboard plus net pour piloter le feed social, surveiller l'état du flux et publier plus vite."
            : "Un flux social mis en scène comme un mini newsroom: hero éditorial, filtres collants et feed plus dense."
        }
        backgroundImage="/images/home-catene.webp"
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_38%,#eef2ff_100%)] py-14 md:py-18">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_52%)]" />
        <div className="absolute -left-14 top-28 h-56 w-56 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="container relative max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.92fr)]">
            <div className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-slate-950 shadow-[0_34px_100px_-48px_rgba(15,23,42,0.7)]">
              {featuredCard ? (
                <>
                  <img
                    src={featuredCard.image}
                    alt={featuredCard.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88)_12%,rgba(2,6,23,0.44)_44%,rgba(2,6,23,0.9)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_28%)]" />
                </>
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_48%,#020617_100%)]" />
              )}

              <div className="relative flex h-full min-h-[430px] flex-col justify-between p-6 md:p-8 xl:min-h-[480px] xl:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Featured hero
                  </span>
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                    {deferredFilter === "Tous" ? "Tout le feed" : deferredFilter}
                  </span>
                </div>

                <div className="mt-10 max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Actus en direct</p>
                  <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
                    {featuredCard ? featuredCard.title : "Le prochain message social apparaîtra ici."}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-white/78 md:text-lg">
                    {featuredCard
                      ? sourceAppearance[featuredCard.sourceName].summary
                      : "Le hero reste prêt à accueillir la prochaine publication relayée depuis Instagram ou Facebook."}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {featuredCard ? (
                      <>
                        <a
                          href={featuredCard.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                          Ouvrir sur {featuredCard.sourceName}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold backdrop-blur",
                            sourceAppearance[featuredCard.sourceName].badgeClass,
                          )}
                        >
                          {(() => {
                            const SourceIcon = sourceAppearance[featuredCard.sourceName].icon;
                            return <SourceIcon className="h-4 w-4" aria-hidden="true" />;
                          })()}
                          {formatPublishedDate(featuredCard.created_at)}
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white/80">
                        Feed en veille
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Cartes live</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-white">{cards.length}</p>
                    <p className="mt-2 text-sm text-white/70">Publications visibles sur le site.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Réseaux</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-white">{sourceCount}</p>
                    <p className="mt-2 text-sm text-white/70">Sources fusionnées dans le même mur.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Dernière date</p>
                    <p className="mt-2 font-heading text-lg font-bold text-white">{latestPublishedLabel}</p>
                    <p className="mt-2 text-sm text-white/70">Repère rapide sur la fraîcheur du feed.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.4)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Social monitor</p>
                    <h3 className="mt-3 font-heading text-2xl font-extrabold text-slate-950">
                      Réseaux synchronisés avec le site
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      Les accès sociaux restent visibles en permanence pour passer du site aux comptes officiels sans friction.
                    </p>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                    <Camera className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {socialProfiles.map((profile) => (
                    <a
                      key={profile.label}
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group rounded-[24px] border border-slate-200/80 bg-gradient-to-br p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-40px_rgba(15,23,42,0.28)]",
                        profile.surfaceClass,
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", profile.badgeClass)}>
                            {profile.label}
                          </span>
                          <p className="mt-3 font-heading text-2xl font-bold text-slate-950">{profile.handle}</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile.description}</p>
                        </div>
                        <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg", profile.iconClass)}>
                          <profile.icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-4 text-sm font-semibold text-slate-700">
                        <span>Voir le profil</span>
                        <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="actus-anniversary-banner relative overflow-hidden rounded-[30px] border border-white/10 bg-black p-6 text-white shadow-[0_26px_70px_-36px_rgba(0,0,0,0.72)]">
                <span className="actus-anniversary-shimmer" aria-hidden="true" />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Anniversaire</p>
                <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                  <p className="font-heading text-5xl font-extrabold leading-none md:text-6xl">50 Ans</p>
                  <p className="pb-1 text-sm font-medium text-white/75 md:text-base">1976-2026</p>
                </div>
                <p className="mt-2 text-sm text-white/80 md:text-base">Radio Taxi Le Havre</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[30px] border border-slate-200/80 bg-white/75 p-3 shadow-[0_20px_55px_-42px_rgba(15,23,42,0.28)] backdrop-blur md:sticky md:top-28 md:z-20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3 rounded-[24px] bg-slate-950 px-4 py-3 text-white">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Sticky filters</p>
                  <p className="mt-1 text-sm text-white/82">
                    Filtrez le mur sans perdre le contexte du hero et des accès sociaux.
                  </p>
                </div>
              </div>

              <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
                {filterOptions.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    count={option.count}
                    isActive={activeFilter === option.value}
                    onClick={() => handleFilterChange(option.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Bento feed</p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
                  Flux hybride pour les publications sociales
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Une première carte hero, puis un mur plus dense qui mélange blocs forts et tuiles rapides pour garder le rythme.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                {deferredFilter === "Tous" ? "Tout le flux" : deferredFilter}
              </div>
            </div>

            {isLoadingCards ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[260px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.28)] animate-pulse"
                  >
                    <div className="h-44 bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-24 rounded-full bg-slate-200" />
                      <div className="h-8 rounded-2xl bg-slate-200" />
                      <div className="h-4 rounded-full bg-slate-200" />
                      <div className="h-10 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="mt-6 rounded-[30px] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Camera className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-slate-950">
                  Aucun résultat pour ce filtre.
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Ce segment du feed est vide. Revenez à l'ensemble du mur pour retrouver les autres publications actives.
                </p>
                <Button
                  type="button"
                  onClick={() => handleFilterChange("Tous")}
                  className="mt-6 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : feedCards.length === 0 ? (
              <div className="mt-6 rounded-[30px] border border-slate-200/80 bg-white/90 p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Hero only</p>
                <h3 className="mt-3 font-heading text-2xl font-bold text-slate-950">
                  La publication sélectionnée occupe déjà tout le premier plan.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Changez de filtre pour parcourir une autre tranche du feed ou publiez une nouvelle capture pour enrichir le mur.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid auto-rows-[118px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {feedCards.map((card, index) => (
                  <FeedCard
                    key={card.id}
                    card={card}
                    index={index}
                    onDelete={removeCard}
                    showDelete={adminMode && isAdmin}
                  />
                ))}
              </div>
            )}
          </div>

          {adminMode && (
            <div className="mt-16 overflow-hidden rounded-[34px] border border-slate-900/10 bg-slate-950 text-white shadow-[0_36px_100px_-48px_rgba(15,23,42,0.8)]">
              <div className="grid gap-0 xl:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="border-b border-white/10 p-6 md:p-8 xl:sticky xl:top-32 xl:h-fit xl:border-b-0 xl:border-r xl:border-white/10">
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

                  <h2 className="mt-4 font-heading text-3xl font-extrabold">Gestion des actus</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Sidebar dashboard pour piloter le feed, ouvrir un aperçu et suivre le volume en un coup d'œil.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <button
                      type="button"
                      onClick={() => handleAdminSectionChange("overview")}
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition",
                        activeAdminSection === "overview"
                          ? "border-white/20 bg-white/12 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Vue d'ensemble
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdminSectionChange("compose")}
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition",
                        activeAdminSection === "compose"
                          ? "border-white/20 bg-white/12 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                      Composer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdminSectionChange("board")}
                      className={cn(
                        "flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition",
                        activeAdminSection === "board"
                          ? "border-white/20 bg-white/12 text-white"
                          : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <FolderKanban className="h-4 w-4" />
                      Kanban board
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Actus visibles</p>
                      <p className="mt-2 font-heading text-3xl font-bold">{cards.length}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Captures manuelles</p>
                      <p className="mt-2 font-heading text-3xl font-bold">{manualCardsCount}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/70">Connecté : {adminUsername}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleLogout}
                          disabled={isAuthLoading}
                          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          Déconnexion
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetCards}
                          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          Réinitialiser ({manualCardsCount})
                        </Button>
                      </div>
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
                        "mt-6 rounded-[24px] border px-4 py-3 text-sm",
                        isStatusPositive
                          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                          : "border-amber-300/25 bg-amber-300/10 text-amber-100",
                      )}
                    >
                      {statusMessage}
                    </div>
                  )}

                  <p className="mt-6 text-xs leading-relaxed text-white/40">
                    Les cartes restent gérées via `api/news.php`, l'authentification via `api/admin.php` et les uploads via `api/upload.php`.
                  </p>
                </aside>

                <div className="p-6 md:p-8">
                  <section id="admin-overview">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Dashboard overview</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Stats cards + vue de flux</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                          Une vue synthétique pour mesurer le volume, la répartition des sources et la fraîcheur du feed avant publication.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                        <CalendarDays className="h-4 w-4 text-amber-300" />
                        {latestPublishedLabel}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Feed total</p>
                        <p className="mt-3 font-heading text-4xl font-bold">{cards.length}</p>
                        <p className="mt-2 text-sm text-white/60">Cartes actives sur la page publique.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Instagram</p>
                        <p className="mt-3 font-heading text-4xl font-bold">{instagramCount}</p>
                        <p className="mt-2 text-sm text-white/60">Publications issues du compte Instagram.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Facebook</p>
                        <p className="mt-3 font-heading text-4xl font-bold">{facebookCount}</p>
                        <p className="mt-2 text-sm text-white/60">Relais connectés au compte Facebook.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Captures manuelles</p>
                        <p className="mt-3 font-heading text-4xl font-bold">{manualCardsCount}</p>
                        <p className="mt-2 text-sm text-white/60">Ajouts opérés depuis le dashboard.</p>
                      </div>
                    </div>
                  </section>

                  <section id="admin-compose" className="mt-10">
                    {!isAdmin ? (
                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Workflow</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Trois blocs pour publier proprement</h3>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <ShieldCheck className="h-5 w-5 text-emerald-300" />
                            <p className="mt-4 font-heading text-lg font-bold">1. Connexion</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              Déverrouillez le panneau pour activer publication, suppression et upload.
                            </p>
                          </div>
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <ImagePlus className="h-5 w-5 text-amber-300" />
                            <p className="mt-4 font-heading text-lg font-bold">2. Visuel</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              Chargez une image WebP ou renseignez une URL déjà prête pour la carte.
                            </p>
                          </div>
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <Sparkles className="h-5 w-5 text-sky-300" />
                            <p className="mt-4 font-heading text-lg font-bold">3. Diffusion</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              Validez le titre, la source et le lien puis poussez la carte en tête du feed.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.85fr)]">
                        <form onSubmit={addCard} className="rounded-[30px] border border-white/10 bg-white/5 p-6 md:p-8">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Composer</p>
                          <h3 className="mt-3 font-heading text-3xl font-extrabold">Nouvelle publication</h3>
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                            Formulaire principal pour alimenter le feed public sans sortir du dashboard.
                          </p>

                          <div className="mt-6 grid gap-4 xl:grid-cols-2">
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
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

                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
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

                          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
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

                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="h-11 rounded-xl bg-white text-slate-950 hover:bg-white/90"
                            >
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
                              onClick={openDraftPreview}
                              className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                              Ouvrir l'aperçu
                            </Button>
                          </div>
                        </form>

                        <div className="grid gap-6">
                          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Draft status</p>
                            <h3 className="mt-3 font-heading text-2xl font-extrabold">Preview drawer prêt</h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/65">
                              Ouvrez l'aperçu latéral pour vérifier le cadrage, le titre et la destination avant publication.
                            </p>

                            <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Source active</p>
                              <p className="mt-2 font-heading text-2xl font-bold">{sourceName}</p>
                              <p className="mt-2 text-sm text-white/60">
                                {title.trim() ? title : "Aucun titre saisi pour le moment."}
                              </p>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Image</p>
                                <p className="mt-2 text-sm text-white/70">
                                  {image.trim() ? "Prête pour l'aperçu" : "En attente d'une URL ou d'un upload"}
                                </p>
                              </div>
                              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Lien source</p>
                                <p className="mt-2 text-sm text-white/70">
                                  {sourceUrl.trim() ? "Destination renseignée" : "Le lien reste à compléter"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Quick actions</p>
                            <div className="mt-4 grid gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => latestCard && setPreviewCard(latestCard)}
                                disabled={!latestCard}
                                className="justify-start rounded-[22px] border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                              >
                                <Eye className="h-4 w-4" />
                                Prévisualiser la carte hero
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleAdminSectionChange("board")}
                                className="justify-start rounded-[22px] border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                              >
                                <FolderKanban className="h-4 w-4" />
                                Aller au kanban board
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={loadCards}
                                className="justify-start rounded-[22px] border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                              >
                                <BarChart3 className="h-4 w-4" />
                                Recharger les données live
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  <section id="admin-board" className="mt-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Kanban board</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Colonnes de pilotage du feed</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                          Une vue latérale par rôle: hero, Instagram et Facebook. Chaque carte garde un accès direct à l'aperçu et à la source.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-3">
                      {adminBoardColumns.map((column) => (
                        <div
                          key={column.id}
                          className={cn(
                            "rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5",
                            column.cards.length > 0 && "shadow-[0_24px_70px_-50px_rgba(15,23,42,0.65)]",
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-[24px] border border-white/10 bg-gradient-to-br p-4",
                              column.accentClass,
                            )}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                  {column.label}
                                </p>
                                <p className="mt-2 font-heading text-2xl font-extrabold text-slate-950">
                                  {column.cards.length}
                                </p>
                              </div>
                              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                                {column.cards.length} carte{column.cards.length > 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">{column.description}</p>
                          </div>

                          <div className="mt-4 space-y-4">
                            {column.cards.length > 0 ? (
                              column.cards.map((card) => (
                                <KanbanCard
                                  key={card.id}
                                  card={card}
                                  onPreview={setPreviewCard}
                                  onDelete={removeCard}
                                  showDelete={isAdmin}
                                />
                              ))
                            ) : (
                              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/5 p-5 text-sm text-white/55">
                                {column.emptyMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Sheet
        open={Boolean(previewCard)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewCard(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-slate-200 bg-[#f8fafc] p-0 sm:max-w-2xl">
          {previewCard && previewSourceMeta && previewSourceIcon && (
            <div className="flex min-h-full flex-col">
              <div className="relative overflow-hidden bg-slate-950">
                <img src={previewCard.image} alt={previewCard.title} className="h-72 w-full object-cover sm:h-80" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.52)_48%,rgba(2,6,23,0.9)_100%)]" />
                <div className="absolute left-5 right-5 top-5 flex flex-wrap gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur",
                      previewSourceMeta.badgeClass,
                    )}
                  >
                    {(() => {
                      const PreviewSourceIcon = previewSourceIcon;
                      return <PreviewSourceIcon className="h-3.5 w-3.5" aria-hidden="true" />;
                    })()}
                    {previewCard.sourceName}
                  </span>
                  {previewCard.id === "draft-preview" && (
                    <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                      Draft preview
                    </span>
                  )}
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                    {formatPublishedDate(previewCard.created_at)}
                  </p>
                  <h3 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {previewCard.title}
                  </h3>
                </div>
              </div>

              <div className="flex-1 px-6 py-6 sm:px-8">
                <SheetHeader className="space-y-3 text-left">
                  <SheetTitle className="font-heading text-3xl font-extrabold text-slate-950">
                    Preview drawer
                  </SheetTitle>
                  <SheetDescription className="text-sm leading-relaxed text-slate-600">
                    Vérifiez le rendu éditorial de la carte, sa destination et sa place dans le flux avant de la laisser en production.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <MetricCard
                    eyebrow="Source"
                    value={previewCard.sourceName}
                    caption="Réseau d'origine de la capture."
                    className="rounded-[24px]"
                    valueClassName="text-2xl"
                  />
                  <MetricCard
                    eyebrow="Publication"
                    value={formatPublishedDate(previewCard.created_at)}
                    caption="Date affichée dans le feed."
                    className="rounded-[24px]"
                    valueClassName="text-lg"
                  />
                  <MetricCard
                    eyebrow="Statut"
                    value={previewCard.id === "draft-preview" ? "Draft" : "Live"}
                    caption={
                      previewCard.id === "draft-preview"
                        ? "Prévisualisation locale avant publication."
                        : "Carte déjà visible dans le flux public."
                    }
                    className="rounded-[24px]"
                    valueClassName="text-2xl"
                  />
                </div>

                <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Résumé</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                    {previewSourceMeta.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
                      <a href={previewCard.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir la source
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    {isAdmin && previewCard.id !== "draft-preview" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void removeCard(previewCard.id)}
                        className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer cette carte
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Actus;
