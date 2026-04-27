/**
 * SERVICE PROVIDER DATA
 *
 * Centralized data about each LLC formation service.
 * Used by comparison tables, service cards, and review pages.
 * Update pricing/features here to change across all pages.
 */

export interface ServiceFeature {
  name: string;
  included: boolean;
  note?: string;
}

export interface ServicePlan {
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  rating: number; // 0-10 scale
  ratingLabel: string;
  formationPrice: string;
  registeredAgentPrice: string;
  yearFounded: number;
  trustpilotRating?: number;
  trustpilotReviews?: number;
  bestFor: string;
  position: string;
  /**
   * Display priority (1 = highest). Drives ordering of getRankedServices()
   * and getAllServicesSorted(). Must match the corresponding affiliate
   * program's `priority` field.
   */
  priority: number;
  pros: string[];
  cons: string[];
  plans: ServicePlan[];
  features: ServiceFeature[];
  processingTime: string;
  moneyBackGuarantee: boolean;
  customerSupport: string;
  statesCovered: number;
  reviewSlug: string;
}

export const services: Record<string, ServiceProvider> = {
  zenbusiness: {
    id: 'zenbusiness',
    name: 'ZenBusiness',
    shortName: 'ZenBusiness',
    tagline: 'Simple, modern LLC formation with the best all-around package',
    rating: 9.4,
    ratingLabel: 'Excellent',
    formationPrice: '$0',
    registeredAgentPrice: '$199/year',
    yearFounded: 2015,
    trustpilotRating: 4.8,
    trustpilotReviews: 18000,
    bestFor: 'Best Overall',
    position: '#1 Best Overall',
    priority: 1,
    pros: [
      '$0 formation (Starter plan) — just pay state fees',
      '4.8-star Trustpilot rating (18,000+ reviews)',
      'Clean, intuitive user interface',
      'Worry-Free Compliance included in Pro plan',
      'Operating agreement template included',
    ],
    cons: [
      'Registered agent costs $199/year (not included in Starter)',
      'Upselling during checkout can be aggressive',
      'Phone support limited to business hours',
    ],
    plans: [
      {
        name: 'Starter',
        price: '$0',
        priceNote: '+ state filing fee',
        features: [
          'Articles of Organization filing',
          'Operating agreement template',
          'Standard filing speed',
        ],
      },
      {
        name: 'Pro',
        price: '$199/year',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Starter',
          'Worry-Free Compliance',
          'EIN filing',
          'Expedited filing speed',
          'Banking resolution',
        ],
      },
      {
        name: 'Premium',
        price: '$349/year',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Pro',
          'Business website',
          'Domain name & email',
          'Customizable business website',
          'Rush filing speed',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: false, note: 'Pro plan and up' },
      { name: 'Operating Agreement', included: true },
      { name: 'EIN Filing', included: false, note: 'Pro plan and up' },
      { name: 'BOI Report Filing', included: true },
      { name: 'Compliance Alerts', included: false, note: 'Pro plan and up' },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '2-3 weeks (Standard), 4-6 days (Expedited)',
    moneyBackGuarantee: true,
    customerSupport: 'Phone, email, live chat',
    statesCovered: 50,
    reviewSlug: 'zenbusiness',
  },
  legalzoom: {
    id: 'legalzoom',
    name: 'LegalZoom',
    shortName: 'LegalZoom',
    tagline: 'The most trusted name in online legal services',
    rating: 8.7,
    ratingLabel: 'Very Good',
    formationPrice: '$0',
    registeredAgentPrice: '$299/year',
    yearFounded: 2001,
    trustpilotRating: 4.5,
    trustpilotReviews: 8000,
    bestFor: 'Best-Known Brand',
    position: '#2 Best-Known Brand',
    priority: 2,
    pros: [
      'Most recognized brand in legal services',
      '$0 Basic formation plan available',
      'Extensive add-on legal services',
      'Attorney consultations available',
      'Long track record (20+ years)',
    ],
    cons: [
      'Registered agent is $299/year — most expensive',
      'Aggressive upselling during checkout',
      'Basic plan is truly bare-bones',
      'Customer support can be slow',
    ],
    plans: [
      {
        name: 'Basic',
        price: '$0',
        priceNote: '+ state filing fee',
        features: [
          'Articles of Organization filing',
          'Name availability search',
          'Digital welcome packet',
        ],
      },
      {
        name: 'Pro',
        price: '$249',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Basic',
          'EIN filing',
          'Operating agreement',
          'Banking resolution',
          'Express shipping of documents',
        ],
      },
      {
        name: 'Premium',
        price: '$399',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Pro',
          'Business plan template',
          'Trademark search',
          'Unlimited attorney consultations (30 min)',
          'Annual compliance calendar',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: false, note: '$299/year add-on' },
      { name: 'Operating Agreement', included: false, note: 'Pro plan and up' },
      { name: 'EIN Filing', included: false, note: 'Pro plan and up' },
      { name: 'BOI Report Filing', included: false, note: 'Add-on service' },
      { name: 'Compliance Alerts', included: false, note: 'Premium plan' },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '7-10 business days (Standard), 5-7 (Expedited)',
    moneyBackGuarantee: true,
    customerSupport: 'Phone, email, live chat',
    statesCovered: 50,
    reviewSlug: 'legalzoom',
  },
  tailorbrands: {
    id: 'tailorbrands',
    name: 'Tailor Brands',
    shortName: 'Tailor Brands',
    tagline: 'AI-driven LLC formation bundled with logo, branding, and website tools',
    rating: 8.4,
    ratingLabel: 'Very Good',
    formationPrice: '$0',
    registeredAgentPrice: 'Add-on',
    yearFounded: 2014,
    trustpilotRating: 4.0,
    trustpilotReviews: 3000,
    bestFor: 'Best for Branding',
    position: '#3 Best for Branding',
    priority: 3,
    pros: [
      '$0 LLC formation on the Lite plan',
      'AI-powered logo maker and branding tools bundled in',
      'Same-day expedited filing on Essential and Elite plans',
      'All-in-one platform: LLC + branding + website',
      'Operating agreement included on every plan',
    ],
    cons: [
      'Standard 14 business days on the free plan',
      'Registered agent and EIN are paid add-ons',
      'Mixed Trustpilot reviews around auto-renewing subscriptions',
      'Branding focus may be unnecessary if you only want LLC filing',
    ],
    plans: [
      {
        name: 'Lite',
        price: '$0',
        priceNote: '+ state filing fee',
        features: [
          'LLC formation (14 business days)',
          'Operating agreement',
          'Annual compliance filing & updates',
          'Business coaching platform',
          'Basic branding tools (logos, website builder)',
        ],
      },
      {
        name: 'Essential',
        price: '$199/year',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Lite',
          '1 business day expedited LLC filing',
          '30-day invoicing & bookkeeping trial',
          'Business coaching program',
          '$30 Amazon gift card bonus',
        ],
      },
      {
        name: 'Elite',
        price: '$249/year',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Essential',
          'Domain name included',
          'Website hosting included',
          '$50 Amazon gift card bonus',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: false, note: 'Paid add-on' },
      { name: 'Operating Agreement', included: true },
      { name: 'EIN Filing', included: false, note: 'Paid add-on' },
      { name: 'BOI Report Filing', included: false, note: 'Paid add-on' },
      { name: 'Compliance Alerts', included: true, note: 'Annual filings included' },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '14 business days (Lite), 1 business day (Essential / Elite)',
    moneyBackGuarantee: false,
    customerSupport: 'Phone, email',
    statesCovered: 50,
    reviewSlug: 'tailor-brands',
  },
  incauthority: {
    id: 'incauthority',
    name: 'Inc Authority',
    shortName: 'Inc Authority',
    tagline: 'Truly free LLC formation with first-year registered agent included',
    rating: 8.6,
    ratingLabel: 'Very Good',
    formationPrice: '$0',
    registeredAgentPrice: 'Free (1st year)',
    yearFounded: 1989,
    trustpilotRating: 4.9,
    trustpilotReviews: 46000,
    bestFor: 'Best for $0 Filing',
    position: '#4 Best for $0 Filing',
    priority: 4,
    pros: [
      'Truly free LLC formation — only pay state filing fee',
      'Free registered agent service for the first year',
      '35+ years in the business formation industry',
      '4.9 Trustpilot rating (46,000+ reviews)',
      'Includes tax planning and business credit consultations',
    ],
    cons: [
      'Heavy upselling throughout the checkout flow',
      'Premium plan pricing not published — only revealed during signup',
      'Operating agreement and EIN are paid upsells',
      'Registered agent renews at a paid rate after year one',
    ],
    plans: [
      {
        name: 'Starter (Free)',
        price: '$0',
        priceNote: '+ state filing fee',
        features: [
          'Business name availability check',
          'LLC formation document prep & filing',
          'Free registered agent service (1 year)',
          'Tax planning consultation',
          'Business credit and funding analysis',
          'Digital document delivery',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: true },
      { name: 'Operating Agreement', included: false, note: 'Paid upsell' },
      { name: 'EIN Filing', included: false, note: 'Paid upsell' },
      { name: 'BOI Report Filing', included: false, note: 'Paid upsell' },
      { name: 'Compliance Alerts', included: false, note: 'Paid upsell' },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '10-15 business days (Standard)',
    moneyBackGuarantee: false,
    customerSupport: 'Phone, email (M-F 7:30am-5pm PT)',
    statesCovered: 50,
    reviewSlug: 'inc-authority',
  },
  northwest: {
    id: 'northwest',
    name: 'Northwest Registered Agent',
    shortName: 'Northwest',
    tagline: 'Privacy-focused formation with unmatched customer support',
    rating: 9.5,
    ratingLabel: 'Excellent',
    formationPrice: '$39',
    registeredAgentPrice: 'Free (1st year)',
    yearFounded: 1998,
    trustpilotRating: 4.9,
    trustpilotReviews: 2400,
    bestFor: 'Best for Privacy',
    position: '#5 Best for Privacy',
    priority: 5,
    pros: [
      'Only $39 for formation + free registered agent (1 year)',
      'Uses their own address on public filings for privacy',
      'Excellent customer support with real humans',
      'No upselling during checkout process',
      'Over 25 years in business',
    ],
    cons: [
      'Registered agent renewal is $125/year after first year',
      'No free EIN filing included',
      'Website design is less modern than competitors',
    ],
    plans: [
      {
        name: 'Formation Package',
        price: '$39',
        priceNote: '+ state filing fee',
        features: [
          'Articles of Organization filing',
          'Free registered agent (1 year)',
          'Privacy protection on filings',
          'Same-day filing processing',
          'Lifetime customer support',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: true },
      { name: 'Operating Agreement', included: true },
      { name: 'EIN Filing', included: false, note: 'Available as add-on' },
      { name: 'BOI Report Filing', included: true },
      { name: 'Compliance Alerts', included: true },
      { name: 'Privacy Protection', included: true },
    ],
    processingTime: 'Same day (+ state processing)',
    moneyBackGuarantee: true,
    customerSupport: 'Phone, email, live chat',
    statesCovered: 50,
    reviewSlug: 'northwest-registered-agent',
  },
  bizee: {
    id: 'bizee',
    name: 'Bizee',
    shortName: 'Bizee',
    tagline: 'Free LLC formation with the most features at $0',
    rating: 8.8,
    ratingLabel: 'Very Good',
    formationPrice: '$0',
    registeredAgentPrice: 'Free (1st year)',
    yearFounded: 2004,
    trustpilotRating: 4.7,
    trustpilotReviews: 32000,
    bestFor: 'Best Free Plus',
    position: '#6 Best Free Plus',
    priority: 6,
    pros: [
      '$0 formation + free registered agent (1 year)',
      'Highest volume of positive reviews (32,000+)',
      'Includes more features at $0 than competitors',
      'Dashboard with compliance tracking',
      'Free business tax consultation',
    ],
    cons: [
      'Website can feel cluttered',
      'Significant upselling during checkout',
      'Operating agreement not included in free plan',
    ],
    plans: [
      {
        name: 'Free',
        price: '$0',
        priceNote: '+ state filing fee',
        features: [
          'Articles of Organization filing',
          'Free registered agent (1 year)',
          'Business tax consultation',
          'Compliance tracking dashboard',
        ],
      },
      {
        name: 'Essentials',
        price: '$199/year',
        priceNote: '+ state filing fee',
        features: [
          'Everything in Free',
          'EIN filing',
          'Operating agreement',
          'Banking resolution',
          'Business email',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: true },
      { name: 'Operating Agreement', included: false, note: 'Essentials plan' },
      { name: 'EIN Filing', included: false, note: 'Essentials plan' },
      { name: 'BOI Report Filing', included: false, note: 'Add-on service' },
      { name: 'Compliance Alerts', included: true },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '3-5 business days',
    moneyBackGuarantee: true,
    customerSupport: 'Phone, email',
    statesCovered: 50,
    reviewSlug: 'bizee',
  },
  llcattorney: {
    id: 'llcattorney',
    name: 'LLC Attorney',
    shortName: 'LLC Attorney',
    tagline: 'Attorney-backed LLC formation for maximum legal protection',
    rating: 8.7,
    ratingLabel: 'Very Good',
    formationPrice: '$49',
    registeredAgentPrice: '$100/year',
    yearFounded: 2020,
    bestFor: 'Best for Legal Protection',
    position: '#7 Best for Legal Protection',
    priority: 7,
    pros: [
      'Actual attorneys review your formation documents',
      'Operating agreement drafted by attorneys included',
      'Compliance monitoring included',
      '90-day affiliate cookie (longest in niche)',
      'Strong focus on legal compliance',
    ],
    cons: [
      'Newer company (less track record)',
      'Fewer user reviews available',
      'Higher base price than free alternatives',
    ],
    plans: [
      {
        name: 'Standard',
        price: '$49',
        priceNote: '+ state filing fee',
        features: [
          'Articles of Organization filing',
          'Attorney-drafted operating agreement',
          'EIN filing',
          'Compliance monitoring',
          'Registered agent (1 year)',
        ],
      },
    ],
    features: [
      { name: 'LLC Formation', included: true },
      { name: 'Registered Agent (1 year)', included: true },
      { name: 'Operating Agreement', included: true, note: 'Attorney-drafted' },
      { name: 'EIN Filing', included: true },
      { name: 'BOI Report Filing', included: true },
      { name: 'Compliance Alerts', included: true },
      { name: 'Privacy Protection', included: false },
    ],
    processingTime: '3-5 business days',
    moneyBackGuarantee: true,
    customerSupport: 'Phone, email',
    statesCovered: 50,
    reviewSlug: 'llc-attorney',
  },
};

/** Get a service by its ID */
export function getService(id: string): ServiceProvider | undefined {
  return services[id];
}

/** Get all services sorted by display priority (lowest priority number first) */
export function getAllServicesSorted(): ServiceProvider[] {
  return Object.values(services).sort((a, b) => a.priority - b.priority);
}

/** Get services ranked 1-N by priority */
export function getRankedServices(): (ServiceProvider & { rank: number })[] {
  return getAllServicesSorted().map((service, index) => ({
    ...service,
    rank: index + 1,
  }));
}
