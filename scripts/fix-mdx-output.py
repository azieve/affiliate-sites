#!/usr/bin/env python3
"""
Validates and fixes Claude CLI output to ensure it's valid MDX with frontmatter.
Handles code fences, preamble text, and other formatting issues.

Usage: python3 fix-mdx-output.py <file_path>
"""
import re
import sys

if len(sys.argv) < 2:
    print("Usage: fix-mdx-output.py <file_path>")
    sys.exit(1)

file_path = sys.argv[1]

try:
    content = open(file_path).read().strip()
except FileNotFoundError:
    print(f"ERROR: File not found: {file_path}")
    sys.exit(1)

if not content:
    print("ERROR: Output file is empty")
    sys.exit(1)

# Strip markdown code fences if present (```mdx, ```markdown, ```, etc.)
content = re.sub(r'^```(?:mdx|markdown|md)?\s*\n', '', content)
content = re.sub(r'\n```\s*$', '', content)
content = content.strip()

# If it doesn't start with ---, try to find the frontmatter block
if not content.startswith('---'):
    match = re.search(r'(---\n.*?\n---\n.*)', content, re.DOTALL)
    if match:
        content = match.group(1)
        print('Fixed: extracted MDX from surrounding text')
    else:
        print('ERROR: Could not find valid MDX frontmatter in output')
        sys.exit(1)

# Validate we have both opening and closing ---
parts = content.split('---', 2)
if len(parts) < 3:
    print('ERROR: Incomplete frontmatter (missing closing ---)')
    sys.exit(1)

open(file_path, 'w').write(content.strip() + '\n')
print('OK: Valid MDX file written')
