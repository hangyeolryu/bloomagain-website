# 인스타그램 자동 게시

카드 세트를 `assets/instagram/<slug>/`에 넣고 큐에 적어 두면 화·금 11:00에
@titakorea에 캐러셀로 올라간다. 손으로 올릴 땐 스크립트 한 줄.

```
assets/instagram/
  insight-16/
    card-1.jpg … card-7.jpg   ← 캐러셀 순서. JPEG만 (API 제약)
    caption.txt               ← 캡션 전문. 해시태그 포함. 없으면 안 올라간다
  queue.txt                   ← 자동 게시 순서
  published.json              ← 올라간 기록 (스크립트가 쓴다. 손대지 말 것)
```

## 한 번만 하는 설정 — Meta 개발자 콘솔

앱 대시보드 → Use cases → Instagram API → **API setup with Instagram login**.
(Unified login은 비즈니스 포트폴리오와 시스템 유저가 있어야 해서 더 길다.
대신 토큰 만료가 없어 크론에 좋다 — 아래 "토큰 수명" 참고.)

1. 인스타 계정이 **프로페셔널**(비즈니스/크리에이터)인지 확인. 아니면 인스타 앱
   설정에서 전환.
2. 콘솔 **2. Generate access tokens** → *Add account* → @titakorea로 로그인 → 권한
   허용 → *Generate token*. 나오는 긴 문자열이 `IG_ACCESS_TOKEN`.
   (Roles 탭에 그 계정을 Instagram Tester로 넣어 두라고 하면 넣는다. 개발 모드에서도
   테스터 계정에는 올릴 수 있다 — 앱 리뷰 없이 우리 계정 하나면 충분.)
3. `.env.local`에 넣는다 (public 레포라 **절대 커밋하지 말 것** — `.env*`는 gitignore).

   ```
   IG_ACCESS_TOKEN=...
   IG_GRAPH_HOST=graph.instagram.com
   ```

4. 계정 ID 찾기 → 나오는 `IG_USER_ID=`를 `.env.local`에 추가.

   ```bash
   node scripts/instagram/publish.mjs --whoami
   ```

5. 크론으로 돌리려면 GitHub Secrets에 `IG_ACCESS_TOKEN`, `IG_USER_ID`를 넣는다.
   (Variables에 `IG_GRAPH_HOST`도. 안 넣으면 graph.instagram.com.)

   ```bash
   gh secret set IG_ACCESS_TOKEN -R hangyeolryu/bloomagain-website
   gh secret set IG_USER_ID -R hangyeolryu/bloomagain-website
   ```

### 토큰 수명

| 로그인 방식 | 토큰 | 만료 | 크론 적합 |
|---|---|---|---|
| Instagram login | 장기 사용자 토큰 | **60일** (연장 가능) | 두 달마다 갱신해야 함 |
| Unified / Facebook login | 시스템 유저 토큰 | 없음 | ◎ |

Instagram 로그인 토큰은 만료 **전에** 연장한다(만료 뒤엔 콘솔에서 다시 발급).
연장하면 `.env.local`을 갱신하고, CI면 secret도 갈아끼운다.

```bash
node scripts/instagram/publish.mjs --refresh-token --write
gh secret set IG_ACCESS_TOKEN -R hangyeolryu/bloomagain-website < <(grep ^IG_ACCESS_TOKEN= .env.local | cut -d= -f2-)
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

자동으로 두려면 2)까지 하고 `queue.txt`에 `insight-16` 한 줄. 다음 화·금에 올라가고
장부는 워크플로가 커밋한다.

## 막힐 때

* **공개 URL이 안 열린다** — main에 푸시 안 됐거나 raw 캐시(5분). 푸시 후 잠깐 기다릴 것.
* **The image format is not supported** — PNG다. `sips -s format jpeg card-1.png --out card-1.jpg`.
* **(#10) Application does not have permission** — 토큰에 `instagram_business_content_publish`가
  없거나 계정이 프로페셔널이 아니다. 콘솔에서 토큰 다시 발급.
* **Invalid OAuth access token / Session has expired** — 토큰 만료. 콘솔에서 재발급.
* 캐러셀은 **2~10장**, 캡션 **2,200자**, 해시태그 **30개**가 상한. 스크립트가 먼저 막는다.
* 하루 게시 상한은 계정당 **100건**(24시간). 우리 쓰임엔 안 닿는다.
