#!/usr/bin/env python3
"""Print the keyword row for progress.next_index as JSON.

Single source of truth for "which keyword is next", shared by
generate-article.sh and the scheduled-task skills. Rows are looked up by the
CSV's `Priority #` column (not by line position), and the script refuses to
run if the numbering is inconsistent — this is what previously let the
pipeline drift off by one and silently skip keywords.

Exit codes: 0 = row printed, 3 = all keywords processed, 1 = error.
"""
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data/keywords/llc_keyword_master_list.csv"
PROGRESS_PATH = ROOT / "data/keywords/progress.json"


def main() -> int:
    with open(CSV_PATH, newline="") as f:
        rows = list(csv.DictReader(f))

    for position, row in enumerate(rows, 1):
        if row["Priority #"].strip() != str(position):
            print(
                f"ERROR: CSV row {position} has Priority # {row['Priority #']!r}; "
                "numbering must be sequential starting at 1",
                file=sys.stderr,
            )
            return 1

    if PROGRESS_PATH.exists():
        next_index = json.loads(PROGRESS_PATH.read_text())["next_index"]
    else:
        next_index = 1

    if next_index > len(rows):
        print(f"All {len(rows)} keywords have been processed.", file=sys.stderr)
        return 3

    row = rows[next_index - 1]
    print(
        json.dumps(
            {
                "index": next_index,
                "total_rows": len(rows),
                "phase": row["Phase"],
                "keyword": row["Keyword"],
                "difficulty": row["Difficulty Tier"],
                "search_intent": row["Search Intent"],
                "article_type": row["Article Type"],
                "category": row["Category"],
                "notes": row.get("Notes") or "",
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
