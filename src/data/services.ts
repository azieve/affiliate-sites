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
    bestFor: 'Best Overall Value',
    position: '#1 Best Overall',
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
  zenbusiness: {
    id: 'zenbusiness',
    name: 'ZenBusiness',
    shortName: 'ZenBusiness',
    tagline: 'Simple, affordable LLC formation for beginners',
    rating: 9.2,
    ratingLabel: 'Excellent',
    formationPrice: '$0',
    registeredAgentPrice: '$199/year',
    yearFounded: 2015,
    trustpilotRating: 4.8,
    trustpilotReviews: 18000,
    bestFor: 'Best for Beginners',
    position: '#2 Easiest to Use',
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
    rating: 8.5,
    ratingLabel: 'Very Good',
    formationPrice: '$0',
    registeredAgentPrice: '$299/year',
    yearFounded: 2001,
    trustpilotRating: 4.5,
    trustpilotReviews: 8000,
    bestFor: 'Best-Known Brand',
    position: '#3 Most Trusted Brand',
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
    bestFor: 'Best Free Option',
    position: '#4 Best Free Formation',
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
    position: '#5 Best Attorney-Backed',
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

/** Get all services sorted by rating (highest first) */
export function getAllServicesSorted(): ServiceProvider[] {
  return Object.values(services).sort((a, b) => b.rating - a.rating);
}

/** Get services ranked 1-N */
export function getRankedServices(): (ServiceProvider & { rank: number })[] {
  return getAllServicesSorted().map((service, index) => ({
    ...service,
    rank: index + 1,
  }));
}
