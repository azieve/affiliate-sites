import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    serviceId: z.string(),
    rating: z.number().min(0).max(10),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    authorRole: z.string().default('Business Formation Researcher'),
    authorBio: z.string().optional(),
    targetKeyword: z.string(),
    featuredImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/comparisons' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    serviceA: z.string(),
    serviceB: z.string(),
    winner: z.string().optional(),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    authorRole: z.string().default('Business Formation Researcher'),
    targetKeyword: z.string(),
    draft: z.boolean().default(false),
  }),
});

const states = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/states' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    state: z.string(),
    stateAbbr: z.string(),
    filingFee: z.number(),
    annualReportFee: z.string(),
    processingTime: z.string(),
    onlineFiling: z.boolean().default(true),
    sosUrl: z.string(),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    targetKeyword: z.string(),
    draft: z.boolean().default(false),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    category: z.enum(['basics', 'comparison', 'tax', 'compliance', 'advanced']),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    authorRole: z.string().default('Business Formation Researcher'),
    targetKeyword: z.string(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    publishDate: z.string(),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    authorRole: z.string().default('Business Formation Researcher'),
    authorBio: z.string().optional(),
    targetKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).default([]),
    category: z.string(),
    cluster: z.string().optional(),
    featuredImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const professions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/professions' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    profession: z.string(),
    topStates: z.array(z.string()).default([]),
    needsLLC: z.enum(['yes', 'recommended', 'depends', 'no']),
    lastUpdated: z.string(),
    author: z.string().default('Sarah Mitchell'),
    targetKeyword: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  reviews,
  comparisons,
  states,
  learn,
  professions,
  blog,
};
