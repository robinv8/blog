#!/usr/bin/env python3
"""Push polished English post JSON files into Notion as Lang=en pages."""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_DIR = ROOT / "content" / "en"
DS = "93e921e8-0876-4c5e-bcba-9a19adc6b0cf"
VER = "2025-09-03"


def load_env():
    env = {}
    for name in (".env", ".env.local"):
        p = ROOT / name
        if not p.exists():
            continue
        for line in p.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def api(token: str, method: str, path: str, body=None):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        "https://api.notion.com/v1" + path,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": VER,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.load(r)
    except urllib.error.HTTPError as ex:
        return {"error": True, "status": ex.code, "body": ex.read().decode()[:2000]}


def rt(content: str, bold=False):
    content = content or ""
    # Notion text objects max 2000 chars
    chunks = []
    for i in range(0, max(len(content), 1), 1900):
        part = content[i : i + 1900]
        if not part and i > 0:
            break
        obj = {"type": "text", "text": {"content": part or " "}}
        if bold:
            obj["annotations"] = {"bold": True}
        chunks.append(obj)
    return chunks or [{"type": "text", "text": {"content": " "}}]


def md_to_blocks(md: str):
    blocks = []
    lines = (md or "").replace("\r\n", "\n").split("\n")
    i = 0
    in_code = False
    code_lang = ""
    code_buf = []

    def flush_code():
        nonlocal code_buf, code_lang
        body = "\n".join(code_buf)
        blocks.append(
            {
                "object": "block",
                "type": "code",
                "code": {
                    "rich_text": rt(body),
                    "language": code_lang if code_lang in {
                        "javascript","typescript","python","go","bash","json","css","html","plain text","markdown","java","rust","sql","yaml"
                    } else "plain text",
                },
            }
        )
        code_buf = []
        code_lang = ""

    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            if not in_code:
                in_code = True
                code_lang = line[3:].strip() or "plain text"
                code_buf = []
            else:
                in_code = False
                flush_code()
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not line.strip():
            i += 1
            continue
        if line.startswith("### "):
            blocks.append({"object": "block", "type": "heading_3", "heading_3": {"rich_text": rt(line[4:])}})
        elif line.startswith("## "):
            blocks.append({"object": "block", "type": "heading_2", "heading_2": {"rich_text": rt(line[3:])}})
        elif line.startswith("# "):
            blocks.append({"object": "block", "type": "heading_1", "heading_1": {"rich_text": rt(line[2:])}})
        elif line.startswith("> "):
            blocks.append({"object": "block", "type": "quote", "quote": {"rich_text": rt(line[2:])}})
        elif line.startswith("- ") or line.startswith("* "):
            blocks.append(
                {
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {"rich_text": rt(line[2:])},
                }
            )
        elif re.match(r"^\d+\.\s+", line):
            text = re.sub(r"^\d+\.\s+", "", line)
            blocks.append(
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {"rich_text": rt(text)},
                }
            )
        elif line.strip() == "---":
            blocks.append({"object": "block", "type": "divider", "divider": {}})
        elif line.startswith("![") and "](" in line:
            # skip empty image placeholders
            m = re.match(r"!\[([^\]]*)\]\(([^)]*)\)", line)
            if m and m.group(2):
                blocks.append(
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {"rich_text": rt(f"[image: {m.group(1) or 'image'}]")},
                    }
                )
        else:
            blocks.append({"object": "block", "type": "paragraph", "paragraph": {"rich_text": rt(line)}})
        i += 1

    if in_code and code_buf:
        flush_code()
    return blocks


def find_existing_en(token: str, slug: str):
    """Return page id if an EN post with this slug already exists."""
    cursor = None
    while True:
        body = {
            "page_size": 100,
            "filter": {
                "and": [
                    {"property": "slug", "rich_text": {"equals": slug}},
                    {"property": "Lang", "select": {"equals": "en"}},
                ]
            },
        }
        if cursor:
            body["start_cursor"] = cursor
        r = api(token, "POST", f"/data_sources/{DS}/query", body)
        if r.get("error"):
            # filter may fail on multi-source; fall back to client scan once
            return None
        results = r.get("results") or []
        if results:
            return results[0]["id"]
        if not r.get("has_more"):
            return None
        cursor = r.get("next_cursor")


def create_or_update(token: str, post: dict, dry_run=False):
    slug = post["slug"]
    title = post["title"]
    summary = (post.get("summary") or "")[:1900]
    md = post.get("markdown") or ""
    date = post.get("date")
    tags = post.get("tags") or []

    props = {
        "title": {"title": rt(title)},
        "slug": {"rich_text": rt(slug)},
        "summary": {"rich_text": rt(summary)},
        "type": {"select": {"name": "Post"}},
        "status": {"select": {"name": "Published"}},
        "Lang": {"select": {"name": "en"}},
    }
    if date:
        props["date"] = {"date": {"start": date[:10] if len(date) >= 10 else date}}
    if tags:
        props["tags"] = {"multi_select": [{"name": t} for t in tags[:10] if t]}

    blocks = md_to_blocks(md)
    # Notion create allows max 100 children
    first, rest = blocks[:100], blocks[100:]

    existing = find_existing_en(token, slug)
    if dry_run:
        print(f"  dry-run {'update' if existing else 'create'} {slug} blocks={len(blocks)}")
        return existing or "dry-run"

    if existing:
        # archive old and recreate (simpler than replacing all blocks)
        api(token, "PATCH", f"/pages/{existing}", {"archived": True})
        time.sleep(0.2)

    body = {
        "parent": {"type": "data_source_id", "data_source_id": DS},
        "properties": props,
        "children": first,
    }
    r = api(token, "POST", "/pages", body)
    if r.get("error"):
        print("  CREATE ERR", slug, r.get("status"), r.get("body", "")[:300])
        return None
    page_id = r["id"]
    # append remaining blocks in chunks of 100
    for i in range(0, len(rest), 100):
        chunk = rest[i : i + 100]
        ar = api(token, "PATCH", f"/blocks/{page_id}/children", {"children": chunk})
        if ar.get("error"):
            # try POST append endpoint
            ar = api(token, "PATCH", f"/blocks/{page_id}/children", {"children": chunk})
        if ar.get("error"):
            print("  APPEND ERR", slug, ar.get("body", "")[:200])
        time.sleep(0.35)
    print(f"  OK {slug} -> {r.get('url','')[:70]}")
    return page_id


def main():
    import argparse

    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", action="append", help="Only these slugs")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    env = load_env()
    token = env.get("NOTION_ACCESS_TOKEN")
    if not token:
        print("Missing NOTION_ACCESS_TOKEN")
        sys.exit(1)

    files = sorted(EN_DIR.glob("*.json"))
    files = [f for f in files if f.name != "index.json"]
    count = 0
    for f in files:
        post = json.loads(f.read_text())
        slug = post.get("slug")
        if not slug or not post.get("title") or not post.get("markdown"):
            continue
        if args.slug and slug not in args.slug and safe_name(slug) not in args.slug:
            # also match filename stem
            if f.stem not in args.slug:
                continue
        print(f"[{count+1}] {slug}")
        create_or_update(token, post, dry_run=args.dry_run)
        count += 1
        if args.limit and count >= args.limit:
            break
        time.sleep(0.4)
    print("done", count)


def safe_name(slug: str) -> str:
    return re.sub(r"[^\w\-\.]+", "_", slug)


if __name__ == "__main__":
    import time

    main()
