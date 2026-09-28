#!/usr/bin/env python3
"""인스타 카드뉴스 → **Canva에서 편집 가능한** PDF.

기존 카드 생성기(gen-cardnews.mjs · render_safety_card.py)는 PNG를 굽는다.
PNG는 Canva에 넣어도 글자를 못 고친다. 그래서 이 스크립트는 reportlab으로
**진짜 텍스트**를 PDF에 넣는다 — Canva가 불러오면 문구를 그대로 편집할 수 있다.

폰트: Pretendard. 저장소의 .otf(CFF)는 reportlab이 못 심어서, 가변폰트
PretendardVariable.ttf 에서 Regular/Bold/ExtraBold 를 뽑아 쓴다.
(fontTools instancer → /tmp/tita-fonts, 없으면 아래 BUILD_FONTS 가 만든다)

⚠️ 사돈 찻자리는 여기서 말하지 않는다. 신고 전에는 모집 공고 자체가 영업이고
(04_법무_체크리스트 첫 줄), 미신고 영업은 3년 이하 징역 또는 3천만원 이하
벌금이다. "사돈"·"좋은 자리 소개"·"결혼 상대" 같은 낱말은 한 자도 쓰지 않는다.
이 카드가 하는 말은 **자식 얘기를 편하게 할 또래가 없다**는 마음까지다.

  <venv>/bin/python scripts/gen_insta_pdf.py
  출력: scripts/insta-out/tita-parents-talk.pdf  (1080×1350 · 6장)
"""
import os
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

W, H = 1080, 1350
FOREST, DEEP = HexColor("#1F4E3D"), HexColor("#143329")
CREAM, SAGE = HexColor("#FBF7F0"), HexColor("#AFC8BA")
CAMEL, INK, MUTED = HexColor("#D4B895"), HexColor("#1A2E26"), HexColor("#6B7D6E")

FD = "/tmp/tita-fonts"
for name in ("Pretendard-Regular", "Pretendard-Bold", "Pretendard-ExtraBold"):
    pdfmetrics.registerFont(TTFont(name, f"{FD}/{name}.ttf"))
R, B, XB = "Pretendard-Regular", "Pretendard-Bold", "Pretendard-ExtraBold"

M = 96  # 좌우 여백


def text(c, x, y, s, font, size, color, leading=None, align="left"):
    """줄바꿈(\n)을 살려서 그린다. 한 줄씩 진짜 텍스트로 들어간다."""
    c.setFont(font, size)
    c.setFillColor(color)
    lead = leading or size * 1.45
    for i, line in enumerate(s.split("\n")):
        yy = y - i * lead
        if align == "center":
            c.drawCentredString(W / 2, yy, line)
        else:
            c.drawString(x, yy, line)
    return y - (len(s.split("\n")) - 1) * lead


def page(c, bg):
    c.setFillColor(bg)
    c.rect(0, 0, W, H, stroke=0, fill=1)


def dots(c, idx, total, color):
    """하단 페이지 점. 카드 순서는 여기로만 말한다."""
    gap, r = 26, 6
    total_w = (total - 1) * gap
    x0 = W / 2 - total_w / 2
    for i in range(total):
        c.setFillColor(color if i == idx else HexColor("#00000000"))
        c.setStrokeColor(color)
        c.setLineWidth(1.6)
        c.circle(x0 + i * gap, 86, r, stroke=1, fill=1 if i == idx else 0)


def build(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    c = canvas.Canvas(path, pagesize=(W, H))
    N = 6

    # ── 1. 표지 ────────────────────────────────────────────────────────
    page(c, FOREST)
    text(c, M, H - 250, "티타", R, 34, SAGE)
    text(c, M, H - 430, "자식 얘기,\n편하게 할 데가\n없더라고요", XB, 96, CREAM, leading=126)
    text(c, M, 300, "그 말씀을 참 많이 들었어요.", R, 40, SAGE)
    dots(c, 0, N, SAGE)
    c.showPage()

    # ── 2. 공감 ────────────────────────────────────────────────────────
    page(c, CREAM)
    text(c, M, H - 250, "다들 이러시더라고요", B, 34, CAMEL)
    text(c, M, H - 420,
         "모임에 나가면\n자식 자랑은 오가는데,",
         B, 56, INK, leading=82)
    text(c, M, H - 650,
         "속 얘기는\n못 꺼내겠더라고요.",
         XB, 60, FOREST, leading=86)
    text(c, M, 330,
         "먼저 물어보기도 민망하고,\n괜히 꺼냈다가 무거워질까 봐요.",
         R, 40, MUTED, leading=60)
    dots(c, 1, N, SAGE)
    c.showPage()

    # ── 3. 같은 시기 ───────────────────────────────────────────────────
    page(c, CREAM)
    text(c, M, H - 250, "그런데", B, 34, CAMEL)
    text(c, M, H - 420,
         "같은 시기를\n지나는 분들이\n계세요.",
         XB, 78, INK, leading=108)
    text(c, M, 380,
         "아이 다 키워놓고,\n이제야 내 시간이 좀 생긴\n비슷한 또래요.",
         R, 42, MUTED, leading=62)
    dots(c, 2, N, SAGE)
    c.showPage()

    # ── 4. 하는 일 ─────────────────────────────────────────────────────
    page(c, CREAM)
    text(c, M, H - 250, "티타에서 하는 건", B, 34, CAMEL)
    y = H - 420
    for line in ("낮에 전시 한 번", "느지막한 브런치", "퇴근하고 저녁 한 끼"):
        c.setFillColor(SAGE)
        c.circle(M + 12, y + 18, 9, stroke=0, fill=1)
        text(c, M + 48, y, line, B, 58, INK)
        y -= 124
    text(c, M, 380,
         "결이 맞는 셋넷이 모여요.\n첫마디도 티타가 꺼내드리니\n편하게 오시면 돼요.",
         R, 40, MUTED, leading=60)
    dots(c, 3, N, SAGE)
    c.showPage()

    # ── 5. 안심 ────────────────────────────────────────────────────────
    page(c, DEEP)
    text(c, M, H - 250, "안심하셔도 돼요", B, 34, CAMEL)
    y = H - 420
    for line in ("45세부터 · 본인인증을 거쳐요",
                 "낮에, 공개된 곳에서 만나요",
                 "소개팅 앱이 아니에요"):
        text(c, M, y, line, B, 50, CREAM)
        y -= 118
    text(c, M, 330,
         "자식 얘기가 통하는 또래를\n만나시라고 만든 자리예요.",
         R, 40, SAGE, leading=60)
    dots(c, 4, N, SAGE)
    c.showPage()

    # ── 6. 마무리 ──────────────────────────────────────────────────────
    page(c, FOREST)
    text(c, M, H - 430, "요즘 어떠세요?\n1분이면 돼요", XB, 82, CREAM, leading=112)
    text(c, M, H - 700, "tita-app.com/enjoy", B, 44, CAMEL)
    text(c, M, 300, "티타 [TITA]", B, 44, CREAM)
    text(c, M, 240, "@titakorea", R, 34, SAGE)
    dots(c, 5, N, SAGE)
    c.showPage()

    c.save()
    return path


if __name__ == "__main__":
    out = build(os.path.join(os.path.dirname(__file__), "insta-out",
                             "tita-parents-talk.pdf"))
    print("만듦:", out, os.path.getsize(out) // 1024, "KB")
