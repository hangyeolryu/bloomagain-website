// 波長タイプ診断（日本語版）— データ単一ソース。
//
// 韓国版 /gyeol の「결 유형 테스트」を日本市場向けにローカライズしたもの。
// 「결(gyeol)」は日本語に直訳できないため、ブランド概念を「波長(はちょう)」に
// 置き換える（波長が合う＝気が合う・相性がいい。恋愛ではない温かい響き）。
//
// 検証テスト用MVPのため、韓国版の「温度(W/C)」細分軸は省き、
// 3軸×4問=12問 → 8タイプのシンプル構成にする。結果はインライン表示＋
// 先行案内(ウェイトリスト)登録で「需要」を測る（日本ではアプリ未ローンチ）。

export type Pole = "F" | "S" | "D" | "B" | "P" | "L";
// E軸(充電): F 一緒に vs S ひとりで | R軸(関係): D 深さ vs B 広さ | T軸(リズム): P 計画 vs L 即興

export type GyeolCode =
  | "FDP" | "FDL" | "FBP" | "FBL"
  | "SDP" | "SDL" | "SBP" | "SBL";

export interface Question {
  q: string;
  a: { text: string; pole: Pole };
  b: { text: string; pole: Pole };
}

// 12問 — 軸の順を混ぜて回答バイアスを減らす。
export const QUESTIONS: Question[] = [
  {
    q: "週末の午後、いちばん心が落ち着くのは？",
    a: { text: "気の合う人たちと、にぎやかに", pole: "F" },
    b: { text: "ひとりで静かに、自分の時間", pole: "S" },
  },
  {
    q: "友だちは、どちらが好き？",
    a: { text: "心を打ち明けられる、近しい数人", pole: "D" },
    b: { text: "広く浅く、いろんな人と", pole: "B" },
  },
  {
    q: "会う約束は？",
    a: { text: "前もって決めておくと安心", pole: "P" },
    b: { text: "その日の気分で決めたい", pole: "L" },
  },
  {
    q: "元気が出ないとき、回復するには？",
    a: { text: "誰かと会って、おしゃべりして", pole: "F" },
    b: { text: "ひとりの時間で、そっと", pole: "S" },
  },
  {
    q: "会話がいちばん楽しい瞬間は？",
    a: { text: "心の奥の話ができたとき", pole: "D" },
    b: { text: "笑いの絶えない、軽やかな時間", pole: "B" },
  },
  {
    q: "一日の過ごし方は？",
    a: { text: "計画どおり、こつこつと", pole: "P" },
    b: { text: "流れにまかせて、しなやかに", pole: "L" },
  },
  {
    q: "初めての集まりに着いたら？",
    a: { text: "自分から話しかけて、なじむ", pole: "F" },
    b: { text: "雰囲気に慣れてから、ゆっくり", pole: "S" },
  },
  {
    q: "心地よい集まりの人数は？",
    a: { text: "3〜4人で、こぢんまり", pole: "D" },
    b: { text: "大勢で、にぎやかに", pole: "B" },
  },
  {
    q: "「今からちょっと出てこない？」と誘われたら？",
    a: { text: "今度ちゃんと予定を決めよう", pole: "P" },
    b: { text: "いいね、すぐ行く！", pole: "L" },
  },
  {
    q: "旅先での夜は？",
    a: { text: "新しく出会った人たちと一緒に", pole: "F" },
    b: { text: "好きな人と静かに", pole: "S" },
  },
  {
    q: "新しい人と親しくなる速さは？",
    a: { text: "ゆっくり、しみ込むように", pole: "D" },
    b: { text: "すぐに打ち解ける", pole: "B" },
  },
  {
    q: "新しいことを始めるときは？",
    a: { text: "準備を整えてから", pole: "P" },
    b: { text: "とりあえず、やってみる", pole: "L" },
  },
];

export interface GyeolType {
  code: GyeolCode;
  emoji: string;
  name: string;
  tagline: string;
  desc: string;
  strengths: string[];
  match: GyeolCode;
  matchReason: string;
  longing: string;
}

export const TYPES: Record<GyeolCode, GyeolType> = {
  FDP: {
    code: "FDP",
    emoji: "🌿",
    name: "やさしい庭師",
    tagline: "気の合う数人と、長く",
    desc: "一緒にいると力が湧き、関係は広げるより深く育てるタイプ。約束を大切にし、そばを守るので、一度結んだ縁が長く続きます。",
    strengths: ["約束を守る安心感", "深く率直な会話", "そばを守る頼もしさ"],
    match: "SDP",
    matchReason: "深さと約束を知る人どうしは、急がなくても心が通います。",
    longing: "そばを守るあなた。でも、あなたのそばを長く守ってくれる一人は、案外めずらしいものです。",
  },
  FDL: {
    code: "FDL",
    emoji: "🍵",
    name: "あたたかい即興派",
    tagline: "通じたら、今日すぐ向かい合う",
    desc: "人との時間が楽しく、心が動けばその場で深い話へ。かたちより本音、計画より「今この瞬間」を大切にします。",
    strengths: ["すぐ心を開くやさしさ", "深い即興の会話", "一緒にいる活力"],
    match: "FBL",
    matchReason: "今を楽しめる人とは、会うたびに新しい時間が待っています。",
    longing: "心が動けばすぐ深くなるあなた。その速さに合わせてくれる人は、そう多くありません。",
  },
  FBP: {
    code: "FBP",
    emoji: "☀️",
    name: "街のムードメーカー",
    tagline: "人と人をつなぐ",
    desc: "大勢の集まりが楽しく、その場を前もって整えるタイプ。あなたがいると、集まりがぐっとあたたかく、自然になります。",
    strengths: ["場を整える気配り", "人をつなぐ親しみ", "明るい空気"],
    match: "FDP",
    matchReason: "広くつなぐあなたと、深く育てる人が出会うと、ちょうどいい均衡になります。",
    longing: "みんなを気にかけるあなた。そのあなたを気にかけてくれる人は、そばにいますか。",
  },
  FBL: {
    code: "FBL",
    emoji: "🎈",
    name: "顔の広いムードメーカー",
    tagline: "どこでも、すぐなじむ",
    desc: "新しい人、新しい場が楽しい明るいタイプ。軽やかに始めて広くなじみ、一緒にいる人まで機嫌よくします。",
    strengths: ["どこでもなじむ人あたり", "楽しいエネルギー", "新しさを楽しむ心"],
    match: "FDL",
    matchReason: "今を楽しむ人どうしは、計画がなくても、いい一日になります。",
    longing: "どこでもよくなじむあなた。でも「本当に自分の人」は、また別の話ですよね。",
  },
  SDP: {
    code: "SDP",
    emoji: "🌙",
    name: "静かな本気",
    tagline: "ひとりも心地よい。でも、そばには本気",
    desc: "ひとりの時間が心地よい一方、本当の一人二人にはこの上なく深いタイプ。前もって決めた静かな時間に、あなたのやさしさが最もよく表れます。",
    strengths: ["深く変わらない本気", "落ち着いた安定感", "頼れるそば"],
    match: "FDP",
    matchReason: "約束を大切にし、深さを知る人とは、長く心地よくいられます。",
    longing: "誰とでものおしゃべりより、言葉が深く通じる一人が大切なあなた。そういう人は、簡単には現れないから、なおさら。",
  },
  SDL: {
    code: "SDL",
    emoji: "🌾",
    name: "のんびり思索家",
    tagline: "静かだけど、芯は強い",
    desc: "ひとりの時間を大切にし、心が動いたとき深く語り合うタイプ。急がず自分のリズムを守り、深い会話一度が、たくさんの出会いより大切です。",
    strengths: ["深い思索", "自分のリズム", "率直な一度の会話"],
    match: "SBL",
    matchReason: "気負わずそばにいてくれる人とは、あなたのリズムが守られます。",
    longing: "自分のリズムを保ちながら、そばにいてくれる人に出会うのは、なかなか難しいものです。",
  },
  SBP: {
    code: "SBP",
    emoji: "🍃",
    name: "距離を知るやさしさ",
    tagline: "広くやさしく、でも距離も知る",
    desc: "いろんな人に広くやさしくしながら、ほどよい距離も保てるタイプ。予測できる心地よさが魅力で、そばにいると心がほどけます。",
    strengths: ["心地よい距離感", "広いやさしさ", "予測できるやさしさ"],
    match: "SBL",
    matchReason: "軽やかで気楽な人とは、たがいに気負わず、長く続きます。",
    longing: "ほどよい距離を知るあなた。その距離を気楽に合わせてくれる人は、案外めずらしいものです。",
  },
  SBL: {
    code: "SBL",
    emoji: "☕",
    name: "気楽な散歩仲間",
    tagline: "気負わず、そのとき、軽やかに",
    desc: "重くなく、そのとき軽やかになじむ心地よいタイプ。そばにいると心がほどけ、無理をしなくても自然に続く関係が好きです。",
    strengths: ["心地よい存在感", "気負わないやさしさ", "自然ななじみ"],
    match: "SDL",
    matchReason: "自分のリズムを知る人とは、黙って歩いても心地よいものです。",
    longing: "気負わず心地よい関係が好きなあなた。でも、その「気楽さ」がいちばん、作りにくいのですよね。",
  },
};

// 回答配列(各問の 'a'|'b')から3文字コードを算出。
// 引き分けは過小代表になりがちな側(F 一緒に・B 広さ・L 即興)へ倒して分布の偏りを緩和。
export function scoreToCode(answers: ("a" | "b")[]): GyeolCode {
  const tally: Record<Pole, number> = { F: 0, S: 0, D: 0, B: 0, P: 0, L: 0 };
  QUESTIONS.forEach((question, i) => {
    const pick = answers[i] === "b" ? question.b : question.a;
    tally[pick.pole] += 1;
  });
  const e = tally.S > tally.F ? "S" : "F";
  const r = tally.D > tally.B ? "D" : "B";
  const t = tally.P > tally.L ? "P" : "L";
  return `${e}${r}${t}` as GyeolCode;
}
