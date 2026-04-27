#!/usr/bin/env python3
"""
Generate the SID → page-path registry.

Walks the built `dist/` directory (or, if no build exists yet, the source
tree under src/pages and src/content) and emits data/sid-registry.json
mapping each 8-char SID to the page pathname it represents.

Usage:
    python3 scripts/generate-sid-registry.py            # run after `pnpm build`
    python3 scripts/generate-sid-registry.py --lookup k7m2q9x3
    python3 scripts/generate-sid-registry.py --reverse-lookup /blog/foo

The hash algorithm here MUST match getPageSid() in src/utils/sid.ts and
the inline JS in src/pages/go/[slug].astro. If you change one, change all.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
REGISTRY_PATH = ROOT / "data" / "sid-registry.json"

ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz"
U32 = 0xFFFFFFFF


def imul32(a: int, b: int) -> int:
    """Math.imul equivalent — 32-bit signed multiply, returning a 32-bit value."""
    return ((a & U32) * (b & U32)) & U32


def cyrb53(s: str, seed: int = 0) -> int:
    h1 = (0xDEADBEEF ^ seed) & U32
    h2 = (0x41C6CE57 ^ seed) & U32
    for ch in s:
        cc = ord(ch)
        h1 = imul32(h1 ^ cc, 2654435761)
        h2 = imul32(h2 ^ cc, 1597334677)
    h1 = imul32(h1 ^ (h1 >> 16), 2246822507) ^ imul32(h2 ^ (h2 >> 13), 3266489909)
    h2 = imul32(h2 ^ (h2 >> 16), 2246822507) ^ imul32(h1 ^ (h1 >> 13), 3266489909)
    return 4294967296 * (0x1FFFFF & h2) + (h1 & U32)


def normalize_path(p: str) -> str:
    if not p:
        return "/"
    s = p.lower()
    if len(s) > 1 and s.endswith("/"):
        s = s[:-1]
    if not s.startswith("/"):
        s = "/" + s
    return s


def get_page_sid(pathname: str) -> str:
    n = cyrb53(normalize_path(pathname))
    out = []
    for _ in range(8):
        out.append(ALPHABET[n % 32])
        n //= 32
    return "".join(reversed(out))


def walk_dist(dist_dir: Path) -> list[str]:
    """Every directory in dist/ that contains an index.html maps to a page."""
    pages: list[str] = []
    for root, _dirs, files in os.walk(dist_dir):
        if "index.html" not in files:
            continue
        rel = Path(root).relative_to(dist_dir)
        pathname = "/" + str(rel).replace(os.sep, "/")
        if pathname == "/.":
            pathname = "/"
        # Strip /go/ redirect pages — they aren't source pages users see.
        if pathname.startswith("/go/"):
            continue
        pages.append(pathname)
    return sorted(set(pages))


def walk_source() -> list[str]:
    """
    Walk src/content and src/pages to derive routes when dist doesn't exist.

    Mapping rules:
      src/content/blog/foo.mdx       -> /blog/foo/
      src/content/reviews/foo.mdx    -> /reviews/foo/
      src/content/comparisons/foo    -> /compare/foo/
      src/content/states/foo.mdx     -> /start-llc/foo/
      src/content/learn/foo.mdx      -> /learn/foo/
      src/content/professions/foo    -> /llc-for/foo/
      src/pages/foo.astro            -> /foo/
      src/pages/foo/index.astro      -> /foo/
      src/pages/[slug] / [...slug]   -> skipped (dynamic, can't enumerate without data)
    """
    pages: set[str] = set()
    content_map = {
        "blog": "/blog",
        "reviews": "/reviews",
        "comparisons": "/compare",
        "states": "/start-llc",
        "learn": "/learn",
        "professions": "/llc-for",
    }
    content_root = ROOT / "src" / "content"
    for collection, prefix in content_map.items():
        coll_dir = content_root / collection
        if not coll_dir.exists():
            continue
        for entry in coll_dir.glob("**/*.mdx"):
            slug = entry.stem
            pages.add(f"{prefix}/{slug}/")

    pages_root = ROOT / "src" / "pages"
    if pages_root.exists():
        for entry in pages_root.glob("**/*.astro"):
            rel = entry.relative_to(pages_root).with_suffix("")
            parts = rel.parts
            if any("[" in part for part in parts):
                continue
            if not parts:
                continue
            if parts[-1] == "index":
                parts = parts[:-1]
            if parts and parts[0] == "go":
                continue
            pathname = "/" + "/".join(parts)
            if pathname != "/":
                pathname += "/"
            pages.add(pathname)

    return sorted(pages)


def build_registry(prefer_source: bool = False) -> dict[str, str]:
    if prefer_source or not DIST.exists():
        if not prefer_source:
            sys.stderr.write(
                f"note: {DIST} not found, walking source tree instead.\n"
            )
        pages = walk_source()
    else:
        pages = walk_dist(DIST)
    registry: dict[str, str] = {}
    collisions: list[tuple[str, str, str]] = []
    for path in pages:
        sid = get_page_sid(path)
        if sid in registry and registry[sid] != path:
            collisions.append((sid, registry[sid], path))
        registry[sid] = path
    if collisions:
        sys.stderr.write(f"warning: {len(collisions)} SID collision(s):\n")
        for sid, a, b in collisions:
            sys.stderr.write(f"  {sid}: {a} <-> {b}\n")
    return registry


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lookup", help="Print page path for a SID")
    parser.add_argument("--reverse-lookup", help="Print SID for a page path")
    parser.add_argument(
        "--from-source",
        action="store_true",
        help="Walk src/content and src/pages instead of dist/ (no build required)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Don't print summary on stdout",
    )
    args = parser.parse_args()

    if args.reverse_lookup:
        print(get_page_sid(args.reverse_lookup))
        return 0

    if args.lookup:
        registry = (
            json.loads(REGISTRY_PATH.read_text())
            if REGISTRY_PATH.exists()
            else build_registry()
        )
        print(registry.get(args.lookup, "(not found)"))
        return 0

    registry = build_registry(prefer_source=args.from_source)
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_PATH.write_text(json.dumps(registry, indent=2, sort_keys=True) + "\n")
    if not args.quiet:
        print(f"Wrote {len(registry)} SIDs to {REGISTRY_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
