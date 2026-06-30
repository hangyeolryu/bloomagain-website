# BloomAgain Korea Website

티타 (Tita) 앱의 공식 웹사이트입니다. 마케팅, 개인정보처리방침, 이용약관, 계정삭제 페이지를 제공합니다.

## 🚀 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Analytics, Auth, Firestore, Storage, Functions)
- **Deployment**: Vercel (권장)

## 📁 프로젝트 구조

```
bloomagain-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 홈페이지 (마케팅)
│   │   ├── privacy/
│   │   │   └── page.tsx          # 개인정보처리방침
│   │   ├── terms/
│   │   │   └── page.tsx          # 이용약관
│   │   └── delete-account/
│   │       └── page.tsx          # 계정삭제 페이지
│   └── lib/
│       └── firebase.ts           # Firebase 설정
├── public/                       # 정적 파일
├── package.json
└── README.md
```

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

### 4. 프로덕션 서버 실행
```bash
npm start
```

## 🔥 Firebase 설정

Firebase 설정은 `src/lib/firebase.ts`에 포함되어 있습니다:

- **Analytics**: 사용자 행동 분석
- **Auth**: 사용자 인증 (필요시)
- **Firestore**: 데이터베이스 (필요시)
- **Storage**: 파일 저장 (필요시)
- **Functions**: 서버 함수 (필요시)

## 📱 페이지 구성

### 1. 홈페이지 (`/`)
- 앱 소개 및 주요 기능
- 접근성 기능 설명
- 다운로드 링크
- 반응형 디자인

### 2. 개인정보처리방침 (`/privacy`)
- 수집하는 정보
- 정보 사용 목적
- 데이터 보안
- 사용자 권리
- 연령 제한 (만 45세 이상)

### 3. 이용약관 (`/terms`)
- 서비스 이용 조건
- 연령 제한 명시
- 이용자 의무
- 면책 조항
- 관할 법원

### 4. 계정삭제 (`/delete-account`)
- 삭제 방법 안내
- 삭제되는 데이터
- 보존되는 데이터
- 처리 기간
- 문의 방법

## 🎨 디자인 특징

- **반응형**: 모바일, 태블릿, 데스크톱 지원
- **접근성**: 큰 글씨, 고대비, 명확한 네비게이션
- **한국어 우선**: 한국어 기본, 영어 지원
- **50+ 타겟**: 시니어 친화적 디자인

## 🚀 배포

### Vercel 배포 (권장)
```bash
npm install -g vercel
vercel
```

### 기타 플랫폼
- Netlify
- Firebase Hosting
- AWS Amplify

## 📧 연락처

- **일반 문의**: efflio.inc@gmail.com
- **계정 삭제**: efflio.inc@gmail.com
- **개인정보**: efflio.inc@gmail.com

## 📄 라이선스

© 2025 BloomAgain Korea. All rights reserved.

---

**티타 (Tita)** - 만 45세 이상을 위한 따뜻한 동반자 앱