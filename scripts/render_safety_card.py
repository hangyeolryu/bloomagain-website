#!/usr/bin/env python3
"""티타 안전 수칙 카드 렌더러 (다크 계열).

색·좌표는 실제 발행된 카드(public/blog/voice-phishing/card-1.png)에서 픽셀로
뽑아 맞춘 값이다. 같은 연작에 나란히 놓아도 한 줄도 어긋나지 않는다.

  배경 세로 그라데이션 (45,42,52) → (24,23,31)
  카멜 (219,187,142) · 크림 (240,235,227) · 뮤트 (172,163,151)
  좌여백 86 · 라벨 412 · 제목 498(+95) · 서브 836(+64) · 하단 1232

pill의 숫자는 **글 번호**다(카드 순서가 아니다). 보이스피싱 = 05.

사용:
    <venv>/bin/python scripts/render_safety_card.py
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
FD = "/Users/hangyeolryu/Documents/projects/bloomagain-website/src/app/fonts"
BOLD, SEMI = f"{FD}/Pretendard-Bold.otf", f"{FD}/Pretendard-SemiBold.otf"

TOP, BOT = (45, 42, 52), (24, 23, 31)
CAMEL, CREAM, MUTED = (219, 187, 142), (240, 235, 227), (172, 163, 151)
TERRA = (193, 90, 60)
X = 86
MAXW = W - X * 2  # 이 폭을 넘는 줄은 렌더 전에 잡는다


def f(p, s):
    return ImageFont.truetype(p, s)


def card(num, label, lines, sub, out,
         cta="넘겨서 보기  →", foot="만 45세 이상 · 친구 매칭"):
    """lines: [(텍스트, 색)] 리스트. 색은 CAMEL 또는 CREAM."""
    im = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)],
               fill=tuple(round(TOP[i] + (BOT[i] - TOP[i]) * t)
                          for i in range(3)))

    # 헤더 로고 + 티타
    d.ellipse([X, 96, X + 60, 156], fill=TERRA)
    d.ellipse([X + 36, 96, X + 96, 156], fill=CREAM)
    d.text((X + 110, 100), "티타", font=f(BOLD, 50), fill=CREAM)

    # 우상단 필 — 하트 + '티타 안전 수칙 · NN'
    pf = f(BOLD, 30)
    txt = f"♥ 티타 안전 수칙 · {num:02d}"
    tw = d.textlength(txt, font=pf)
    d.rounded_rectangle([W - 86 - tw - 52, 104, W - 86, 158], radius=27,
                        fill=(58, 50, 45))
    d.text((W - 86 - tw - 26, 114), txt, font=pf, fill=CAMEL)

    # 라벨
    d.text((X, 412), label, font=f(SEMI, 34), fill=MUTED)

    # 제목 (최대 3줄)
    tf = f(BOLD, 72)
    y = 498
    for text, col in lines:
        w = d.textlength(text, font=tf)
        if w > MAXW:
            raise ValueError(f"제목 줄이 넘칩니다({w:.0f}>{MAXW}): {text}")
        d.text((X, y), text, font=tf, fill=col)
        y += 95

    # 서브
    y = max(y + 40, 836)
    sf = f(SEMI, 40)
    for ln in sub.split("\n"):
        w = d.textlength(ln, font=sf)
        if w > MAXW:
            raise ValueError(f"서브 줄이 넘칩니다({w:.0f}>{MAXW}): {ln}")
        d.text((X, y), ln, font=sf, fill=MUTED)
        y += 64

    # 하단
    ff = f(BOLD, 32)
    d.text((X, 1232), foot, font=ff, fill=MUTED)
    cw = d.textlength(cta, font=ff)
    d.text((W - 86 - cw, 1232), cta, font=ff, fill=CREAM)

    im.save(out)
    print("saved", out)


if __name__ == "__main__":
    OUT = "/Users/hangyeolryu/Documents/projects/bloomagain-website/public/blog/voice-phishing"
    # 04 — 각본이 반드시 쓰는 말. 03(수법)과 05(기억할 한 가지) 사이에서
    # '그래서 무엇을 하나'를 맡는다. 티타가 여럿이 모이는 자리를 기본으로
    # 두는 이유와 바로 이어지는 카드다.
    card(
        5,
        "그들이 반드시 하는 말",
        [("“누구에게도", CREAM),
         ("말하지 마세요.”", CREAM),
         ("이 말이 신호예요.", CAMEL)],
        "옆에 물어볼 사람이 한 명만 있어도\n이 각본은 대부분 깨집니다.",
        f"{OUT}/card-4.png",
    )
