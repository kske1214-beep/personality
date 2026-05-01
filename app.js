const prefectures=["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
const jobs=["webマーケティング","デジタルマーケティング","webマーケティングコンサルティング","デジタルマーケティングコンサルティング","webディレクター","広告運用スタッフ"];
const mustPatterns=["必須","MUST","経験\d+年以上","KPI","運用","ディレクション","SQL","GA4","広告"]; const wantPatterns=["歓迎","尚可","WANT","あれば","英語","マネジメント","AI","生成AI"]; const hiddenRules=[{k:"スピード",v:"短サイクル実行力"},{k:"オーナー",v:"自走力"},{k:"横断",v:"巻き込み力"},{k:"改善",v:"改善力"},{k:"数値",v:"数字責任"},{k:"仮説",v:"論理性"}];
const axisList=["再現性","論理性","数字責任","自走力","改善力","巻き込み力","カルチャーフィット"];
const baseAxis={"再現性":72,"論理性":70,"数字責任":68,"自走力":70,"改善力":74,"巻き込み力":66,"カルチャーフィット":71};
const compareTemplate={"年収":[3,4,4],"裁量":[4,3,3],"成長環境":[5,4,3],"評価制度":[3,4,3],"AI活用度":[4,3,2],"内製化思想":[5,3,2]};

const $=id=>document.getElementById(id);const locationEl=$("location"),jobEl=$("jobType");
prefectures.forEach(p=>locationEl.add(new Option(p,p))); locationEl.add(new Option("選択してください",""),0);
jobs.forEach(j=>jobEl.add(new Option(j,j))); jobEl.add(new Option("選択してください",""),0);

$("searchForm").addEventListener("submit",e=>{e.preventDefault();runOS();});
function runOS(){
  const company=$("companyInput").value.trim(),hiring=$("hiringType").value,loc=locationEl.value,job=jobEl.value,text=$("jobPostText").value.trim();
  if(!company||!hiring||!loc||!job||!text){alert("1〜5をすべて入力してください。");return;}
  const must=extractByPatterns(text,mustPatterns,6),want=extractByPatterns(text,wantPatterns,6),hidden=extractHiddenAxes(text);
  const axis=scoreAxes(text,must,want,hidden); const winRate=calcWinRate(axis,must,want,hidden);
  $("resultTitle").textContent=`${company}｜${job}｜${loc} の面接準備プラン`;
  $("resultSummary").textContent=`分析根拠: 求人票の要件文（MUST/WANT）と行動要求語から評価軸を算出。MUST充足度と評価軸の整合で勝率を推定。`;
  renderList("mustList",must.length?must:["必須条件の明示表現は少ないため、実務要件文を重点確認してください"]);
  renderList("wantList",want.length?want:["歓迎条件の明示表現が少ないため、周辺スキルを補足提案すると有効です"]);
  renderList("hiddenList",hidden.length?hidden:["隠れ評価軸: 自走力・改善力・数字責任を仮置きで想定"]);
  drawAxisChart(axis); $("axisReason").textContent="スコアは求人票内の頻出要件・行動要求語・責任範囲語から重み付け。70以上は面接で具体エピソード必須。";
  $("winRateScore").textContent=`${winRate}%`; $("winRateReason").textContent=winRate>=75?"通過可能性は高め。深掘り対策を優先。":"通過率を上げる余地あり。MUSTに紐づく実績表現を強化。";
  const q=buildQuestions(company,job,must,hidden); renderList("hrQuestions",q.hr); renderList("mgrQuestions",q.mgr); renderList("ceoQuestions",q.ceo);
  $("motivation").textContent=`貴社の${hidden[0]||"自走力"}を重視する環境で、${must[0]||"主要KPI達成"}に直結する経験を再現し、事業成長に貢献したいと考え志望しました。`;
  $("selfPr").textContent=`私は${axisTop(axis).join("・")}を強みとし、目標から逆算した施策設計と検証で成果を出してきました。`;
  $("reasonChange").textContent=`現職では裁量範囲が限定されるため、より広い責任領域で成果責任を持ち、意思決定に近い立場で価値創出したく転職を決意しました。`;
  renderList("expectedQs",buildExpectedQs(must,job)); renderList("deepQs",buildDeepQs(hidden));
  renderCompareTable();
}
function extractByPatterns(text,patterns,max){const out=[];patterns.forEach(p=>{const reg=new RegExp(p,"gi");const c=(text.match(reg)||[]).length;if(c>0)out.push(`${p}（${c}）`);});return out.slice(0,max);}
function extractHiddenAxes(text){const out=[];hiddenRules.forEach(r=>{if(new RegExp(r.k,"gi").test(text))out.push(r.v);});return [...new Set(out)];}
function scoreAxes(text,must,want,hidden){const s={...baseAxis};s["再現性"]+=must.length*3;s["論理性"]+=(text.match(/仮説|検証|設計/g)||[]).length*3;s["数字責任"]+=(text.match(/KPI|ROAS|CPA|CVR|数値/g)||[]).length*3;s["自走力"]+=(text.match(/主体|オーナー|自走/g)||[]).length*4;s["改善力"]+=(text.match(/改善|PDCA/g)||[]).length*3;s["巻き込み力"]+=(text.match(/連携|横断|調整/g)||[]).length*3;s["カルチャーフィット"]+=want.length+hidden.length*2;Object.keys(s).forEach(k=>s[k]=Math.min(100,s[k]));return s;}
function calcWinRate(axis,must,want,hidden){const avg=Math.round(Object.values(axis).reduce((a,b)=>a+b,0)/axisList.length);return Math.min(95,Math.max(45,avg+must.length*2+hidden.length-want.length));}
function axisTop(axis){return Object.entries(axis).sort((a,b)=>b[1]-a[1]).slice(0,3).map(v=>`${v[0]}(${v[1]})`);}
function buildQuestions(company,job,must,hidden){return{hr:[`中途入社者の評価は入社後いつ・何指標で判定されますか？`,`採用背景として、${must[0]||"主要要件"}を強化したい理由を教えてください。`],mgr:[`${job}で成果を出す人の共通行動を3つ教えてください。`,`直近6か月で最も改善インパクトが大きかった施策は何ですか？`],ceo:[`${company}が今後3年で勝つために、組織へ最も求める変化は何ですか？`,`${hidden[0]||"自走力"}が強い人材に、どの権限を委譲していますか？`]};}
function buildExpectedQs(must,job){return[`この職種（${job}）で最初の90日で何を達成しますか？`,`あなたの経験は${must[0]||"必須要件"}にどう接続しますか？`,`過去の失敗からどう改善しましたか？`];}
function buildDeepQs(hidden){return[`数字責任を負った具体案件と結果は？`,`${hidden[0]||"改善力"}を示す定量成果は？`,`利害関係者を巻き込んだ難易度の高い調整経験は？`];}
function renderCompareTable(){const body=$("compareBody");body.innerHTML="";Object.entries(compareTemplate).forEach(([k,v])=>{const hint=v[0]>v[1]?"応募企業優位。理由を志望動機で言語化":"差分を埋める学習計画を提示";body.innerHTML+=`<tr><td>${k}</td><td>${v[0]}</td><td>${v[1]}</td><td>${v[2]}</td><td>${hint}</td></tr>`;});}
function renderList(id,arr){$(id).innerHTML=arr.map(x=>`<li>${x}</li>`).join("");}
function drawAxisChart(axis){const c=$("axisChart"),ctx=c.getContext("2d");ctx.clearRect(0,0,c.width,c.height);const entries=Object.entries(axis);const left=130,top=20,h=24,g=16,maxW=410;ctx.font="13px sans-serif";entries.forEach(([k,v],i)=>{const y=top+i*(h+g),w=v/100*maxW;ctx.fillStyle="#334155";ctx.fillText(k,20,y+16);ctx.fillStyle="#e2e8f0";ctx.fillRect(left,y,maxW,h);ctx.fillStyle="#1d4ed8";ctx.fillRect(left,y,w,h);ctx.fillStyle="#0f172a";ctx.fillText(String(v),left+w+8,y+16);});}
