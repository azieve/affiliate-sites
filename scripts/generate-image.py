#!/usr/bin/env python3
"""
Generate an SEO-optimized hero image for a blog article using the Gemini API.

Usage:
    python3 scripts/generate-image.py <slug> "<prompt>"

Outputs responsive WebP images + OG JPEG to public/blog/<slug>/:
    hero-1200.webp   (desktop, 1200×675)
    hero-800.webp    (tablet,  800×450)
    hero-400.webp    (mobile,  400×225)
    og.jpg           (Open Graph, 1200×630)

Prints the base path on success: /blog/<slug>/hero
"""

import base64
import json
import os
import sys
import urllib.request
import urllib.error

from PIL import Image
from io import BytesIO

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)

# --- Config ---
GEMINI_MODEL = "gemini-2.5-flash-image"
ASPECT_RATIO = "16:9"
DESKTOP_WIDTH = 1200
TABLET_WIDTH = 800
MOBILE_WIDTH = 400
OG_WIDTH = 1200
OG_HEIGHT = 630
WEBP_QUALITY = 82  # Good balance of quality vs file size for Core Web Vitals


def load_api_key():
    """Read GEMINI_API_KEY from environment or .env.local."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key

    env_file = os.path.join(PROJECT_DIR, ".env.local")
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")

    print("ERROR: GEMINI_API_KEY not found in environment or .env.local", file=sys.stderr)
    sys.exit(1)


def generate_image(api_key, prompt):
    """Call Gemini API to generate an image. Returns raw PNG bytes."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"

    # Wrap the user prompt with style guidance for consistent, SEO-friendly images
    styled_prompt = (
        f"{prompt}\n\n"
        "Style: Clean, modern, professional illustration. "
        "Use a muted corporate color palette (navy, teal, warm grays). "
        "IMPORTANT: Absolutely no text, no words, no letters, no numbers, "
        "no labels, no captions, no watermarks anywhere in the image. "
        "No people's faces. Abstract or symbolic representation only. "
        "Suitable as a blog hero image for a business/legal website."
    )

    payload = {
        "contents": [{"parts": [{"text": styled_prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "imageConfig": {"aspectRatio": ASPECT_RATIO},
        },
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"ERROR: Gemini API returned {e.code}: {body}", file=sys.stderr)
        sys.exit(1)

    # Extract image from response
    for candidate in data.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                return base64.b64decode(inline["data"])

    print("ERROR: No image data in Gemini response", file=sys.stderr)
    print(json.dumps(data, indent=2)[:2000], file=sys.stderr)
    sys.exit(1)


def optimize_images(png_bytes, output_dir):
    """
    Take raw PNG bytes and produce:
      - 3 responsive WebP sizes (1200, 800, 400 wide)
      - 1 OG JPEG (1200x630, cropped)
    Returns dict of output paths with file sizes.
    """
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(BytesIO(png_bytes)).convert("RGB")
    orig_w, orig_h = img.size

    results = {}

    # --- Responsive WebP sizes ---
    for width, label in [(DESKTOP_WIDTH, "1200"), (TABLET_WIDTH, "800"), (MOBILE_WIDTH, "400")]:
        ratio = width / orig_w
        height = round(orig_h * ratio)
        resized = img.resize((width, height), Image.LANCZOS)

        path = os.path.join(output_dir, f"hero-{label}.webp")
        resized.save(path, "WEBP", quality=WEBP_QUALITY, method=6)
        size_kb = os.path.getsize(path) / 1024
        results[f"hero-{label}.webp"] = f"{size_kb:.0f}KB"

    # --- OG image (JPEG, 1200x630, center-cropped) ---
    og_ratio = OG_WIDTH / OG_HEIGHT  # ~1.905
    img_ratio = orig_w / orig_h

    if img_ratio > og_ratio:
        # Image is wider — crop sides
        new_w = round(orig_h * og_ratio)
        left = (orig_w - new_w) // 2
        cropped = img.crop((left, 0, left + new_w, orig_h))
    else:
        # Image is taller — crop top/bottom
        new_h = round(orig_w / og_ratio)
        top = (orig_h - new_h) // 2
        cropped = img.crop((0, top, orig_w, top + new_h))

    og = cropped.resize((OG_WIDTH, OG_HEIGHT), Image.LANCZOS)
    og_path = os.path.join(output_dir, "og.jpg")
    og.save(og_path, "JPEG", quality=85, optimize=True)
    size_kb = os.path.getsize(og_path) / 1024
    results["og.jpg"] = f"{size_kb:.0f}KB"

    return results


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 generate-image.py <slug> \"<prompt>\"", file=sys.stderr)
        sys.exit(1)

    slug = sys.argv[1]
    prompt = sys.argv[2]

    output_dir = os.path.join(PROJECT_DIR, "public", "blog", slug)

    # Skip if images already exist
    if os.path.exists(os.path.join(output_dir, "hero-1200.webp")):
        print(f"Images already exist for {slug}, skipping.", file=sys.stderr)
        print(f"/blog/{slug}/hero")
        sys.exit(0)

    api_key = load_api_key()

    print(f"Generating image for: {slug}", file=sys.stderr)
    print(f"Prompt: {prompt[:100]}...", file=sys.stderr)

    png_bytes = generate_image(api_key, prompt)
    print(f"Received {len(png_bytes) / 1024:.0f}KB from Gemini API", file=sys.stderr)

    results = optimize_images(png_bytes, output_dir)

    for filename, size in results.items():
        print(f"  {filename}: {size}", file=sys.stderr)

    # Print the base path for the shell script to capture
    print(f"/blog/{slug}/hero")


if __name__ == "__main__":
    main()
