import { siteConfig } from '@/data/site';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/** Generate full meta title with site name suffix */
export function getMetaTitle(title: string): string {
  if (title.includes(siteConfig.shortName) || title.includes(siteConfig.name)) {
    return title;
  }
  return `${title} | ${siteConfig.shortName}`;
}

/** Generate canonical URL */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const withTrailingSlash = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${siteConfig.url}${withTrailingSlash}`;
}

/** Generate Organization schema */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    description: siteConfig.description,
  };
}

/** Generate Article schema */
export function getArticleSchema(props: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    url: props.url,
    datePublished: props.publishedTime,
    dateModified: props.modifiedTime,
    author: {
      '@type': 'Person',
      name: props.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(props.image && { image: props.image }),
  };
}

/** Generate Review schema */
export function getReviewSchema(props: {
  name: string;
  description: string;
  rating: number;
  author: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: props.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: props.rating,
      bestRating: 10,
      worstRating: 0,
    },
    author: {
      '@type': 'Person',
      name: props.author,
    },
    description: props.description,
    url: props.url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

/** Generate BreadcrumbList schema */
export function getBreadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${siteConfig.url}${item.href}`,
    })),
  };
}

/** Generate FAQPage schema */
export function getFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Format date for display */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Get rating label from numeric score */
export function getRatingLabel(score: number): string {
  if (score >= 9.0) return 'Excellent';
  if (score >= 8.0) return 'Very Good';
  if (score >= 7.0) return 'Good';
  if (score >= 6.0) return 'Above Average';
  if (score >= 5.0) return 'Average';
  return 'Below Average';
}

/** Get rating color class from score */
export function getRatingColor(score: number): string {
  if (score >= 9.0) return 'bg-green-600';
  if (score >= 8.0) return 'bg-lime-600';
  if (score >= 7.0) return 'bg-yellow-500';
  if (score >= 6.0) return 'bg-orange-500';
  return 'bg-red-500';
}
