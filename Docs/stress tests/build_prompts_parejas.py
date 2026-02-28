"""
One-off script: read prompts_catalog.md, extract all Couple/Group prompts
(5 paragraphs each), write docs/stress tests/prompts_segmind_parejas.json
"""
import json
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
CATALOG_PATH = PROJECT_ROOT / "prompts" / "prompts_catalog.md"
OUT_PATH = SCRIPT_DIR / "prompts_segmind_parejas.json"

# Section key -> possible **Section:** prefixes (some categories use "Wardrobe & Details")
SECTION_PREFIXES: list[tuple[str, list[str]]] = [
    ("Identity Preservation", ["**Identity Preservation:**"]),
    ("Theme & Action", ["**Theme & Action:**"]),
    ("Wardrobe (Art Directed)", ["**Wardrobe (Art Directed):**", "**Wardrobe & Details:**"]),
    ("Scene & Atmosphere", ["**Scene & Atmosphere:**"]),
    ("Lighting & Tech", ["**Lighting & Tech:**"]),
]
SECTION_HEADERS_ORDER = [k for k, _ in SECTION_PREFIXES]


def extract_section_content(line: str) -> str | None:
    """If line is **Section Name:** content, return content. Else None."""
    line = line.strip()
    if not line.startswith("**") or ":**" not in line:
        return None
    idx = line.index(":**") + 3
    return line[idx:].strip()


def extract_couple_group_prompts(content: str) -> list[str]:
    lines = content.splitlines()
    prompts = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Start of block: ### PREFIX-CG#: Name
        if line.startswith("### ") and "-CG" in line and ":" in line:
            next_line = lines[i + 1].strip() if i + 1 < len(lines) else ""
            if next_line == "**Tipo:** Couple/Group":
                # Scan forward until we have all 5 sections (allow blank lines between)
                section_content: dict[str, str] = {}
                j = i + 2
                while j < len(lines):
                    check = lines[j]
                    if check.strip().startswith("---") or (check.startswith("### ") and "-CG" in check and j > i + 2):
                        break
                    content = extract_section_content(check)
                    if content is not None:
                        for key, prefixes in SECTION_PREFIXES:
                            if key in section_content:
                                continue
                            for prefix in prefixes:
                                if check.strip().startswith(prefix):
                                    section_content[key] = content
                                    break
                    j += 1
                if len(section_content) == 5:
                    parts = [section_content[h] for h in SECTION_HEADERS_ORDER]
                    full_prompt = " ".join(parts)
                    prompts.append(full_prompt)
                else:
                    raise ValueError(f"Block at line {i+1} has {len(section_content)} sections (expected 5): {list(section_content.keys())}")
            i += 1
            continue
        i += 1
    return prompts


def main():
    if not CATALOG_PATH.exists():
        raise SystemExit(f"Catalog not found: {CATALOG_PATH}")
    text = CATALOG_PATH.read_text(encoding="utf-8")
    prompts = extract_couple_group_prompts(text)
    if len(prompts) != 70:
        raise SystemExit(f"Expected 70 Couple/Group prompts, got {len(prompts)}")
    OUT_PATH.write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(prompts)} prompts to {OUT_PATH}")


if __name__ == "__main__":
    main()
