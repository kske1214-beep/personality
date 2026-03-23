const companyData = {
  "株式会社A": {
    locations: ["東京", "大阪", "福岡"],
    jobs: ["営業", "企画", "エンジニア"],
    strengths: {
      成長性: 82,
      安定性: 70,
      働き方柔軟性: 78,
      報酬競争力: 74,
      技術投資: 88
    },
    roles: {
      営業: {
        priorities: { 顧客理解: 85, 実行力: 90, データ活用: 62, 協働性: 76, 改善思考: 68 },
        talents: [
          "仮説を持って顧客課題を深掘りできる人",
          "数字目標を分解し、行動に落とし込める人",
          "他部署を巻き込みながら提案を前進させられる人"
        ],
        questions: [
          "トップセールスの行動特性はどのような点にありますか？",
          "新規開拓と既存深耕の比率は四半期ごとにどう変わりますか？",
          "営業におけるデータ活用で、今後強化したい指標は何ですか？"
        ],
        summary: "営業組織は成果重視。再現性ある活動設計と顧客解像度の高さが評価されます。"
      },
      企画: {
        priorities: { 顧客理解: 78, 実行力: 72, データ活用: 86, 協働性: 84, 改善思考: 88 },
        talents: [
          "定量・定性データを統合して意思決定を支援できる人",
          "曖昧なテーマを構造化し、施策に落とし込める人",
          "経営・現場双方に伝わるストーリーを作れる人"
        ],
        questions: [
          "企画の成果を測るKPIはどのレイヤーで管理していますか？",
          "施策の優先順位を決める際の判断軸を教えてください。",
          "関係部署との合意形成で重視される行動は何ですか？"
        ],
        summary: "企画職はデータドリブンかつ横断連携が鍵。課題設定力が面接の評価ポイントです。"
      },
      エンジニア: {
        priorities: { 顧客理解: 70, 実行力: 80, データ活用: 82, 協働性: 74, 改善思考: 90 },
        talents: [
          "技術選定をビジネス成果と紐づけて説明できる人",
          "負債を可視化し、段階的な改善計画を提案できる人",
          "プロダクト視点で優先順位を議論できる人"
        ],
        questions: [
          "現在の開発で技術的負債として認識されている領域はどこですか？",
          "中途入社者が最初の3か月で期待される成果は何ですか？",
          "技術投資の意思決定における、事業側との連携プロセスを教えてください。"
        ],
        summary: "エンジニア採用では改善思考と実装力の両立が重要。技術の目的言語化が差分になります。"
      }
    }
  },
  "株式会社B": {
    locations: ["東京", "名古屋"],
    jobs: ["マーケティング", "カスタマーサクセス", "エンジニア"],
    strengths: {
      成長性: 76,
      安定性: 84,
      働き方柔軟性: 72,
      報酬競争力: 69,
      技術投資: 75
    },
    roles: {
      マーケティング: {
        priorities: { 顧客理解: 88, 実行力: 73, データ活用: 92, 協働性: 72, 改善思考: 82 },
        talents: [
          "獲得からLTVまで一気通貫で設計できる人",
          "複数チャネルを検証し学習を高速化できる人",
          "意思決定に必要な指標をシンプルに示せる人"
        ],
        questions: [
          "短期の獲得効率と中長期のブランド投資をどう両立していますか？",
          "マーケ施策の撤退判断はどの指標・期間で行いますか？",
          "プロダクト改善へ接続するための分析体制を教えてください。"
        ],
        summary: "マーケティングは検証速度が勝負。分析力と打ち手の実行バランスが求められます。"
      },
      カスタマーサクセス: {
        priorities: { 顧客理解: 92, 実行力: 78, データ活用: 74, 協働性: 90, 改善思考: 76 },
        talents: [
          "顧客の成功定義を言語化して伴走できる人",
          "オンボーディングとアップセルを一貫して設計できる人",
          "顧客の声をプロダクト改善へ橋渡しできる人"
        ],
        questions: [
          "ハイタッチ／ロータッチの運用基準はどのように設計されていますか？",
          "解約抑止に効果の高い先行指標は何ですか？",
          "CSから開発へのエスカレーション基準を教えてください。"
        ],
        summary: "CSは顧客理解と協働性が最重視。課題先読み力を示せると強いです。"
      },
      エンジニア: {
        priorities: { 顧客理解: 66, 実行力: 82, データ活用: 84, 協働性: 70, 改善思考: 86 },
        talents: [
          "運用と開発の両視点で、安定稼働を設計できる人",
          "計測基盤を使って改善サイクルを回せる人",
          "非機能要件の優先度を事業文脈で説明できる人"
        ],
        questions: [
          "SLO/SLIの運用で、直近注力している課題は何ですか？",
          "アーキテクチャ変更時の意思決定フローを教えてください。",
          "技術検証の提案が採用される条件は何ですか？"
        ],
        summary: "堅実運用と継続改善の両立が期待される環境。事業理解のある技術者が刺さります。"
      }
    }
  }
};

const companyInput = document.getElementById("companyInput");
const companySuggestions = document.getElementById("companySuggestions");
const locationSelect = document.getElementById("location");
const jobTypeSelect = document.getElementById("jobType");
const searchForm = document.getElementById("searchForm");
const emptyState = document.getElementById("emptyState");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const talentList = document.getElementById("talentList");
const questionList = document.getElementById("questionList");
const strengthDescription = document.getElementById("strengthDescription");
const fitDescription = document.getElementById("fitDescription");

initializeCompanySuggestions();

companyInput.addEventListener("input", () => {
  fillDependentFilters(companyInput.value.trim());
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const companyName = companyInput.value.trim();
  const location = locationSelect.value;
  const jobType = jobTypeSelect.value;

  const company = companyData[companyName];
  if (!company || !location || !jobType) {
    alert("企業名・勤務地・職種を選択してください。");
    return;
  }

  renderAnalysis(companyName, location, jobType);
});

function initializeCompanySuggestions() {
  const names = Object.keys(companyData);
  companySuggestions.innerHTML = names
    .map((name) => `<option value="${name}"></option>`)
    .join("");
}

function fillDependentFilters(companyName) {
  locationSelect.innerHTML = '<option value="">選択してください</option>';
  jobTypeSelect.innerHTML = '<option value="">選択してください</option>';

  if (!companyData[companyName]) {
    return;
  }

  companyData[companyName].locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });

  companyData[companyName].jobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job;
    option.textContent = job;
    jobTypeSelect.appendChild(option);
  });
}

function renderAnalysis(companyName, location, jobType) {
  const company = companyData[companyName];
  const roleData = company.roles[jobType];

  resultTitle.textContent = `${companyName}｜${location}｜${jobType} の面接分析`;
  resultSummary.textContent = roleData.summary;

  strengthDescription.textContent =
    "企業全体の特性。面接では高スコアの項目と自分の経験を接続すると説得力が増します。";
  fitDescription.textContent =
    "募集ポジションで評価される観点。上位2項目に紐づく実績エピソードを準備しましょう。";

  talentList.innerHTML = roleData.talents.map((item) => `<li>${item}</li>`).join("");
  questionList.innerHTML = roleData.questions.map((item) => `<li>${item}</li>`).join("");

  drawBarChart("strengthChart", company.strengths, "#2563eb");
  drawBarChart("fitChart", roleData.priorities, "#16a34a");

  emptyState.classList.add("hidden");
  resultCard.classList.remove("hidden");
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
