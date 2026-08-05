#!/usr/bin/env python3
"""posts.ts → Firestore blog_posts 동기화 (앱 '티타 이야기' 탭 미러).

posts.ts가 원본이고 Firestore는 앱용 미러다. 이미지 경로(/blog/...)는 앱이
불러올 수 있게 절대 URL로 바꾼다.

⚠️ 푸시: 새 문서를 pushSent=false로 만들면 Cloud Functions의
onBlogPostCreated가 전체 회원에게 새 글 알림을 보낸다. 되돌릴 수 없으므로
--apply 전에 반드시 dry-run으로 "푸시가 나갈 글"을 확인할 것.

⚠️ publishedAt은 새 글에만 쓴다. 기존 글에 덮으면 전 글의 발행시각이 '지금'이
되어 앱 목록 정렬이 무너지고 이야기 탭 new 배지가 전부를 새 글로 센다.

파운더 스토리(audience:"founder")는 앱에 넣지 않는다 — 독자가 투자자·기관·
동료 창업자라 회원에게 푸시할 내용이 아니다.

사용:
    cd ~/Documents/projects/bloomagain-backend
    .venv/bin/python ~/Documents/projects/bloomagain-website/scripts/sync_blog_to_app.py [--apply]

(firebase_admin + ADC가 있는 백엔드 venv로 실행한다.)
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import firestore

APPLY = "--apply" in sys.argv
NO_PUSH = "--no-push" in sys.argv
SITE = "https://tita-app.com"
WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

raw = subprocess.run(
    ["npx", "tsx", "-e",
     "import{POSTS}from'./src/app/blog/posts.ts';console.log(JSON.stringify(POSTS))"],
    cwd=WEB, capture_output=True, text=True, check=True,
).stdout
posts = json.loads(raw[raw.index("["):raw.rindex("]") + 1])

skipped = [p["slug"] for p in posts if p.get("audience") == "founder"]
posts = [p for p in posts if p.get("audience") != "founder"]


def absolutize(v):
    return f"{SITE}{v}" if isinstance(v, str) and v.startswith("/") else v


try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app()
db = firestore.client()
col = db.collection("blog_posts")

new_slugs, updated = [], []
for p in posts:
    slug = p["slug"]
    doc = col.document(slug)
    exists = doc.get().exists
    body = []
    for b in p.get("body", []):
        b = dict(b)
        if b.get("src"):
            b["src"] = absolutize(b["src"])
        body.append(b)
    data = {
        "slug": slug,
        "title": p["title"],
        "description": p.get("description", ""),
        "date": p.get("date", ""),
        "category": p.get("category", ""),
        "cover": absolutize(p.get("cover", "")),
        "tags": p.get("tags", []),
        "readingMinutes": p.get("readingMinutes", 3),
        "body": body,
        "sources": p.get("sources", []),
        "faq": p.get("faq", []),
    }
    if not exists:
        try:
            data["publishedAt"] = datetime.strptime(
                p.get("date", ""), "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            data["publishedAt"] = firestore.SERVER_TIMESTAMP
        data["pushSent"] = bool(NO_PUSH)
        new_slugs.append(slug)
    else:
        updated.append(slug)
    if APPLY:
        doc.set(data, merge=True)   # 기존 문서의 pushSent를 덮지 않는다

print(f"앱 대상 글: {len(posts)}편")
if skipped:
    print(f"\n[앱 제외 — 파운더 스토리] {len(skipped)}편")
    for s in skipped:
        print(f"   × {s}")
print(f"\n[새 글 — 푸시 {'차단' if NO_PUSH else '발송'}] {len(new_slugs)}편")
for s in new_slugs:
    print(f"   + {s}")
print(f"\n[기존 글 — 내용만 갱신, 푸시 없음] {len(updated)}편")
for s in updated:
    print(f"   · {s}")

if not APPLY:
    print("\n[DRY-RUN] --apply 를 붙여야 실제로 씁니다.")
else:
    print(f"\n완료 — 새 글 {len(new_slugs)}, 갱신 {len(updated)}")
