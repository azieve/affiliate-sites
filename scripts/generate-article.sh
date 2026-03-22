#!/usr/bin/env bash
#
# generate-article.sh
# Picks the next keyword from the master list and uses Claude CLI to generate
# an SEO article, then writes it as MDX to the blog content collection.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
KEYWORDS_CSV="$PROJECT_DIR/data/keywords/llc_keyword_master_list.csv"
PROGRESS_FILE="$PROJECT_DIR/data/keywords/progress.json"
BLOG_DIR="$PROJECT_DIR/src/content/blog"
LOG_FILE="$PROJECT_DIR/data/keywords/generation.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# ── Read progress ──────────────────────────────────────────────────
if [ ! -f "$PROGRESS_FILE" ]; then
  echo '{"next_index": 1, "completed": []}' > "$PROGRESS_FILE"
fi

NEXT_INDEX=$(python3 -c "import json; print(json.load(open('$PROGRESS_FILE'))['next_index'])")
log "Next keyword index: $NEXT_INDEX"

# ── Read the keyword row from CSV ──────────────────────────────────
# CSV columns: Priority #, Phase, Keyword, Est. Monthly Volume, Est. KD,
#              Difficulty Tier, Search Intent, Article Type, Category, Notes
TOTAL_ROWS=$(tail -n +2 "$KEYWORDS_CSV" | wc -l | tr -d ' ')

if [ "$NEXT_INDEX" -gt "$TOTAL_ROWS" ]; then
  log "All $TOTAL_ROWS keywords have been processed. Nothing to do."
  exit 0
fi

# Extract the row (1-indexed, skip header)
ROW=$(sed -n "$((NEXT_INDEX + 1))p" "$KEYWORDS_CSV")

PRIMARY_KEYWORD=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[2])
")

CATEGORY=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[8])
")

SEARCH_INTENT=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[6])
")

ARTICLE_TYPE=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[7])
")

PHASE=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[1])
")

DIFFICULTY=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[5])
")

NOTES=$(echo "$ROW" | python3 -c "
import sys, csv
row = list(csv.reader([sys.stdin.read().strip()]))[0]
print(row[9] if len(row) > 9 else '')
")

log "Generating article for: $PRIMARY_KEYWORD (Category: $CATEGORY, Intent: $SEARCH_INTENT)"

# ── Build the list of existing blog posts for internal linking ─────
EXISTING_POSTS=""
if [ -d "$BLOG_DIR" ]; then
  for f in "$BLOG_DIR"/*.mdx; do
    [ -f "$f" ] || continue
    slug=$(basename "$f" .mdx)
    title=$(grep '^title:' "$f" | head -1 | sed 's/^title: *"\?\(.*\)"\?$/\1/')
    EXISTING_POSTS="$EXISTING_POSTS
- /blog/$slug/ — $title"
  done
fi

# Also include the static pages for internal linking
STATIC_PAGES="
- /best-llc-services/ — Best LLC Formation Services (main comparison hub)
- /reviews/northwest-registered-agent/ — Northwest Registered Agent Review
- /reviews/zenbusiness/ — ZenBusiness Review
- /reviews/legalzoom/ — LegalZoom Review
- /reviews/bizee/ — Bizee Review
- /reviews/llc-attorney/ — LLC Attorney Review
- /compare/zenbusiness-vs-legalzoom/ — ZenBusiness vs LegalZoom
- /compare/northwest-vs-zenbusiness/ — Northwest vs ZenBusiness
- /learn/what-is-an-llc/ — What Is an LLC?
- /learn/how-much-does-an-llc-cost/ — How Much Does an LLC Cost?
- /learn/llc-vs-sole-proprietorship/ — LLC vs Sole Proprietorship
- /learn/llc-vs-s-corp/ — LLC vs S-Corp
- /learn/llc-operating-agreement/ — LLC Operating Agreement Guide
- /learn/boi-report-guide/ — BOI Report Guide
- /learn/what-is-a-registered-agent/ — What Is a Registered Agent?
- /start-llc/texas/ — How to Start an LLC in Texas
- /start-llc/florida/ — How to Start an LLC in Florida
- /start-llc/california/ — How to Start an LLC in California
- /start-llc/delaware/ — How to Start an LLC in Delaware
- /llc-for/freelancers/ — LLC for Freelancers
- /blog/ — Blog listing page"

# ── Generate slug from keyword ─────────────────────────────────────
SLUG=$(echo "$PRIMARY_KEYWORD" | python3 -c "
import sys, re
kw = sys.stdin.read().strip()
# Remove [year] placeholder
kw = re.sub(r'\[year\]', '$(date +%Y)', kw)
# Slugify
slug = re.sub(r'[^a-z0-9]+', '-', kw.lower()).strip('-')
# Trim to reasonable length
if len(slug) > 80:
    slug = slug[:80].rsplit('-', 1)[0]
print(slug)
")

TODAY=$(date +%Y-%m-%d)
CURRENT_YEAR=$(date +%Y)

# Replace [year] in keyword for display
DISPLAY_KEYWORD=$(echo "$PRIMARY_KEYWORD" | sed "s/\[year\]/$CURRENT_YEAR/g")

OUTPUT_FILE="$BLOG_DIR/$SLUG.mdx"

if [ -f "$OUTPUT_FILE" ]; then
  log "Article already exists: $OUTPUT_FILE — skipping"
  # Still advance the counter
  python3 -c "
import json
p = json.load(open('$PROGRESS_FILE'))
p['next_index'] = $NEXT_INDEX + 1
p['completed'].append({'index': $NEXT_INDEX, 'keyword': '''$PRIMARY_KEYWORD''', 'slug': '$SLUG', 'date': '$TODAY', 'skipped': True})
json.dump(p, open('$PROGRESS_FILE', 'w'), indent=2)
"
  exit 0
fi

# ── Build the Claude prompt via Python (avoids shell escaping issues) ──
log "Calling Claude CLI to generate article..."

PROMPT_FILE=$(mktemp)
export DISPLAY_KEYWORD CATEGORY SEARCH_INTENT ARTICLE_TYPE DIFFICULTY NOTES TODAY STATIC_PAGES EXISTING_POSTS
export KEYWORD_INDEX="$NEXT_INDEX"
python3 "$SCRIPT_DIR/build-prompt.py" > "$PROMPT_FILE"

if claude --print --model sonnet < "$PROMPT_FILE" > "$OUTPUT_FILE" 2>>"$LOG_FILE"; then
  rm -f "$PROMPT_FILE"
  log "Article generated successfully: $OUTPUT_FILE"
else
  rm -f "$PROMPT_FILE"
  log "ERROR: Claude CLI failed for keyword: $PRIMARY_KEYWORD"
  rm -f "$OUTPUT_FILE"
  exit 1
fi

# ── Validate the output has frontmatter ────────────────────────────
python3 "$SCRIPT_DIR/fix-mdx-output.py" "$OUTPUT_FILE" 2>>"$LOG_FILE" || {
    log "ERROR: Failed to validate/fix output. Removing broken file."
    rm -f "$OUTPUT_FILE"
    exit 1
  }

# ── Update progress ────────────────────────────────────────────────
python3 -c "
import json
p = json.load(open('$PROGRESS_FILE'))
p['next_index'] = $NEXT_INDEX + 1
p['completed'].append({
    'index': $NEXT_INDEX,
    'keyword': '''$PRIMARY_KEYWORD''',
    'slug': '$SLUG',
    'date': '$TODAY',
    'skipped': False
})
json.dump(p, open('$PROGRESS_FILE', 'w'), indent=2)
"

log "Progress updated. Next index: $((NEXT_INDEX + 1))"
log "Article published at: /blog/$SLUG/"

# ── Commit and push to trigger Vercel deploy ───────────────────────
cd "$PROJECT_DIR"
git add "$OUTPUT_FILE" "$PROGRESS_FILE"
git commit -m "$(cat <<EOF
Add blog article: $DISPLAY_KEYWORD

Auto-generated SEO article targeting: $DISPLAY_KEYWORD
Category: $CATEGORY | Intent: $SEARCH_INTENT
Published to: /blog/$SLUG/
EOF
)"

git push origin main 2>>"$LOG_FILE" && {
  log "Pushed to GitHub — Vercel deploy triggered."
} || {
  log "ERROR: git push failed. Article committed locally but not deployed."
}
