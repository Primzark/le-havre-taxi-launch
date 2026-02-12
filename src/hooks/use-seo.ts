import { useEffect } from "react";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_LINK,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PRIMARY_DOMAIN,
  SITE_NAME,
} from "@/config/site";

type SEOOptions = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  ogImage?: string;
  keywords?: string[];
  ogType?: "website" | "article";
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  breadcrumbs?:
    | false
    | Array<{
        name: string;
        path?: string;
        url?: string;
      }>;
};

function setMetaTag(attribute: "name" | "property", key: string, value: string) {
  let tag = document.head.querySelector(`meta[${attribute}='${key}']`) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", value);
}

function removeMetaTag(attribute: "name" | "property", key: string) {
  const tag = document.head.querySelector(`meta[${attribute}='${key}']`);
  tag?.remove();
}

function setCanonical(url: string) {
  let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

function setAlternateLanguage(hrefLang: string, url: string) {
  let link = document.head.querySelector(
    `link[rel='alternate'][hreflang='${hrefLang}']`,
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", hrefLang);
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${PRIMARY_DOMAIN}${normalizedPath}`;
}

function setStructuredData(schemas: Array<Record<string, unknown>>) {
  document
    .head
    .querySelectorAll("script[type='application/ld+json'][data-seo-managed='true']")
    .forEach((node) => node.remove());

  schemas.forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoManaged = "true";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

function normalizeCanonicalPath(canonicalPath: string): string {
  const [path] = canonicalPath.split(/[?#]/);
  const cleanPath = path.trim() || "/";
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

export function useSEO({
  title,
  description,
  canonicalPath = "/",
  robots = "index, follow",
  ogImage = `${PRIMARY_DOMAIN}/og-image.webp`,
  keywords,
  ogType = "website",
  structuredData,
  breadcrumbs,
}: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const normalizedPath = normalizeCanonicalPath(canonicalPath);
    const canonical = `${PRIMARY_DOMAIN}${normalizedPath}`;
    const absoluteOgImage = toAbsoluteUrl(ogImage);
    const normalizedKeywords = keywords
      ? Array.from(
          new Set(
            keywords
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword.length > 0),
          ),
        )
      : [];

    document.documentElement.setAttribute("lang", "fr");
    document.title = fullTitle;

    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", robots);
    setMetaTag("name", "googlebot", robots);
    setMetaTag("name", "theme-color", "#0f5eb6");
    setMetaTag("name", "author", "SCA Radio Taxi Le Havre");
    setMetaTag("property", "og:locale", "fr_FR");
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:image", absoluteOgImage);
    setMetaTag("property", "og:image:alt", fullTitle);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", absoluteOgImage);
    setMetaTag("name", "twitter:image:alt", fullTitle);
    setMetaTag("name", "twitter:site", SITE_NAME);

    if (normalizedKeywords.length > 0) {
      setMetaTag("name", "keywords", normalizedKeywords.join(", "));
    } else {
      removeMetaTag("name", "keywords");
    }

    setCanonical(canonical);
    setAlternateLanguage("fr-FR", canonical);
    setAlternateLanguage("x-default", canonical);

    const defaultSchemas: Array<Record<string, unknown>> = [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: SITE_NAME,
        url: PRIMARY_DOMAIN,
        image: absoluteOgImage,
        logo: `${PRIMARY_DOMAIN}/images/logo-taxi-le-havre.webp`,
        telephone: CONTACT_PHONE_LINK,
        email: CONTACT_EMAIL,
        areaServed: "Le Havre",
        priceRange: "€€",
        openingHours: "Mo-Su 00:00-23:59",
        inLanguage: "fr-FR",
        sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: fullTitle,
        description,
        url: canonical,
        inLanguage: "fr-FR",
      },
    ];

    if (breadcrumbs !== false) {
      const defaultBreadcrumbs =
        breadcrumbs && breadcrumbs.length > 0
          ? breadcrumbs.map((breadcrumb, index) => {
              const pathOrUrl = breadcrumb.url ?? breadcrumb.path;
              const absoluteItem = pathOrUrl
                ? (/^https?:\/\//i.test(pathOrUrl)
                  ? pathOrUrl
                  : toAbsoluteUrl(normalizeCanonicalPath(pathOrUrl)))
                : undefined;

              return {
                "@type": "ListItem",
                position: index + 1,
                name: breadcrumb.name,
                ...(absoluteItem ? { item: absoluteItem } : {}),
              };
            })
          : canonical !== `${PRIMARY_DOMAIN}/`
            ? [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Accueil",
                  item: `${PRIMARY_DOMAIN}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: title,
                  item: canonical,
                },
              ]
            : [];

      if (defaultBreadcrumbs.length > 0) {
        defaultSchemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: defaultBreadcrumbs,
        });
      }
    }

    const customSchemas = structuredData
      ? (Array.isArray(structuredData) ? structuredData : [structuredData])
      : [];
    setStructuredData([...defaultSchemas, ...customSchemas]);
  }, [title, description, canonicalPath, robots, ogImage, keywords, ogType, structuredData, breadcrumbs]);
}
