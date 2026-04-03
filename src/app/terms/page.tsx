import Link from "next/link";

export default function TermsPage() {
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
                <Link href="/terms" className="text-gray-900 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">이용약관</h1>
          <p className="text-lg text-gray-600 mb-8">다시 봄(Bloom Again Korea)</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 &apos;다시 봄&apos;(이하 &apos;회사&apos;)이 제공하는 서비스(이하 &apos;서비스&apos;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제2조 (정의)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>&quot;서비스&quot;란 회사가 제공하는 50세 이상 사용자를 위한 소셜 네트워킹 및 커뮤니티 플랫폼을 의미합니다.</li>
                <li>&quot;이용자&quot;란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 회원을 의미합니다.</li>
                <li>&quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                <li>&quot;서클&quot;이란 이용자들이 공통의 관심사를 바탕으로 형성하는 모임 공간을 의미합니다.</li>
                <li>&quot;콘텐츠&quot;란 이용자가 서비스를 이용하면서 게시한 글, 사진, 동영상, 댓글, 메시지 등 모든 정보를 의미합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제3조 (약관의 게시와 개정)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
                <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.</li>
                <li>이용자는 개정된 약관에 대해 동의하지 않을 권리가 있으며, 개정된 약관에 동의하지 않을 경우에는 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제4조 (회원가입)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회원가입은 신청자가 온라인으로 회사가 제공하는 소정의 가입신청 양식에서 요구하는 사항을 기록하여 가입을 완료하는 것으로 성립됩니다.</li>
                <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>가입신청자가 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                    <li>50세 미만인 경우</li>
                    <li>본 약관 및 개인정보처리방침에 동의하지 않은 경우</li>
                  </ul>
                </li>
                <li>회원가입 계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제5조 (서비스의 제공 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>서클 생성 및 참여 서비스</li>
                    <li>사용자 간 매칭 및 친구 찾기 서비스</li>
                    <li>1:1 및 그룹 채팅 서비스</li>
                    <li>게시물 작성 및 공유 서비스</li>
                    <li>이벤트 및 모임 일정 관리 서비스</li>
                    <li>AI 기반 인연 추천 서비스</li>
                    <li>접근성 최적화 서비스 (시력 수준 기반 동적 레이아웃)</li>
                    <li>스캠 방지 및 안전 모니터링 서비스</li>
                  </ul>
                </li>
                <li>회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제6조 (서비스의 중단)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
                <li>회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제7조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>이용자는 다음 행위를 하여서는 안 됩니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
                    <li>스캠, 사기, 금전 요청 등 불법적인 행위</li>
                    <li>로맨스 스캠, 피싱 등 타인을 속이거나 해를 끼치는 행위</li>
                    <li>기타 불법적이거나 부당한 행위</li>
                  </ul>
                </li>
                <li>이용자는 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제8조 (개인정보의 보호)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 이용자의 개인정보 보호를 위하여 노력합니다. 이용자의 개인정보 보호에 관해서는 관련법령 및 회사가 정하는 &quot;개인정보처리방침&quot;에 정한 바에 따릅니다.</li>
                <li>회사는 이용자의 개인정보를 제3자에게 제공하거나 공유하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                    <li>서비스 제공에 필요한 최소한의 정보를 기술 파트너(Google Cloud/Firebase, Vertex AI)에게 제공하는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제9조 (콘텐츠의 저작권)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>이용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 콘텐츠의 저작자에게 귀속됩니다.</li>
                <li>이용자는 서비스를 이용하여 취득한 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
                <li>회사는 이용자가 게시한 콘텐츠를 서비스 운영, 홍보 등의 목적으로 사용할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제10조 (서비스 이용의 제한)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</li>
                <li>회사는 전항에도 불구하고, 다음의 경우에는 즉시 영구이용정지를 할 수 있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>스캠, 사기, 금전 요청 등 불법적인 행위를 한 경우</li>
                    <li>로맨스 스캠, 피싱 등 타인을 속이거나 해를 끼치는 행위를 한 경우</li>
                    <li>타인의 개인정보를 무단으로 수집, 이용하거나 유출한 경우</li>
                    <li>기타 관련 법령을 위반하거나 중대한 사유로 인하여 회사가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
                  </ul>
                </li>
                <li>회사는 본 조에 따라 서비스 이용을 제한하거나 정지한 때에는 그 사유 및 제한기간 등을 이용자에게 사전 통지하거나 사후에 통지합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제11조 (손해배상)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가 회사의 중대한 과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지 아니합니다.</li>
                <li>이용자가 본 약관의 규정을 위반하여 회사에 손해를 입힌 경우, 이용자는 회사에 대하여 그 손해를 배상하여야 합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제12조 (면책조항)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
                <li>회사는 회원이 게시한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
                <li>회사는 AI 기반 서비스(인연 추천, 스캠 방지 등)의 오류, 부정확성, 오탐, 미탐으로 인한 손해에 대해 책임을 지지 않습니다.</li>
                <li>회사는 스캠 방지 시스템이 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않으며, 이용자가 사기로 인해 입은 손해에 대해 책임을 지지 않습니다.</li>
                <li>회사는 이용자 간의 대화 내용, 거래, 금전적 거래에 대해 책임을 지지 않습니다.</li>
                <li>회사는 AI 인연 추천의 정확성이나 성공률을 보장하지 않으며, 추천 결과로 인한 손해에 대해 책임을 지지 않습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제13조 (분쟁의 해결)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.</li>
                <li>회사와 이용자 간에 발생한 분쟁은 전자거래기본법 제28조 및 동 시행령 제15조에 의하여 설치된 전자거래분쟁조정위원회의 조정에 따를 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제14조 (기타)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>본 약관에서 정하지 아니한 사항에 대해서는 관련법령 또는 상관례에 따릅니다.</li>
                <li>회사는 필요한 경우 특정 서비스에 관하여 적용될 사항(이하 &quot;개별약관&quot;이라고 합니다)을 정하여 이를 미리 공지할 수 있습니다.</li>
                <li>이용자가 개별약관에 동의한 경우, 본 약관에 우선하여 개별약관의 내용이 적용됩니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제15조 (연령 제한)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 서비스는 50세 이상의 사용자만을 대상으로 합니다. 50세 미만의 사용자는 서비스를 이용할 수 없으며, 회원가입이 거부될 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제16조 (AI 기반 서비스)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 Google Cloud Vertex AI를 활용하여 사용자 매칭 및 스캠 방지 서비스를 제공하기 위해 노력합니다.</li>
                <li>이용자는 AI 기반 서비스의 특성상 완벽하지 않을 수 있으며, 100% 정확한 감지나 매칭을 보장하지 않음을 이해하고 동의합니다.</li>
                <li>회사는 AI 서비스의 오류, 부정확성, 오탐(false positive), 미탐(false negative)에 대해 책임을 지지 않습니다.</li>
                <li>AI 기반 인연 추천은 참고용이며, 최종 판단은 이용자 본인이 하여야 합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제17조 (스캠 방지 시스템)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 실시간 스캠 방지 시스템을 통해 사기 행위를 감지하고 차단하기 위해 노력합니다.</li>
                <li>이용자는 스캠 방지를 위한 메시지 모니터링 및 분석에 동의합니다.</li>
                <li>의심스러운 메시지로 판단된 경우 경고가 표시되거나 차단될 수 있으며, 관리자에게 알림이 전송될 수 있습니다.</li>
                <li>회사는 스캠 방지 시스템이 모든 사기를 감지하거나 차단할 수 있음을 보장하지 않습니다. 이용자는 개인정보와 금전 관련 요청에 대해 항상 주의를 기울여야 합니다.</li>
                <li>스캠 방지 시스템의 오탐(false positive)으로 인한 불편이나 손해에 대해 회사는 책임을 지지 않습니다.</li>
                <li>고위험 사용자로 판단된 경우, 관리자 검토 후 계정 제한 또는 정지가 이루어질 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#534741] mb-4">제18조 (접근성 서비스)</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>회사는 시력 수준에 따른 동적 레이아웃 조정 서비스를 제공합니다.</li>
                <li>접근성 설정은 로컬 기기에 저장되며, 서버와 동기화되지 않습니다.</li>
                <li>이용자는 접근성 설정을 언제든지 변경할 수 있습니다.</li>
              </ol>
            </section>

            <div className="border-t-2 border-[#8CB350] pt-8 mt-12">
              <div className="space-y-4 text-gray-700">
                <div>
                  <strong>공고일자</strong>: 2026년 1월 1일
                </div>
                <div>
                  <strong>시행일자</strong>: 2026년 1월 1일
                </div>
                <div>
                  <strong>최종 업데이트</strong>: 2026년 1월 1일
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">문의처</h3>
                  <div className="bg-[#BFE38A]/20 border-l-4 border-[#8CB350] p-6 rounded-lg">
                    <ul className="space-y-2">
                      <li><strong>이메일</strong>: <a href="mailto:ceo@effeffcorp.com" className="text-[#8CB350] hover:underline">ceo@effeffcorp.com</a></li>
                      <li><strong>운영시간</strong>: 평일 09:00 - 18:00</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}