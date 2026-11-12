# Meta 광고 (페이스북·인스타그램) 스크립트

Claude에서 바로 광고 현황을 보고 캠페인을 만들기 위한 Marketing API 스크립트다.
외부 MCP 업체에 광고 계정 권한을 주지 않고, `scripts/instagram/publish.mjs`와 같은 방식
(의존성 없음, `.env.local`에서 토큰, fetch 직접 호출, 장부 파일)으로 간다.

```
scripts/meta-ads/
  lib.mjs          토큰·계정 읽기, Graph API 호출, 페이지네이션, 표 출력
  status.mjs       읽기 전용 현황 (계정 · 캠페인/세트/광고 · 최근 N일 인사이트)
  create.mjs       스펙 JSON → 캠페인·세트·크리에이티브·광고 생성 (전부 PAUSED)
  specs/           스펙 파일들. example.json이 기준
  ledger.json      create.mjs가 만든 개체 ID 기록 (스크립트가 쓴다)
```

원칙 둘.
- **만드는 건 전부 PAUSED.** 켜는 건 Ads Manager에서 눈으로 보고 직접 한다. 스크립트에는 켜는 기능이 없다.
- **토큰은 `.env.local`에만.** 로그·장부·커밋 어디에도 안 남는다. 시크릿 쓰기는 사람이 직접 한다.

## 한 번만 하는 설정

### 1. 시스템 사용자 토큰 받기 (`META_ADS_TOKEN`)

인스타 게시용 토큰(`IG_ACCESS_TOKEN`)은 Business Login for Instagram으로 받은 거라
광고 권한이 없다. 광고는 **비즈니스 관리자의 시스템 사용자** 토큰을 따로 뽑는다.
시스템 사용자 토큰은 만료가 없어서 60일마다 연장할 필요가 없다.

1. [business.facebook.com/settings](https://business.facebook.com/settings) → 왼쪽 **사용자 → 시스템 사용자**.
   - 이미 "tita 인스타 System User"가 있으면 그걸 써도 되고, 광고용으로 하나 더 만들어도 된다.
     새로 만들면 역할은 **관리자**(광고 생성에 필요).
2. 그 시스템 사용자 → **자산 추가** → **광고 계정** → TITA 광고 계정 선택 → **광고 계정 관리**(전체 제어) 체크 → 저장.
   - 같은 화면에서 **앱** → TITA Meta 앱도 추가(앱 관리). 앱설치 캠페인이 앱을 참조하기 때문.
   - **페이지** → 광고를 내보낼 페이스북 페이지도 추가(콘텐츠 관리 이상).
3. **토큰 생성** → 앱 선택(TITA Meta 앱) → 만료 **없음** → 권한에서 `ads_management`, `ads_read`,
   `business_management`, `pages_read_engagement` 체크 → 생성. 나온 토큰을 바로 복사(다시 못 본다).
4. `.env.local`에 넣는다.

   ```
   META_ADS_TOKEN=EAA...
   ```

토큰이 제대로 됐는지는 [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)에
붙여 보면 권한 목록과 자산이 나온다. `ads_management`가 있고 광고 계정이 붙어 있어야 한다.

### 2. 광고 계정 ID (`META_AD_ACCOUNT_ID`)

[Ads Manager](https://adsmanager.facebook.com/) 주소창의 `act=123456789` 숫자, 또는
비즈니스 설정 → 계정 → 광고 계정 목록에 적힌 ID. `act_` 붙여도 되고 숫자만 넣어도 된다.

```
META_AD_ACCOUNT_ID=123456789
```

### 3. 앱·페이지 연결 (앱설치 캠페인용)

앱설치 캠페인(`OUTCOME_APP_PROMOTION`)은 "어느 앱을 설치시키는지"를 Meta 앱 ID와 스토어 URL로 적는다.

- **`META_PROMOTED_APP_ID`** — [developers.facebook.com/apps](https://developers.facebook.com/apps) → **티타** 앱(초록 아이콘) → 앱 설정 → 기본 설정의 앱 ID.
  ⚠️ `.env.local`에 이미 있는 `META_APP_ID`는 인스타 게시용 "tita 인스타" 앱이라 **다른 앱**이다. 스토어가 등록된 쪽은
  "티타" 앱이고, 8월 앱설치 캠페인도 그 앱으로 돌았다. 어느 건지 헷갈리면 비즈니스 설정 → 계정 → 앱에서 아이콘으로 구분.
  같은 화면 아래 **플랫폼 추가 → Android**에 패키지명 `com.bloomagain.bloomagain`과 Play 스토어 URL이
  등록돼 있어야 한다. 없으면 광고 세트 생성이 "앱이 안드로이드 플랫폼을 지원하지 않음"류 에러로 막힌다.
  설치 수를 세려면 앱에 Meta SDK(또는 MMP) 이벤트가 붙어 있어야 하고, 이건 2026-08 광고 때 이미 해 둔 상태.
- **`META_PAGE_ID`** — 광고가 "누구 이름으로" 나가는지. 페이스북 페이지 → 소개(정보) 맨 아래 페이지 ID,
  또는 비즈니스 설정 → 계정 → 페이지. 인스타 지면은 이 페이지에 연결된 인스타 계정(@titakorea)으로 나간다.
- 스토어 URL은 스펙에 직접 적혀 있다: `https://play.google.com/store/apps/details?id=com.bloomagain.bloomagain`.
  iOS는 2026-08 인증률 문제로 중단한 상태라 예시 스펙은 안드로이드만 겨냥한다(`user_os: ["Android"]`).

`.env.example`에 네 키 이름이 있다. 값은 전부 `.env.local`에만.

## 쓰는 법

### 현황 보기 (읽기 전용)

```bash
node scripts/meta-ads/status.mjs
```

```bash
node scripts/meta-ads/status.mjs --days 30 --level ad
```

계정 이름·통화·상태, 캠페인/세트/광고 목록(상태·예산·타깃), 최근 N일 지출·노출·클릭·앱설치·CPI가 표로 나온다.
`--all`을 주면 보관·삭제된 것도 목록에 나온다. 토큰이 없으면 무엇을 넣을지 한 줄 안내하고 끝난다.

### 캠페인 만들기

먼저 드라이런으로 보낼 내용을 본다. 토큰 없이도 된다.

```bash
node scripts/meta-ads/create.mjs --dry-run scripts/meta-ads/specs/example.json
```

괜찮으면 실제로 만든다. 캠페인 → 광고 세트 → (이미지 업로드) → 크리에이티브 → 광고 순서로, 전부 PAUSED.

```bash
node scripts/meta-ads/create.mjs scripts/meta-ads/specs/example.json
```

만들어진 ID는 `scripts/meta-ads/ledger.json`에 적힌다. 중간에 실패해도 거기까지의 ID가 남으니
Ads Manager에서 지우거나 이어서 손보면 된다. 끝나면 Ads Manager 링크를 찍어 주니 거기서
타깃·예산·미리보기 확인하고 직접 켠다.

### 스펙 파일 쓰는 법

`specs/example.json`을 복사해서 이름·카피·이미지를 바꾸는 게 제일 빠르다. 구조:

| 키 | 가는 곳 | 메모 |
|---|---|---|
| `campaign` | `act_X/campaigns` | `objective`는 `OUTCOME_APP_PROMOTION`. `special_ad_categories: []` 필수 |
| `adset` | `act_X/adsets` | `daily_budget`은 **계정 통화 단위 그대로**(USD 계정이면 3 = $3/일). 스크립트가 API 단위(센트)로 바꾼다 |
| `creative` | `act_X/adcreatives` | `image`에 https URL이면 그대로, 로컬 파일이면 업로드해서 `image_hash`로 |
| `ad` | `act_X/ads` | 이름만 있으면 된다. 세트·크리에이티브 연결은 스크립트가 |

- 문자열 값이 `"$env:META_PAGE_ID"` 꼴이면 `.env.local` 값으로 바뀐다. 드라이런 때 값이 없으면
  `<META_PAGE_ID 미설정>`으로 찍히고 경고만, 실제 실행이면 중단.
- `currency`는 **필수**. 계정 통화와 다르면 중단한다. 티타 광고 계정은 **USD**다(2026-11 확인).
- `status`는 스펙에 적어도 무시된다. 항상 PAUSED.
- 타깃: 한국(`KR`), 여성(`genders: [2]`), 45세 이상(`age_min: 45, age_max: 65` — 65가 Meta 최대, 65+ 의미),
  안드로이드만(`user_os`). `targeting_automation.advantage_audience: 0`은 "Meta가 알아서 타깃을 넓히지 말라"는
  뜻이다. 1로 두면 45세 아래로도 퍼진다.
- 카피는 이모지 없이, 또래 모임 톤. 소개팅 앱으로 읽히는 문구는 쓰지 않는다.
- 이미지는 1080×1080 또는 1080×1350 JPEG. 인스타 카드 1장을 그대로 써도 된다(예시가 그렇다).
  영상 광고는 아직 이 스크립트가 다루지 않는다.

### 예산 단위 주의

Meta는 통화마다 예산 단위가 다르다(대부분 센트 = 100배, KRW·JPY 등은 1배). 티타 계정은 USD라 스펙의 `3`을
`300`(센트)으로 보낸다. **처음 만들었을 때 Ads Manager에서 일 예산이 $3로 보이는지 꼭 확인**하고,
$0.03이나 $300으로 보이면 `lib.mjs`의 `currencyOffset`을 고친다. PAUSED라 돈은 안 나간다.

## 자주 막히는 데

- `(#100) ... permission` 또는 `(#200)` — 시스템 사용자에 광고 계정·앱·페이지 자산이 안 붙었거나 토큰 권한이 모자란다. 1번 2~3단계 다시.
- `(#10) Application does not have permission for this action` — 앱이 개발 모드거나 Marketing API 접근 단계가 낮다. 개발자 콘솔 → 앱 → Marketing API → 도구에서 표준 액세스 확인.
- `Invalid parameter ... promoted_object` — 앱에 Android 플랫폼이 등록 안 됐거나 `META_PROMOTED_APP_ID`가 인스타 앱 등 다른 앱이다.
- `targeting_automation` 관련 에러 — 새 광고 세트는 `advantage_audience`를 0 또는 1로 꼭 적어야 한다. 예시에 들어 있다.
- `is_adset_budget_sharing_enabled` 에러 — 캠페인 예산을 안 쓰면 캠페인에 `is_adset_budget_sharing_enabled: false`를 꼭 적어야 한다(2026-11부터). 예시에 들어 있다.
- `(#100) 1885183 Ads creative post was created by an app that is in development mode` — 토큰을 만든 앱이 **개발 모드**다.
  developers.facebook.com → 그 앱 → 상단 "App Mode"를 **Live**로. 기본 설정에 개인정보처리방침 URL·데이터 삭제 URL이
  있어야 켜진다. 캠페인·세트까지는 만들어졌을 테니 켠 뒤 `--resume`으로 이어서.
- 중간에 실패했으면 원인 고친 뒤 **같은 명령에 `--resume`**: 장부의 마지막 실패 항목에서 이미 만든 캠페인·세트·크리에이티브는 건너뛴다.
- 실패한 뒤 다시 돌리면 캠페인이 하나 더 생긴다. `ledger.json`에서 먼저 만든 ID를 보고 Ads Manager에서 정리할 것.
