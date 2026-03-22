/**
 * SITE-WIDE CONFIGURATION
 */

export const siteConfig = {
  name: 'TopBestLLCService.com',
  shortName: 'TopBestLLC',
  url: 'https://topbestllcservice.com',
  description:
    'Expert reviews and comparisons of the best LLC formation services. Find the right service for your business with our in-depth guides.',
  operator: 'Eximia Ltd',
  currentYear: new Date().getFullYear(),
  lastUpdated: '2026-03-22',

  // SEO
  defaultOgImage: '/og-default.png',
  twitterHandle: '', // Set when available

  // Navigation
  mainNav: [
    {
      label: 'Reviews',
      href: '/best-llc-services/',
      children: [
        { label: 'Best LLC Services 2026', href: '/best-llc-services/' },
        { label: 'Northwest Review', href: '/reviews/northwest-registered-agent/' },
        { label: 'ZenBusiness Review', href: '/reviews/zenbusiness/' },
        { label: 'LegalZoom Review', href: '/reviews/legalzoom/' },
        { label: 'Bizee Review', href: '/reviews/bizee/' },
        { label: 'LLC Attorney Review', href: '/reviews/llc-attorney/' },
      ],
    },
    {
      label: 'Resources',
      href: '/start-llc/',
      children: [
        { label: 'Start an LLC by State', href: '/start-llc/' },
        { label: 'What Is an LLC?', href: '/learn/what-is-an-llc/' },
        { label: 'LLC Cost Guide', href: '/learn/how-much-does-an-llc-cost/' },
        { label: 'LLC Operating Agreement', href: '/learn/llc-operating-agreement/' },
        { label: 'BOI Report Guide', href: '/learn/boi-report-guide/' },
      ],
    },
    {
      label: 'Insights',
      href: '/compare/',
      children: [
        { label: 'ZenBusiness vs LegalZoom', href: '/compare/zenbusiness-vs-legalzoom/' },
        { label: 'Northwest vs ZenBusiness', href: '/compare/northwest-vs-zenbusiness/' },
        { label: 'LLC for Freelancers', href: '/llc-for/freelancers/' },
        { label: 'LLC vs Sole Proprietorship', href: '/learn/llc-vs-sole-proprietorship/' },
        { label: 'LLC vs S-Corp', href: '/learn/llc-vs-s-corp/' },
      ],
    },
  ],

  footerLinks: {
    company: [
      { label: 'About', href: '/about/' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms of Use', href: '/terms/' },
      { label: 'Contact', href: '/contact/' },
    ],
    reviews: [
      { label: 'Best LLC Services', href: '/best-llc-services/' },
      { label: 'Northwest Review', href: '/reviews/northwest-registered-agent/' },
      { label: 'ZenBusiness Review', href: '/reviews/zenbusiness/' },
      { label: 'LegalZoom Review', href: '/reviews/legalzoom/' },
    ],
    guides: [
      { label: 'Start an LLC in Texas', href: '/start-llc/texas/' },
      { label: 'Start an LLC in Florida', href: '/start-llc/florida/' },
      { label: 'Start an LLC in California', href: '/start-llc/california/' },
      { label: 'Start an LLC in Delaware', href: '/start-llc/delaware/' },
    ],
  },

  // Disclosure text
  commissionBannerText:
    'We earn commissions from brands listed on this site, which influences how listings are presented.',
  disclosureText:
    'Some of the links in this article are affiliate links, meaning we may earn a commission if you click through and make a purchase, at no additional cost to you. We only recommend services we\'ve researched and believe will be genuinely helpful.',
} as const;
