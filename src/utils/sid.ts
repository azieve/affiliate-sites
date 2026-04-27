/**
 * Per-page SID generation for affiliate tracking.
 *
 * Produces a deterministic 8-char base32 ID from a page pathname.
 * Used to attribute affiliate clicks to the page they came from
 * without exposing the slug in the outbound URL.
 *
 * IMPORTANT: The implementation in src/pages/go/[slug].astro must
 * produce byte-identical output to this function. If you change the
 * algorithm here, mirror the change there.
 */

// Crockford's base32 alphabet — no i/l/o/u (avoids visual collisions and accidental words).
const ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  let s = pathname.toLowerCase();
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  if (!s.startsWith('/')) s = '/' + s;
  return s;
}

export function getPageSid(pathname: string): string {
  const norm = normalizePath(pathname);
  let n = cyrb53(norm);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out = ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out;
}

export const SID_FALLBACK = 'tbllc';
