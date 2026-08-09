#!/usr/bin/env python3
"""insight-09 카드 2·3번의 글자만 교체한다.

카드를 처음부터 다시 그리지 않는다. 로고·칩·쪽번호·진행점·출처 줄은 원본
픽셀을 그대로 두고, 글자가 놓인 띠만 배경색으로 지운 뒤 새로 얹는다.
전체를 다시 그려보니 로고·칩에서 3%가량 픽셀이 어긋났다 — 한 연작에서
두 장만 바꾸는 일에는 이 방식이 맞다.

기하는 원본 card-2·card-3에서 픽셀로 재서 맞춘 값이다.
  좌여백 84 · 제목 58(줄간격 77) · 보조 36(줄간격 55) · 배경 (246,228,226)
제목·보조 모두 한 줄 안에서 색과 굵기를 섞을 수 있다.

⚠️ 원본을 덮어쓰므로 두 번 돌리면 안 된다. 다시 돌릴 일이 있으면
   git에서 원본을 되살린 뒤 실행한다:
     git checkout HEAD -- public/blog/insight-09/card-2.png card-3.png
"""
from PIL import Image, ImageDraw, ImageFont

D = ("/Users/hangyeolryu/Documents/projects/bloomagain-website"
     "/public/blog/insight-09")
FD = ("/Users/hangyeolryu/Documents/projects/bloomagain-website"
      "/src/app/fonts")
BOLD, SEMI = f"{FD}/Pretendard-Bold.otf", f"{FD}/Pretendard-SemiBold.otf"

BG = (246, 228, 226)
INK, TERRA, GREY = (26, 26, 26), (200, 90, 58), (130, 122, 120)
MARGIN = 84
MAXW = 1080 - MARGIN * 2
T_SIZE, T_STEP = 58, 77
S_SIZE, S_STEP = 36, 55
BAND = (390, 910)  # 글자를 지울 세로 구간 — 칩(≤160)과 출처(≥1150)는 건드리지 않는다


def draw_line(d, x, y, segs, size):
    """(글자, 색, 굵기) 조각들을 왼쪽부터 이어 그린다."""
    for text, color, bold in segs:
        f = ImageFont.truetype(BOLD if bold else SEMI, size)
        d.text((x, y), text, font=f, fill=color)
        bb = d.textbbox((0, 0), text, font=f)
        x += bb[2] - bb[0]


def line_width(d, segs, size):
    w = 0
    for text, _, bold in segs:
        f = ImageFont.truetype(BOLD if bold else SEMI, size)
        bb = d.textbbox((0, 0), text, font=f)
        w += bb[2] - bb[0]
    return w


def retext(path, title, sub, title_top, sub_top):
    """title_top·sub_top은 글자 윗선(원본에서 잰 값)."""
    im = Image.open(path).convert("RGB")
    d = ImageDraw.Draw(im)
    d.rectangle([0, BAND[0], im.width, BAND[1]], fill=BG)

    for name, block, size, step, top in (
            ("제목", title, T_SIZE, T_STEP, title_top),
            ("보조", sub, S_SIZE, S_STEP, sub_top)):
        for segs in block:
            w = line_width(d, segs, size)
            if w > MAXW:
                raise ValueError(f"{name} 줄이 넘칩니다({w}>{MAXW}): "
                                 f"{''.join(t for t, _, _ in segs)}")
        # d.text의 y는 글자 윗선보다 위에 있다. 첫 줄의 top bearing만큼 올린다.
        f0 = ImageFont.truetype(BOLD if block[0][0][2] else SEMI, size)
        pad = d.textbbox((0, 0), block[0][0][0], font=f0)[1]
        y = top - pad
        for segs in block:
            draw_line(d, MARGIN, y, segs, size)
            y += step

    im.save(path, "PNG")
    print("saved", path)


# ── card-2 · '점수를 매기느라' → '내 말을 되짚느라' ──────────────────────────
# 채점이라는 말이 기계적이었다. 실제로 벌어지는 일은 방금 한 내 말을
# 되돌려 보는 것이라 '되짚느라'가 정확하다. 한 줄이 줄어 위치를 다시 잡았다.
retext(
    f"{D}/card-2.png",
    [[("대화 중엔 ", INK, True), ("내 말을 되짚느라,", TERRA, True)],
     [("상대 표정을 못 봐요.", INK, True)]],
    [[("심리학은 이 착각을 ‘호감 격차’라 불러요.", GREY, False)],
     [("양쪽 다 그러니, 아무도 먼저 연락하지 않죠.", INK, True)]],
    title_top=524, sub_top=755,
)

# ── card-3 · '실패가 아니에요' → '원래 시간이 걸려요' ────────────────────────
# 실패를 부정하려면 실패라는 말을 먼저 꺼내야 한다. 부정문을 없애고 홀 교수의
# 결과를 그대로 말한다. '마음을 나눌 수 있는'을 붙여 어떤 친구인지 밝힌다.
retext(
    f"{D}/card-3.png",
    [[("마음을 나눌 수 있는", INK, True)],
     [("친구가 되는 데는", INK, True)],
     [("원래 시간이 걸려요", TERRA, True), (".", INK, True)]],
    [[("50시간에 가벼운 친구, ", GREY, False),
      ("200시간에 가까운 친구", INK, True), (".", GREY, False)],
     [("게다가 새로 사귀어본 게 수십 년 만이잖아요.", GREY, False)],
     [("어색한 게 아니라, ", GREY, False), ("오랜만인 거예요.", INK, True)]],
    title_top=420, sub_top=729,
)
