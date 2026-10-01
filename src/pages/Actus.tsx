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
  ACTUS_ADMIN_PATH,
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
  Eye,
  Facebook,
  Globe2,
  ImagePlus,
  Instagram,
  LayoutDashboard,
  Loader2,
  Newspaper,
  Plus,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type NewsSource = "Actualite";
type SocialPlatform = "Instagram" | "Facebook";
type AdminSection = "overview" | "compose" | "board";

type NewsItem = {
  id: string;
  title: string;
  image: string;
  sourceUrl: string;
  sourceName: NewsSource;
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
  items?: NewsItem[];
  item?: NewsItem;
  error?: string;
};

type LiveSocialFeed = {
  label: SocialPlatform;
  handle: string;
  description: string;
  href: string;
  embedUrl: string;
  icon: LucideIcon;
  chipClass: string;
  surfaceClass: string;
  frameClass: string;
  note: string;
};

type BoardColumn = {
  id: string;
  label: string;
  description: string;
  items: NewsItem[];
  accentClass: string;
  emptyMessage: string;
};

type MetricCardProps = {
  eyebrow: string;
  value: string | number;
  caption: string;
  className?: string;
  valueClassName?: string;
};

type LiveFeedCardProps = {
  feed: LiveSocialFeed;
};

type NewsHeroCardProps = {
  item: NewsItem;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
};

type NewsGridCardProps = {
  item: NewsItem;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
};

type AdminBoardCardProps = {
  item: NewsItem;
  onPreview: (item: NewsItem) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
};

type ActusProps = {
  adminMode?: boolean;
};

const STORAGE_KEY = "taxi-le-havre-site-news";
const JSON_ACCEPT_HEADERS = { Accept: "application/json" } as const;
const JSON_REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
const NEWS_SOURCE_LABEL = "Actualité du site";
const NEWS_LINK_LABEL = "Lire l'actualité";
const FACEBOOK_PLUGIN_URL = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
  FACEBOOK_URL,
)}&tabs=timeline&width=500&height=640&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&lazy=true`;

const liveFeeds: LiveSocialFeed[] = [
  {
    label: "Instagram",
    handle: "@lehavretaxi",
    description:
      "Retrouvez notre univers Instagram et accédez directement au compte officiel de Radio Taxi Le Havre.",
    href: INSTAGRAM_URL,
    embedUrl: "https://www.instagram.com/lehavretaxi/embed/",
    icon: Instagram,
    chipClass: "bg-rose-500/10 text-rose-700",
    surfaceClass: "from-rose-50 via-white to-amber-50",
    frameClass: "bg-[#faf7f4]",
    note: "Consultez le compte officiel pour voir les publications, stories et nouveautés du réseau.",
  },
  {
    label: "Facebook",
    handle: "TaxiLeHavre",
    description:
      "Accédez à notre page Facebook officielle pour suivre les publications et informations du réseau.",
    href: FACEBOOK_URL,
    embedUrl: FACEBOOK_PLUGIN_URL,
    icon: Facebook,
    chipClass: "bg-sky-500/10 text-sky-700",
    surfaceClass: "from-sky-50 via-white to-cyan-50",
    frameClass: "bg-[#f4f7fb]",
    note: "Ouvrez la page Facebook pour parcourir les posts, les commentaires et les dernières informations.",
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

type NewsFormField = "title" | "sourceUrl" | "image";
type NewsFormErrors = Partial<Record<NewsFormField, string>>;
type LoginField = "username" | "password";
type LoginFieldErrors = Partial<Record<LoginField, string>>;

const NEWS_FORM_FIELD_LABELS: Record<NewsFormField, string> = {
  title: "Titre",
  sourceUrl: "Lien de l'actualité",
  image: "URL image",
};

const isValidNewsImageInput = (value: string) => {
  const normalizedValue = value.trim();
  const usesAllowedPath =
    normalizedValue.startsWith("/images/") || normalizedValue.startsWith("/uploads/actus/");
  return isWebpImageReference(normalizedValue) && (usesAllowedPath || isHttpUrl(normalizedValue));
};

const getNewsFormFieldError = (field: NewsFormField, value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return {
      title: "Renseignez un titre.",
      sourceUrl: "Indiquez le lien de l'actualité.",
      image: "Ajoutez le chemin ou l'adresse de l'image WebP.",
    }[field];
  }

  if (field === "sourceUrl" && !isHttpUrl(normalizedValue)) {
    return "Saisissez une adresse qui commence par http:// ou https://.";
  }

  if (field === "image" && !isValidNewsImageInput(normalizedValue)) {
    return "Utilisez une image WebP dans /images/ ou /uploads/actus/, ou une adresse complète.";
  }

  return "";
};

const getLoginFieldError = (field: LoginField, value: string) => {
  if (field === "username" && !value.trim()) {
    return "Renseignez l'identifiant administrateur.";
  }
  if (field === "password" && value.length === 0) {
    return "Renseignez le mot de passe administrateur.";
  }
  return "";
};

const isAdminManagedNewsRecord = (item: { id?: unknown; sourceName?: unknown }) => {
  const id = String(item.id ?? "");
  const sourceName = String(item.sourceName ?? "");

  return sourceName === "Actualite" || id.startsWith("news-") || id.startsWith("manual-");
};

const normalizeNewsItem = (item: Record<string, unknown>): NewsItem | null => {
  if (!isAdminManagedNewsRecord(item)) {
    return null;
  }

  const id = String(item.id ?? "").trim();
  const title = String(item.title ?? "").trim();
  const image = String(item.image ?? "").trim();
  const sourceUrl = String(item.sourceUrl ?? "").trim();
  const createdAt = String(item.created_at ?? "").trim();

  if (!id || !title || !image || !sourceUrl) {
    return null;
  }

  return {
    id,
    title,
    image,
    sourceUrl,
    sourceName: "Actualite",
    created_at: createdAt || undefined,
  };
};

const sanitizeNewsItems = (items: unknown): NewsItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => (item && typeof item === "object" ? normalizeNewsItem(item as Record<string, unknown>) : null))
    .filter((item): item is NewsItem => item !== null)
    .sort((a, b) => {
      const aDate = a.created_at ? Date.parse(a.created_at) : 0;
      const bDate = b.created_at ? Date.parse(b.created_at) : 0;
      return bDate - aDate;
    });
};

const formatPublishedDate = (value?: string) => {
  if (!value) {
    return "Pas encore publiée";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Pas encore publiée";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const MetricCard = ({ eyebrow, value, caption, className, valueClassName }: MetricCardProps) => (
  <div className={cn("rounded-[24px] border border-slate-200/80 bg-white/90 p-5 shadow-sm", className)}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
    <p className={cn("mt-3 font-heading text-3xl font-extrabold text-slate-950", valueClassName)}>{value}</p>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">{caption}</p>
  </div>
);

const LiveFeedCard = ({ feed }: LiveFeedCardProps) => (
  <article className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)]">
    <div className={cn("bg-gradient-to-br p-6", feed.surfaceClass)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={cn("inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", feed.chipClass)}>
            {feed.label}
          </span>
          <h3 className="mt-3 font-heading text-3xl font-extrabold text-slate-950">{feed.handle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{feed.description}</p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
          <feed.icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>

    <div className={cn("border-y border-slate-200/80 p-3", feed.frameClass)}>
      <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white">
        <iframe
          title={`${feed.label} live feed`}
          src={feed.embedUrl}
          loading="lazy"
          className="h-[620px] w-full"
          allow="clipboard-write; encrypted-media; web-share"
        />
      </div>
    </div>

    <div className="p-6">
      <p className="text-sm leading-relaxed text-slate-600">{feed.note}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
          <a href={feed.href} target="_blank" rel="noopener noreferrer">
            Ouvrir {feed.label}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  </article>
);

const NewsHeroCard = ({ item, onDelete, showDelete = false }: NewsHeroCardProps) => (
  <article className="group overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-48px_rgba(15,23,42,0.42)]">
    <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <div className="relative min-h-[340px] overflow-hidden bg-slate-950">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.42)_45%,rgba(2,6,23,0.92)_100%)]" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
            <BadgeCheck className="h-3.5 w-3.5 text-amber-500" />
            Dernière actualité
          </span>
          <span className="inline-flex rounded-full bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            {NEWS_SOURCE_LABEL}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
            {formatPublishedDate(item.created_at)}
          </p>
          <h3 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">À la une</p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Retrouvez ici les informations importantes, les nouveautés du service et les annonces publiées par l'équipe.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MetricCard
              eyebrow="Canal"
              value={NEWS_SOURCE_LABEL}
              caption="Rubrique éditoriale du site."
              valueClassName="text-2xl"
            />
            <MetricCard
              eyebrow="Publication"
              value={formatPublishedDate(item.created_at)}
              caption="Date affichée sur la page."
              valueClassName="text-lg"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
              {NEWS_LINK_LABEL}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>

          {showDelete && onDelete && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onDelete(item.id)}
              className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>
    </div>
  </article>
);

const NewsGridCard = ({ item, onDelete, showDelete = false }: NewsGridCardProps) => (
  <article className="group overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_22px_60px_-40px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(15,23,42,0.42)]">
    <div className="relative overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="h-60 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-transparent" />
      <div className="absolute left-4 top-4">
        <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
          {NEWS_SOURCE_LABEL}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
          {formatPublishedDate(item.created_at)}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-white">{item.title}</h3>
      </div>
    </div>

    <div className="p-5">
      <p className="text-sm leading-relaxed text-slate-600">
        Information publiée par Radio Taxi Le Havre pour orienter les visiteurs vers le contenu complet.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-primary"
        >
          {NEWS_LINK_LABEL}
          <ArrowUpRight className="h-4 w-4" />
        </a>

        {showDelete && onDelete && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(item.id)}
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

const AdminBoardCard = ({ item, onPreview, onDelete, showDelete = false }: AdminBoardCardProps) => (
  <article className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
    <div className="relative overflow-hidden rounded-[20px]">
      <img src={item.image} alt={item.title} loading="lazy" className="h-44 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/10 to-transparent" />
      <div className="absolute left-3 top-3">
        <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
          {NEWS_SOURCE_LABEL}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          {formatPublishedDate(item.created_at)}
        </p>
        <h3 className="mt-2 font-heading text-xl font-bold leading-tight text-white">{item.title}</h3>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPreview(item)}
        className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      >
        <Eye className="h-4 w-4" />
        Aperçu
      </Button>
      <Button variant="outline" size="sm" asChild className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          <ArrowUpRight className="h-4 w-4" />
          Ouvrir
        </a>
      </Button>
      {showDelete && onDelete && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </Button>
      )}
    </div>
  </article>
);

const Actus = ({ adminMode = false }: ActusProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginFieldErrors, setLoginFieldErrors] = useState<LoginFieldErrors>({});
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const authSubmissionLock = useRef(false);
  const loginUsernameRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [newsFormErrors, setNewsFormErrors] = useState<NewsFormErrors>({});
  const [hasAttemptedNewsSubmit, setHasAttemptedNewsSubmit] = useState(false);
  const [focusNewsErrorSummary, setFocusNewsErrorSummary] = useState(false);
  const newsErrorSummaryRef = useRef<HTMLDivElement>(null);
  const newsSubmissionLock = useRef(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeAdminSection, setActiveAdminSection] = useState<AdminSection>("overview");
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);

  const actusSEO = useMemo(
    () =>
      adminMode
        ? {
            title: "Gestion des actualités",
            description: "Dashboard d'administration des actualités du site Taxi Le Havre.",
            canonicalPath: ACTUS_ADMIN_PATH,
            robots: "noindex, nofollow",
            ogImage: "/images/home-catene.webp",
            keywords: ["gestion actualités taxi le havre", "admin news taxi le havre"],
            breadcrumbs: false as const,
          }
        : {
            title: "Actus",
            description:
              "Consultez les actualités de Taxi Le Havre et retrouvez nos comptes Instagram et Facebook officiels.",
            canonicalPath: "/actus",
            ogImage: "/images/home-catene.webp",
            keywords: [
              "actus taxi le havre",
              "news taxi le havre",
              "instagram taxi le havre",
              "facebook taxi le havre",
            ],
            structuredData: {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Actus Taxi Le Havre",
              url: `${PRIMARY_DOMAIN}/actus`,
              inLanguage: "fr-FR",
            },
          },
    [adminMode],
  );

  useSEO(actusSEO);

  const latestNews = newsItems[0] ?? null;
  const additionalNews = newsItems.slice(1);
  const latestNewsLabel = useMemo(() => formatPublishedDate(latestNews?.created_at), [latestNews?.created_at]);
  const isStatusPositive = /active|fermée|publiée|supprimées|réinitialisées|téléversée/i.test(statusMessage);

  useEffect(() => {
    if (!focusNewsErrorSummary || Object.keys(newsFormErrors).length === 0) {
      return;
    }

    newsErrorSummaryRef.current?.focus();
    setFocusNewsErrorSummary(false);
  }, [focusNewsErrorSummary, newsFormErrors]);

  const boardColumns = useMemo<BoardColumn[]>(
    () => [
      {
        id: "featured",
        label: "À la une",
        description: "La première actualité visible sur la page publique.",
        items: latestNews ? [latestNews] : [],
        accentClass: "from-amber-500/18 via-white to-white",
        emptyMessage: "Aucune actualité mise en avant pour le moment.",
      },
      {
        id: "recent",
        label: "Récentes",
        description: "Les dernières actualités publiées par l'équipe.",
        items: newsItems.slice(1, 3),
        accentClass: "from-sky-500/18 via-white to-white",
        emptyMessage: "Aucune actualité récente supplémentaire.",
      },
      {
        id: "library",
        label: "Bibliothèque",
        description: "Les autres actualités déjà en ligne.",
        items: newsItems.slice(3),
        accentClass: "from-slate-400/18 via-white to-white",
        emptyMessage: "La bibliothèque est vide.",
      },
    ],
    [latestNews, newsItems],
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
    setSourceUrl("");
    setUploadFile(null);
    setNewsFormErrors({});
    setHasAttemptedNewsSubmit(false);
    setFocusNewsErrorSummary(false);
  };

  const updateNewsField = (field: NewsFormField, value: string) => {
    setStatusMessage("");
    if (field === "title") setTitle(value);
    if (field === "sourceUrl") setSourceUrl(value);
    if (field === "image") setImage(value);

    setNewsFormErrors((currentErrors) => {
      if (!hasAttemptedNewsSubmit && !currentErrors[field]) {
        return currentErrors;
      }

      const error = getNewsFormFieldError(field, value);
      const nextErrors = { ...currentErrors };
      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }
      return nextErrors;
    });
  };

  const updateLoginField = (field: LoginField, value: string) => {
    if (field === "username") setLoginUsername(value);
    if (field === "password") setLoginPassword(value);

    if (Object.keys(loginFieldErrors).length > 0) {
      const error = getLoginFieldError(field, value);
      const nextErrors = { ...loginFieldErrors };
      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }
      setLoginFieldErrors(nextErrors);
      setStatusMessage(Object.values(nextErrors).join(" "));
    } else if (statusMessage && !isStatusPositive) {
      setStatusMessage("");
    }
  };

  const validateNewsFieldOnBlur = (field: NewsFormField, value: string) => {
    if (!hasAttemptedNewsSubmit && !newsFormErrors[field] && (field === "title" || !value.trim())) {
      return;
    }

    setNewsFormErrors((currentErrors) => {
      const error = getNewsFormFieldError(field, value);
      const nextErrors = { ...currentErrors };
      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }
      return nextErrors;
    });
  };

  const jumpToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAdminSectionChange = (section: AdminSection) => {
    setActiveAdminSection(section);
    jumpToSection(`admin-${section}`);
  };

  const loadNews = async () => {
    setIsLoadingNews(true);

    try {
      const response = await fetch(ACTUS_API_URL, {
        headers: JSON_ACCEPT_HEADERS,
        credentials: "same-origin",
      });
      const result = (await response.json()) as NewsResponse;

      if (response.ok && result?.success === true) {
        setNewsItems(sanitizeNewsItems(result.items));
        return;
      }

      throw new Error(result?.error || "Unable to load news");
    } catch {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setNewsItems([]);
        setIsLoadingNews(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as unknown;
        setNewsItems(sanitizeNewsItems(parsed));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setNewsItems([]);
      }
    } finally {
      setIsLoadingNews(false);
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
    void Promise.all([loadNews(), refreshSession()]);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newsItems));
  }, [newsItems]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAuthLoading || authSubmissionLock.current) {
      return;
    }
    setStatusMessage("");

    const nextErrors: LoginFieldErrors = {};
    const usernameError = getLoginFieldError("username", loginUsername);
    const passwordError = getLoginFieldError("password", loginPassword);
    if (usernameError) nextErrors.username = usernameError;
    if (passwordError) nextErrors.password = passwordError;

    if (Object.keys(nextErrors).length > 0) {
      setLoginFieldErrors(nextErrors);
      setStatusMessage(Object.values(nextErrors).join(" "));
      if (nextErrors.username) {
        loginUsernameRef.current?.focus();
      } else {
        loginPasswordRef.current?.focus();
      }
      return;
    }

    setLoginFieldErrors({});
    authSubmissionLock.current = true;
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
        const message = response.status === 401
          ? "Identifiant ou mot de passe incorrect. Vérifiez vos informations et réessayez."
          : response.status === 429
            ? "Trop de tentatives. Réessayez dans quelques instants."
            : response.status >= 500
              ? "Le service de connexion est indisponible. Réessayez dans quelques instants."
              : result?.error || "Connexion admin impossible. Réessayez dans quelques instants.";
        setStatusMessage(message);
        return;
      }

      setIsAdmin(true);
      setAdminUsername(result.username || loginUsername.trim());
      setLoginPassword("");
      setStatusMessage("Connexion admin active.");
    } catch {
      setStatusMessage("Impossible de joindre le service de connexion. Vérifiez votre réseau et réessayez.");
    } finally {
      authSubmissionLock.current = false;
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
        if (response.status === 401 || response.status === 403) {
          setIsAdmin(false);
          setAdminUsername("");
          setStatusMessage("Votre session a expiré. Reconnectez-vous avant de téléverser une image.");
        } else {
          setStatusMessage(result?.error || "Téléversement impossible. Réessayez dans quelques instants.");
        }
        return;
      }

      updateNewsField("image", result.url);
      setUploadFile(null);
      setStatusMessage("Image téléversée. URL renseignée automatiquement.");
    } catch {
      setStatusMessage("Erreur réseau pendant le téléversement.");
    } finally {
      setIsUploading(false);
    }
  };

  const addNews = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isUploading || newsSubmissionLock.current) {
      return;
    }
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour publier une actualité.")) {
      return;
    }

    const values: Record<NewsFormField, string> = { title, sourceUrl, image };
    const nextErrors: NewsFormErrors = {};
    (Object.keys(NEWS_FORM_FIELD_LABELS) as NewsFormField[]).forEach((field) => {
      const error = getNewsFormFieldError(field, values[field]);
      if (error) nextErrors[field] = error;
    });

    setHasAttemptedNewsSubmit(true);
    setNewsFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFocusNewsErrorSummary(true);
      return;
    }

    newsSubmissionLock.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(ACTUS_API_URL, {
        method: "POST",
        headers: JSON_REQUEST_HEADERS,
        credentials: "same-origin",
        body: JSON.stringify({
          title: title.trim(),
          image: image.trim(),
          sourceUrl: sourceUrl.trim(),
        }),
      });

      const result = (await response.json()) as NewsResponse;
      const normalized = result.item && typeof result.item === "object"
        ? normalizeNewsItem(result.item as unknown as Record<string, unknown>)
        : null;

      if (!response.ok || result?.success !== true || !normalized) {
        const message = response.status === 401 || response.status === 403
          ? "Votre session a expiré. Reconnectez-vous pour publier cette actualité."
          : response.status === 422
            ? "L'image ou le lien ne peut pas être utilisé. Vérifiez les références et réessayez."
            : "La publication n'a pas abouti. Réessayez dans quelques instants.";
        if (response.status === 401 || response.status === 403) {
          setIsAdmin(false);
          setAdminUsername("");
        }
        setStatusMessage(message);
        return;
      }

      setNewsItems((previous) => [normalized, ...previous]);
      resetPublishForm();
      setStatusMessage("Actualité publiée.");
      setActiveAdminSection("board");
    } catch {
      setStatusMessage("Erreur réseau pendant la publication.");
    } finally {
      newsSubmissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  const removeNews = async (id: string, askConfirmation = true) => {
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour supprimer une actualité.")) {
      return;
    }

    if (askConfirmation && !window.confirm("Confirmer la suppression de cette actualité ?")) {
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
      if (!response.ok || result?.success !== true) {
        setStatusMessage(result?.error || "Suppression impossible.");
        return;
      }

      setNewsItems(sanitizeNewsItems(result.items));
      setPreviewItem((current) => (current?.id === id ? null : current));
      setStatusMessage("Actualité supprimée.");
    } catch {
      setStatusMessage("Erreur réseau pendant la suppression.");
    }
  };

  const resetNews = async () => {
    setStatusMessage("");

    if (!requireAdmin("Connexion admin requise pour réinitialiser les actualités.")) {
      return;
    }

    if (newsItems.length === 0) {
      setStatusMessage("Aucune actualité à supprimer.");
      return;
    }

    for (const item of newsItems) {
      await removeNews(item.id, false);
    }

    await loadNews();
    setStatusMessage("Actualités réinitialisées.");
  };

  const openDraftPreview = () => {
    setPreviewItem({
      id: "draft-preview",
      title: title.trim() || "Actualité en préparation",
      image: image.trim() || "/images/home-catene.webp",
      sourceUrl: sourceUrl.trim() || PRIMARY_DOMAIN,
      sourceName: "Actualite",
      created_at: new Date().toISOString(),
    });
  };

  const previewStatusLabel = previewItem?.id === "draft-preview" ? "Brouillon" : "En ligne";

  return (
    <Layout>
      <PageHero
        title={adminMode ? "Gestion des actualités" : "Actus"}
        subtitle={
          adminMode
            ? "Espace de publication et de suivi des actualités du site Taxi Le Havre."
            : "Retrouvez nos actualités, nos comptes officiels et les informations utiles de Radio Taxi Le Havre."
        }
        backgroundImage="/images/home-catene.webp"
      />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_38%,#eef2ff_100%)] py-14 md:py-18">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_52%)]" />
        <div className="absolute -left-14 top-28 h-56 w-56 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />

        <div className="container relative max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
            <div className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_32px_90px_-48px_rgba(15,23,42,0.4)] backdrop-blur md:p-8 xl:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_32%)]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
                  <Globe2 className="h-3.5 w-3.5 text-amber-500" />
                  Actus en un coup d'œil
                </div>

                <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-slate-950 md:text-5xl">
                  Suivez l'actualité de Radio Taxi Le Havre
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Retrouvez nos publications Instagram et Facebook ainsi que les informations utiles du site dans un espace clair, rapide et agréable à parcourir.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    eyebrow="Flux sociaux"
                    value={liveFeeds.length}
                    caption="Instagram et Facebook officiels."
                  />
                  <MetricCard
                    eyebrow="Actualités du site"
                    value={newsItems.length}
                    caption="Annonces, nouveautés et informations du service."
                  />
                  <MetricCard
                    eyebrow="Dernière publication"
                    value={latestNewsLabel}
                    caption="Date de la publication la plus récente."
                    valueClassName="text-lg"
                  />
                </div>

                <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-950 px-5 py-4 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.75)]">
                  <p className="text-sm leading-relaxed text-white/82 md:text-base">
                    Découvrez d'abord nos réseaux officiels pour suivre le quotidien du service, puis les actualités du site pour retrouver annonces, nouveautés et informations pratiques.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <MetricCard
                eyebrow="Réseaux officiels"
                value="2 canaux"
                caption="Accès direct à Instagram et Facebook."
                className="rounded-[30px]"
              />
              <MetricCard
                eyebrow="Rubrique info"
                value="Actualités"
                caption="Communiqués, annonces et infos utiles du site."
                className="rounded-[30px]"
              />
              <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Navigation rapide</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => jumpToSection("social-live")}
                    className="justify-start rounded-[22px] border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Instagram + Facebook
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => jumpToSection("site-news")}
                    className="justify-start rounded-[22px] border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    Actualités du site
                  </Button>
                  {adminMode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => jumpToSection("news-admin")}
                      className="justify-start rounded-[22px] border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard admin
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section id="social-live" className="mt-14">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">En direct des réseaux</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold text-slate-950 md:text-4xl">Instagram et Facebook</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Retrouvez ici nos comptes officiels et accédez directement aux plateformes pour consulter l'ensemble des publications.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Comptes officiels
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {liveFeeds.map((feed) => (
                <LiveFeedCard key={feed.label} feed={feed} />
              ))}
            </div>
          </section>

          <section id="site-news" className="mt-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actualités du site</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold text-slate-950 md:text-4xl">Actualités Radio Taxi Le Havre</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Communiqués, informations de service, événements et nouveautés publiés par Radio Taxi Le Havre.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                {latestNewsLabel}
              </div>
            </div>

            {isLoadingNews ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.28)] animate-pulse"
                  >
                    <div className="h-60 bg-slate-200" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-28 rounded-full bg-slate-200" />
                      <div className="h-8 rounded-2xl bg-slate-200" />
                      <div className="h-4 rounded-full bg-slate-200" />
                      <div className="h-10 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : newsItems.length === 0 ? (
              <div className="mt-6 rounded-[30px] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Newspaper className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-slate-950">
                  Aucune actualité du site pour le moment.
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Revenez bientôt pour découvrir les prochaines informations du service, de la centrale et de la vie du réseau.
                </p>
              </div>
            ) : (
              <div className="mt-6">
                {latestNews && (
                  <NewsHeroCard
                    item={latestNews}
                    onDelete={removeNews}
                    showDelete={adminMode && isAdmin}
                  />
                )}

                {additionalNews.length > 0 && (
                  <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {additionalNews.map((item) => (
                      <NewsGridCard
                        key={item.id}
                        item={item}
                        onDelete={removeNews}
                        showDelete={adminMode && isAdmin}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {adminMode && (
            <section
              id="news-admin"
              className="mt-16 overflow-hidden rounded-[34px] border border-slate-900/10 bg-slate-950 text-white shadow-[0_36px_100px_-48px_rgba(15,23,42,0.8)]"
            >
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

                  <h2 className="mt-4 font-heading text-3xl font-extrabold">Espace actualités</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Centralisez ici la création, l'aperçu et le suivi des actualités publiées sur le site.
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
                      Composer une actu
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
                      <BarChart3 className="h-4 w-4" />
                      Kanban actus
                    </button>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Actus en ligne</p>
                      <p className="mt-2 font-heading text-3xl font-bold">{newsItems.length}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Canaux live</p>
                      <p className="mt-2 font-heading text-3xl font-bold">{liveFeeds.length}</p>
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
                          onClick={resetNews}
                          className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                          Réinitialiser les news
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} noValidate aria-busy={isAuthLoading} className="mt-6 grid gap-3">
                      <fieldset disabled={isAuthLoading} className="grid gap-3 border-0 p-0">
                        <div className="grid gap-2">
                          <Label htmlFor="admin-username" className="sr-only">Identifiant administrateur</Label>
                          <Input
                            id="admin-username"
                            ref={loginUsernameRef}
                            value={loginUsername}
                            onChange={(event) => updateLoginField("username", event.target.value)}
                            autoComplete="username"
                            maxLength={80}
                            required
                            aria-invalid={loginFieldErrors.username ? true : undefined}
                            aria-describedby={loginFieldErrors.username || (statusMessage && !isStatusPositive) ? "actus-admin-status" : undefined}
                            placeholder="Identifiant admin"
                            className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="admin-password" className="sr-only">Mot de passe administrateur</Label>
                          <Input
                            id="admin-password"
                            ref={loginPasswordRef}
                            type="password"
                            value={loginPassword}
                            onChange={(event) => updateLoginField("password", event.target.value)}
                            autoComplete="current-password"
                            required
                            aria-invalid={loginFieldErrors.password ? true : undefined}
                            aria-describedby={loginFieldErrors.password || (statusMessage && !isStatusPositive) ? "actus-admin-status" : undefined}
                            placeholder="Mot de passe"
                            className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                          />
                        </div>
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
                      </fieldset>
                      {isAuthLoading && (
                        <p role="status" aria-live="polite" className="sr-only">
                          Connexion en cours.
                        </p>
                      )}
                    </form>
                  )}

                  {statusMessage && (
                    <div
                      id="actus-admin-status"
                      role={isStatusPositive ? "status" : "alert"}
                      aria-live={isStatusPositive ? "polite" : "assertive"}
                      aria-atomic="true"
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
                </aside>

                <div className="p-6 md:p-8">
                  <section id="admin-overview">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Vue d'ensemble</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Vue d'ensemble éditoriale</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                          Suivez le volume d'actualités en ligne, la présence des comptes officiels et le rythme de publication.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                        <CalendarDays className="h-4 w-4 text-amber-300" />
                        {latestNewsLabel}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Actus site</p>
                        <p className="mt-3 font-heading text-4xl font-bold">{newsItems.length}</p>
                        <p className="mt-2 text-sm text-white/60">Cartes actuellement visibles sur la page.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Instagram</p>
                        <p className="mt-3 font-heading text-4xl font-bold">Direct</p>
                        <p className="mt-2 text-sm text-white/60">Compte officiel affiché sur la page.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Facebook</p>
                        <p className="mt-3 font-heading text-4xl font-bold">Direct</p>
                        <p className="mt-2 text-sm text-white/60">Page officielle affichée sur la page.</p>
                      </div>
                      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Objectif</p>
                        <p className="mt-3 font-heading text-4xl font-bold">Informer</p>
                        <p className="mt-2 text-sm text-white/60">Mettre en avant une information claire, utile et visuelle.</p>
                      </div>
                    </div>
                  </section>

                  <section id="admin-compose" className="mt-10">
                    {!isAdmin ? (
                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Mode d'emploi</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Publier une actualité claire et utile</h3>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <ShieldCheck className="h-5 w-5 text-emerald-300" />
                            <p className="mt-4 font-heading text-lg font-bold">1. Connexion</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              Connectez-vous pour accéder à la publication, à la suppression et au téléversement.
                            </p>
                          </div>
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <ImagePlus className="h-5 w-5 text-amber-300" />
                            <p className="mt-4 font-heading text-lg font-bold">2. Visuel + lien</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              Préparez un visuel WebP et le lien à ouvrir depuis la carte.
                            </p>
                          </div>
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                            <Newspaper className="h-5 w-5 text-sky-300" />
                            <p className="mt-4 font-heading text-lg font-bold">3. Publication</p>
                            <p className="mt-2 text-sm leading-relaxed text-white/65">
                              L'actualité s'affiche dans la rubrique dédiée avec sa date et son bouton d'ouverture.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
                        <form onSubmit={addNews} noValidate aria-busy={isSubmitting} className="rounded-[30px] border border-white/10 bg-white/5 p-6 md:p-8">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Composer une actualité</p>
                          <h3 className="mt-3 font-heading text-3xl font-extrabold">Actualité du site</h3>
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                            Renseignez un titre, un lien et un visuel pour publier une nouvelle carte sur la page Actus.
                          </p>

                          {Object.keys(newsFormErrors).length > 0 && (
                            <div
                              ref={newsErrorSummaryRef}
                              id="news-error-summary"
                              role="alert"
                              aria-labelledby="news-error-summary-title"
                              tabIndex={-1}
                              className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-300/10 p-4 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                              <p id="news-error-summary-title" className="font-semibold">
                                Corrigez les champs suivants avant la publication :
                              </p>
                              <ul className="mt-2 list-inside list-disc space-y-1">
                                {(Object.keys(NEWS_FORM_FIELD_LABELS) as NewsFormField[])
                                  .filter((field) => newsFormErrors[field])
                                  .map((field) => (
                                    <li key={field}>
                                      <button
                                        type="button"
                                        className="text-left underline underline-offset-2"
                                        onClick={() => document.getElementById(`news-${field === "sourceUrl" ? "source-url" : field}`)?.focus()}
                                      >
                                        {NEWS_FORM_FIELD_LABELS[field]} : {newsFormErrors[field]}
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          <div className="mt-6 grid gap-4 xl:grid-cols-2">
                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                              <div className="space-y-2">
                                <Label htmlFor="news-title" className="text-white/80">Titre</Label>
                                <Input
                                  id="news-title"
                                  value={title}
                                  onChange={(event) => updateNewsField("title", event.target.value)}
                                  onBlur={(event) => validateNewsFieldOnBlur("title", event.target.value)}
                                  placeholder="Ex: Nouvelle organisation du service"
                                  required
                                  maxLength={160}
                                  disabled={isSubmitting}
                                  aria-invalid={newsFormErrors.title ? true : undefined}
                                  aria-describedby={newsFormErrors.title ? "news-title-error" : undefined}
                                  className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                                />
                                {newsFormErrors.title && <p id="news-title-error" className="text-sm text-rose-200">{newsFormErrors.title}</p>}
                              </div>

                              <div className="mt-4 space-y-2">
                                <Label htmlFor="news-source-url" className="text-white/80">Lien de l'actualité</Label>
                                <Input
                                  id="news-source-url"
                                  type="url"
                                  value={sourceUrl}
                                  onChange={(event) => updateNewsField("sourceUrl", event.target.value)}
                                  onBlur={(event) => validateNewsFieldOnBlur("sourceUrl", event.target.value)}
                                  placeholder="https://..."
                                  required
                                  maxLength={500}
                                  disabled={isSubmitting}
                                  aria-invalid={newsFormErrors.sourceUrl ? true : undefined}
                                  aria-describedby={newsFormErrors.sourceUrl ? "news-source-url-error" : undefined}
                                  className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                                />
                                {newsFormErrors.sourceUrl && <p id="news-source-url-error" className="text-sm text-rose-200">{newsFormErrors.sourceUrl}</p>}
                              </div>
                            </div>

                            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                              <div className="space-y-2">
                                <Label htmlFor="news-image" className="text-white/80">URL image</Label>
                                <Input
                                  id="news-image"
                                  value={image}
                                  onChange={(event) => updateNewsField("image", event.target.value)}
                                  onBlur={(event) => validateNewsFieldOnBlur("image", event.target.value)}
                                  placeholder="/uploads/actus/... .webp ou https://... .webp"
                                  required
                                  maxLength={500}
                                  aria-invalid={newsFormErrors.image ? true : undefined}
                                  aria-describedby={newsFormErrors.image ? "news-image-error" : undefined}
                                  disabled={isSubmitting || isUploading}
                                  className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white placeholder:text-white/35 focus-visible:ring-white/20"
                                />
                                {newsFormErrors.image && <p id="news-image-error" className="text-sm text-rose-200">{newsFormErrors.image}</p>}
                              </div>

                              <div className="mt-4 space-y-2">
                                <Label htmlFor="news-image-file" className="text-white/80">Téléverser une image</Label>
                                <Input
                                  id="news-image-file"
                                  type="file"
                                  accept="image/webp"
                                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                                  disabled={isUploading || isSubmitting}
                                  className="h-11 rounded-xl border-white/10 bg-slate-900/70 text-white file:text-white placeholder:text-white/35 focus-visible:ring-white/20"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={uploadSelectedImage}
                              aria-busy={isUploading}
                              disabled={isUploading || isSubmitting || !uploadFile}
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

                            <Button
                              type="button"
                              variant="outline"
                              onClick={openDraftPreview}
                              disabled={isSubmitting || isUploading}
                              className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                              Ouvrir l'aperçu
                            </Button>
                          </div>

                          {isUploading && (
                            <p role="status" aria-live="polite" className="sr-only">
                              Téléversement de l'image en cours.
                            </p>
                          )}

                          <div className="mt-6">
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
                                  <Plus className="h-4 w-4" />
                                  Publier l'actualité
                                </>
                              )}
                            </Button>
                          </div>

                          {isSubmitting && (
                            <p role="status" aria-live="polite" className="sr-only">
                              Publication de l'actualité en cours.
                            </p>
                          )}
                        </form>

                        <div className="grid gap-6">
                          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Repère visiteur</p>
                            <h3 className="mt-3 font-heading text-2xl font-extrabold">Ce que voit le visiteur</h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/65">
                              Chaque carte publiée apparaît dans la rubrique "Actualités du site" avec son visuel, sa date et son lien.
                            </p>
                          </div>

                          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Aperçu rapide</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[22px] border border-white/10 bg-slate-900/70 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Titre</p>
                                <p className="mt-2 text-sm text-white/70">
                                  {title.trim() ? title : "Aucun titre saisi"}
                                </p>
                              </div>
                              <div className="rounded-[22px] border border-white/10 bg-slate-900/70 p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Lien</p>
                                <p className="mt-2 text-sm text-white/70">
                                  {sourceUrl.trim() ? "Lien prêt" : "Lien non renseigné"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  <section id="admin-board" className="mt-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Kanban actualités</p>
                        <h3 className="mt-3 font-heading text-3xl font-extrabold">Pilotage éditorial du site</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                          Suivez vos cartes mises en avant, les plus récentes et la bibliothèque d'archives pour garder une page claire.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-3">
                      {boardColumns.map((column) => (
                        <div
                          key={column.id}
                          className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5"
                        >
                          <div className={cn("rounded-[24px] border border-white/10 bg-gradient-to-br p-4", column.accentClass)}>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                  {column.label}
                                </p>
                                <p className="mt-2 font-heading text-2xl font-extrabold text-slate-950">
                                  {column.items.length}
                                </p>
                              </div>
                              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                                {column.items.length} carte{column.items.length > 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">{column.description}</p>
                          </div>

                          <div className="mt-4 space-y-4">
                            {column.items.length > 0 ? (
                              column.items.map((item) => (
                                <AdminBoardCard
                                  key={item.id}
                                  item={item}
                                  onPreview={setPreviewItem}
                                  onDelete={removeNews}
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
            </section>
          )}
        </div>
      </section>

      <Sheet
        open={Boolean(previewItem)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewItem(null);
          }
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto border-l border-slate-200 bg-[#f8fafc] p-0 sm:max-w-2xl">
          {previewItem && (
            <div className="flex min-h-full flex-col">
              <div className="relative overflow-hidden bg-slate-950">
                <img src={previewItem.image} alt={previewItem.title} className="h-72 w-full object-cover sm:h-80" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.52)_48%,rgba(2,6,23,0.9)_100%)]" />
                <div className="absolute left-5 right-5 top-5 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                    {NEWS_SOURCE_LABEL}
                  </span>
                  <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    {previewStatusLabel}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                    {formatPublishedDate(previewItem.created_at)}
                  </p>
                  <h3 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {previewItem.title}
                  </h3>
                </div>
              </div>

              <div className="flex-1 px-6 py-6 sm:px-8">
                <SheetHeader className="space-y-3 text-left">
                  <SheetTitle className="font-heading text-3xl font-extrabold text-slate-950">
                    Aperçu de la carte
                  </SheetTitle>
                  <SheetDescription className="text-sm leading-relaxed text-slate-600">
                    Vérifiez le rendu du visuel, du titre et de la date avant ou après publication dans la rubrique "Actualités du site".
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <MetricCard
                    eyebrow="Type"
                    value={NEWS_SOURCE_LABEL}
                    caption="Contenu éditorial du site."
                    className="rounded-[24px]"
                    valueClassName="text-2xl"
                  />
                  <MetricCard
                    eyebrow="Statut"
                    value={previewStatusLabel}
                    caption={
                      previewItem.id === "draft-preview"
                        ? "Prévisualisation avant publication."
                        : "Carte déjà visible sur la page publique."
                    }
                    className="rounded-[24px]"
                    valueClassName="text-2xl"
                  />
                  <MetricCard
                    eyebrow="Publication"
                    value={formatPublishedDate(previewItem.created_at)}
                    caption="Date affichée sous la carte."
                    className="rounded-[24px]"
                    valueClassName="text-lg"
                  />
                </div>

                <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Résumé</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                    Cette carte met en avant une information du service avec un lien direct vers son contenu complet.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
                      <a href={previewItem.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir le lien
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    {isAdmin && previewItem.id !== "draft-preview" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void removeNews(previewItem.id)}
                        className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer cette news
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
