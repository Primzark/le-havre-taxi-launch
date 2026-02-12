export const LEGACY_HOSTS = new Set([
  "taxi-le-havre-hub.lovable.app",
  "taxihavre.com",
  "www.taxihavre.com",
  "taxis-lehavre.com",
  "www.taxis-lehavre.com",
  "www.taxi-le-havre.com",
]);

export const buildLegacyDomainRedirectUrl = (
  hostname: string,
  pathname: string,
  search: string,
  hash: string,
  primaryDomain: string,
): string | null => {
  const normalizedHost = hostname.trim().toLowerCase();
  if (!LEGACY_HOSTS.has(normalizedHost)) {
    return null;
  }

  return `${primaryDomain}${pathname}${search}${hash}`;
};
