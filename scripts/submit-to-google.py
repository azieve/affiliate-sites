#!/usr/bin/env python3
"""
Logs new content publication and submits sitemap to Google Search Console.

Google deprecated the sitemap ping endpoint and the Indexing API only works
for JobPosting/BroadcastEvent schema. The reliable approach is:
  1. Sitemap includes <lastmod> dates (handled by Astro sitemap integration)
  2. Sitemap is registered in Search Console (one-time manual step)
  3. This script resubmits via Search Console API to nudge Google

Usage: python3 submit-to-google.py <url>
"""
import sys
import warnings
warnings.filterwarnings("ignore")

SITE_URL = 'https://topbestllcservice.com'
SITEMAP_URL = f'{SITE_URL}/sitemap-index.xml'
KEY_FILE = '/Users/alonzieve/.config/gcloud/topbestllc-search-console.json'
SCOPES = ['https://www.googleapis.com/auth/webmasters']

def submit_sitemap():
    """Resubmit sitemap via Search Console API."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('searchconsole', 'v1', credentials=creds)
    service.sitemaps().submit(
        siteUrl=SITE_URL,
        feedpath=SITEMAP_URL,
    ).execute()
    print(f"Sitemap resubmitted via Search Console API: {SITEMAP_URL}")

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else None
    if url:
        print(f"New content published: {url}")

    try:
        submit_sitemap()
    except Exception as e:
        print(f"WARNING: Sitemap submission failed: {e}", file=sys.stderr)
        print("Ensure the service account has Owner access in Search Console", file=sys.stderr)
        print("and the webmasters scope is authorized.", file=sys.stderr)
