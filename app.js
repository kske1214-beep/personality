const companyData = {
  "株式会社A": {
    locations: ["東京", "大阪", "福岡"],
    jobs: ["営業", "企画", "エンジニア"],
    strengths: { 成長性: 82, 安定性: 70, 働き方柔軟性: 78, 報酬競争力: 74, 技術投資: 88 },
    roles: {
      営業: {
        priorities: { 顧客理解: 85, 実行力: 90, データ活用: 62, 協働性: 76, 改善思考: 68 },
        talents: ["仮説を持って顧客課題を深掘りできる人", "数字目標を分解し、行動に落とし込める人", "他部署を巻き込みながら提案を前進させられる人"],
        questions: ["トップセールスの行動特性はどのような点にありますか？", "新規開拓と既存深耕の比率は四半期ごとにどう変わりますか？", "営業におけるデータ活用で、今後強化したい指標は何ですか？"],
        summary: "営業組織は成果重視。再現性ある活動設計と顧客解像度の高さが評価されます。"
      },
      企画: {
        priorities: { 顧客理解: 78, 実行力: 72, データ活用: 86, 協働性: 84, 改善思考: 88 },
        talents: ["定量・定性データを統合して意思決定を支援できる人", "曖昧なテーマを構造化し、施策に落とし込める人", "経営・現場双方に伝わるストーリーを作れる人"],
        questions: ["企画の成果を測るKPIはどのレイヤーで管理していますか？", "施策の優先順位を決める際の判断軸を教えてください。", "関係部署との合意形成で重視される行動は何ですか？"],
        summary: "企画職はデータドリブンかつ横断連携が鍵。課題設定力が面接の評価ポイントです。"
      },
      エンジニア: {
        priorities: { 顧客理解: 70, 実行力: 80, データ活用: 82, 協働性: 74, 改善思考: 90 },
        talents: ["技術選定をビジネス成果と紐づけて説明できる人", "負債を可視化し、段階的な改善計画を提案できる人", "プロダクト視点で優先順位を議論できる人"],
        questions: ["現在の開発で技術的負債として認識されている領域はどこですか？", "中途入社者が最初の3か月で期待される成果は何ですか？", "技術投資の意思決定における、事業側との連携プロセスを教えてください。"],
        summary: "エンジニア採用では改善思考と実装力の両立が重要。技術の目的言語化が差分になります。"
      }
    }
  }
};

const keywordRules = [
  { keyword: "SaaS", strength: "成長性", priority: "データ活用" },
  { keyword: "マネジメント", strength: "安定性", priority: "協働性" },
  { keyword: "リモート", strength: "働き方柔軟性", priority: "実行力" },
  { keyword: "年収", strength: "報酬競争力", priority: "実行力" },
  { keyword: "アーキテクチャ", strength: "技術投資", priority: "改善思考" },
  { keyword: "顧客", strength: "成長性", priority: "顧客理解" },
  { keyword: "KPI", strength: "安定性", priority: "データ活用" },
  { keyword: "改善", strength: "技術投資", priority: "改善思考" }
];

const companyInput = document.getElementById("companyInput");
const companySuggestions = document.getElementById("companySuggestions");
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

initializeCompanySuggestions();
companyInput.addEventListener("input", () => fillDependentFilters(companyInput.value.trim()));

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const companyName = companyInput.value.trim();
  const location = locationSelect.value;
  const jobType = jobTypeSelect.value;
  const post = jobPostText.value.trim();
  const company = companyData[companyName];

  if (!company || !location || !jobType || !post) {
    alert("1〜5をすべて入力してください。");
    return;
  }

  renderAnalysis(companyName, location, jobType, post);
});

function initializeCompanySuggestions() {
  companySuggestions.innerHTML = Object.keys(companyData).map((name) => `<option value="${name}"></option>`).join("");
}

function fillDependentFilters(companyName) {
  locationSelect.innerHTML = '<option value="">選択してください</option>';
  jobTypeSelect.innerHTML = '<option value="">選択してください</option>';
  const company = companyData[companyName];
  if (!company) return;

  company.locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });

  company.jobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job;
    option.textContent = job;
    jobTypeSelect.appendChild(option);
  });
}

function renderAnalysis(companyName, location, jobType, post) {
  const company = companyData[companyName];
  const roleData = company.roles[jobType];
  const extraction = extractKeywords(post);
  const adjustedStrengths = adjustScores(company.strengths, extraction.strengthBoosts);
  const adjustedPriorities = adjustScores(roleData.priorities, extraction.priorityBoosts);

  resultTitle.textContent = `${companyName}｜${location}｜${jobType} の自動面接分析`;
  resultSummary.textContent = `${roleData.summary} 求人票テキストの強調語を反映して分析を補正しました。`;
  strengthDescription.textContent = "求人票内で強調された要素をもとに、企業の強みスコアを補正表示しています。";
  fitDescription.textContent = "求人票で繰り返し出る語を重み付けし、面接で評価されやすい観点を再計算しています。";

  keywordList.innerHTML = extraction.keywords.length
    ? extraction.keywords.map((k) => `<li>${k.keyword}（出現: ${k.count}回）</li>`).join("")
    : "<li>定義済みキーワードは検出されませんでした（原データの分析を表示）。</li>";

  talentList.innerHTML = buildAutoTalents(roleData.talents, extraction).map((item) => `<li>${item}</li>`).join("");
  questionList.innerHTML = buildAutoQuestions(roleData.questions, extraction).map((item) => `<li>${item}</li>`).join("");

  drawBarChart("strengthChart", adjustedStrengths, "#2563eb");
  drawBarChart("fitChart", adjustedPriorities, "#16a34a");

  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
}

function extractKeywords(text) {
  const strengthBoosts = {};
  const priorityBoosts = {};
  const keywords = [];

  keywordRules.forEach((rule) => {
    const count = countKeyword(text, rule.keyword);
    if (count > 0) {
      keywords.push({ keyword: rule.keyword, count });
      strengthBoosts[rule.strength] = (strengthBoosts[rule.strength] || 0) + count * 2;
      priorityBoosts[rule.priority] = (priorityBoosts[rule.priority] || 0) + count * 3;
    }
  });

  keywords.sort((a, b) => b.count - a.count);
  return { keywords, strengthBoosts, priorityBoosts };
}

function countKeyword(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = text.match(new RegExp(escaped, "gi"));
  return matches ? matches.length : 0;
}

function adjustScores(baseMap, boosts) {
  const adjusted = {};
  Object.entries(baseMap).forEach(([name, score]) => {
    adjusted[name] = Math.min(100, score + (boosts[name] || 0));
  });
  return adjusted;
}

function buildAutoTalents(baseTalents, extraction) {
  if (!extraction.keywords.length) return baseTalents;
  const top = extraction.keywords.slice(0, 2).map((k) => k.keyword).join("・");
  return [
    `求人票で強調される「${top}」を実務で再現できる人`,
    "定量成果を具体的に説明し、採用要件との一致を示せる人",
    ...baseTalents.slice(0, 2)
  ];
}

function buildAutoQuestions(baseQuestions, extraction) {
  if (!extraction.keywords.length) return baseQuestions;
  return [
    `求人票内で頻出する要件（${extraction.keywords[0].keyword}）は、入社後どの場面で特に重視されますか？`,
    "配属後の3か月で成果を出している中途社員の共通行動を教えてください。",
    ...baseQuestions.slice(0, 1)
  ];
}

function drawBarChart(canvasId, dataMap, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const entries = Object.entries(dataMap);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f172a";
  ctx.font = "13px sans-serif";

  const left = 110;
  const top = 24;
  const barHeight = 22;
  const gap = 20;
  const maxWidth = 290;

  entries.forEach(([label, value], index) => {
    const y = top + index * (barHeight + gap);
    const width = (value / 100) * maxWidth;
    ctx.fillStyle = "#334155";
    ctx.fillText(label, 12, y + 15);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(left, y, maxWidth, barHeight);
    ctx.fillStyle = color;
    ctx.fillRect(left, y, width, barHeight);
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`${value}`, left + width + 8, y + 15);
  });
}
