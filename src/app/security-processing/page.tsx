import LegalLayout from "../_components/legal/LegalLayout";

const TOC = [
  { id: "section-1", label: "1. 목적" },
  { id: "section-2", label: "2. 처리하는 데이터" },
  { id: "section-3", label: "3. 이용 목적" },
  { id: "section-4", label: "4. 보관 및 삭제" },
  { id: "section-5", label: "5. 동의" },
];

export default function SecurityProcessingPage() {
  return (
    <LegalLayout
      activeKey="security"
      title="보안·행동 데이터 처리 안내"
      subtitle="다시 봄 (Bloom Again Korea)"
      versionTag="v1.0"
      effectiveDate="2026년 1월 1일"
      lastUpdated="2026년 5월 19일"
      toc={TOC}
    >
      <section id="section-1">
        <h2>1. 목적</h2>
        <p>
          회사는 서비스 이용의 안전을 위해 인지·행동 관련 지표와 이용 패턴을 분석합니다. 이
          페이지는 해당 처리에 대한 동의를 구하기 위한 안내이며,{" "}
          <a href="/terms">이용약관</a> 및 <a href="/privacy">개인정보처리방침</a>과 함께
          적용됩니다.
        </p>
      </section>

      <section id="section-2">
        <h2>2. 처리하는 데이터</h2>
        <ul>
          <li>
            <strong>인지·행동 지표</strong>: 입력 오류율, 수정 속도, 응답 지연, 불규칙성 지수 등 (스캠·사기 방지 및 접근성 최적화 목적)
          </li>
          <li>
            <strong>이용 경로 및 이벤트</strong>: 화면 경로, 주요 기능 이용 시점 (보안 기준선 및 이상 탐지)
          </li>
          <li>
            <strong>행동 변화 지표</strong>: 메시지·프로필·관계 진행 속도 등 (이상 행동 감지)
          </li>
        </ul>
      </section>

      <section id="section-3">
        <h2>3. 이용 목적</h2>
        <ul>
          <li>스캠·사기·로맨스 스캠 등 위험 행위 감지 및 차단</li>
          <li>서비스 이용의 안전성 확보 및 사기 피해 예방</li>
          <li>접근성(시력·인지 수준)에 맞는 UI 자동 조정</li>
          <li>부정 이용·다중 계정 등 이상 패턴 분석</li>
        </ul>
      </section>

      <section id="section-4">
        <h2>4. 보관 및 삭제</h2>
        <p>
          상호작용 로그 등 보안·행동 데이터는 내부 방침에 따라 일정 기간 보관된 후 삭제되며,
          계정 삭제 시 해당 이용자 데이터는 삭제 또는 익명화됩니다. 법적·보안상 보관이 필요한
          경우 해당 법령에 따릅니다.
        </p>
      </section>

      <section id="section-5">
        <h2>5. 동의</h2>
        <p>
          위 내용에 동의하시면 앱 내 가입·온보딩 단계에서{" "}
          <strong>&ldquo;보안 및 행동 데이터 처리에 동의&rdquo;</strong> 항목에 체크해
          주세요. 동의하지 않을 경우 스캠 방지·접근성 최적화 등 일부 기능이 제한될 수 있습니다.
        </p>
      </section>
    </LegalLayout>
  );
}
