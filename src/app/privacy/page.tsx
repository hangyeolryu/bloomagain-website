import LegalLayout from "../_components/legal/LegalLayout";

const TOC = [
  { id: "summary", label: "수집 데이터·이용 목적 요약" },
  { id: "section-1", label: "제1조 (목적)" },
  { id: "section-2", label: "제2조 (수집 및 이용 목적)" },
  { id: "section-3", label: "제3조 (처리하는 항목)" },
  { id: "section-4", label: "제4조 (처리 및 보유 기간)" },
  { id: "section-5", label: "제5조 (제3자 제공)" },
  { id: "section-6", label: "제6조 (연구 목적 활용 동의)" },
  { id: "section-7", label: "제7조 (정신건강 위기 대응)" },
  { id: "section-8", label: "제8조 (이용자의 권리)" },
  { id: "section-9", label: "제9조 (안전성 확보 조치)" },
  { id: "section-10", label: "제10조 (개인정보 보호책임자)" },
  { id: "section-11", label: "제11조 (변경)" },
  { id: "consent-matrix", label: "부칙 — 동의 매트릭스" },
  { id: "technical", label: "부칙 — 기술적 세부사항" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      activeKey="privacy"
      title="개인정보 처리방침"
      subtitle="다시 봄 (Tita Korea)"
      versionTag="v2.0"
      effectiveDate="2026년 5월 19일"
      lastUpdated="2026년 5월 19일"
      toc={TOC}
    >
      <section id="summary" className="bg-slate-50 border border-slate-200 rounded-lg p-6 -mt-2 mb-10">
        <h2 className="!mt-0">수집 데이터·이용 목적 요약</h2>
        <p>본 앱이 수집하는 데이터, 수집 경로, 그리고 모든 이용 목적을 한눈에 정리합니다.</p>

        <h3>1. 수집하는 데이터</h3>
        <ul>
          <li><strong>프로필 데이터</strong>: 이름, 생년월일, 성별, 이메일, 휴대폰 번호, 본인인증값(CI/DI), 프로필 사진, 관심사, 지역, 자기소개, 접근성 설정 등</li>
          <li><strong>채팅·메시지 데이터</strong>: 대화 메시지 내용(스캠 분석 및 안전 보호 목적)</li>
          <li><strong>안전·이용 데이터</strong>: 서비스 이용 기록, 접속 로그, 기기 정보, 신뢰도·위험 점수, 안전 이벤트 이력, FCM 토큰</li>
          <li><strong>안녕감 측정 데이터</strong> (선택 동의): 외로움·웰빙·우울 등 표준 척도 응답 및 자체 일일 질문 응답</li>
          <li><strong>기관 PoC 식별자</strong> (해당 시): 가입 기관(50플러스재단 캠퍼스, 노인복지관 등) 코드</li>
        </ul>

        <h3>2. 수집 방법</h3>
        <ul>
          <li><strong>앱 내 입력</strong>: 회원가입, 프로필 작성, 설정, 메시지 전송, 설문 응답</li>
          <li><strong>백엔드 API</strong>: 앱-서버 간 통신을 통해 전송·저장되는 프로필, 메시지, 이용 기록, 설문 응답</li>
          <li><strong>Google Cloud Functions</strong>: 임베딩 생성, 스캠 분석, 설문 점수 계산</li>
          <li><strong>자동 수집</strong>: 행동 데이터(터치·응답 latency·접근성 사용 패턴)</li>
        </ul>

        <h3>3. 모든 이용 목적</h3>
        <ul>
          <li><strong>매칭·추천</strong>: 프로필 + 일일 질문 태그 기반 임베딩 및 유사도 기반 인연·모임 추천</li>
          <li><strong>안전·스캠 감지</strong>: 메시지 분석을 통한 위험 대화 자동 차단, 위험 점수 산정</li>
          <li><strong>서비스 제공</strong>: 회원 관리, 푸시 알림, 접근성 설정 적용, 본인인증 및 부정 이용 방지</li>
          <li><strong>사용자 안녕감 측정</strong> (선택 동의): 본인 외로움·웰빙 변화 대시보드 제공</li>
          <li><strong>연구·통계 활용</strong> (선택 동의): 익명 집계 데이터의 학술 publish 및 정책 연구</li>
          <li><strong>기관 PoC 보고</strong> (선택 동의): 가입 기관에 익명 집계 결과 보고</li>
          <li>별도의 광고용 목적으로 개인을 식별 가능한 형태의 분석을 수행하지 않습니다.</li>
        </ul>
      </section>

      <section id="section-1">
        <h2>제1조 (목적)</h2>
        <p>
          &lsquo;다시 봄&rsquo;(이하 &lsquo;회사&rsquo;)은 이용자의 개인정보를 보호하고 이와 관련한
          고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보 처리방침을 수립·공개합니다.
          본 처리방침은 개인정보보호법(PIPA), 정보통신망법, 기관생명윤리위원회(IRB) 가이드라인을 준수합니다.
        </p>
      </section>

      <section id="section-2">
        <h2>제2조 (개인정보의 수집 및 이용 목적)</h2>
        <p>
          회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 각 목적에 대해 별도의 동의를 받으며,
          이용자는 일부 목적에 대해 동의를 거부하실 수 있고 거부 시에도 일반 서비스 이용은 가능합니다(필수 항목 제외).
        </p>
        <ol>
          <li>
            <strong>회원 가입 및 관리 (필수)</strong>: 본인 확인, 서비스 이용 의사 확인, 회원자격 유지·관리, 부정 이용 방지, CI/DI 기반 블랙리스트 확인.
          </li>
          <li>
            <strong>AI 기반 인연 추천 (필수)</strong>: Google Cloud Vertex AI text-embedding-005(또는 동일 세대 모델)을 활용한 사용자 프로필 임베딩 벡터(768차원) 생성 및 코사인 유사도 기반 매칭. 임베딩 벡터는 30일간 캐시되어 성능 최적화. 단, 추천 결과의 정확성이나 성공률을 보장하지 않습니다.
          </li>
          <li>
            <strong>접근성 최적화 (필수)</strong>: 사용자의 시력 수준 5단계(정상/경미/중등도/중증/심각), 오타율, 응답 latency 등 행동 데이터를 활용한 UI 자동 조정(글자 크기 14-24px, 대비 1.0-2.5, 버튼 간격 8-24px). 기본 설정은 중증 시력 기준.
          </li>
          <li>
            <strong>서비스 안전 및 보안 (필수)</strong>:
            <ul>
              <li>Google Cloud Vertex AI Gemini 모델을 활용한 실시간 메시지 분석 및 위험 대화 자동 차단</li>
              <li>4단계 안전 시스템 (특허 출원 PA260003): CI 인증 → AI 위험 점수 → 적응형 UI → 멤버 상호 보호</li>
              <li>로맨스 스캠·피싱 패턴 감지 및 차단 시도</li>
              <li>사용자 위험 점수 누적 및 관리자 검토 후 제재 가능</li>
              <li><strong>중요:</strong> 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다.</li>
            </ul>
          </li>
          <li>
            <strong>사용자 안녕감 측정 및 개선 (선택)</strong>: 우울·삶 만족도 등 정량 측정 도구를 통한 사용자 변화 추적 및 본인 대시보드 제공. 현재 사용 도구는 모두 public domain입니다.
            <ul>
              <li><strong>PHQ-2</strong> (Patient Health Questionnaire 2-item, public domain)</li>
              <li><strong>Cantril Ladder</strong> (public domain, Mini Pulse 격주 측정)</li>
              <li>티타 자체 설계 일일 질문 (성향·취향·정서 우회 측정)</li>
            </ul>
            <p className="mt-2 text-base text-gray-600">
              추가 도구(LSIS-6, UCLA Loneliness Scale, WHO-5, SWLS 등)는 권리자 사용 허가 절차가 완료되는 시점에 본 처리방침을 개정하여 안내한 후 도입할 예정입니다.
            </p>
          </li>
          <li>
            <strong>연구 및 통계 활용 (선택)</strong>: 익명화된 집계 데이터를 활용한 학술 논문 publish, 국립정신건강센터·보건복지부 등 공공 기관과의 정책 연구 협력, 한국 시니어 세대 디지털·정서·사회 연결 종단 데이터셋 구축. 개인 식별 정보는 학술 publish에 포함되지 않습니다.
          </li>
          <li>
            <strong>기관 협력 PoC 데이터 공유 (선택)</strong>: 본인이 특정 기관(예: 50플러스재단 캠퍼스, 노인복지관)을 통해 가입한 경우에 한해, 익명화·집계된 결과(전체 인원 수, 평균 변화, 양성률 등)를 해당 기관에 보고. <strong>개별 사용자 식별 정보는 절대 공유하지 않습니다.</strong>
          </li>
        </ol>
      </section>

      <section id="section-3">
        <h2>제3조 (처리하는 개인정보의 항목)</h2>
        <p>회사는 서비스 제공을 위해 아래와 같은 개인정보 항목을 수집할 수 있습니다.</p>
        <ol>
          <li><strong>필수항목</strong>: 이름, 생년월일, 성별, 이메일 주소, 휴대폰 번호, 본인인증값(CI/DI), 사용자 ID, 카카오 ID(소셜 로그인 시)</li>
          <li>
            <strong>선택항목</strong>:
            <ul>
              <li>프로필 사진, 관심사, 지역(시·군·구 수준), 자기소개</li>
              <li>시각적 접근성 설정값(시력 수준, 글자 크기, 대비 레벨, 버튼 간격)</li>
              <li>음성 안내 설정, 간소화 모드 설정, 자동 재생 설정</li>
              <li>동거 형태, 최종 학력, 직업 상태, 자가 보고 건강 상태 (Baseline survey)</li>
              <li><strong>민감 정보</strong>(만성질환 유무 등)는 별도 동의 후에만 수집</li>
            </ul>
          </li>
          <li>
            <strong>자동수집항목</strong>:
            <ul>
              <li>기기 정보, 접속 로그, 쿠키, 서비스 이용 기록</li>
              <li>대화 메시지 메타데이터(빈도·길이·시각); 본문은 안전 분석 외 별도 보존되지 않음</li>
              <li>사용자 임베딩 벡터(768차원, 30일 캐시)</li>
              <li>신뢰도 점수, 위험 점수, 안전 이벤트 이력</li>
              <li>FCM 토큰(푸시 알림 전송용)</li>
            </ul>
          </li>
          <li>
            <strong>설문 응답 (선택 동의 시에만)</strong>:
            <ul>
              <li>PHQ-2 등 public domain 표준 척도 응답</li>
              <li>티타 자체 일일 질문 응답 + 누적 태그</li>
              <li>Mini Pulse (격주 안부 체크) 응답</li>
              <li>모임 종료 후 만족도 응답</li>
              <li>서버 계산 점수: PHQ-2/9 합계, Cantril Ladder 점수</li>
            </ul>
          </li>
          <li><strong>B2G 기관 가입 시</strong>: 기관 식별자(tenant_id), 기관별 PoC 시작일, 기관 내 그룹 ID</li>
        </ol>
      </section>

      <section id="section-4">
        <h2>제4조 (개인정보의 처리 및 보유 기간)</h2>
        <ol>
          <li>회사는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</li>
          <li>
            원칙적으로 회원 탈퇴 시 개인정보는 지체 없이 파기합니다. 단, 다음의 경우 일정 기간 보관될 수 있습니다:
            <ul>
              <li>부정 이용 방지 목적의 fraud_history는 익명화(이름·CI 등 PII 제거) 후 보존</li>
              <li>법령에 따라 보관이 필요한 경우 해당 법령에 따른 보관 기간</li>
              <li><strong>연구 활용 동의 항목</strong>(제2조 6번): 5년 보유 후 자동 삭제 (단, 이미 익명화되어 학술 publish된 집계 통계는 보존됨)</li>
              <li><strong>창립 회원 번호 발급 이력</strong>: 신뢰성 보장을 위해 익명화된 형태로 영구 보관</li>
            </ul>
          </li>
          <li>사용자 임베딩 벡터: 30일 캐시 후 자동 갱신</li>
          <li>대화 메시지 메타데이터: 90일 보유 후 자동 삭제</li>
          <li>안전 이벤트 이력 및 위험 점수: 서비스 안전을 위해 내부 방침에 따라 보관</li>
          <li><strong>설문 응답 데이터</strong>: 사용자 동의에 따라 보유. 동의 철회 시 즉시 삭제.</li>
          <li><strong>결제·세금계산서 정보</strong>: 「국세기본법」 및 「전자상거래법」에 따라 5년간 보관</li>
        </ol>
      </section>

      <section id="section-5">
        <h2>제5조 (개인정보의 제3자 제공)</h2>
        <p>
          회사는 이용자의 개인정보를 제2조에서 명시한 범위 내에서만 처리하며, <strong>이용자의 동의 없이는 제3자에게 제공하지 않습니다</strong>. 아래 경우에는 예외로 합니다.
        </p>
        <ol>
          <li>이용자가 사전에 제3자 제공·공개에 동의한 경우</li>
          <li>법령 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          <li>
            <strong>기술 파트너 (필수 서비스 운영 위탁)</strong>:
            <ul>
              <li><strong>Google Cloud Platform / Firebase</strong>: 데이터 저장, 사용자 인증, 푸시 알림 전송, BigQuery 분석(익명화 후)</li>
              <li>
                <strong>Google Cloud Vertex AI</strong> (Google LLC, 제3자 AI):
                <ul>
                  <li><strong>전송 데이터</strong>: 사용자 프로필 텍스트 → 임베딩 벡터 생성; 채팅 메시지 텍스트 → 스캠·안전 분석</li>
                  <li><strong>보호 방식</strong>: Google Cloud 서비스 약관 및 데이터 처리 계약(DPA)에 따라 처리. Google의 자체 모델 학습용으로 이용되지 않습니다.</li>
                </ul>
              </li>
              <li><strong>OpenAI</strong> (선택적, 제3자 AI): AI 상담사 봇 응답 생성용 텍스트. OpenAI 자체 모델 학습용으로 이용되지 않음.</li>
              <li><strong>NICE 평가정보</strong>: 본인인증 (CI/DI 발급)</li>
              <li><strong>TossPayments / Apple / Google</strong>: 결제 처리</li>
              <li><strong>RevenueCat</strong>: 구독 관리</li>
            </ul>
          </li>
          <li>
            <strong>기관 PoC 협력처 (제2조 7번 동의 시에만)</strong>:
            <ul>
              <li>기관(서울시50플러스재단, 경기도50+, 노인복지관 등)에 제공하는 데이터는 <strong>익명화된 집계 수준</strong>(N≥50 미만 셀 마스킹)만 해당</li>
              <li>개별 사용자의 이름·연락처·CI·메시지 내용 등은 <strong>절대 공유하지 않음</strong></li>
              <li>공유 형식: 분기·PoC 종료 보고서 PDF + 익명 데이터셋 CSV (필요 시)</li>
            </ul>
          </li>
          <li>
            <strong>학술 연구 협력 (제2조 6번 동의 시에만)</strong>:
            <ul>
              <li>대학·연구기관과의 공동 연구 시 IRB 승인된 범위 내에서 익명화 데이터 공유</li>
              <li>학술 논문 publish 시 개별 사용자 식별 불가능한 집계만 사용</li>
            </ul>
          </li>
        </ol>
        <p>회사는 개인정보를 당사와 동일하거나 동등 이상의 보호를 제공하는 제3자에게만 공유합니다.</p>
      </section>

      <section id="section-6" className="bg-blue-50 border-l-4 border-blue-400 rounded-r p-6 my-8">
        <h2 className="!mt-0">제6조 (연구 목적 활용 동의)</h2>
        <ol>
          <li><strong>별도 동의</strong>: 제2조 6번(연구 및 통계 활용), 제2조 7번(기관 PoC) 활용은 회원 가입과 분리하여 별도 동의를 받습니다.</li>
          <li>
            <strong>거부 시</strong>: 동의를 거부하셔도 티타의 일반 서비스(모임·매칭·메시지·안전 기능) 이용에 제한이 없습니다. 다만:
            <ul>
              <li>본인 외로움·웰빙 변화 대시보드 제공 X (설문 미수집)</li>
              <li>기관 PoC 가입 시 해당 기관에 익명화 결과 제공 X</li>
            </ul>
          </li>
          <li><strong>동의 후 철회</strong>: 마이페이지 → 설정 → &ldquo;연구 활용 동의&rdquo;에서 언제든 철회 가능. 철회 시 즉시 이후 데이터 수집 중단, 기수집 데이터는 14일 이내 삭제.</li>
          <li>
            <strong>사용 도구 출처 표기</strong>:
            <ul>
              <li>PHQ-2: Public domain (Pfizer 공개)</li>
              <li>Cantril Ladder: Public domain</li>
              <li>티타 자체 일일 질문: 티타(㈜이프이프) 자체 설계 콘텐츠</li>
            </ul>
          </li>
          <li><strong>윤리 검토</strong>: 학술 연구 협력은 대학·공공기관의 기관생명윤리위원회(IRB) 승인을 받은 프로토콜에 따라 진행됩니다.</li>
        </ol>
      </section>

      <section id="section-7" className="bg-rose-50 border-l-4 border-rose-400 rounded-r p-6 my-8">
        <h2 className="!mt-0">제7조 (정신건강 위기 대응)</h2>
        <ol>
          <li>
            <strong>자동 안내</strong>: 설문 응답이 다음 임계치를 초과할 경우, 사용자에게 자동으로 정신건강 지원 정보를 제공합니다:
            <ul>
              <li>PHQ-2 합계 ≥ 2</li>
            </ul>
            <p className="mt-2 text-base text-gray-600">
              PHQ-9(전체 9문항, 자해 문항 포함) 도입 시 추가 임계치(합계 ≥ 10, 자해 문항 양성)도 본 처리방침 개정 후 적용 예정입니다.
            </p>
          </li>
          <li>
            <strong>안내 내용</strong>: 정신건강상담전화(1577-0199), 자살예방상담전화(1393), 보건복지부 정신건강 정보 페이지(<a href="https://www.mentalhealth.go.kr" target="_blank" rel="noopener noreferrer">www.mentalhealth.go.kr</a>).
          </li>
          <li>
            <strong>임상 진단 아님</strong>: 본 서비스의 자동 안내는 <strong>임상적 진단·치료를 대체하지 않으며</strong>, 사용자가 전문 의료기관에 방문할 것을 권장하는 정보 제공입니다.
          </li>
          <li>
            <strong>응급 상황 대응 (PHQ-9 도입 후 예정)</strong>: PHQ-9(자해 문항 포함) 도입 시, 자해 문항 양성 응답에 대해 사용자가 사전에 지정한 비상연락처(가족·친구)에 알림 전송을 선택할 수 있도록 할 예정입니다(별도 동의 필수, 본 처리방침 개정 후 활성화).
          </li>
        </ol>
      </section>

      <section id="section-8">
        <h2>제8조 (이용자의 권리와 의무)</h2>
        <p>이용자는 다음 권리를 보장받습니다:</p>
        <ol>
          <li><strong>열람권</strong>: 본인의 개인정보를 언제든 조회. 마이페이지 → 설정 → &ldquo;내 데이터 보기&rdquo;</li>
          <li><strong>정정·삭제권</strong>: 개인정보 수정 또는 회원 탈퇴를 통한 삭제. 마이페이지에서 즉시 가능</li>
          <li><strong>처리 정지권</strong>: 설문 응답 수집·연구 활용 등 선택 동의는 언제든 철회</li>
          <li><strong>이의 제기권</strong>: 자동화된 의사 결정(매칭 알고리즘, 안전 점수)에 대한 설명 요구 가능 (Right to Explanation)</li>
          <li><strong>데이터 이동권</strong>: 본인 데이터 JSON 형식으로 download (마이페이지 → 설정 → &ldquo;내 데이터 내보내기&rdquo;)</li>
        </ol>
      </section>

      <section id="section-9">
        <h2>제9조 (개인정보의 안전성 확보 조치)</h2>
        <p>회사는 이용자의 개인정보를 취급함에 있어 분실, 도난, 유출, 변조 또는 훼손되지 않도록 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.</p>
        <ol>
          <li><strong>암호화</strong>: 비밀번호 및 주요 데이터는 암호화되어 저장 및 관리됩니다.</li>
          <li><strong>익명화 파이프라인</strong>: 분석용 데이터는 PII(이름·전화·CI) 분리 후 hash 처리하여 별도 컬렉션(users_anon)에 적재.</li>
          <li><strong>AI 보안 모니터링</strong>: Vertex AI Gemini 기반 실시간 메시지 분석 + 멀티모달 신뢰 스코어링.</li>
          <li><strong>해킹 대비</strong>: SSL 전송 구간 암호화 및 외부 침입 차단 시스템.</li>
          <li><strong>접근 제어</strong>: Firebase Authentication, CI/DI 블랙리스트, 내부 감사 로그.</li>
          <li><strong>ISMS-P 인증</strong>: 진행 중 (2026 Q3 정식 완료 예정).</li>
          <li><strong>데이터 처리 로그</strong>: 모든 governance API 호출(consent, export, delete) 자동 audit_logs 기록.</li>
          <li><strong>N&lt;50 마스킹</strong>: 외부 보고서 작성 시 집계 셀 인원이 50명 미만이면 마스킹.</li>
        </ol>
      </section>

      <section id="section-10">
        <h2>제10조 (개인정보 보호책임자)</h2>
        <p>서비스 이용 중 발생하는 모든 개인정보 보호 관련 민원은 아래의 담당 부서로 문의하실 수 있습니다.</p>
        <div className="bg-[#BFE38A]/20 border-l-4 border-[#1F4E3D] p-6 rounded">
          <ul className="!list-none !pl-0">
            <li><strong>성명</strong>: 유한결</li>
            <li><strong>직책</strong>: 개인정보 보호책임자 / 대표</li>
            <li><strong>이메일</strong>: <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a></li>
            <li><strong>회사</strong>: ㈜이프이프 (사업자등록 466-81-04205)</li>
            <li><strong>신고센터</strong>: 개인정보보호위원회 (<a href="https://privacy.go.kr" target="_blank" rel="noopener noreferrer">privacy.go.kr</a>), 개인정보침해신고센터 (118번)</li>
          </ul>
        </div>
      </section>

      <section id="section-11">
        <h2>제11조 (개인정보 처리방침의 변경)</h2>
        <p>본 처리방침은 시행일로부터 적용되며, 법령·정책 변경 또는 신규 데이터 수집 도구 도입 시 공지사항을 통해 사전 고지합니다.</p>
        <ul>
          <li><strong>v1.0 공고·시행</strong>: 2026년 1월 1일</li>
          <li><strong>v2.0 공고·시행</strong>: 2026년 5월 19일</li>
        </ul>
        <h3>v2.0 주요 변경사항</h3>
        <ol>
          <li>정량 측정 도구(PHQ-2, Cantril Ladder, Daily Questions — 모두 public domain) 사용 명시</li>
          <li>연구 목적 활용 동의 분리 (선택 항목)</li>
          <li>기관 PoC 데이터 공유 조항 신설 (선택 항목, 익명화 집계만)</li>
          <li>정신건강 위기 자동 안내 조항 신설 (PHQ-2 양성 등)</li>
          <li>Right to Explanation 명시</li>
          <li>익명화 파이프라인 (users_anon) 명시</li>
          <li>ISMS-P 인증 진행 안내</li>
          <li>창립 회원 번호 발급 이력 영구 보관 명시</li>
        </ol>
      </section>

      <section id="consent-matrix">
        <h2>부칙 — 동의 매트릭스 요약</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full border-collapse text-base">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2 text-left">#</th>
                <th className="border border-slate-300 px-3 py-2 text-left">동의 항목</th>
                <th className="border border-slate-300 px-3 py-2 text-left">필수/선택</th>
                <th className="border border-slate-300 px-3 py-2 text-left">거부 시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-3 py-2">1</td>
                <td className="border border-slate-300 px-3 py-2">서비스 이용 (필수 운영 데이터)</td>
                <td className="border border-slate-300 px-3 py-2">필수</td>
                <td className="border border-slate-300 px-3 py-2">가입 불가</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2">2</td>
                <td className="border border-slate-300 px-3 py-2">본인인증 (NICE CI/DI)</td>
                <td className="border border-slate-300 px-3 py-2">필수</td>
                <td className="border border-slate-300 px-3 py-2">가입 불가</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2">3</td>
                <td className="border border-slate-300 px-3 py-2">위치 정보 (시·구 수준)</td>
                <td className="border border-slate-300 px-3 py-2">필수</td>
                <td className="border border-slate-300 px-3 py-2">가입 불가</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2">4</td>
                <td className="border border-slate-300 px-3 py-2">마케팅 수신 (이메일·푸시)</td>
                <td className="border border-slate-300 px-3 py-2">선택</td>
                <td className="border border-slate-300 px-3 py-2">일반 사용 가능</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2">5</td>
                <td className="border border-slate-300 px-3 py-2">만성질환 등 민감 정보</td>
                <td className="border border-slate-300 px-3 py-2">선택</td>
                <td className="border border-slate-300 px-3 py-2">일반 사용 가능</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-slate-300 px-3 py-2">6</td>
                <td className="border border-slate-300 px-3 py-2"><strong>설문 응답 수집</strong> (제2조 5번)</td>
                <td className="border border-slate-300 px-3 py-2"><strong>선택</strong></td>
                <td className="border border-slate-300 px-3 py-2">본인 외로움 대시보드 X, 일반 사용 가능</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-slate-300 px-3 py-2">7</td>
                <td className="border border-slate-300 px-3 py-2"><strong>연구 목적 활용</strong> (제2조 6번)</td>
                <td className="border border-slate-300 px-3 py-2"><strong>선택</strong></td>
                <td className="border border-slate-300 px-3 py-2">학술 publish용 익명 집계 X, 일반 사용 가능</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-slate-300 px-3 py-2">8</td>
                <td className="border border-slate-300 px-3 py-2"><strong>기관 PoC 데이터 공유</strong> (제2조 7번)</td>
                <td className="border border-slate-300 px-3 py-2"><strong>선택</strong></td>
                <td className="border border-slate-300 px-3 py-2">해당 기관 사용 시 PoC 보고서 비활성, 일반 사용 가능</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2">9</td>
                <td className="border border-slate-300 px-3 py-2">PHQ-9 자해 양성 시 비상연락 알림 (PHQ-9 도입 후 예정)</td>
                <td className="border border-slate-300 px-3 py-2">선택</td>
                <td className="border border-slate-300 px-3 py-2">자동 알림 X, 본인 화면 안내만</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2">10</td>
                <td className="border border-slate-300 px-3 py-2">AI 학습 데이터 활용</td>
                <td className="border border-slate-300 px-3 py-2">선택</td>
                <td className="border border-slate-300 px-3 py-2">AI 개선 기여 X, 일반 사용 가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="technical">
        <h2>부칙 — 기술적 세부사항</h2>

        <h3>AI 기반 매칭 시스템</h3>
        <ul>
          <li><strong>기술</strong>: Google Cloud Vertex AI text-embedding-005 (또는 동일 세대) 모델을 활용한 사용자 프로필 분석</li>
          <li><strong>목적</strong>: 관심사·일일 질문 태그 기반 사용자·모임 유사도 계산</li>
          <li><strong>캐싱</strong>: 임베딩 벡터는 30일간 캐시되어 성능 최적화</li>
          <li><strong>면책</strong>: 추천 결과의 정확성이나 성공률을 보장하지 않습니다.</li>
        </ul>

        <h3>스캠 방지 시스템</h3>
        <ul>
          <li><strong>실시간 분석</strong>: Google Cloud Vertex AI Gemini 모델을 통한 메시지 분석 시도</li>
          <li><strong>4단계 안전</strong>: CI 인증 → AI 위험 점수 → 적응형 UI → 멤버 상호 보호 (특허 출원 PA260003)</li>
          <li>
            <strong>패턴 감지</strong>:
            <ul>
              <li>로맨스 스캠: 과도한 감정 표현, 금전적 도움 요청, 긴급 상황 주장, 만남 회피</li>
              <li>피싱: 계좌 정보, 비밀번호, 개인정보 요청, 의심스러운 링크</li>
            </ul>
          </li>
          <li><strong>제재</strong>: 위험 점수 누적 시 관리자 검토 후 제한 또는 정지 가능</li>
          <li><strong>중요 면책</strong>: 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다.</li>
        </ul>

        <h3>신규 측정 도구 인프라 — v2</h3>
        <ul>
          <li><strong>설문 응답 저장</strong>: Firestore <code className="bg-slate-100 px-1 rounded text-sm">users/{`{uid}`}/survey_responses</code> + Backend Postgres <code className="bg-slate-100 px-1 rounded text-sm">survey_responses</code> 테이블</li>
          <li><strong>점수 계산</strong>: 서버 사이드만 수행 (클라이언트 신뢰 X)</li>
          <li><strong>태그 propagation</strong>: 설문 응답 → <code className="bg-slate-100 px-1 rounded text-sm">dailyQuestionTags</code> → embedding 파이프라인</li>
          <li><strong>B2G tenant 격리</strong>: <code className="bg-slate-100 px-1 rounded text-sm">tenant_id</code> 필드로 캠퍼스·복지관별 데이터 격리. 기관 간 데이터 섞이지 않음.</li>
        </ul>

        <h3>접근성 시스템</h3>
        <ul>
          <li><strong>시력 수준</strong>: 정상(16px), 경미(18px), 중등도(20px), 중증(22px), 심각(24px)</li>
          <li><strong>기본 설정</strong>: 중증 시력 기준(22px, 대비 2.0, 버튼 간격 20px)</li>
          <li><strong>동적 조정</strong>: 시력 수준에 따라 글자 크기, 대비, 버튼 간격 자동 조정</li>
          <li><strong>저장 위치</strong>: 로컬 기기(SharedPreferences), 서버 동기화는 사용자 동의 시에만</li>
        </ul>

        <h3>제3자 AI 서비스(외부 API)</h3>
        <p>본 앱은 아래 제3자 AI 제공자를 사용합니다. 각 제공자별 전송 데이터와 보호 방식을 명시합니다.</p>
        <ul>
          <li>
            <strong>Google Cloud Vertex AI</strong> (Google LLC)
            <ul>
              <li><strong>전송 데이터</strong>: 프로필 텍스트 — 임베딩용; 채팅 메시지 텍스트 — 스캠·안전 분석용. 이미지 등 다른 유형의 데이터는 해당 AI 기능에 사용되지 않습니다.</li>
              <li><strong>보호 방식</strong>: Google Cloud 서비스 약관 및 DPA에 따라 처리. Google의 자체 모델 학습용으로 이용되지 않습니다.</li>
            </ul>
          </li>
          <li>
            <strong>OpenAI</strong> (선택적)
            <ul>
              <li><strong>전송 데이터</strong>: AI 상담사 봇과의 대화에서 이용자가 입력한 텍스트 및 대화 맥락.</li>
              <li><strong>보호 방식</strong>: OpenAI 서비스 약관 및 DPA에 따라 처리. OpenAI 자체 모델 학습용으로 이용되지 않습니다.</li>
            </ul>
          </li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r mt-6">
          <h3 className="!mt-0">면책 조항</h3>
          <p>
            회사는 AI 기반 서비스(인연 추천, 스캠 방지, 안녕감 측정 등)의 오류, 부정확성, 오탐, 미탐으로 인한 손해에 대해 책임을 지지 않습니다. 스캠 방지 시스템이 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않으며, 이용자가 사기로 인해 입은 손해에 대해 책임을 지지 않습니다. 설문 도구를 통한 안녕감 측정 결과는 임상적 진단·치료를 대체하지 않으며, 마음 건강 문제는 반드시 전문 의료기관에 방문하실 것을 권장합니다. 이용자는 개인정보와 금전 관련 요청에 대해 항상 주의를 기울여야 합니다.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
