import { useEffect } from "react";
import { PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";

type SEOOptions = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  ogImage?: string;
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

function setCanonical(url: string) {
  let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

export function useSEO({
  title,
  description,
  canonicalPath = "/",
  robots = "index, follow",
  ogImage = `${PRIMARY_DOMAIN}/og-image.jpg`,
}: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonical = `${PRIMARY_DOMAIN}${canonicalPath}`;

    document.documentElement.setAttribute("lang", "fr");
    document.title = fullTitle;

    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", robots);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);
    setCanonical(canonical);
  }, [title, description, canonicalPath, robots, ogImage]);
}
