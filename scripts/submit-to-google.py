#!/usr/bin/env python3
"""
Submits new content to search engines after publication.

1. IndexNow — instant indexing for Bing, Yandex, and other participating engines
2. Google Search Console — sitemap resubmission to nudge Google

Usage: python3 submit-to-google.py <url>
"""
import json
import sys
import warnings
import urllib.request
import urllib.error

warnings.filterwarnings("ignore")

SITE_URL = 'https://topbestllcservice.com'
SITE_HOST = 'topbestllcservice.com'
SITEMAP_URL = f'{SITE_URL}/sitemap-index.xml'
INDEXNOW_KEY = 'b008aed07bd64818b3690609d16370c9'
INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

# Google Search Console
GCLOUD_KEY_FILE = '/Users/alonzieve/.config/gcloud/topbestllc-search-console.json'
GCLOUD_SCOPES = ['https://www.googleapis.com/auth/webmasters']


def submit_indexnow(url):
    """Submit URL to IndexNow (Bing, Yandex, and other participating engines)."""
    payload = json.dumps({
        'host': SITE_HOST,
        'key': INDEXNOW_KEY,
        'keyLocation': f'{SITE_URL}/{INDEXNOW_KEY}.txt',
        'urlList': [url],
    }).encode('utf-8')

    req = urllib.request.Request(
        INDEXNOW_ENDPOINT,
        data=payload,
        headers={'Content-Type': 'application/json; charset=utf-8'},
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"IndexNow submitted ({resp.status}): {url}")
            return True
    except urllib.error.HTTPError as e:
        print(f"WARNING: IndexNow submission failed ({e.code}): {url}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"WARNING: IndexNow submission failed: {e}", file=sys.stderr)
        return False


def submit_google_sitemap():
    """Resubmit sitemap via Google Search Console API."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    creds = service_account.Credentials.from_service_account_file(
        GCLOUD_KEY_FILE, scopes=GCLOUD_SCOPES
    )
    service = build('searchconsole', 'v1', credentials=creds)
    service.sitemaps().submit(
        siteUrl='sc-domain:topbestllcservice.com',
        feedpath=SITEMAP_URL,
    ).execute()
    print(f"Google sitemap resubmitted: {SITEMAP_URL}")


if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else None
    if not url:
        print("Usage: python3 submit-to-google.py <url>", file=sys.stderr)
        sys.exit(1)

    print(f"New content published: {url}")

    # IndexNow (Bing + others)
    submit_indexnow(url)

    # Google Search Console
    try:
        submit_google_sitemap()
    except Exception as e:
        print(f"WARNING: Google sitemap submission failed: {e}", file=sys.stderr)
