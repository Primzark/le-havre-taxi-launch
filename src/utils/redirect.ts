export const LEGACY_HOSTS = new Set(["taxihavre.com", "www.taxihavre.com", "taxis-lehavre.com"]);

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
