import Link from "next/link";

export default function SecurityProcessingPage() {
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
                <Link href="/privacy" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  이용약관
                </Link>
                <Link href="/security-processing" className="text-gray-900 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">보안 및 행동 데이터 처리 안내</h1>
          <p className="text-lg text-gray-600 mb-8">다시 봄(Bloom Again Korea)</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">1. 목적</h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 서비스 이용의 안전을 위해 인지·행동 관련 지표와 이용 패턴을 분석합니다.
                이 페이지는 해당 처리에 대한 동의를 구하기 위한 안내이며, 이용약관 및 개인정보처리방침과 함께 적용됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">2. 처리하는 데이터</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>인지·행동 지표</strong>: 입력 오류율, 수정 속도, 응답 지연, 불규칙성 지수 등 (스캠·사기 방지 및 접근성 최적화 목적)</li>
                <li><strong>이용 경로 및 이벤트</strong>: 화면 경로, 주요 기능 이용 시점 (보안 기준선 및 이상 탐지)</li>
                <li><strong>행동 변화 지표</strong>: 메시지·프로필·관계 진행 속도 등 (이상 행동 감지)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">3. 이용 목적</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>스캠·사기·로맨스 스캠 등 위험 행위 감지 및 차단 시도</li>
                <li>서비스 이용의 안전성 확보 및 사기 피해 예방</li>
                <li>접근성(시력·인지 수준)에 맞는 UI 조정</li>
                <li>부정 이용·다중 계정 등 이상 패턴 분석</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">4. 보관 및 삭제</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                상호작용 로그 등 보안·행동 데이터는 내부 방침에 따라 일정 기간 보관된 후 삭제되며,
                계정 삭제 시 해당 이용자 데이터는 삭제 또는 익명화됩니다. (법적·보안상 보관이 필요한 경우 해당 법령에 따릅니다.)
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">5. 동의</h2>
              <p className="text-gray-700 leading-relaxed">
                위 내용에 동의하시면 앱 내 가입·온보딩 단계에서 &quot;보안 및 행동 데이터 처리에 동의&quot; 항목에 체크해 주세요.
                동의하지 않을 경우 스캠 방지·접근성 최적화 등 일부 기능이 제한될 수 있습니다.
              </p>
            </section>

            <div className="border-t-2 border-[#8CB350] pt-8 mt-12">
              <p className="text-gray-600 text-sm">
                문의: <a href="mailto:hangyeolryu@gmail.com" className="text-[#8CB350] hover:underline">hangyeolryu@gmail.com</a>
              </p>
              <p className="text-gray-500 text-sm mt-2">최종 업데이트: 2026년 1월 1일</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
