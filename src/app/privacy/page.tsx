import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#534741]">다시, 봄</Link>
              <span className="ml-2 text-sm text-gray-500">Dasi, Bom</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </Link>
                <Link href="/privacy" className="text-gray-900 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  이용약관
                </Link>
                <Link href="/security-processing" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  보안·행동 데이터 처리
                </Link>
                <Link href="/delete-account" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  계정삭제
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">개인정보 처리방침</h1>
          <p className="text-lg text-gray-600 mb-8">다시 봄(Bloom Again Korea)</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                &apos;다시 봄&apos;(이하 &apos;회사&apos;)은 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보 처리방침을 수립·공개합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제2조 (개인정보의 수집 및 이용 목적)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  <strong>회원 가입 및 관리</strong>: 본인 확인, 서비스 이용 의사 확인, 회원자격 유지·관리, 부정 이용 방지, CI/DI 기반 블랙리스트 확인
                </li>
                <li>
                  <strong>AI 기반 인연 추천</strong>: Google Cloud Vertex AI의 text-embedding-004 모델을 활용한 사용자 프로필 분석 및 유사도 기반 추천 서비스 제공. 임베딩 벡터는 30일간 캐시되어 성능 최적화. 단, 추천 결과의 정확성이나 성공률을 보장하지 않습니다.
                </li>
                <li>
                  <strong>접근성 최적화</strong>: 사용자의 시력 수준에 따른 앱 내 레이아웃 자동 조정(글자 크기, 대비, 버튼 간격). 기본 설정은 중증 시력 기준으로 제공됩니다.
                </li>
                <li>
                  <strong>서비스 안전 및 보안</strong>: 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Google Cloud Vertex AI Gemini 1.5 Flash 모델을 활용한 실시간 메시지 분석 및 스캠 감지 시도</li>
                    <li>대화 맥락 분석을 통한 의심 패턴 감지</li>
                    <li>로맨스 스캠 패턴 감지 시도(과도한 감정 표현, 금전적 도움 요청, 긴급 상황 주장, 만남 회피 등)</li>
                    <li>피싱 패턴 감지 시도(계좌 정보, 비밀번호, 개인정보 요청 등)</li>
                    <li>대화 맥락 분석(최근 메시지 기반 패턴 분석)</li>
                    <li>사용자 위험 점수 누적 및 관리자 검토 후 제재 가능</li>
                    <li>관리자 알림 시스템(고위험 메시지 자동 보고)</li>
                    <li><strong>중요:</strong> 스캠 방지 시스템이 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다. 이용자는 개인정보와 금전 관련 요청에 대해 항상 주의를 기울여야 합니다.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제3조 (처리하는 개인정보의 항목)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                회사는 서비스 제공을 위해 아래와 같은 개인정보 항목을 수집할 수 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <strong>필수항목</strong>: 이름, 생년월일, 성별, 이메일 주소, 휴대폰 번호, 본인인증값(CI/DI), 사용자 ID, 카카오 ID(소셜 로그인 시)
                </li>
                <li>
                  <strong>선택항목</strong>: 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>프로필 사진, 관심사, 지역(대략적 위치), 자기소개, 가치관</li>
                    <li>시각적 접근성 설정값(시력 수준, 글자 크기, 대비 레벨, 버튼 간격)</li>
                    <li>음성 안내 설정, 간소화 모드 설정, 자동 재생 설정</li>
                  </ul>
                </li>
                <li>
                  <strong>자동수집항목</strong>: 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>기기 정보, 접속 로그, 쿠키, 서비스 이용 기록</li>
                    <li>대화 메시지 내용(스캠 분석 및 신뢰도 계산용, 안전 보호 목적)</li>
                    <li>사용자 프로필 분석 데이터(30일간 캐시)</li>
                    <li>신뢰도 점수, 위험 점수, 스캠 감지 이력(서비스 안전 보호 목적)</li>
                    <li>FCM 토큰(푸시 알림 전송용)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제4조 (개인정보의 처리 및 보유 기간)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  회사는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
                </li>
                <li>
                  원칙적으로 회원 탈퇴 시 개인정보는 지체 없이 파기합니다. 단, 다음의 경우 일정 기간 보관될 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>부정 이용 방지 및 로맨스 스캠 기록 확인을 위해 내부 방침에 따라 일정 기간 보관</li>
                    <li>법령에 따라 보관이 필요한 경우 해당 법령에 따른 보관 기간</li>
                  </ul>
                </li>
                <li>사용자 임베딩 벡터는 30일간 캐시되며, 이후 자동으로 갱신됩니다.</li>
                <li>스캠 감지 이력 및 위험 점수는 서비스 안전을 위해 내부 방침에 따라 보관될 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제5조 (개인정보의 제3자 제공)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                회사는 이용자의 개인정보를 제2조에서 명시한 범위 내에서만 처리하며, 이용자의 동의 없이는 원칙적으로 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>이용자가 사전에 제3자 제공 및 공개에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>
                  <strong>기술 파트너</strong>: 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><strong>Google Cloud Platform / Firebase</strong>: 데이터 저장, 사용자 인증, 푸시 알림 전송</li>
                    <li><strong>Google Cloud Vertex AI</strong>: 
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li>text-embedding-004 모델: 사용자 프로필 임베딩 벡터 생성(768차원)</li>
                        <li>Gemini 1.5 Flash 모델: 실시간 메시지 스캠 분석 및 신뢰도 계산</li>
                      </ul>
                    </li>
                    <li><strong>OpenAI</strong> (선택적): AI 상담사 봇 응답 생성(gpt-4o-mini 모델)</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제6조 (이용자의 권리와 의무)</h2>
              <p className="text-gray-700 leading-relaxed">
                이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다. 접근성 설정(시력 수준, 글자 크기 등)은 앱 내 설정 화면에서 언제든지 변경 가능합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제7조 (개인정보의 안전성 확보 조치)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                회사는 이용자의 개인정보를 취급함에 있어 분실, 도난, 유출, 변조 또는 훼손되지 않도록 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li><strong>암호화</strong>: 비밀번호 및 주요 데이터는 암호화되어 저장 및 관리됩니다.</li>
                <li>
                  <strong>AI 보안 모니터링</strong>: 
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Google Cloud Vertex AI Gemini 1.5 Flash를 활용한 실시간 메시지 분석 시도</li>
                    <li>대화 맥락 분석을 통한 의심 패턴 감지 시도</li>
                    <li>로맨스 스캠 및 피싱 패턴 감지 및 차단 시도</li>
                    <li>사용자 위험 점수 누적 및 관리자 검토 후 제재 가능</li>
                    <li><strong>면책:</strong> 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다.</li>
                  </ul>
                </li>
                <li><strong>해킹 대비</strong>: SSL 전송 구간 암호화 및 외부 침입 차단 시스템을 운영합니다.</li>
                <li><strong>접근 제어</strong>: Firebase Authentication을 통한 안전한 사용자 인증 및 CI/DI 기반 블랙리스트 확인</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제8조 (개인정보 보호책임자)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                서비스 이용 중 발생하는 모든 개인정보 보호 관련 민원은 아래의 담당 부서로 문의하실 수 있습니다.
              </p>
              <div className="bg-[#BFE38A]/20 border-l-4 border-[#8CB350] p-6 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>성명</strong>: 유한결</li>
                  <li><strong>직책</strong>: 개인정보 보호책임자</li>
                  <li><strong>이메일</strong>: <a href="mailto:hangyeolryu@gmail.com" className="text-[#8CB350] hover:underline">hangyeolryu@gmail.com</a></li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제9조 (개인정보 처리방침의 변경)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 수정이 있을 시에는 공지사항을 통해 고지할 것입니다.
              </p>
              <ul className="space-y-1 text-gray-700">
                <li><strong>공고일자</strong>: 2026년 1월 1일</li>
                <li><strong>시행일자</strong>: 2026년 1월 1일</li>
                <li><strong>최종 업데이트</strong>: 2026년 1월 1일</li>
              </ul>
            </section>

            <div className="border-t-2 border-[#8CB350] pt-8 mt-12">
              <h2 className="text-2xl font-semibold text-[#534741] mb-6">부칙: 기술적 세부사항</h2>
              
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 기반 매칭 시스템</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>기술</strong>: Google Cloud Vertex AI text-embedding-004 모델을 활용한 사용자 프로필 분석</li>
                  <li><strong>목적</strong>: 관심사와 가치관 기반 사용자 유사도 계산 및 추천</li>
                  <li><strong>캐싱</strong>: 분석 데이터는 30일간 캐시되어 성능 최적화</li>
                  <li><strong>면책</strong>: 추천 결과의 정확성이나 성공률을 보장하지 않습니다.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">스캠 방지 시스템</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>실시간 분석</strong>: Google Cloud Vertex AI Gemini 1.5 Flash 모델을 통한 메시지 분석 시도</li>
                  <li><strong>패턴 감지</strong>: 
                    <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                      <li>로맨스 스캠: 과도한 감정 표현, 금전적 도움 요청, 긴급 상황 주장, 만남 회피</li>
                      <li>피싱: 계좌 정보, 비밀번호, 개인정보 요청, 의심스러운 링크</li>
                    </ul>
                  </li>
                  <li><strong>대화 맥락 분석</strong>: 최근 메시지를 분석하여 패턴 감지 시도</li>
                  <li><strong>제재</strong>: 위험 점수 누적 시 관리자 검토 후 제한 또는 정지 가능</li>
                  <li><strong>중요 면책</strong>: 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다. 이용자는 개인정보와 금전 관련 요청에 대해 항상 주의를 기울여야 합니다.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">접근성 시스템</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>기능</strong>: 시력 수준에 따른 앱 내 레이아웃 자동 조정</li>
                  <li><strong>조정 항목</strong>: 글자 크기, 대비, 버튼 간격</li>
                  <li><strong>기본 설정</strong>: 중증 시력 기준으로 제공</li>
                  <li><strong>저장 위치</strong>: 로컬 기기에만 저장, 서버 동기화 없음</li>
                </ul>
              </section>
              
              <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">면책 조항</h3>
                <p className="text-gray-700 leading-relaxed">
                  회사는 AI 기반 서비스(인연 추천, 스캠 방지 등)의 오류, 부정확성, 오탐, 미탐으로 인한 손해에 대해 책임을 지지 않습니다. 
                  스캠 방지 시스템이 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않으며, 이용자가 사기로 인해 입은 손해에 대해 책임을 지지 않습니다. 
                  이용자는 개인정보와 금전 관련 요청에 대해 항상 주의를 기울여야 합니다.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
