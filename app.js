const prefectures = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

const jobProfiles = {
  "webマーケティング": { priorities: { 顧客理解: 82, 実行力: 80, データ活用: 88, 協働性: 70, 改善思考: 84 }, summary: "Web集客の成果創出に直結する職種です。", talents: ["CVに繋がる導線設計ができる人", "数字で打ち手を改善できる人"], questions: ["直近で最も伸びた流入チャネルは何ですか？"] },
  "デジタルマーケティング": { priorities: { 顧客理解: 80, 実行力: 76, データ活用: 90, 協働性: 74, 改善思考: 82 }, summary: "複数チャネル統合で成果最大化を担う職種です。", talents: ["チャネル横断で最適化できる人", "分析から仮説検証を高速で回せる人"], questions: ["評価KPIはファネルのどこを重視しますか？"] },
  "webマーケティングコンサルティング": { priorities: { 顧客理解: 90, 実行力: 74, データ活用: 86, 協働性: 84, 改善思考: 84 }, summary: "顧客課題を整理し施策提案する職種です。", talents: ["課題を構造化し提案できる人", "顧客との合意形成が得意な人"], questions: ["提案の採用率が高い人の共通点は何ですか？"] },
  "デジタルマーケティングコンサルティング": { priorities: { 顧客理解: 88, 実行力: 72, データ活用: 92, 協働性: 82, 改善思考: 84 }, summary: "データ基盤と施策運用を統合提案する職種です。", talents: ["データ分析と提案を両立できる人", "経営視点で施策優先度を示せる人"], questions: ["コンサル案件の成果定義はどう設計しますか？"] },
  "webディレクター": { priorities: { 顧客理解: 76, 実行力: 88, データ活用: 72, 協働性: 90, 改善思考: 80 }, summary: "制作進行と品質管理のハブとなる職種です。", talents: ["要件定義と進行管理が強い人", "関係者調整を推進できる人"], questions: ["優先順位変更時の意思決定は誰が担いますか？"] },
  "広告運用スタッフ": { priorities: { 顧客理解: 74, 実行力: 86, データ活用: 90, 協働性: 72, 改善思考: 88 }, summary: "運用型広告でROAS改善を担う職種です。", talents: ["運用数値を深く読める人", "改善の打ち手を継続実行できる人"], questions: ["媒体ごとの改善サイクルはどの頻度ですか？"] }
};

const baseStrengths = { 成長性: 78, 安定性: 74, 働き方柔軟性: 72, 報酬競争力: 70, 技術投資: 80 };
const keywordRules = [
  { keyword: "SaaS", strength: "成長性", priority: "データ活用" }, { keyword: "マネジメント", strength: "安定性", priority: "協働性" },
  { keyword: "リモート", strength: "働き方柔軟性", priority: "実行力" }, { keyword: "年収", strength: "報酬競争力", priority: "実行力" },
  { keyword: "アーキテクチャ", strength: "技術投資", priority: "改善思考" }, { keyword: "顧客", strength: "成長性", priority: "顧客理解" },
  { keyword: "KPI", strength: "安定性", priority: "データ活用" }, { keyword: "改善", strength: "技術投資", priority: "改善思考" }
];

const companyInput = document.getElementById("companyInput");
const hiringType = document.getElementById("hiringType");
const locationSelect = document.getElementById("location");
const jobTypeSelect = document.getElementById("jobType");
const jobPostText = document.getElementById("jobPostText");
const searchForm = document.getElementById("searchForm");
const emptyState = document.getElementById("emptyState");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const keywordList = document.getElementById("keywordList");
const talentList = document.getElementById("talentList");
const questionList = document.getElementById("questionList");
const strengthDescription = document.getElementById("strengthDescription");
const fitDescription = document.getElementById("fitDescription");

initializePrefectures();

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const companyName = companyInput.value.trim();
  const jobType = jobTypeSelect.value;
  if (!companyName || !hiringType.value || !locationSelect.value || !jobType || !jobPostText.value.trim()) {
    alert("1〜5をすべて入力してください。");
    return;
  }
  renderAnalysis(companyName, hiringType.value, locationSelect.value, jobType, jobPostText.value.trim());
});

function initializePrefectures() {
  locationSelect.innerHTML = '<option value="">選択してください</option>';
  prefectures.forEach((pref) => {
    const option = document.createElement("option");
    option.value = pref;
    option.textContent = pref;
    locationSelect.appendChild(option);
  });
}

function renderAnalysis(companyName, hiring, location, jobType, post) {
  const roleData = jobProfiles[jobType];
  const extraction = extractKeywords(post);
  const adjustedStrengths = adjustScores(baseStrengths, extraction.strengthBoosts);
  const adjustedPriorities = adjustScores(roleData.priorities, extraction.priorityBoosts);

  resultTitle.textContent = `${companyName}｜${hiring}｜${location}｜${jobType} の自動面接分析`;
  resultSummary.textContent = `${roleData.summary} 求人票テキストの強調語を反映して分析を補正しました。`;
  strengthDescription.textContent = "求人票内で強調された要素をもとに、企業の強みスコアを補正表示しています。";
  fitDescription.textContent = "求人票で繰り返し出る語を重み付けし、面接で評価されやすい観点を再計算しています。";

  keywordList.innerHTML = extraction.keywords.length ? extraction.keywords.map((k) => `<li>${k.keyword}（出現: ${k.count}回）</li>`).join("") : "<li>定義済みキーワードは検出されませんでした。</li>";
  talentList.innerHTML = buildAutoTalents(roleData.talents, extraction).map((item) => `<li>${item}</li>`).join("");
  questionList.innerHTML = buildAutoQuestions(roleData.questions, extraction).map((item) => `<li>${item}</li>`).join("");
  drawBarChart("strengthChart", adjustedStrengths, "#2563eb");
  drawBarChart("fitChart", adjustedPriorities, "#16a34a");
  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
}

function extractKeywords(text) { const strengthBoosts = {}; const priorityBoosts = {}; const keywords = []; keywordRules.forEach((rule) => { const count = countKeyword(text, rule.keyword); if (count > 0) { keywords.push({ keyword: rule.keyword, count }); strengthBoosts[rule.strength] = (strengthBoosts[rule.strength] || 0) + count * 2; priorityBoosts[rule.priority] = (priorityBoosts[rule.priority] || 0) + count * 3; } }); keywords.sort((a, b) => b.count - a.count); return { keywords, strengthBoosts, priorityBoosts }; }
function countKeyword(text, keyword) { const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const matches = text.match(new RegExp(escaped, "gi")); return matches ? matches.length : 0; }
function adjustScores(baseMap, boosts) { const adjusted = {}; Object.entries(baseMap).forEach(([name, score]) => { adjusted[name] = Math.min(100, score + (boosts[name] || 0)); }); return adjusted; }
function buildAutoTalents(baseTalents, extraction) { if (!extraction.keywords.length) return baseTalents; const top = extraction.keywords.slice(0, 2).map((k) => k.keyword).join("・"); return [`求人票で強調される「${top}」を実務で再現できる人`, "定量成果を具体的に説明し、採用要件との一致を示せる人", ...baseTalents]; }
function buildAutoQuestions(baseQuestions, extraction) { if (!extraction.keywords.length) return baseQuestions; return [`求人票内で頻出する要件（${extraction.keywords[0].keyword}）は、入社後どの場面で特に重視されますか？`, "配属後の3か月で成果を出している中途社員の共通行動を教えてください。", ...baseQuestions]; }

function drawBarChart(canvasId, dataMap, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const entries = Object.entries(dataMap);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f172a";
  ctx.font = "13px sans-serif";
  const left = 110, top = 24, barHeight = 22, gap = 20, maxWidth = 290;
  entries.forEach(([label, value], index) => {
    const y = top + index * (barHeight + gap);
    const width = (value / 100) * maxWidth;
    ctx.fillStyle = "#334155"; ctx.fillText(label, 12, y + 15);
    ctx.fillStyle = "#e2e8f0"; ctx.fillRect(left, y, maxWidth, barHeight);
    ctx.fillStyle = color; ctx.fillRect(left, y, width, barHeight);
    ctx.fillStyle = "#0f172a"; ctx.fillText(`${value}`, left + width + 8, y + 15);
  });
}
