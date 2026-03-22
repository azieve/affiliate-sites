/**
 * CENTRAL AFFILIATE LINK REGISTRY
 *
 * This is the single source of truth for all affiliate links across the site.
 * To update a link, change it here — it updates everywhere automatically.
 *
 * All affiliate links should use the <AffiliateLink> component or the
 * getAffiliateUrl() helper, never hardcoded URLs.
 */

export interface AffiliateProgram {
  id: string;
  name: string;
  shortName: string;
  url: string;
  slug: string; // Used for /go/[slug] redirects
  cta: string;
  network: 'direct' | 'impact' | 'awin';
  commission: string;
  cookieDays: number;
  position: string;
  logo?: string; // path to logo in /public/logos/
}

export const affiliatePrograms: Record<string, AffiliateProgram> = {
  northwest: {
    id: 'northwest',
    name: 'Northwest Registered Agent',
    shortName: 'Northwest',
    url: 'https://www.northwestregisteredagent.com/?affiliate_id=PLACEHOLDER',
    slug: 'northwest',
    cta: 'Visit Northwest',
    network: 'direct',
    commission: '$60/sale',
    cookieDays: 30,
    position: 'Best Overall',
    logo: '/logos/northwest.svg',
  },
  zenbusiness: {
    id: 'zenbusiness',
    name: 'ZenBusiness',
    shortName: 'ZenBusiness',
    url: 'https://www.zenbusiness.com/?clickid=PLACEHOLDER',
    slug: 'zenbusiness',
    cta: 'Visit ZenBusiness',
    network: 'awin',
    commission: '$60–$100/sale',
    cookieDays: 30,
    position: 'Best for Beginners',
    logo: '/logos/zenbusiness.svg',
  },
  legalzoom: {
    id: 'legalzoom',
    name: 'LegalZoom',
    shortName: 'LegalZoom',
    url: 'https://www.legalzoom.com/?irclickid=PLACEHOLDER',
    slug: 'legalzoom',
    cta: 'Visit LegalZoom',
    network: 'impact',
    commission: '15% (~$37–$125)',
    cookieDays: 30,
    position: 'Best-Known Brand',
    logo: '/logos/legalzoom.svg',
  },
  bizee: {
    id: 'bizee',
    name: 'Bizee',
    shortName: 'Bizee',
    url: 'https://www.bizee.com/?utm_source=PLACEHOLDER',
    slug: 'bizee',
    cta: 'Visit Bizee',
    network: 'direct',
    commission: 'Up to $175/sale',
    cookieDays: 30,
    position: 'Best Free Option',
    logo: '/logos/bizee.svg',
  },
  llcattorney: {
    id: 'llcattorney',
    name: 'LLC Attorney',
    shortName: 'LLC Attorney',
    url: 'https://llcattorney.com/?irclickid=PLACEHOLDER',
    slug: 'llc-attorney',
    cta: 'Visit LLC Attorney',
    network: 'impact',
    commission: '$150–$220/sale',
    cookieDays: 90,
    position: 'Best for Legal Protection',
    logo: '/logos/llcattorney.svg',
  },
} as const;

/** Get the affiliate URL for a given service key */
export function getAffiliateUrl(serviceId: keyof typeof affiliatePrograms): string {
  return affiliatePrograms[serviceId]?.url ?? '#';
}

/** Get the /go/ redirect URL for a given service key */
export function getRedirectUrl(serviceId: keyof typeof affiliatePrograms): string {
  const program = affiliatePrograms[serviceId];
  return program ? `/go/${program.slug}/` : '#';
}

/** Get all affiliate programs as an array, optionally sorted by a field */
export function getAllPrograms(): AffiliateProgram[] {
  return Object.values(affiliatePrograms);
}
