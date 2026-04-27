#!/usr/bin/env python3
"""
Builds the article generation prompt from environment variables.
Outputs the prompt to stdout.

Expected env vars: DISPLAY_KEYWORD, CATEGORY, SEARCH_INTENT, ARTICLE_TYPE,
                   DIFFICULTY, NOTES, TODAY, STATIC_PAGES, EXISTING_POSTS
"""
import os
import sys

# Author rotation — cycles through the three available authors
AUTHORS = [
    {
        "name": "Sarah Mitchell",
        "role": "Business Formation Researcher",
        "bio": "Sarah has researched and tested over 20 LLC formation services since 2021. She has personally formed LLCs in 5 states.",
    },
    {
        "name": "James Caldwell",
        "role": "Corporate Compliance & Tax Strategist",
        "bio": "James Caldwell is a corporate compliance and tax strategist with over 15 years of experience helping small business owners navigate entity selection, tax planning, and regulatory requirements.",
    },
]

keyword_index = int(os.environ.get('KEYWORD_INDEX', '1'))
author = AUTHORS[(keyword_index - 1) % len(AUTHORS)]

kw = os.environ.get('DISPLAY_KEYWORD', '')
category = os.environ.get('CATEGORY', '')
intent = os.environ.get('SEARCH_INTENT', '')
article_type = os.environ.get('ARTICLE_TYPE', '')
difficulty = os.environ.get('DIFFICULTY', '')
notes = os.environ.get('NOTES', '')
today = os.environ.get('TODAY', '')
static_pages = os.environ.get('STATIC_PAGES', '')
existing_posts = os.environ.get('EXISTING_POSTS', '')

notes_line = f'**Notes:** {notes}' if notes else ''

prompt = f"""You are writing an SEO-optimized article for topbestllcservice.com, an LLC formation affiliate website.

**Primary keyword:** {kw}
**Category:** {category}
**Search Intent:** {intent}
**Article Type:** {article_type}
**Difficulty Tier:** {difficulty}
{notes_line}

## MULTI-EXPERT PROCESS

You must simulate a sequential multi-expert review process. Do NOT output intermediate steps — only output the final article. But internally, follow this process:

### Step 1: SEO Strategist Brief
As an SEO expert with 10+ years of experience in affiliate marketing content:
- Choose an engaging, SEO-optimized title (include primary keyword naturally)
- Write a meta description (150-160 chars)
- Plan the H1 (matches or closely mirrors title) and 4-6 H2 subheadings
- Set target word count: 1,500-4,500 words
- Specify keyword density: primary keyword 5-8 times, each secondary keyword 2-4 times
- Identify 3-5 internal links from the existing pages list that are relevant
- Identify the search intent and ensure the article fully satisfies it

### Step 2: Domain Expert Article Writing
Two experts collaboratively write the article:

**Expert A — Experienced CFO** that has deep understanding of company administration:
- Deep understanding of the nitty gritty of setting up a business
- Understanding of compliance and risks
- Understanding of how to get LLC setup efficiently without wasting time

**Expert B — Senior Corporate Lawyer** (top-tier firm, 20+ years):
- Provides practical advice on how to do things efficiently and by the book
- Covers tax implications, financial planning, and personal risk mitigation strategy
- Explains concepts in accessible terms for non-professionals

Together they write a comprehensive, authoritative article that:
- Is written in a professional but accessible tone (not academic, not salesy)
- Uses an authentic author voice — in at least one place, the author should offer a personal opinion, observation, or anecdote on the topic (e.g., "In my experience..." or "I've seen too many business owners...")
- Uses concrete examples, numbers, and scenarios where possible
- Includes GRANULAR DETAIL — specific pricing tiers, specific features per plan, specific gotchas and hidden costs. Google rewards specificity over generic overviews.
- Where reviewing or mentioning a service, includes brief comparison snippets against 1-2 competitors (e.g., "Unlike LegalZoom which charges $X for this, Northwest includes it free")
- References at least 2 reputable external websites or sources (e.g., SEC.gov, IRS publications, Harvard Business Review, TechCrunch, Bloomberg, other top news sites) with natural outbound links
- Where appropriate, references recent market events, IPOs, funding rounds, regulatory changes, or economic conditions to make the content feel timely and current
- Mentions the current year (2026) at least 3-4 times naturally in the body text, not just the title
- Naturally incorporates all keywords at the specified density
- Includes all planned internal links with natural anchor text
- Has a clear introduction, body with H2 sections, and conclusion
- MUST include a comprehensive FAQ section with 5-8 questions in "People Also Ask" format (e.g., "How much does it cost to...?", "Do I need a...?", "What happens if...?"). These should target common search queries related to the topic.
- Ensures that all mentions of relevant LLC formation providers use the relevant affiliate links from this list (listed in priority order):
  - ZenBusiness: [ZenBusiness](/go/zenbusiness/)
  - LegalZoom: [LegalZoom](/go/legalzoom/)
  - Tailor Brands: [Tailor Brands](/go/tailor-brands/)
  - Inc Authority: [Inc Authority](/go/inc-authority/)
  - Northwest Registered Agent: [Northwest Registered Agent](/go/northwest/)
  - Bizee: [Bizee](/go/bizee/)
  - LLC Attorney: [LLC Attorney](/go/llc-attorney/)
- SERVICE PRIORITIZATION (very important — this drives revenue):
  - Prefer **ZenBusiness** as the primary recommendation in narrative text, "best for X" callouts, and worked examples.
  - Use **LegalZoom** as the secondary recommendation.
  - Tailor Brands, Inc Authority, and Northwest may be mentioned in supporting roles or as alternatives.
  - Bizee and LLC Attorney should only be mentioned when directly relevant (e.g., comparing free options or attorney-backed formation specifically).
  - In any comparison table, list services in this exact order: ZenBusiness, LegalZoom, Tailor Brands, Inc Authority, Northwest, Bizee, LLC Attorney.
  - Do NOT lead with Northwest as the top recommendation in new articles. Northwest is now positioned as #5 (Best for Privacy) — appropriate to mention when privacy is the topic, not as the default first pick.
- IMPORTANT: At least one affiliate link MUST appear within the first 2-3 paragraphs of the article (above the fold). Weave it naturally into the intro text — e.g., mentioning a service name with pricing when discussing formation costs or process. Prefer ZenBusiness for the above-fold mention.

### Step 3: Dual Review
**SEO Expert Review:**
- Verify keyword density targets are met
- Check title tag, meta description, H1/H2 structure
- Ensure internal links are properly placed
- Verify readability and content depth for ranking

**Senior Securities Lawyer Review:**
- Flag any claims that could be misleading or non-compliant
- Ensure appropriate disclaimers where discussing returns, investment outcomes, or tax advice
- Verify that no statement could be construed as investment advice or a securities offering
- Add necessary qualifiers (e.g., "consult a tax professional," "past performance...")
- Ensure the article includes a disclaimer that the author name may be a fictional pseudonym

**CRITICAL: Compliance and accuracy ALWAYS take precedence over SEO optimization.**

**MANDATORY DISCLAIMER:** Every article MUST end with an italicized disclaimer paragraph that includes ALL of:
1. "The author name used in this article may be a pen name or pseudonym and is used for illustrative and editorial purposes only."
2. "This article is for informational purposes only and does not constitute investment, tax, or legal advice."
3. "Consult qualified professionals before making financial decisions."

### Step 4: Final Validation
Compare against the SEO brief:
- All keyword density targets met? If not, adjust.
- All H2s covered? If not, fill gaps.
- Word count in range (1,500-4,500)? If not, expand or trim.
- Internal links included? If not, add them.
- Compliance disclaimers present? If not, add them.

## EXISTING PAGES FOR INTERNAL LINKING

Choose 3-5 relevant pages from this list to link to naturally within the article:
{static_pages}
{existing_posts}

## OUTPUT FORMAT

CRITICAL FORMATTING RULES — read carefully:
1. Your response must start on the VERY FIRST LINE with exactly three dashes: ---
2. Do NOT wrap the output in markdown code fences
3. Do NOT add any text, commentary, or explanation before or after the MDX content
4. The ONLY thing you output is the raw MDX file content starting with ---

The frontmatter format:

---
title: "Your Article Title Here"
metaDescription: "150-160 character meta description here"
publishDate: "{today}"
lastUpdated: "{today}"
author: "{author['name']}"
authorRole: "{author['role']}"
authorBio: "{author['bio']}"
targetKeyword: "{kw}"
secondaryKeywords: ["keyword1", "keyword2", "keyword3"]
category: "{category}"
cluster: "{article_type}"
draft: false
---

After the closing --- of frontmatter, write the full article body in Markdown. Use ## for H2 headings. Do not include an H1. Use standard Markdown links. The article should be 1,500-4,500 words.

IMPORTANT: Start your response with --- on line 1. Nothing else before it.
"""

print(prompt)
