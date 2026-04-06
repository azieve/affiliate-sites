#!/usr/bin/env python3
"""
Submits a URL to Google's Indexing API for crawling.
Usage: python3 submit-to-google.py <url>
"""
import sys
import warnings
warnings.filterwarnings("ignore")

from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = '/Users/alonzieve/.config/gcloud/topbestllc-search-console.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']

def submit_url(url):
    creds = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    service = build('indexing', 'v3', credentials=creds)
    result = service.urlNotifications().publish(
        body={'url': url, 'type': 'URL_UPDATED'}
    ).execute()
    print(f"Submitted to Google Indexing API: {url}")
    return result

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 submit-to-google.py <url>")
        sys.exit(1)
    submit_url(sys.argv[1])
