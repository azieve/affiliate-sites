/**
 * CENTRAL AFFILIATE LINK REGISTRY
 *
 * This is the single source of truth for all affiliate links across the site.
 * To update a link, change it here — it updates everywhere automatically.
 *
 * All affiliate links should use the <AffiliateLink> component or the
 * getAffiliateUrl() helper, never hardcoded URLs.
 *
 * URL templates contain `XXXXX` (case-insensitive) where the per-page SID
 * is substituted at click time inside src/pages/go/[slug].astro. If no SID
 * is available (no same-origin referrer), the script falls back to `tbllc`.
 */

export interface AffiliateProgram {
  id: string;
  name: string;
  shortName: string;
  url: string;
  slug: string; // Used for /go/[slug] redirects
  cta: string;
  network: 'direct' | 'impact' | 'awin' | 'tune';
  commission: string;
  cookieDays: number;
  position: string;
  /**
   * Display priority (1 = highest). Drives ordering on the hub page,
   * comparison tables, and article-generation prompt.
   */
  priority: number;
  logo?: string; // path to logo in /public/logos/
}

export const affiliatePrograms: Record<string, AffiliateProgram> = {
  zenbusiness: {
    id: 'zenbusiness',
    name: 'ZenBusiness',
    shortName: 'ZenBusiness',
    url: 'https://www.awin1.com/cread.php?awinmid=102801&awinaffid=2099007&clickref=tbllc&clickref2=XXXXX&clickref3=tbllc&ued=https%3A%2F%2Fwww.zenbusiness.com%2Ffile%2Fllc-b',
    slug: 'zenbusiness',
    cta: 'Visit ZenBusiness',
    network: 'awin',
    commission: '$60–$100/sale',
    cookieDays: 30,
    position: 'Best Overall',
    priority: 1,
    logo: '/logos/zenbusiness.svg',
  },
  legalzoom: {
    id: 'legalzoom',
    name: 'LegalZoom',
    shortName: 'LegalZoom',
    url: 'https://legalzoomcominc.pxf.io/c/483168/2115401/26746?subId1=tbllc&subId2=XXXXX&subId3=tbllc',
    slug: 'legalzoom',
    cta: 'Visit LegalZoom',
    network: 'impact',
    commission: '15% (~$37–$125)',
    cookieDays: 30,
    position: 'Best-Known Brand',
    priority: 2,
    logo: '/logos/legalzoom.svg',
  },
  tailorbrands: {
    id: 'tailorbrands',
    name: 'Tailor Brands',
    shortName: 'Tailor Brands',
    url: 'https://tailorbrands.go2cloud.org/aff_c?offer_id=90&aff_id=5138&url_id=45&aff_sub2=tbllc&aff_sub3=XXXXX',
    slug: 'tailor-brands',
    cta: 'Visit Tailor Brands',
    network: 'tune',
    commission: 'Per-sale (rate varies by plan)',
    cookieDays: 30,
    position: 'Best for Branding',
    priority: 3,
    logo: '/logos/tailorbrands.svg',
  },
  incauthority: {
    id: 'incauthority',
    name: 'Inc Authority',
    shortName: 'Inc Authority',
    url: 'https://goto.incauthority.com/c/483168/3307621/34978?subId1=tbllc&subId2=XXXXX&subId3=tbllc',
    slug: 'inc-authority',
    cta: 'Visit Inc Authority',
    network: 'impact',
    commission: 'Per-sale (rate varies by upsell)',
    cookieDays: 30,
    position: 'Best for $0 Filing',
    priority: 4,
    logo: '/logos/incauthority.svg',
  },
  northwest: {
    id: 'northwest',
    name: 'Northwest Registered Agent',
    shortName: 'Northwest',
    url: 'https://www.awin1.com/cread.php?awinmid=66946&awinaffid=2263979&clickref=tbllc&clickref2=XXXXX&clickref3=tbllc',
    slug: 'northwest',
    cta: 'Visit Northwest',
    network: 'awin',
    commission: '$60/sale',
    cookieDays: 30,
    position: 'Best for Privacy',
    priority: 5,
    logo: '/logos/northwest.svg',
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
    priority: 6,
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
    priority: 7,
    logo: '/logos/llcattorney.webp',
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

/** Get all affiliate programs as an array, sorted by priority ascending */
export function getAllPrograms(): AffiliateProgram[] {
  return Object.values(affiliatePrograms).sort((a, b) => a.priority - b.priority);
}

/** Substitute the SID into a tracking URL template (replaces XXXXX, case-insensitive) */
export function normalizeAffiliateUrl(template: string, sid: string): string {
  return template.replace(/XXXXX/gi, sid);
}
