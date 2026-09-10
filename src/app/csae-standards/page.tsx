export const metadata = {
  // 정규 URL. trailingSlash: true 라 반드시 끝 슬래시까지 적는다 —
  // 빠뜨리면 301되는 주소를 정규 주소로 선언하는 꼴이 된다.
  alternates: { canonical: "/csae-standards/" },
  title:
    "티타 - 마음 맞는 또래 친구 (Tita) — 아동 안전 표준 / Child Safety Standards (CSAE)",
  description:
    "티타 - 마음 맞는 또래 친구(Tita, com.bloomagain.bloomagain) 앱의 아동 성적 학대 및 착취(CSAE) 금지 표준과 아동 안전 담당자 연락처입니다.",
};

const H2: React.CSSProperties = { lineHeight: 1.25, fontSize: 20, marginTop: 28 };
const UL: React.CSSProperties = { margin: "8px 0 16px 22px" };
const MUTED: React.CSSProperties = { color: "#666", fontSize: 14 };

export default function Page() {
  return (
    <main style={{ backgroundColor: "#fff" }}>
      <div
        style={{
          maxWidth: 880,
          margin: "40px auto",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: 16,
          lineHeight: 1.6,
          color: "#111",
          padding: "0 16px",
        }}
      >
        <h1 style={{ lineHeight: 1.3, fontSize: 28, marginBottom: 12 }}>
          티타 - 마음 맞는 또래 친구 (Tita) — 아동 안전 표준
          <br />
          Child Safety Standards against Child Sexual Abuse and Exploitation (CSAE)
        </h1>

        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: "14px 16px",
            margin: "20px 0 8px",
            background: "#fafafa",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <strong>앱 / App</strong>: 티타 - 마음 맞는 또래 친구 (Tita) —{" "}
              <code>com.bloomagain.bloomagain</code>
            </li>
            <li>
              <strong>개발자 / Developer</strong>: ㈜이프이프 (EFFEFF Inc.)
            </li>
            <li>
              <strong>아동 안전 담당자 / Child safety point of contact</strong>:{" "}
              <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a>
            </li>
          </ul>
        </div>
        <p style={MUTED}>최종 수정일 / Last updated: 2026-09-10</p>

        {/* ─────────────────────────── 한국어 ─────────────────────────── */}

        <h2 style={{ ...H2, fontSize: 24, marginTop: 40 }}>한국어</h2>

        <h2 style={H2}>1. 무관용 원칙</h2>
        <p>
          티타 - 마음 맞는 또래 친구(Tita, 이하 &ldquo;티타&rdquo;)는 아동 성적 학대 및 착취(CSAE)에
          해당하는 모든 콘텐츠와 행위를 <strong>명시적으로 금지</strong>합니다. 아동성착취물(CSAM)의
          제작·소지·유포·요청, 아동 대상 그루밍, 미성년자의 성적 대상화, 그 밖에 이를 조장하거나
          알선하려는 모든 시도가 여기에 포함됩니다. 위반이 확인되면 콘텐츠를 즉시 삭제하고 계정을
          영구 정지하며, 법령에 따라 수사기관에 신고하고 협조합니다.
        </p>

        <h2 style={H2}>2. 티타는 만 45세 이상 성인 전용 서비스입니다</h2>
        <ul style={UL}>
          <li>
            티타는 <strong>만 45세 이상</strong>만 가입할 수 있는 또래 친구 서비스입니다. 연애 상대를
            찾는 앱이 아닙니다.
          </li>
          <li>
            모든 회원은 가입 시 <strong>휴대폰 본인확인(NICE 본인인증)</strong>을 거칩니다. 생년월일이
            실명 인증 정보로 확인되므로 미성년자는 가입 자체가 불가능합니다.
          </li>
          <li>
            나이를 속이거나 타인 명의로 인증한 정황이 확인되면 계정을 즉시 정지합니다.
          </li>
        </ul>

        <h2 style={H2}>3. 용어</h2>
        <ul style={UL}>
          <li>
            <strong>아동</strong>: 만 18세 미만인 사람.
          </li>
          <li>
            <strong>CSAM(아동성착취물)</strong>: 형태를 불문한 아동 성착취 자료(사진, 영상, 음성,
            문자, AI로 생성·편집된 것 포함).
          </li>
          <li>
            <strong>그루밍</strong>: 성적 착취를 목적으로 아동의 신뢰를 얻으려는 모든 행위.
          </li>
        </ul>

        <h2 style={H2}>4. 금지되는 콘텐츠와 행위</h2>
        <ul style={UL}>
          <li>CSAM 및 미성년자를 성적으로 묘사한 콘텐츠(AI 생성·편집물 포함).</li>
          <li>아동 그루밍, 아동에 대한 성적 유인·요구, 성적 자료의 요청.</li>
          <li>CSAM에 접근·거래·제작하는 방법의 안내 또는 그 링크 공유.</li>
          <li>아동과 접촉하기 위해 나이나 신분을 속이는 행위.</li>
          <li>아동 대상 성범죄를 조장하거나 미화하는 표현.</li>
        </ul>

        <h2 style={H2}>5. 탐지와 검토</h2>
        <ul style={UL}>
          <li>가입 단계의 본인확인으로 미성년자 유입을 차단합니다.</li>
          <li>
            대화·프로필·게시글에 자동 필터를 적용해 성적 유인, 외부 앱 유도, 사기 정황을 탐지합니다.
          </li>
          <li>CSAE로 신고되거나 자동 탐지된 건은 <strong>최우선으로 즉시 검토</strong>합니다.</li>
          <li>알려진 아동 성착취물 탐지에는 업계 표준 도구와 해시 대조 방식을 활용합니다.</li>
        </ul>

        <h2 style={H2}>6. 앱 안에서 신고하는 방법</h2>
        <ul style={UL}>
          <li>
            <strong>신고 버튼</strong>: 모든 프로필·대화방·게시글의 오른쪽 위 메뉴에서 &ldquo;신고&rdquo;를
            눌러 사유를 선택하고 내용을 적어 보낼 수 있습니다.
          </li>
          <li>
            <strong>차단</strong>: 신고와 별개로 상대를 즉시 차단할 수 있으며, 차단하면 양쪽 모두에게
            노출되지 않습니다.
          </li>
          <li>
            <strong>티타 문의</strong>: 설정 &gt; 문의에서 운영팀에 바로 알릴 수 있습니다.
          </li>
          <li>
            <strong>이메일</strong>: <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a>
          </li>
        </ul>

        <h2 style={H2}>7. 수사기관·유관기관 신고</h2>
        <ul style={UL}>
          <li>
            아동성착취물이 확인되면 자료를 보존하고 <strong>경찰청 사이버범죄 신고시스템(ECRM,
            ecrm.police.go.kr) 또는 112</strong>에 신고합니다.
          </li>
          <li>필요한 경우 방송통신심의위원회에 유통 차단을 요청합니다.</li>
          <li>
            국외 관련 건은 <strong>NCMEC(미국 실종·착취아동방지센터)</strong> 등 해당 기관에 신고합니다.
          </li>
          <li>수사기관의 적법한 요청에는 관련 법령에 따라 협조합니다.</li>
        </ul>

        <h2 style={H2}>8. 조치</h2>
        <ul style={UL}>
          <li>위반 콘텐츠 즉시 삭제.</li>
          <li>CSAE 위반 계정은 <strong>영구 정지</strong>하며 재가입을 제한합니다.</li>
          <li>법적 의무에 따라 증거를 보존하고 수사기관에 이관합니다.</li>
        </ul>

        <h2 style={H2}>9. 준수하는 법령</h2>
        <p>
          티타는 <strong>아동·청소년의 성보호에 관한 법률</strong>, <strong>정보통신망 이용촉진 및
          정보보호 등에 관한 법률</strong>, <strong>아동복지법</strong>을 비롯한 대한민국의 아동 안전
          관련 법령과 <strong>Google Play 아동 안전 표준 정책</strong>을 준수합니다.
        </p>

        <h2 style={H2}>10. 아동 안전 담당자</h2>
        <p>
          아동 안전 담당자: ㈜이프이프 대표 —{" "}
          <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a>
          <br />본 표준에 관한 문의와 CSAE 관련 제보를 이 주소로 받습니다.
        </p>

        <h2 style={H2}>11. 표준의 갱신</h2>
        <p>
          모범 사례와 법령의 변화에 맞추어 본 표준을 주기적으로 검토·갱신하며, 중요한 변경은 이
          페이지에 수정일과 함께 반영합니다.
        </p>

        {/* ─────────────────────────── English ─────────────────────────── */}

        <h2 style={{ ...H2, fontSize: 24, marginTop: 48 }}>English</h2>

        <h2 style={H2}>1. Zero-Tolerance Policy</h2>
        <p>
          티타 - 마음 맞는 또래 친구 (Tita), published by ㈜이프이프 (EFFEFF Inc.),{" "}
          <strong>explicitly prohibits</strong> all content and conduct involving child sexual abuse
          and exploitation (CSAE). This includes the creation, possession, distribution or
          solicitation of child sexual abuse material (CSAM), grooming, the sexualization of minors,
          and any attempt to facilitate such harm. Violating content is removed immediately, the
          account is permanently banned, and we report to and cooperate with law enforcement as
          required by law.
        </p>

        <h2 style={H2}>2. Tita is an adults-only service (age 45 and above)</h2>
        <ul style={UL}>
          <li>
            Tita is a friendship service for people <strong>aged 45 and older</strong>. It is not a
            dating app.
          </li>
          <li>
            Every member completes <strong>mobile identity verification (NICE)</strong> at sign-up.
            Date of birth is confirmed against verified identity records, so minors cannot create an
            account.
          </li>
          <li>
            Accounts showing signs of age misrepresentation or verification under another person&rsquo;s
            identity are suspended immediately.
          </li>
        </ul>

        <h2 style={H2}>3. Definitions</h2>
        <ul style={UL}>
          <li>
            <strong>Child</strong>: any person under the age of 18.
          </li>
          <li>
            <strong>CSAM</strong>: child sexual abuse material in any form (images, video, audio,
            text, AI-generated or edited).
          </li>
          <li>
            <strong>Grooming</strong>: any behavior that builds trust with a minor to enable sexual
            exploitation.
          </li>
        </ul>

        <h2 style={H2}>4. Prohibited content and conduct</h2>
        <ul style={UL}>
          <li>CSAM or sexualized depictions of minors, including AI-generated or edited content.</li>
          <li>Grooming, sexual solicitation of minors, or requesting sexual material from minors.</li>
          <li>Links to, or instructions for, accessing, trading or producing CSAM.</li>
          <li>Misrepresenting age or identity in order to interact with minors.</li>
          <li>Content that promotes or glorifies sexual offences against children.</li>
        </ul>

        <h2 style={H2}>5. Detection and moderation</h2>
        <ul style={UL}>
          <li>Identity verification at sign-up keeps minors off the service.</li>
          <li>
            Automated filters run on messages, profiles and posts to detect sexual solicitation,
            off-platform luring and fraud.
          </li>
          <li>Reports and signals related to CSAE receive <strong>immediate, priority review</strong>.</li>
          <li>We use industry-standard tooling and hash matching to detect known abusive material.</li>
        </ul>

        <h2 style={H2}>6. In-app reporting mechanism</h2>
        <ul style={UL}>
          <li>
            <strong>Report</strong>: every profile, conversation and post has a &ldquo;신고 (Report)&rdquo;
            action in its top-right menu, where a user selects a reason and adds details.
          </li>
          <li>
            <strong>Block</strong>: users can block another member at any time; blocking hides both
            parties from each other.
          </li>
          <li>
            <strong>Inquiry (티타 문의)</strong>: Settings &gt; Inquiry reaches the operations team
            directly.
          </li>
          <li>
            <strong>Email</strong>: <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a>
          </li>
        </ul>

        <h2 style={H2}>7. Reporting to authorities</h2>
        <ul style={UL}>
          <li>
            Confirmed CSAM is preserved and reported to the{" "}
            <strong>Korean National Police Agency cybercrime reporting system (ECRM,
            ecrm.police.go.kr)</strong> or 112.
          </li>
          <li>
            Where appropriate we request blocking through the Korea Communications Standards
            Commission (방송통신심의위원회).
          </li>
          <li>
            Matters with an international nexus are reported to <strong>NCMEC</strong> or the
            equivalent authority.
          </li>
          <li>We comply with lawful requests from law enforcement.</li>
        </ul>

        <h2 style={H2}>8. Enforcement</h2>
        <ul style={UL}>
          <li>Immediate removal of violating content.</li>
          <li>
            <strong>Permanent ban</strong> for CSAE violations, with re-registration blocked.
          </li>
          <li>Preservation of evidence and referral to law enforcement as required by law.</li>
        </ul>

        <h2 style={H2}>9. Legal compliance</h2>
        <p>
          Tita complies with applicable child safety laws of the Republic of Korea, including the{" "}
          <strong>Act on the Protection of Children and Youth against Sex Offences</strong>, the{" "}
          <strong>Act on Promotion of Information and Communications Network Utilization and
          Information Protection</strong> and the <strong>Child Welfare Act</strong>, as well as the{" "}
          <strong>Google Play Child Safety Standards Policy</strong>.
        </p>

        <h2 style={H2}>10. Child safety point of contact</h2>
        <p>
          Child safety point of contact: the CEO of ㈜이프이프 (EFFEFF Inc.) —{" "}
          <a href="mailto:ceo@effeffcorp.com">ceo@effeffcorp.com</a>
          <br />
          Questions about these standards and CSAE reports are received at this address.
        </p>

        <h2 style={H2}>11. Updates</h2>
        <p>
          We review and update these standards as best practices and legal requirements evolve.
          Material changes are reflected on this page together with an updated date.
        </p>

        <p style={{ ...MUTED, marginTop: 32 }}>
          티타 - 마음 맞는 또래 친구 (Tita) · ㈜이프이프 (EFFEFF Inc.) ·{" "}
          <code>com.bloomagain.bloomagain</code>
        </p>
      </div>
    </main>
  );
}
