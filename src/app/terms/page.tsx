import Link from "next/link";

export default function TermsPage() {
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
                <Link href="/privacy" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>다시, 봄 (Dasi, Bom)</strong> 서비스 이용약관에 오신 것을 환영합니다. 
              본 약관은 사용자가 당사 서비스를 이용함에 있어 필요한 권리, 의무 및 책임사항을 규정합니다.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-600">
                본 약관은 BloomAgain Korea(이하 회사)가 제공하는 다시, 봄 (Dasi, Bom) 서비스의 
                이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1. 서비스</strong>란 회사가 제공하는 다시, 봄 (Dasi, Bom) 모바일 애플리케이션 및 관련 서비스를 의미합니다.
                </p>
                <p className="text-gray-600">
                  <strong>2. 이용자</strong>란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 회원을 의미합니다.
                </p>
                <p className="text-gray-600">
                  <strong>3. 회원</strong>이란 서비스에 개인정보를 제공하여 회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
                </p>
                <p className="text-gray-600">
                  <strong>4. 콘텐츠</strong>란 이용자가 서비스를 이용하면서 생성한 메시지, 사진, 음성, 텍스트 등의 모든 정보를 의미합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (연령 제한)</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>중요:</strong> 본 서비스는 50세 이상의 사용자만을 대상으로 합니다. 
                  50세 미만의 사용자는 서비스를 이용할 수 없으며, 회원가입이 제한됩니다.
                </p>
              </div>
              <p className="text-gray-600">
                회사는 연령 확인을 위해 출생년도 정보를 요구하며, 
                허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
              <p className="text-gray-600 mb-4">회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>사용자 간 소통 및 연결 서비스</li>
                <li>소규모 그룹(서클) 관리 서비스</li>
                <li>이벤트 및 모임 관리 서비스</li>
                <li>메시징 및 음성 통신 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (회원가입)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                </p>
                <p className="text-gray-600">
                  2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-6 space-y-1">
                  <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>50세 미만인 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (이용자의 의무)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>신청 또는 변경시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  <li>다른 이용자의 개인정보를 수집하거나 저장하는 행위</li>
                  <li>상업적 목적의 광고, 판촉, 스팸 메시지 전송</li>
                  <li>기타 불법적이거나 부당한 행위</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (서비스 이용의 제한)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 
                  경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                </p>
                <p className="text-gray-600">
                  이용자는 위 조치에 대하여 회사가 정한 절차에 따라 이의신청을 할 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제8조 (개인정보보호)</h2>
              <p className="text-gray-600">
                회사는 관련법령이 정하는 바에 따라서 이용자 등록정보를 포함한 이용자의 개인정보를 보호하기 위해 노력합니다. 
                이용자의 개인정보보호에 관해서는 관련법령 및 회사가 정하는 개인정보처리방침에 정한 바에 의합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제9조 (회사의 의무)</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.</li>
                <li>회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 구축하여야 합니다.</li>
                <li>회사는 이용자의 개인정보를 본인의 승낙없이 타인에게 누설, 배포하지 않습니다. 다만, 전기통신관련법령 등 관계법령에 의하여 관계 국가기관 등의 요구가 있는 경우에는 그러하지 아니합니다.</li>
                <li>회사는 이용자로부터 제기되는 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 적절한 절차를 거쳐 즉시 처리하여야 합니다. 다만, 즉시 처리가 곤란한 경우는 이용자에게 그 사유와 처리일정을 통보하여야 합니다.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제10조 (서비스의 중단)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  1. 회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p className="text-gray-600">
                  2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제11조 (손해배상)</h2>
              <p className="text-gray-600">
                회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가 회사의 고의 또는 중대한 과실에 의한 경우를 제외하고는 이에 대하여 책임을 부담하지 아니합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제12조 (면책조항)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
                </p>
                <p className="text-gray-600">
                  2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
                </p>
                <p className="text-gray-600">
                  3. 회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여는 책임을 지지 않습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제13조 (관할법원)</h2>
              <p className="text-gray-600">
                서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">제14조 (약관의 개정)</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  1. 회사는 약관의 규제에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련법을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.
                </p>
                <p className="text-gray-600">
                  2. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                </p>
                <p className="text-gray-600">
                  3. 이용자는 개정된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원탈퇴를 할 수 있습니다.
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