#!/usr/bin/env python3
"""
Pulls Search Console performance data and surfaces low-CTR opportunities —
queries and pages with strong impressions but weak click-through, which is
where rewriting the <title> and meta description has the biggest payoff.

Usage:
    /usr/bin/python3 scripts/analyze-search-console.py [--days 28] [--min-impressions 50]
"""
import argparse
import datetime as dt
import json
import sys
import warnings
from collections import defaultdict

warnings.filterwarnings("ignore", category=FutureWarning)

from google.oauth2 import service_account
from googleapiclient.discovery import build

GCLOUD_KEY_FILE = '/Users/alonzieve/.config/gcloud/topbestllc-search-console.json'
GCLOUD_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SITE_URL = 'sc-domain:topbestllcservice.com'


def get_service():
    creds = service_account.Credentials.from_service_account_file(
        GCLOUD_KEY_FILE, scopes=GCLOUD_SCOPES
    )
    return build('searchconsole', 'v1', credentials=creds, cache_discovery=False)


def query(service, start, end, dimensions, row_limit=25000, filters=None):
    body = {
        'startDate': start,
        'endDate': end,
        'dimensions': dimensions,
        'rowLimit': row_limit,
        'dataState': 'final',
    }
    if filters:
        body['dimensionFilterGroups'] = [{'filters': filters}]
    rows = []
    start_row = 0
    while True:
        body['startRow'] = start_row
        resp = service.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
        batch = resp.get('rows', [])
        rows.extend(batch)
        if len(batch) < row_limit:
            break
        start_row += row_limit
    return rows


def fmt_pct(x):
    return f"{x * 100:.2f}%"


def expected_ctr(position):
    """Rough industry-average CTR by SERP position (organic, mixed intent)."""
    table = {
        1: 0.275, 2: 0.155, 3: 0.10, 4: 0.075, 5: 0.057,
        6: 0.045, 7: 0.036, 8: 0.030, 9: 0.025, 10: 0.022,
    }
    p = max(1, min(10, int(round(position))))
    return table.get(p, 0.02)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--days', type=int, default=28)
    parser.add_argument('--min-impressions', type=int, default=50)
    parser.add_argument('--max-position', type=float, default=20.0,
                        help='Only flag rows ranking better than this (lower = higher).')
    parser.add_argument('--top', type=int, default=30, help='How many rows to show per section.')
    parser.add_argument('--json-out', type=str, default=None,
                        help='Optional path to dump full results as JSON.')
    args = parser.parse_args()

    end = dt.date.today() - dt.timedelta(days=2)  # GSC data lag
    start = end - dt.timedelta(days=args.days)
    print(f"Range: {start} → {end}  ({args.days} days)")
    print(f"Site:  {SITE_URL}\n")

    service = get_service()

    # ── 1) Page-level summary ────────────────────────────────────────────
    pages = query(service, start.isoformat(), end.isoformat(), ['page'])
    pages_sorted = sorted(pages, key=lambda r: r['impressions'], reverse=True)

    print(f"━━━ TOP PAGES BY IMPRESSIONS (top {args.top}) ━━━")
    print(f"{'CTR':>8}  {'Imp':>8}  {'Clk':>6}  {'Pos':>6}  Page")
    for r in pages_sorted[:args.top]:
        page = r['keys'][0]
        print(f"{fmt_pct(r['ctr']):>8}  {r['impressions']:>8.0f}  "
              f"{r['clicks']:>6.0f}  {r['position']:>6.1f}  {page}")
    print()

    # ── 2) Query-level low-CTR opportunities ─────────────────────────────
    queries = query(service, start.isoformat(), end.isoformat(), ['query', 'page'])
    opps = []
    for r in queries:
        imp = r['impressions']
        pos = r['position']
        ctr = r['ctr']
        if imp < args.min_impressions:
            continue
        if pos > args.max_position:
            continue
        exp = expected_ctr(pos)
        gap = exp - ctr  # positive means underperforming expected CTR
        missed_clicks = gap * imp
        opps.append({
            'query': r['keys'][0],
            'page': r['keys'][1],
            'impressions': imp,
            'clicks': r['clicks'],
            'ctr': ctr,
            'expected_ctr': exp,
            'position': pos,
            'gap': gap,
            'missed_clicks': missed_clicks,
        })

    opps.sort(key=lambda x: x['missed_clicks'], reverse=True)

    print(f"━━━ LOW-CTR OPPORTUNITIES — query+page, ranked by est. missed clicks ━━━")
    print(f"(filters: impressions ≥ {args.min_impressions}, position ≤ {args.max_position})\n")
    print(f"{'Miss':>5}  {'Pos':>5}  {'Imp':>6}  {'Clk':>4}  {'CTR':>7}  {'Exp':>6}  Query  →  Page")
    for o in opps[:args.top]:
        page_short = o['page'].replace('https://topbestllcservice.com', '')
        print(f"{o['missed_clicks']:>5.0f}  {o['position']:>5.1f}  "
              f"{o['impressions']:>6.0f}  {o['clicks']:>4.0f}  "
              f"{fmt_pct(o['ctr']):>7}  {fmt_pct(o['expected_ctr']):>6}  "
              f"{o['query']}  →  {page_short}")
    print()

    # ── 3) Roll up opportunities by page ─────────────────────────────────
    by_page = defaultdict(lambda: {
        'impressions': 0, 'clicks': 0, 'missed_clicks': 0.0,
        'queries': [], 'avg_position': 0.0, '_pos_weight': 0.0,
    })
    for o in opps:
        b = by_page[o['page']]
        b['impressions'] += o['impressions']
        b['clicks'] += o['clicks']
        b['missed_clicks'] += o['missed_clicks']
        b['queries'].append((o['query'], o['impressions'], o['ctr'], o['position']))
        b['_pos_weight'] += o['position'] * o['impressions']
    for b in by_page.values():
        b['avg_position'] = b['_pos_weight'] / b['impressions'] if b['impressions'] else 0
        b['queries'].sort(key=lambda q: q[1], reverse=True)
        del b['_pos_weight']

    pages_ranked = sorted(by_page.items(), key=lambda kv: kv[1]['missed_clicks'], reverse=True)
    print(f"━━━ PAGES WITH MOST UNCAPTURED CTR (top {args.top}) ━━━")
    for page, b in pages_ranked[:args.top]:
        page_short = page.replace('https://topbestllcservice.com', '')
        print(f"\n  {page_short}")
        print(f"    impressions={b['impressions']:.0f}  clicks={b['clicks']:.0f}  "
              f"avg_pos={b['avg_position']:.1f}  est_missed_clicks={b['missed_clicks']:.0f}")
        for q, imp, ctr, pos in b['queries'][:5]:
            print(f"      • {q!r:<55} imp={imp:.0f}  ctr={fmt_pct(ctr)}  pos={pos:.1f}")
    print()

    if args.json_out:
        with open(args.json_out, 'w') as f:
            json.dump({
                'range': {'start': start.isoformat(), 'end': end.isoformat()},
                'opportunities': opps,
                'pages': [{'page': p, **b} for p, b in pages_ranked],
            }, f, indent=2, default=str)
        print(f"Full results written to {args.json_out}")


if __name__ == '__main__':
    main()
