# 인스타그램 자동 게시

카드 세트를 `assets/instagram/<slug>/`에 넣고 큐에 적어 두면 화·목 오전(10:23 예약, GitHub 사정으로 늦어질 수 있음)에
@titakorea에 캐러셀로 올라간다. 손으로 올릴 땐 스크립트 한 줄.

```
assets/instagram/
  insight-16/
    card-1.jpg … card-7.jpg   ← 캐러셀 순서. JPEG만 (API 제약)
    caption.txt               ← 캡션 전문. 해시태그 포함. 없으면 안 올라간다
  queue.txt                   ← 자동 게시 순서
  published.json              ← 올라간 기록 (스크립트가 쓴다. 손대지 말 것)
```

## 한 번만 하는 설정 — 토큰 받기

⚠️ **콘솔의 "Generate token" 단추는 쓰지 말 것.** 2026-10-28 실측: Unified login·Instagram login
어느 메뉴에서 눌러도 "tita 인스타 System User"의 **자산 없는 빈 토큰**(EAA…)만 나왔다.
권한 목록은 멀쩡한데 어떤 계정도 못 연다. 정식 Facebook 로그인 창(`--login-url`)으로 받아도
같았다. 비즈니스 설정의 "Instagram 계정" 자산 배정도 소용없었다(그건 광고·Suite용).

되는 길은 **Business Login for Instagram** — titakorea 계정에서 직접 허용하는 방식이다.
토큰은 60일짜리라 연장이 필요하다(아래).

1. 콘솔 → Use cases → Instagram API → **API setup with Instagram login**.
   - 1단계 **Business login settings → OAuth redirect URIs**에 `https://tita-app.com/auth/callback` 등록.
   - 같은 화면의 **Instagram app ID / Instagram app secret**을 `.env.local`에
     `IG_APP_ID=` / `IG_APP_SECRET=` 으로. (Meta 앱 시크릿과 다른 값이다.)
   - **App roles → Roles → Instagram Testers**에 titakorea가 있고 인스타 앱에서 초대를
     수락한 상태여야 한다. 아니면 로그인 창이 "Insufficient developer role"로 막힌다.
2. 로그인 창 주소를 뽑아 브라우저에서 연다. titakorea로 로그인 → 허용 →
   tita-app.com의 "페이지 없음" 화면으로 튕긴다(정상). 그 주소창 전체를 복사.

   ```bash
   node scripts/instagram/publish.mjs --ig-login-url
   ```

3. 그 주소를 넘기면 60일 토큰으로 바꿔 `.env.local`에 쓴다(토큰·호스트·계정 ID 세 줄).

   ```bash
   node scripts/instagram/publish.mjs --ig-exchange-code '<돌아온 주소>' --write
   node scripts/instagram/publish.mjs --whoami     # @titakorea, 게시물 N개 가 나와야 한다
   ```

4. 크론까지 쓰려면 GitHub에 같은 값을 넣는다(secret 쓰기는 사람이 직접).

   ```bash
   grep '^IG_ACCESS_TOKEN=' .env.local | cut -d= -f2- | tr -d '\n' | gh secret set IG_ACCESS_TOKEN -R hangyeolryu/bloomagain-website
   grep '^IG_USER_ID=' .env.local | cut -d= -f2- | tr -d '\n' | gh secret set IG_USER_ID -R hangyeolryu/bloomagain-website
   gh variable set IG_GRAPH_HOST -b graph.instagram.com -R hangyeolryu/bloomagain-website
   ```

### 토큰 수명 — 60일, 만료 전에 연장

발급일 기준 60일(2026-10-28 발급 → **2026-12-27 만료**). 만료 **전에** 연장해야 하고,
지나면 위 2~3번을 다시 한다. 연장은 발급 24시간 뒤부터 된다. 달력에 **12월 15일쯤** 적어 둘 것.

```bash
node scripts/instagram/publish.mjs --refresh-token --write
grep '^IG_ACCESS_TOKEN=' .env.local | cut -d= -f2- | tr -d '\n' | gh secret set IG_ACCESS_TOKEN -R hangyeolryu/bloomagain-website
```

토큰이 어느 앱·누구 것인지 볼 때: `--debug-token`(META_APP_ID·META_APP_SECRET 필요, EAA 토큰만).

## 갈 곳 세트 — 서울 문화행사에서 자동으로

`SEOUL_API_KEY`(data.seoul.go.kr 인증키, `.env.local`)가 있어야 전체가 온다. 없으면 샘플 5건.

```bash
node scripts/instagram/seoul-events.mjs --list                 # 앞으로 3주, 무료, 5060 취향 분류, 점수순
node scripts/instagram/seoul-events.mjs --list --days 30 --paid
node scripts/instagram/seoul-events.mjs --make free-11-w2 --pick 1,3,4,7   # 번호로 골라 세트 생성(카드·스토리·캡션)
```

생성물: `set.json`(카드 데이터) · `caption.txt` · `card-1..N.jpg` · `story.jpg`(9:16) · `thumb-N.jpg`(행사 포스터).
포스터는 일정 줄 옆에 작게 붙는다(한 장 3줄). 데이터셋이 공공누리 1유형이라 카드 하단 출처 표기로 충분하다.
포스터 안 작품 사진은 작가 저작물일 수 있어 전면에 크게 깔지 않는다. 빼려면 `--no-thumbs`.
표지에 그림을 깔고 싶으면 `set.json`의 `cover.image`에 폴더 안 파일 이름(예: `cover.jpg`)을 적고 다시 굽는다 —
생성 이미지는 장당 수십 원이 들고 행사 정보가 아니라서 특별한 세트에만.
카드만 다시 구우려면 `node scripts/cards/gen-event-cards.cjs free-11-w2`.
표지·스토리 색은 세트마다 돌아간다(forest → cream → terracotta → plum → teal). 처음 구울 때 `set.json`의 `theme`에
적히므로 다시 구워도 같고, 바꾸려면 `--theme cream`처럼 준다. 일정·마무리 장은 늘 딥그린.
운영 리듬과 주제 뱅크는 `docs/social/instagram-plan-2026-11.md`.

## 스토리

세트 폴더의 `story.jpg`(1080×1920)를 올린다. 24시간 뒤 사라지므로 시각을 골라 손으로.

```bash
node scripts/instagram/publish.mjs --story free-11-w2 --dry-run
node scripts/instagram/publish.mjs --story free-11-w2
```

## 올리기

```bash
# 1) 세트 커밋·푸시 — 인스타가 raw.githubusercontent.com(main)에서 이미지를 가져간다
git add assets/instagram/insight-16 && git commit -m "chore(카드): insight-16" && git push

# 2) 올라갈 내용 확인 (URL이 열리는지, 캡션, 장수)
node scripts/instagram/publish.mjs --slug insight-16 --dry-run

# 3) 게시
node scripts/instagram/publish.mjs --slug insight-16

# 4) 장부 커밋
git add assets/instagram/published.json && git commit -m "chore(인스타): insight-16 게시" && git push
```

자동으로 두려면 2)까지 하고 `queue.txt`에 `insight-16` 한 줄. 다음 화·목에 올라가고(story.jpg가 있으면 스토리도 같이)
장부는 워크플로가 커밋한다.

## 막힐 때

* **공개 URL이 안 열린다** — main에 푸시 안 됐거나 raw 캐시(5분). 푸시 후 잠깐 기다릴 것.
* **The image format is not supported** — PNG다. `sips -s format jpeg card-1.png --out card-1.jpg`.
* **(#10) Application does not have permission** — 토큰에 `instagram_business_content_publish`가
  없거나 계정이 프로페셔널이 아니다. 콘솔에서 토큰 다시 발급.
* **Invalid OAuth access token / Session has expired** — 토큰 만료. 위 2~3번으로 재발급.
* **Object with ID '1784…' does not exist / missing permissions** — 자산 없는 빈 토큰(콘솔 Generate token 산물). `--debug-token`으로 확인, 위 절차로 다시.
* **Insufficient developer role** — 로그인한 인스타 계정이 앱 테스터가 아님. 다른 계정으로 로그인돼 있거나 초대 미수락.
* 캐러셀은 **2~10장**, 캡션 **2,200자**, 해시태그 **30개**가 상한. 스크립트가 먼저 막는다.
* 하루 게시 상한은 계정당 **100건**(24시간). 우리 쓰임엔 안 닿는다.
