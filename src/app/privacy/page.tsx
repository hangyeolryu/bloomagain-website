import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">다시, 봄</Link>
              <span className="ml-2 text-sm text-gray-500">Dasi, Bom</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </Link>
                <Link href="/privacy" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  이용약관
                </Link>
                <Link href="/delete-account" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>다시, 봄 (Dasi, Bom)</strong>은 사용자의 개인정보 보호를 매우 중요하게 생각합니다. 
              본 개인정보처리방침은 당사가 수집하는 정보, 사용 방법, 보호 방법에 대해 설명합니다.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 수집하는 정보</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">프로필 정보</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>이름 (실명 또는 닉네임)</li>
                    <li>출생년도 (50세 이상 확인용)</li>
                    <li>거주지 (도시, 구/군)</li>
                    <li>관심사 및 취미</li>
                    <li>자기소개</li>
                    <li>프로필 사진</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">인증 정보</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>이메일 주소 (OAuth 제공자로부터)</li>
                    <li>전화번호 (SMS 인증용)</li>
                    <li>소셜 로그인 정보 (Google, Apple, Naver, Kakao)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">기기 정보</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>기기 ID 및 모델</li>
                    <li>운영체제 버전</li>
                    <li>앱 버전</li>
                    <li>푸시 알림 토큰</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">사용 정보</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>메시지 및 대화 내용</li>
                    <li>음성 메시지</li>
                    <li>서클 활동</li>
                    <li>이벤트 참여 기록</li>
                    <li>마지막 접속 시간</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 정보 사용 목적</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>서비스 제공 및 계정 관리</li>
                <li>사용자 인증 및 보안</li>
                <li>맞춤형 추천 및 개인화</li>
                <li>고객 지원 및 문의 응답</li>
                <li>서비스 개선 및 개발</li>
                <li>법적 의무 이행</li>
                <li>안전 및 보안 강화</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 정보 공유</h2>
              <p className="text-gray-600 mb-4">
                당사는 사용자의 동의 없이 개인정보를 제3자와 공유하지 않습니다. 
                다음의 경우에만 정보를 공유할 수 있습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>법적 요구사항에 따른 경우</li>
                <li>사용자 안전을 위해 필요한 경우</li>
                <li>서비스 제공을 위해 필요한 최소한의 정보만 공유</li>
                <li>사용자가 명시적으로 동의한 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 데이터 보안</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>모든 데이터는 HTTPS를 통한 암호화 전송</li>
                <li>Firebase의 보안 인프라 활용</li>
                <li>정기적인 보안 업데이트 및 모니터링</li>
                <li>접근 권한 최소화 원칙</li>
                <li>데이터 백업 및 복구 시스템</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 사용자 권리</h2>
              <p className="text-gray-600 mb-4">사용자는 다음의 권리를 가집니다:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>개인정보 열람 및 수정</li>
                <li>개인정보 삭제 요청</li>
                <li>개인정보 처리 정지 요청</li>
                <li>개인정보 이전 요청</li>
                <li>동의 철회</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 쿠키 및 추적</h2>
              <p className="text-gray-600 mb-4">
                당사는 서비스 개선을 위해 다음의 정보를 수집할 수 있습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>앱 사용 패턴 및 통계</li>
                <li>오류 및 성능 데이터</li>
                <li>익명화된 분석 데이터</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 연령 제한</h2>
              <p className="text-gray-600">
                본 서비스는 50세 이상의 사용자만을 대상으로 합니다. 
                50세 미만의 사용자는 서비스를 이용할 수 없으며, 
                해당 정보는 수집되지 않습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보처리방침 변경</h2>
              <p className="text-gray-600">
                본 개인정보처리방침은 필요에 따라 변경될 수 있습니다. 
                중요한 변경사항이 있을 경우 앱 내 공지 또는 이메일을 통해 
                사용자에게 알려드립니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 문의처</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">
                  개인정보 관련 문의사항이 있으시면 언제든지 연락해 주세요.
                </p>
                <p className="text-gray-600">
                  <strong>이메일:</strong> efflio.inc@gmail.com<br />
                  <strong>고객지원:</strong> efflio.inc@gmail.com<br />
                  <strong>운영시간:</strong> 평일 09:00 - 18:00
                </p>
              </div>
            </section>

            <div className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-500">
                <strong>최종 업데이트:</strong> 2025년 09월 27일<br />
                <strong>시행일:</strong> 2025년 09월 27일
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
