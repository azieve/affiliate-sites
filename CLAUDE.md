# TopBestLLCService.com

Affiliate SEO site that reviews and compares LLC formation services, targeting people who need help starting an LLC.

## Project Goals

- Rank for LLC formation keywords (service reviews, state guides, educational content)
- Monetize via affiliate commissions from LLC formation services (Northwest, ZenBusiness, LegalZoom, Bizee, LLC Attorney)
- Publish 2 SEO-optimized blog articles daily via automated content generation
- Build topical authority across LLC formation, state-by-state guides, and business compliance

## Stack

- **Framework:** Astro 6 with MDX content collections
- **Styling:** Tailwind CSS 4
- **Node.js:** >= 22.12.0 (use `/opt/homebrew/opt/node@22/bin/node` on this machine)
- **Hosting:** Vercel (production deploys via GitHub Actions on push to `main`)
- **Repo:** `azieve/affiliate-sites` on GitHub
- **Domain:** topbestllcservice.com

## Site Structure

| Path | Content |
|---|---|
| `/reviews/[slug]/` | Individual service reviews (MDX content collection) |
| `/compare/[slug]/` | Head-to-head comparisons (MDX content collection) |
| `/blog/[slug]/` | SEO blog articles (MDX, auto-generated daily) |
| `/learn/[topic]/` | Educational guides (Astro pages) |
| `/start-llc/[state]/` | State-by-state LLC formation guides (Astro pages) |
| `/llc-for/[profession]/` | Industry-specific LLC guides (Astro pages) |
| `/best-llc-services/` | Main comparison hub page |
| `/go/[slug]/` | Affiliate redirect URLs (noindex, nofollow) |

## Key Data Files

- `src/data/affiliates.ts` — Central affiliate link registry (all services, URLs, commission info)
- `src/data/services.ts` — Service provider data (pricing, features, pros/cons)
- `src/data/site.ts` — Site config, navigation, disclosure text
- `data/keywords/llc_keyword_master_list.csv` — SEO keyword queue (100+ keywords with volume, difficulty, intent)
- `data/keywords/progress.json` — Tracks which keywords have been published

## Automated Content Generation

A launchd daemon generates and publishes blog articles automatically:

- **Plist:** `~/Library/LaunchAgents/com.topbestllcservice.generate-article.plist`
- **Schedule:** Daily at 9:00 AM and 3:00 PM
- **Pipeline:** `scripts/generate-article.sh` → `scripts/build-prompt.py` → Claude CLI (sonnet) → `scripts/fix-mdx-output.py`
- **Flow:** Reads next keyword from CSV → builds multi-expert prompt → generates MDX article → validates → git commits → pushes to trigger Vercel deploy
- **Logs:** `data/keywords/generation.log`, `data/keywords/launchd-stdout.log`

### Managing the cronjob

```bash
# Check status
launchctl list | grep topbestllcservice

# Reload after editing plist
launchctl unload ~/Library/LaunchAgents/com.topbestllcservice.generate-article.plist
launchctl load ~/Library/LaunchAgents/com.topbestllcservice.generate-article.plist

# Run manually
bash scripts/generate-article.sh
```

## Google APIs

### Indexing API

Script: `scripts/submit-to-google.py`

- Uses Google Indexing API to request re-crawling of URLs after publishing
- Credentials: `~/.config/gcloud/topbestllc-search-console.json` (service account)
- Called manually or after publishing new content

### Search Console

- Site is verified in Google Search Console
- Used for monitoring search performance (impressions, clicks, position)
- No automated Search Console API integration in the codebase (queries done manually)

## Deployment

- **Auto-deploy:** Push to `main` triggers GitHub Actions → Vercel production deploy
- **Vercel project:** `busy-murdock` (project ID in `.vercel/project.json`)
- **Required GitHub secret:** `VERCEL_TOKEN` — must be set in repo settings

## Git

- **Remote:** `azieve/affiliate-sites` (HTTPS)
- **GitHub account:** `azieve` (switch with `gh auth switch --user azieve` if needed)
- The daily article cronjob auto-commits and pushes to `main`

## SEO Components

- `src/components/seo/FAQSchema.astro` — FAQ accordion with JSON-LD structured data
- `src/components/seo/SchemaMarkup.astro` — Reusable schema generator (Organization, Article, Review, etc.)
- `src/components/seo/Breadcrumbs.astro` — Breadcrumb navigation with schema
- `src/utils/seo.ts` — SEO helper functions

## Content Conventions

- Blog articles use MDX with frontmatter (title, description, date, author, keywords)
- Two rotating authors: Sarah Mitchell (Business Formation Researcher), James Caldwell (Corporate Compliance & Tax Strategist)
- All affiliate links go through `/go/[slug]/` redirects with `rel="nofollow sponsored"`
- Articles must include above-fold affiliate link and disclosure snippet
- State guide pages are static Astro (not MDX) with inline Tailwind
