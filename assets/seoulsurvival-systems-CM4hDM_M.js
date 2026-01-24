import{g as W}from"./seoulsurvival-core-D8bQ2IUu.js";import{t as h,g as Y}from"./seoulsurvival-i18n-fm0rBIgf.js";import{f as J}from"./seoulsurvival-utils-D68McrsR.js";const en=[{id:"real_estate_mogul",nameKey:"synergy.realEstateMogul.name",descKey:"synergy.realEstateMogul.desc",icon:"🏢",check:c=>c.villas>0&&c.officetels>0&&c.apartments>0&&c.shops>0&&c.buildings>0,effect:"property_income",multiplier:1.3},{id:"finance_guru",nameKey:"synergy.financeGuru.name",descKey:"synergy.financeGuru.desc",icon:"💰",check:c=>c.deposits>0&&c.savings>0&&c.bonds>0&&c.usStocks>0&&c.cryptos>0,effect:"financial_income",multiplier:1.25},{id:"diversification",nameKey:"synergy.diversification.name",descKey:"synergy.diversification.desc",icon:"📊",check:c=>c.deposits>0&&c.savings>0&&c.bonds>0&&c.usStocks>0&&c.cryptos>0&&c.villas>0&&c.officetels>0&&c.apartments>0&&c.shops>0&&c.buildings>0,effect:"all_income",multiplier:1.15},{id:"seoul_ruler",nameKey:"synergy.seoulRuler.name",descKey:"synergy.seoulRuler.desc",icon:"🗼",check:c=>c.buildings>=5,effect:"all_income",multiplier:1.5},{id:"completionist",nameKey:"synergy.completionist.name",descKey:"synergy.completionist.desc",icon:"🏆",check:c=>c.__completionistUnlocked||!1,effect:"all_income",multiplier:2}];function sn(c=W){return en.filter($=>$.check(c))}function tn(c,$){const S=sn(c);let o=1;for(const i of S)(i.effect===$||i.effect==="all_income")&&(o*=i.multiplier);return o}function gn(c,$=W){return c*tn($,"property_income")}function fn(c,$=W){return c*tn($,"financial_income")}function $n(c){const $=Object.values(c).every(S=>S.purchased);W.__completionistUnlocked=$}function yn(c=W){return en.map($=>({id:$.id,nameKey:$.nameKey,descKey:$.descKey,icon:$.icon,active:$.check(c),multiplier:$.multiplier,effect:$.effect}))}const ln=[{id:"A1_mentor",category:"A",nameKey:"cp.A1.name",descKey:"cp.A1.desc",cost:1,icon:"👨‍🏫",requires:[],effect:{type:"click_multiplier",value:1.2}},{id:"A2_network",category:"A",nameKey:"cp.A2.name",descKey:"cp.A2.desc",cost:2,icon:"🌐",requires:["A1_mentor"],effect:{type:"auto_income_multiplier",value:1.25}},{id:"A3_recognition",category:"A",nameKey:"cp.A3.name",descKey:"cp.A3.desc",cost:3,icon:"🏆",requires:["A2_network"],effect:{type:"starting_cash",value:1e7}},{id:"A4_reputation",category:"A",nameKey:"cp.A4.name",descKey:"cp.A4.desc",cost:5,icon:"⭐",requires:["A3_recognition"],effect:{type:"price_discount",value:.1}},{id:"B1_broker",category:"B",nameKey:"cp.B1.name",descKey:"cp.B1.desc",cost:3,icon:"📊",requires:[],effect:{type:"financial_income_multiplier",value:1.3}},{id:"B2_fund_manager",category:"B",nameKey:"cp.B2.name",descKey:"cp.B2.desc",cost:5,icon:"💼",requires:["B1_broker"],effect:{type:"financial_price_discount",value:.25}},{id:"B3_hedge_fund",category:"B",nameKey:"cp.B3.name",descKey:"cp.B3.desc",cost:8,icon:"🦈",requires:["B2_fund_manager"],effect:{type:"financial_to_property_synergy",value:1.15}},{id:"C1_realtor",category:"C",nameKey:"cp.C1.name",descKey:"cp.C1.desc",cost:3,icon:"🏠",requires:[],effect:{type:"property_income_multiplier",value:1.3}},{id:"C2_builder",category:"C",nameKey:"cp.C2.name",descKey:"cp.C2.desc",cost:5,icon:"🏗️",requires:["C1_realtor"],effect:{type:"property_price_discount",value:.25}},{id:"C3_redeveloper",category:"C",nameKey:"cp.C3.name",descKey:"cp.C3.desc",cost:8,icon:"🌆",requires:["C2_builder"],effect:{type:"property_to_financial_synergy",value:1.15}},{id:"D1_workaholic",category:"D",nameKey:"cp.D1.name",descKey:"cp.D1.desc",cost:3,icon:"💪",requires:[],effect:{type:"click_income_multiplier",value:1.5}},{id:"D2_automation",category:"D",nameKey:"cp.D2.name",descKey:"cp.D2.desc",cost:5,icon:"🤖",requires:["D1_workaholic"],effect:{type:"auto_click_speed",value:2}},{id:"D3_ceo_mentality",category:"D",nameKey:"cp.D3.name",descKey:"cp.D3.desc",cost:8,icon:"👔",requires:["D2_automation"],effect:{type:"click_bonus_chance",value:.05}},{id:"E1_parents",category:"E",nameKey:"cp.E1.name",descKey:"cp.E1.desc",cost:2,icon:"👨‍👩‍👧",requires:[],effect:{type:"starting_deposits",value:5}},{id:"E2_connections",category:"E",nameKey:"cp.E2.name",descKey:"cp.E2.desc",cost:5,icon:"🤝",requires:["E1_parents"],effect:{type:"starting_career",value:1}},{id:"E3_silver_spoon",category:"E",nameKey:"cp.E3.name",descKey:"cp.E3.desc",cost:10,icon:"🥄",requires:["E2_connections"],effect:{type:"starting_bundle",value:{villa:1,career:2}}},{id:"F1_preserve_1",category:"F",nameKey:"cp.F1.name",descKey:"cp.F1.desc",cost:6,icon:"🔒",requires:[],effect:{type:"permanent_slot",value:1}},{id:"F2_preserve_2",category:"F",nameKey:"cp.F2.name",descKey:"cp.F2.desc",cost:15,icon:"🔐",requires:["F1_preserve_1"],effect:{type:"permanent_slot",value:2}},{id:"G1_prediction",category:"G",nameKey:"cp.G1.name",descKey:"cp.G1.desc",cost:7,icon:"🔮",requires:[],effect:{type:"market_event_bonus",value:1.5}},{id:"G2_insider",category:"G",nameKey:"cp.G2.name",descKey:"cp.G2.desc",cost:12,icon:"👁️",requires:["G1_prediction"],effect:{type:"market_event_preview",value:!0}}];function rn(){const c={click_multiplier:1,auto_income_multiplier:1,click_income_multiplier:1,financial_income_multiplier:1,property_income_multiplier:1,financial_to_property_synergy:1,property_to_financial_synergy:1,auto_click_speed:1,market_event_bonus:1,price_discount:0,financial_price_discount:0,property_price_discount:0,starting_cash:0,starting_deposits:0,starting_career:0,starting_bundle:null,click_bonus_chance:0,permanent_slot:0,market_event_preview:!1};for(const $ of W.purchasedUpgrades){const S=ln.find(P=>P.id===$);if(!S)continue;const{type:o,value:i}=S.effect;o.includes("multiplier")||o.includes("synergy")||o==="auto_click_speed"||o==="market_event_bonus"?c[o]=(c[o]||1)*i:o.includes("discount")?c[o]=Math.min(.5,(c[o]||0)+i):o==="permanent_slot"?c[o]=Math.max(c[o]||0,i):o==="market_event_preview"||o==="starting_bundle"?c[o]=i:c[o]=(c[o]||0)+(typeof i=="number"?i:0)}return c}function _n(){return rn().starting_cash||0}function kn(c){const $=rn(),o={click_power:"click_multiplier",auto_income:"auto_income_multiplier",all_income:"auto_income_multiplier",price_reduction:null}[c]||c;return o===null?1-($.price_discount||0):$[o]||1}let z=null,G=null,cn=null;function dn(c,$){z=c,G=$,cn=$.sessionStartTime}function j(c){if(!z||!G||["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(s=>c.includes(s)))return;const o=s=>String(s).padStart(2,"0"),i=new Date,P=`${o(i.getHours())}:${o(i.getMinutes())}`;function x(){if(!G)return;const s=i.getFullYear(),r=o(i.getMonth()+1),g=o(i.getDate()),f=typeof G.gameStartTime<"u"&&G.gameStartTime?G.gameStartTime:cn,M=Math.max(1,Math.floor((Date.now()-f)/864e5)+1),m=document.getElementById("diaryHeaderMeta");m&&(m.textContent=`${s}.${r}.${g}(${h("ui.dayCount",{days:M})})`);const y=document.getElementById("diaryMetaDate"),q=document.getElementById("diaryMetaDay");y&&(y.textContent=h("ui.today",{date:`${s}.${r}.${g}`})),q&&(q.textContent=h("ui.dayCount",{days:M}))}function R(s){var B,u,_,O,A,F,T,b;const r=String(s||"").trim();if(new RegExp(h("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(r)||/다음\s*업그레이드/.test(r)&&/클릭\s*남/.test(r))return"";const f=n=>n.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu,"").trim(),M=n=>Math.floor(Math.random()*n),m=(n,e)=>{if(!Array.isArray(e)||e.length===0)return"";const a=`__diaryLastPick_${n}`,l=window[a];let N=M(e.length);return e.length>1&&typeof l=="number"&&N===l&&(N=(N+1+M(e.length-1))%e.length),window[a]=N,e[N]},y=n=>f(n).replace(/\s+/g," ").trim();if(h("msg.achievementUnlocked",{name:"",desc:""}).split(":")[0]+"",r.startsWith("🏆")&&(r.includes("업적 달성:")||r.includes("Achievement Unlocked:"))){const n=f(r).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[e,a]=n.split(/\s*-\s*/);return m("achievement",[`오늘은 체크 하나를 더했다. (${e||"업적"})`,`작게나마 성취. ${e||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${e||"업적"}.
${a||""}`.trim(),`"${e||"업적"}" 달성.
${a?`메모: ${a}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${e||"업적"})`,`또 하나의 마일스톤. ${e||"업적"}.
${a||""}`.trim(),`작은 성취도 성취다. ${e||"업적"}.
${a||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${e||"업적"}.
${a||""}`.trim(),`기록에 하나 더. ${e||"업적"}.
${a||""}`.trim(),`뿌듯함이 조금씩. ${e||"업적"} 달성.
${a||""}`.trim(),`이런 게 인생이지. ${e||"업적"}.
${a||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${e||"업적"}.
${a||""}`.trim()])}const q=Y()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(r.startsWith("🎉")&&(r.includes("승진했습니다")||/promoted/i.test(r))){const n=r.match(q),e=(B=n==null?void 0:n[1])==null?void 0:B.trim(),a=(u=n==null?void 0:n[2])==null?void 0:u.trim(),l=a?a.replace(/[()]/g,"").trim():"";return m("promotion",[`명함이 바뀌었다. ${e||"다음 단계"}.
${l}`.trim(),`오늘은 좀 뿌듯하다. ${e||"승진"}이라니.
${l}`.trim(),`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
${l}`.trim(),`그래, 나도 올라갈 줄 안다. ${e||"승진"}.
${l}`.trim(),`커피가 조금 더 쓰게 느껴진다. ${e||"승진"}의 맛.
${l}`.trim(),`한 단계 올라섰다. ${e||"승진"}.
${l}`.trim(),`노력이 보상받는 순간. ${e||"승진"}.
${l}`.trim(),`새로운 시작. ${e||"승진"}.
${l}`.trim(),`더 높은 곳에서 보는 풍경이 다르다. ${e||"승진"}.
${l}`.trim(),`자리도 바뀌고 마음도 바뀐다. ${e||"승진"}.
${l}`.trim(),`이제야 진짜 시작인가. ${e||"승진"}.
${l}`.trim(),`무게감이 느껴진다. ${e||"승진"}의 무게.
${l}`.trim()])}const I=Y()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(r.startsWith("🔓")){const n=y(r),e=r.match(I),a=((e==null?void 0:e[1])||"").trim(),l={적금:[`자동이체 버튼이 눈에 들어왔다.
${n}`,`천천히 쌓는 쪽으로 방향을 틀었다.
${n}`,`오늘은 '루틴'이 열렸다.
${n}`,`꾸준함의 길이 열렸다.
${n}`,`작은 투자의 문이 열렸다.
${n}`,`시간이 내 편이 되는 선택지.
${n}`,`루틴 투자의 시작.
${n}`,`매일의 습관이 가능해졌다.
${n}`,`인내심의 투자가 열렸다.
${n}`,`작은 것들이 모이는 길.
${n}`],국내주식:[`이제 차트랑 뉴스랑 싸울 차례다.
${n}`,`심장이 약하면 못 할 선택지… 열렸다.
${n}`,`변동성의 문이 열렸다.
${n}`,`국장의 세계로 입문.
${n}`,`차트의 파도를 탈 수 있다.
${n}`,`투자자의 길이 열렸다.
${n}`,`변동성에 도전할 수 있다.
${n}`,`국장의 심장박동을 느낄 수 있다.
${n}`,`위험과 기회의 문.
${n}`,`국장 투자의 시작.
${n}`],미국주식:[`시차를 버티는 돈이 열렸다.
${n}`,`달러 냄새가 난다.
${n}`,`밤샘의 선택지… 드디어.
${n}`,`글로벌 투자의 문이 열렸다.
${n}`,`세계 시장에 발을 담글 수 있다.
${n}`,`미장의 파도를 탈 수 있다.
${n}`,`달러의 무게를 느낄 수 있다.
${n}`,`시차의 스트레스를 견딜 수 있다.
${n}`,`환율의 변동을 경험할 수 있다.
${n}`,`미장 투자의 시작.
${n}`],코인:[`롤러코스터 입장권이 생겼다.
${n}`,`FOMO가 문을 두드린다.
${n}`,`폭등/폭락의 세계가 열렸다.
${n}`,`변동성의 극치를 경험할 수 있다.
${n}`,`멘탈이 시험받는 투자.
${n}`,`코인판의 무게를 견딜 수 있다.
${n}`,`FOMO와 공포 사이의 선택.
${n}`,`디지털 자산의 세계.
${n}`,`심장이 먼저 반응하는 투자.
${n}`,`롤러코스터의 정점에 설 수 있다.
${n}`],빌라:[`첫 '집'이라는 단어가 현실이 됐다.
${n}`,`작아도 내 편이 하나 생긴 기분.
${n}`,`부동산 투자의 첫걸음.
${n}`,`집이라는 단어가 현실이 됐다.
${n}`,`내 공간을 가질 수 있다.
${n}`,`작은 집도 집이다.
${n}`,`부동산의 세계로 입문.
${n}`,`첫 집의 무게감을 느낄 수 있다.
${n}`,`내 이름으로 등기할 수 있다.
${n}`,`부동산 투자의 시작.
${n}`],오피스텔:[`출근 동선이 머리에 그려졌다.
${n}`,`현실적인 선택지가 열렸다.
${n}`,`실용적인 투자가 가능해졌다.
${n}`,`생활의 편의를 살 수 있다.
${n}`,`도시 생활의 현실을 경험할 수 있다.
${n}`,`작은 공간, 큰 만족의 선택.
${n}`,`실용주의의 투자.
${n}`,`생활의 질을 올릴 수 있다.
${n}`,`현실적인 부동산 투자.
${n}`,`도시 생활의 편의를 살 수 있다.
${n}`],아파트:[`꿈이 조금 현실 쪽으로 다가왔다.
${n}`,`안정의 상징이 열렸다.
${n}`,`한국인의 꿈을 살 수 있다.
${n}`,`부동산 투자의 정점.
${n}`,`아파트의 무게감을 느낄 수 있다.
${n}`,`꿈이 현실이 되는 순간.
${n}`,`안정적인 투자가 가능해졌다.
${n}`,`부동산의 대표주자를 살 수 있다.
${n}`,`가치가 보장되는 선택.
${n}`,`한국 사회의 상징을 살 수 있다.
${n}`],상가:[`유동인구라는 단어가 갑자기 무겁다.
${n}`,`장사 잘되길… 진심으로.
${n}`,`상권의 힘을 믿을 수 있다.
${n}`,`유동인구가 내 수익이 될 수 있다.
${n}`,`상권 투자의 묘미를 느낄 수 있다.
${n}`,`임대 수익의 달콤함을 경험할 수 있다.
${n}`,`상가의 가치를 알아볼 수 있다.
${n}`,`상권의 파도를 탈 수 있다.
${n}`,`임차인의 성공이 내 성공이 될 수 있다.
${n}`,`상가 투자의 리스크를 감수할 수 있다.
${n}`],빌딩:[`스카이라인에 욕심이 생겼다.
${n}`,`이제 진짜 '엔드게임' 냄새.
${n}`,`부동산 투자의 정점.
${n}`,`스카이라인의 주인이 될 수 있다.
${n}`,`도시의 한 조각을 소유할 수 있다.
${n}`,`빌딩의 무게감을 느낄 수 있다.
${n}`,`부동산 투자의 완성.
${n}`,`도시의 심장부를 살 수 있다.
${n}`,`스카이라인에 내 이름을 올릴 수 있다.
${n}`,`부동산 투자의 궁극.
${n}`]};return a&&l[a]?m(`unlock_${a}`,l[a]):m("unlock",[`문이 하나 열렸다.
${n}`,`다음 장으로 넘어갈 수 있게 됐다.
${n}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${n}`,`드디어. ${n}`,`새로운 가능성이 열렸다.
${n}`,`선택지가 하나 더 생겼다.
${n}`,`다음 단계로 나아갈 수 있다.
${n}`,`기회의 문이 열렸다.
${n}`,`새로운 길이 보인다.
${n}`,`진행의 길이 열렸다.
${n}`])}if(r.startsWith("💸 자금이 부족합니다")){const n=y(r);return m("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${n}`,`현실 체크. 돈이 없다.
${n}`,`오늘은 참는다. 아직은 무리.
${n}`,`계산기만 두드리고 끝.
${n}`,`통장 잔고가 거짓말을 한다.
${n}`,`돈이 부족하다는 건 늘 아프다.
${n}`,`다시 모아야 한다. 조금 더.
${n}`,`욕심을 접어야 할 때.
${n}`,`현실이 무겁다.
${n}`,`내일을 기다려야 한다.
${n}`])}if(r.startsWith("✅")&&(r.includes("구입했습니다")||/purchased/i.test(r))){const n=y(r),e=r.match(/^✅\s*(.+?)\s+\d/),a=((e==null?void 0:e[1])||"").trim(),l={예금:[`일단은 안전한 데에 묶어두자.
${n}`,`불안할 땐 예금이 답이다.
${n}`,`통장에 '쿠션'을 하나 깔았다.
${n}`,`안전함이 최고의 수익률.
${n}`,`무엇보다도 평온함.
${n}`,`돈이 잠들어 있는 게 나쁘지 않다.
${n}`,`은행이 내 편이 되는 순간.
${n}`,`위험은 내일로 미뤄두자.
${n}`,`조용히 쌓이는 게 좋다.
${n}`,`불안할 때는 이게 최선.
${n}`,`돈이 안전하게 지켜지는 느낌.
${n}`,`위험 없는 선택.
${n}`],적금:[`루틴을 샀다. 매일이 쌓이면 언젠가.
${n}`,`천천히, 꾸준히. 적금은 배신을 덜 한다.
${n}`,`버티기 모드 ON.
${n}`,`작은 것들이 모여 큰 것이 된다.
${n}`,`매일의 습관이 미래를 만든다.
${n}`,`꾸준함이 무기다.
${n}`,`서두르지 않고 천천히.
${n}`,`시간이 내 편이 되는 느낌.
${n}`,`작은 투자가 큰 결과를 만든다.
${n}`,`루틴의 힘을 믿는다.
${n}`,`매일 조금씩, 그게 전부다.
${n}`,`인내심이 필요한 투자.
${n}`],국내주식:[`차트가 나를 보더니 웃는 것 같았다.
${n}`,`기대 반, 긴장 반.
${n}`,`뉴스 알람을 켜야 할 것 같다.
${n}`,`변동성의 바다에 뛰어든다.
${n}`,`심장이 뛰는 투자.
${n}`,`국장의 파도를 타본다.
${n}`,`위험과 기회가 공존한다.
${n}`,`차트 한 줄에 모든 게 달렸다.
${n}`,`투자자의 길을 걷는다.
${n}`,`시장의 심장박동을 느낀다.
${n}`,`변동성에 내 심장도 같이 흔들린다.
${n}`,`국장의 무게를 견뎌본다.
${n}`],미국주식:[`달러 환율부터 떠올랐다.
${n}`,`밤에 울리는 알림을 각오했다.
${n}`,`세계로 한 걸음.
${n}`,`시차를 극복하는 투자.
${n}`,`미장의 파도를 타본다.
${n}`,`달러의 무게를 느낀다.
${n}`,`세계 시장에 발을 담근다.
${n}`,`밤샘의 대가를 치른다.
${n}`,`환율이 내 수익을 좌우한다.
${n}`,`글로벌 투자자의 길.
${n}`,`시차 때문에 잠을 설친다.
${n}`,`미장의 리듬에 맞춘다.
${n}`],코인:[`심장 단단히 붙잡고 탔다.
${n}`,`오늘은 FOMO가 이겼다.
${n}`,`롤러코스터에 표를 끊었다.
${n}`,`폭등과 폭락 사이에서 줄타기.
${n}`,`멘탈이 시험받는 투자.
${n}`,`변동성의 극치를 경험한다.
${n}`,`코인판의 무게를 견뎌본다.
${n}`,`FOMO와 공포 사이에서.
${n}`,`디지털 자산의 세계.
${n}`,`심장이 먼저 반응한다.
${n}`,`롤러코스터의 정점에 서 있다.
${n}`,`위험을 감수하는 선택.
${n}`],빌라:[`작아도 시작은 시작이다.
${n}`,`첫 집 느낌… 마음이 조금 놓였다.
${n}`,`벽지 냄새를 상상했다.
${n}`,`첫 부동산. 작지만 소중하다.
${n}`,`집이라는 단어가 현실이 됐다.
${n}`,`내 공간이 생겼다.
${n}`,`작은 집도 집이다.
${n}`,`부동산 투자의 첫걸음.
${n}`,`작은 시작이 큰 결과를 만든다.
${n}`,`첫 집의 무게감.
${n}`,`내 이름으로 등기되는 순간.
${n}`,`부동산의 세계에 입문했다.
${n}`],오피스텔:[`현실적인 선택을 했다.
${n}`,`출근길이 짧아지는 상상을 했다.
${n}`,`관리비 생각은 내일 하자.
${n}`,`실용적인 투자.
${n}`,`출근 동선이 머리에 그려진다.
${n}`,`현실과 이상의 절충.
${n}`,`생활의 편의를 샀다.
${n}`,`도시 생활의 현실.
${n}`,`작은 공간, 큰 만족.
${n}`,`실용주의의 승리.
${n}`,`생활의 질이 올라간다.
${n}`,`현실적인 부동산 투자.
${n}`],아파트:[`꿈이 조금 더 선명해졌다.
${n}`,`안정의 상징을 손에 쥐었다.
${n}`,`괜히 뿌듯하다.
${n}`,`한국인의 꿈을 샀다.
${n}`,`안정의 상징을 손에 쥐었다.
${n}`,`부동산 투자의 정점.
${n}`,`아파트의 무게감.
${n}`,`꿈이 현실이 되는 순간.
${n}`,`안정적인 투자.
${n}`,`부동산의 대표주자.
${n}`,`가치가 보장되는 선택.
${n}`,`한국 사회의 상징.
${n}`],상가:[`유동인구가 돈이 되는 세계.
${n}`,`임차인 운이 따라주길.
${n}`,`간판 불빛을 상상했다.
${n}`,`상권의 힘을 믿는다.
${n}`,`유동인구가 내 수익이다.
${n}`,`상권 투자의 묘미.
${n}`,`임대 수익의 달콤함.
${n}`,`상가의 가치를 알아본다.
${n}`,`유동인구가 곧 돈이다.
${n}`,`상권의 파도를 타본다.
${n}`,`임차인의 성공이 내 성공.
${n}`,`상가 투자의 리스크.
${n}`],빌딩:[`스카이라인을 한 조각 샀다.
${n}`,`이건… 진짜 끝판왕 느낌이다.
${n}`,`도시가 내 편인 것 같았다.
${n}`,`부동산 투자의 정점.
${n}`,`스카이라인의 주인.
${n}`,`도시의 한 조각을 소유한다.
${n}`,`빌딩의 무게감.
${n}`,`부동산 투자의 완성.
${n}`,`도시의 심장부를 샀다.
${n}`,`스카이라인에 내 이름이.
${n}`,`부동산 투자의 궁극.
${n}`,`도시의 한 부분이 내 것이다.
${n}`]};return a&&l[a]?m(`buy_${a}`,l[a]):m("buy",[`결심하고 질렀다.
${n}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${n}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${n}`,`한 발 더 나아갔다.
${n}`,`손이 먼저 움직였다.
${n}`,`투자의 길을 걷는다.
${n}`,`미래를 위한 선택.
${n}`,`돈이 돈을 버는 구조.
${n}`,`자산을 늘리는 순간.
${n}`,`투자자의 마음가짐.
${n}`])}if(r.startsWith("💰")&&r.includes("판매했습니다")){const n=y(r),e=r.match(/^💰\s*(.+?)\s+\d/),a=((e==null?void 0:e[1])||"").trim(),l={코인:[`손이 떨리기 전에 내렸다.
${n}`,`욕심을 접었다. 오늘은 이쯤.
${n}`,`살아남는 게 먼저다.
${n}`,`FOMO를 이겨냈다.
${n}`,`멘탈을 지키기 위해 내렸다.
${n}`,`롤러코스터에서 내렸다.
${n}`,`변동성에서 벗어났다.
${n}`,`손절의 아픔을 견뎌낸다.
${n}`,`코인판에서 살아남았다.
${n}`,`위험에서 벗어났다.
${n}`],국내주식:[`수익이든 손절이든, 결론은 냈다.
${n}`,`차트와 잠깐 이별.
${n}`,`정리하고 숨 돌린다.
${n}`,`국장의 파도에서 벗어났다.
${n}`,`차트의 무게에서 해방.
${n}`,`투자 포지션을 정리했다.
${n}`,`변동성에서 벗어났다.
${n}`,`국장의 스트레스에서 해방.
${n}`,`정리하고 다음 기회를 본다.
${n}`,`차트와의 관계를 정리했다.
${n}`],미국주식:[`시차도 같이 정리했다.
${n}`,`달러 생각은 잠시 접는다.
${n}`,`잠깐 쉬어가기로 했다.
${n}`,`미장의 밤샘에서 벗어났다.
${n}`,`시차의 스트레스에서 해방.
${n}`,`달러의 무게에서 벗어났다.
${n}`,`미장 투자를 정리했다.
${n}`,`글로벌 투자에서 잠시 휴식.
${n}`,`환율 걱정을 접었다.
${n}`,`미장의 리듬에서 벗어났다.
${n}`],예금:[`안전벨트를 풀었다.
${n}`,`현금이 필요했다.
${n}`,`안전함에서 벗어났다.
${n}`,`예금의 안정성을 포기했다.
${n}`,`현금화의 선택.
${n}`,`안전한 곳에서 돈을 꺼냈다.
${n}`,`예금의 편안함을 잃었다.
${n}`,`현금이 필요해 정리했다.
${n}`,`안전한 투자에서 벗어났다.
${n}`,`예금의 쿠션을 제거했다.
${n}`],적금:[`꾸준함을 잠깐 멈췄다.
${n}`,`루틴을 깼다. 사정이 있었다.
${n}`,`적금의 루틴을 중단했다.
${n}`,`꾸준함을 포기했다.
${n}`,`루틴의 힘을 잃었다.
${n}`,`적금의 안정성을 포기.
${n}`,`매일의 습관을 깼다.
${n}`,`적금의 꾸준함을 중단.
${n}`,`루틴 투자에서 벗어났다.
${n}`,`적금의 시간을 포기했다.
${n}`],빌라:[`정든 것과 이별.
${n}`,`현실적으로 정리했다.
${n}`,`첫 집과 작별.
${n}`,`부동산 투자를 정리했다.
${n}`,`작은 집을 내려놨다.
${n}`,`첫 부동산과 이별.
${n}`,`집의 무게에서 벗어났다.
${n}`,`부동산의 첫걸음을 정리.
${n}`,`작은 집을 포기했다.
${n}`,`첫 집의 추억을 정리.
${n}`],오피스텔:[`동선은 이제 안녕.
${n}`,`정리하고 다음으로.
${n}`,`실용적인 투자를 정리.
${n}`,`출근 동선의 편의를 포기.
${n}`,`현실적인 선택을 정리.
${n}`,`오피스텔의 실용성을 포기.
${n}`,`생활의 편의를 잃었다.
${n}`,`도시 생활의 현실을 정리.
${n}`,`작은 공간을 내려놨다.
${n}`,`현실적인 투자를 정리.
${n}`],아파트:[`꿈을 잠시 내려놓았다.
${n}`,`정리했다. 마음이 좀 쓰다.
${n}`,`한국인의 꿈을 포기.
${n}`,`안정의 상징을 내려놨다.
${n}`,`부동산 투자를 정리.
${n}`,`아파트의 무게에서 벗어났다.
${n}`,`꿈이 현실에서 멀어졌다.
${n}`,`안정적인 투자를 포기.
${n}`,`부동산의 대표주자를 정리.
${n}`,`가치 보장을 포기했다.
${n}`],상가:[`임차인 걱정이 덜었다.
${n}`,`상권이란 게 참…
${n}`,`유동인구의 기회를 포기.
${n}`,`상권 투자를 정리했다.
${n}`,`임대 수익의 달콤함을 포기.
${n}`,`상가의 가치를 내려놨다.
${n}`,`유동인구의 수익을 포기.
${n}`,`상권의 파도에서 벗어났다.
${n}`,`임차인의 성공을 포기.
${n}`,`상가 투자의 리스크를 정리.
${n}`],빌딩:[`도시 한 조각을 내려놨다.
${n}`,`정리했다. 다시 올라가면 된다.
${n}`,`부동산 투자의 정점을 포기.
${n}`,`스카이라인의 주인을 내려놨다.
${n}`,`도시의 한 조각을 포기.
${n}`,`빌딩의 무게에서 벗어났다.
${n}`,`부동산 투자의 완성을 정리.
${n}`,`도시의 심장부를 포기.
${n}`,`스카이라인에서 내 이름을 지웠다.
${n}`,`부동산 투자의 궁극을 정리.
${n}`]};return a&&l[a]?m(`sell_${a}`,l[a]):m("sell",[`정리할 건 정리했다.
${n}`,`가끔은 줄여야 산다.
${n}`,`현금이 필요했다. 그래서 팔았다.
${n}`,`미련은 접어두고 정리.
${n}`,`투자 포지션을 정리했다.
${n}`,`현금화의 선택.
${n}`,`자산을 정리하는 순간.
${n}`,`투자에서 벗어났다.
${n}`,`정리하고 다음 기회를 본다.
${n}`,`미련 없이 정리했다.
${n}`])}if(r.startsWith("❌")){const n=y(r);return m("fail",[`오늘은 뜻대로 안 됐다.
${n}`,`계획은 늘 계획대로 안 된다.
${n}`,`한 번 더. 다음엔 될 거다.
${n}`,`벽에 부딪혔다.
${n}`,`실패는 또 다른 시작.
${n}`,`좌절은 잠시뿐.
${n}`,`다시 일어서야 한다.
${n}`,`실패도 경험이다.
${n}`,`다음 기회를 기다린다.
${n}`,`실패에서 배운다.
${n}`])}if(r.startsWith("📈")&&r.includes("발생")){const n=y(r),e=(O=(_=r.match(/^📈\s*(.+?)\s*발생/))==null?void 0:_[1])==null?void 0:O.trim(),l=(((F=(A=r.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:A[1])==null?void 0:F.trim())||e||"").trim(),L=(H=>{const V=String(H||""),k=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[an,on]of k)if(V.includes(an))return on;return""})(`${l} ${n}`)||"시장";window.__diaryLastMarketProduct=L,window.__diaryLastMarketName=l||n;const t={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
${n}`,`안정은 조용히 돈을 번다. 오늘도 예금은 예금했다.
${n}`,`예금은 변하지 않는다. 그게 장점.
${n}`,`안정적인 투자는 조용하다.
${n}`,`예금의 평온함이 느껴진다.
${n}`,`변동성 없는 투자의 편안함.
${n}`,`예금은 늘 그 자리다.
${n}`,`안전함의 가치를 느낀다.
${n}`,`예금의 조용한 수익.
${n}`,`변동 없는 투자의 평온.
${n}`],적금:[`루틴이 흔들리는 날이 있다. 그래도 적금은 적금.
${n}`,`꾸준함의 세계에도 이벤트는 온다.
${n}`,`적금의 루틴이 흔들린다.
${n}`,`꾸준함에도 변화가 있다.
${n}`,`적금의 안정성이 시험받는다.
${n}`,`루틴 투자의 변동.
${n}`,`매일의 습관이 흔들린다.
${n}`,`적금의 꾸준함이 시험받는다.
${n}`,`시간이 만드는 투자의 변화.
${n}`,`적금의 루틴이 바뀐다.
${n}`],국내주식:[`차트가 또 날 시험한다.
${n}`,`뉴스 한 줄에 심장이 먼저 반응했다.
${n}`,`국장답게… 오늘도 변동성.
${n}`,`국장의 파도가 높아진다.
${n}`,`차트의 심장박동이 빨라진다.
${n}`,`국장의 변동성이 극대화된다.
${n}`,`뉴스 한 줄이 모든 걸 바꾼다.
${n}`,`국장의 무게가 느껴진다.
${n}`,`차트의 파도를 타야 한다.
${n}`,`국장 투자의 리스크가 커진다.
${n}`],미국주식:[`시차가 오늘따라 더 길게 느껴진다.
${n}`,`달러랑 감정은 분리… 하자.
${n}`,`미장 이벤트는 밤에 더 크게 들린다.
${n}`,`미장의 파도가 높아진다.
${n}`,`시차의 스트레스가 커진다.
${n}`,`달러의 무게가 느껴진다.
${n}`,`미장의 리듬이 바뀐다.
${n}`,`환율의 변동이 심해진다.
${n}`,`밤샘의 대가가 커진다.
${n}`,`글로벌 투자의 무게.
${n}`],코인:[`멘탈이 먼저 흔들린다. 코인은 늘 그렇다.
${n}`,`롤러코스터가 출발했다.
${n}`,`FOMO랑 손절 사이에서 줄타기.
${n}`,`코인판의 파도가 거세진다.
${n}`,`변동성의 극치를 경험한다.
${n}`,`멘탈이 시험받는 순간.
${n}`,`FOMO와 공포 사이에서.
${n}`,`롤러코스터의 정점에 서 있다.
${n}`,`코인판의 무게가 느껴진다.
${n}`,`위험을 감수하는 투자의 극치.
${n}`],빌라:[`동네 분위기가 바뀌면 빌라도 숨을 쉰다.
${n}`,`작은 집도 결국은 시장을 탄다.
${n}`,`부동산 시장의 파도가 느껴진다.
${n}`,`작은 집도 시장의 영향을 받는다.
${n}`,`부동산 투자의 변동성.
${n}`,`동네 분위기의 변화.
${n}`,`작은 집의 가치가 흔들린다.
${n}`,`부동산 시장의 리듬.
${n}`,`첫 집의 무게감이 느껴진다.
${n}`,`부동산 투자의 리스크.
${n}`],오피스텔:[`현실의 수요가 움직이는 소리가 난다.
${n}`,`출근 동선이 바뀌면 월세도 같이 흔들린다.
${n}`,`실용적인 투자도 시장의 영향을 받는다.
${n}`,`생활의 편의가 시장에 좌우된다.
${n}`,`도시 생활의 현실이 바뀐다.
${n}`,`오피스텔의 가치가 흔들린다.
${n}`,`현실적인 투자의 변동성.
${n}`,`생활의 질이 시장에 좌우된다.
${n}`,`실용주의 투자의 리스크.
${n}`,`도시 생활의 현실이 느껴진다.
${n}`],아파트:[`아파트는 '상징'이라더니, 이벤트도 상징처럼 크게 온다.
${n}`,`꿈이 흔들릴 때가 있다.
${n}`,`한국인의 꿈이 시장에 좌우된다.
${n}`,`안정의 상징이 흔들린다.
${n}`,`부동산 투자의 정점이 시험받는다.
${n}`,`아파트의 무게감이 느껴진다.
${n}`,`꿈이 현실에서 멀어질 수 있다.
${n}`,`안정적인 투자도 변동한다.
${n}`,`부동산의 대표주자가 흔들린다.
${n}`,`가치 보장이 시장에 좌우된다.
${n}`],상가:[`유동인구라는 말이 오늘은 무겁다.
${n}`,`장사라는 건 결국 파도 타기.
${n}`,`상권의 힘이 시장에 좌우된다.
${n}`,`유동인구의 수익이 변동한다.
${n}`,`상권 투자의 묘미와 리스크.
${n}`,`임대 수익의 달콤함과 쓴맛.
${n}`,`상가의 가치가 흔들린다.
${n}`,`상권의 파도가 거세진다.
${n}`,`임차인의 성공이 시장에 좌우된다.
${n}`,`상가 투자의 리스크가 커진다.
${n}`],빌딩:[`도시가 요동치면 빌딩도 요동친다.
${n}`,`스카이라인의 공기가 달라졌다.
${n}`,`부동산 투자의 정점이 시험받는다.
${n}`,`스카이라인의 주인이 시장에 좌우된다.
${n}`,`도시의 한 조각이 흔들린다.
${n}`,`빌딩의 무게감이 느껴진다.
${n}`,`부동산 투자의 완성이 시장에 좌우된다.
${n}`,`도시의 심장부가 요동친다.
${n}`,`스카이라인의 이름이 흔들린다.
${n}`,`부동산 투자의 궁극이 시험받는다.
${n}`],노동:[`업무 흐름이 바뀌면 내 하루도 바뀐다.
${n}`,`오늘은 손이 더 바빠질 것 같다.
${n}`,`일의 리듬이 바뀐다.
${n}`,`업무의 흐름이 시장에 좌우된다.
${n}`,`노동의 가치가 변동한다.
${n}`,`일의 무게감이 느껴진다.
${n}`,`업무의 스트레스가 커진다.
${n}`,`노동의 리듬이 시장에 좌우된다.
${n}`,`일의 가치가 흔들린다.
${n}`,`업무의 변동성이 느껴진다.
${n}`],시장:[`시장이 시끄럽다.
${n}`,`뉴스가 난리다.
${n}`,`분위기가 확 바뀌었다.
${n}`,`감정은 접고, 상황만 기록.
${n}`,`시장의 파도가 거세진다.
${n}`,`뉴스 한 줄이 모든 걸 바꾼다.
${n}`,`시장의 무게감이 느껴진다.
${n}`,`변동성의 극치를 경험한다.
${n}`,`시장의 리듬이 바뀐다.
${n}`,`투자의 리스크가 커진다.
${n}`]};return m(`market_${L}`,t[L]||t.시장)}if(r.startsWith("📉")&&r.includes("종료")){const n=window.__diaryLastMarketProduct||"시장",e=window.__diaryLastMarketName||"",a={코인:[`심장이 겨우 진정됐다. (${e||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
${e||""}`.trim(),`롤러코스터가 멈췄다. 잠시만.
${e||""}`.trim(),`FOMO의 파도가 잠잠해졌다.
${e||""}`.trim(),`변동성의 폭풍이 지나갔다.
${e||""}`.trim(),`멘탈이 겨우 회복됐다.
${e||""}`.trim(),`코인판의 소란이 잠잠해졌다.
${e||""}`.trim(),`위험의 파도가 잠잠해졌다.
${e||""}`.trim()],국내주식:[`차트가 잠깐 조용해졌다.
${e||""}`.trim(),`국장 소란 종료. 숨 한 번.
${e||""}`.trim(),`뉴스의 파도가 잠잠해졌다.
${e||""}`.trim(),`차트의 심장박동이 안정됐다.
${e||""}`.trim(),`국장의 변동성이 잠잠해졌다.
${e||""}`.trim(),`투자자의 심장이 진정됐다.
${e||""}`.trim(),`국장의 무게에서 벗어났다.
${e||""}`.trim(),`차트의 파도가 잠잠해졌다.
${e||""}`.trim()],미국주식:[`밤이 지나갔다.
${e||""}`.trim(),`미장 이벤트 종료. 알림도 잠잠.
${e||""}`.trim(),`시차의 스트레스가 사라졌다.
${e||""}`.trim(),`달러의 무게에서 벗어났다.
${e||""}`.trim(),`미장의 파도가 잠잠해졌다.
${e||""}`.trim(),`밤샘의 대가가 끝났다.
${e||""}`.trim(),`환율의 변동이 잠잠해졌다.
${e||""}`.trim(),`글로벌 투자의 무게에서 벗어났다.
${e||""}`.trim()],부동산:[`동네가 다시 평소 얼굴을 찾았다.
${e||""}`.trim(),`부동산 시장이 안정됐다.
${e||""}`.trim(),`동네 분위기가 평소로 돌아왔다.
${e||""}`.trim(),`부동산 투자의 변동성이 잠잠해졌다.
${e||""}`.trim(),`집의 무게에서 벗어났다.
${e||""}`.trim(),`부동산 시장의 파도가 잠잠해졌다.
${e||""}`.trim(),`부동산 투자의 리스크가 줄어들었다.
${e||""}`.trim(),`동네가 평소의 모습을 찾았다.
${e||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},N=["빌라","오피스텔","아파트","상가","빌딩"].includes(n)?"부동산":n,L=m(`marketEnd_${N}`,a[N]||a.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,L}if(r.startsWith("💡")){const n=y(r),e=window.__diaryLastMarketProduct||"",a=window.__diaryLastMarketName||"",l={코인:[`메모(코인): 멘탈 관리가 수익률이다.
${n}`,`코인 메모.
${a?`(${a})
`:""}${n}`.trim(),`코인 투자 노트: 변동성을 견뎌야 한다.
${n}`,`코인 기록: FOMO를 이겨내야 한다.
${n}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
${n}`,`코인 투자 기록: 위험을 감수하는 선택.
${n}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
${n}`,`국장 메모.
${a?`(${a})
`:""}${n}`.trim(),`국장 투자 노트: 차트의 파도를 타야 한다.
${n}`,`국장 기록: 변동성을 견뎌야 한다.
${n}`,`국장 메모: 투자자의 심장이 시험받는다.
${n}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
${n}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
${n}`,`미장 메모.
${a?`(${a})
`:""}${n}`.trim(),`미장 투자 노트: 밤샘의 대가를 치러야 한다.
${n}`,`미장 기록: 달러의 무게를 견뎌야 한다.
${n}`,`미장 메모: 시차의 스트레스를 견뎌야 한다.
${n}`,`미장 투자 기록: 글로벌 투자의 무게.
${n}`],예금:[`메모(예금): 조용히 이기는 쪽.
${n}`,`예금 투자 노트: 안정이 최고의 수익률.
${n}`,`예금 기록: 변동성 없는 투자의 편안함.
${n}`,`예금 메모: 안전함의 가치.
${n}`,`예금 투자 기록: 조용한 수익.
${n}`],적금:[`메모(적금): 루틴이 무기.
${n}`,`적금 투자 노트: 꾸준함이 무기다.
${n}`,`적금 기록: 매일의 습관이 미래를 만든다.
${n}`,`적금 메모: 시간이 내 편이 되는 투자.
${n}`,`적금 투자 기록: 인내심이 필요한 투자.
${n}`],부동산:[`메모(부동산): 공실은 악몽, 임차인은 복.
${n}`,`동네 메모.
${a?`(${a})
`:""}${n}`.trim(),`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
${n}`,`부동산 기록: 시장의 파도를 타야 한다.
${n}`,`부동산 메모: 부동산 투자의 리스크.
${n}`,`부동산 투자 기록: 동네 분위기의 변화.
${n}`],노동:[`메모(노동): 버티는 사람이 이긴다.
${n}`,`노동 노트: 일의 무게감을 견뎌야 한다.
${n}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
${n}`,`노동 메모: 일의 가치가 변동한다.
${n}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
${n}`]},L=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e;return L&&l[L]?m(`memo_${L}`,l[L]):m("memo",[`메모.
${n}`,`적어둔다.
${n}`,`까먹기 전에 기록.
${n}`,`투자 노트에 기록.
${n}`,`기억해둘 것.
${n}`,`나중을 위해 기록.
${n}`])}if(r.startsWith("🎁")&&r.includes("해금")){const n=y(r),e=((b=(T=r.match(/해금:\s*(.+)$/))==null?void 0:T[1])==null?void 0:b.trim())||"",l=(L=>{const t=String(L||"");return t.includes("예금")?"예금":t.includes("적금")?"적금":t.includes("미국주식")||t.includes("미장")||t.includes("🇺🇸")?"미국주식":t.includes("코인")||t.includes("₿")||t.includes("암호")?"코인":t.includes("주식")?"국내주식":t.includes("빌딩")?"빌딩":t.includes("상가")?"상가":t.includes("아파트")?"아파트":t.includes("오피스텔")?"오피스텔":t.includes("빌라")?"빌라":t.includes("월세")||t.includes("부동산")?"부동산":t.includes("클릭")||t.includes("노동")||t.includes("업무")||t.includes("CEO")||t.includes("커리어")?"노동":""})(`${e} ${n}`)||"기본",N={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
${e||n}`,`업무 스킬이 하나 늘었다.
${e||n}`,`손끝이 더 빨라질 준비.
${e||n}`,`일하는 방식이 개선될 것 같다.
${e||n}`,`업무 효율이 올라갈 것 같다.
${e||n}`,`노동의 질이 향상될 것 같다.
${e||n}`,`일하는 능력이 강화됐다.
${e||n}`,`업무 스킬의 진화.
${e||n}`],예금:[`예금이 더 조용히 벌어다 주겠지.
${e||n}`,`안정 쪽에 옵션이 하나 추가됐다.
${e||n}`,`예금의 수익률이 올라갈 것 같다.
${e||n}`,`안정적인 투자가 더 강해진다.
${e||n}`,`예금의 가치가 상승할 것 같다.
${e||n}`,`안전한 투자의 힘이 커진다.
${e||n}`,`예금의 편안함이 더해진다.
${e||n}`,`안정적인 투자의 진화.
${e||n}`],적금:[`루틴 강화 카드가 열렸다.
${e||n}`,`꾸준함을 돕는 장치가 생겼다.
${e||n}`,`적금의 루틴이 강화됐다.
${e||n}`,`꾸준함의 힘이 커진다.
${e||n}`,`매일의 습관이 더 강해진다.
${e||n}`,`적금의 시간 가치가 올라간다.
${e||n}`,`루틴 투자의 힘이 커진다.
${e||n}`,`꾸준함의 진화.
${e||n}`],국내주식:[`차트 싸움에 새 무기가 생겼다.
${e||n}`,`국장 대응력이 올라갈 것 같다.
${e||n}`,`국장 투자의 힘이 커진다.
${e||n}`,`차트의 파도를 더 잘 탈 수 있다.
${e||n}`,`국장의 변동성에 대응할 수 있다.
${e||n}`,`투자자의 능력이 강화됐다.
${e||n}`,`국장 투자의 진화.
${e||n}`,`차트 싸움의 무기가 강화됐다.
${e||n}`],미국주식:[`시차를 버틸 장비가 하나 생겼다.
${e||n}`,`달러 쪽 옵션이 열린다.
${e||n}`,`미장 투자의 힘이 커진다.
${e||n}`,`시차의 스트레스를 견딜 수 있다.
${e||n}`,`달러의 무게를 더 잘 견딜 수 있다.
${e||n}`,`글로벌 투자의 능력이 강화됐다.
${e||n}`,`미장 투자의 진화.
${e||n}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${e||n}`],코인:[`코인판에서 버틸 도구가 생겼다.
${e||n}`,`멘탈을 지키는 업그레이드…였으면.
${e||n}`,`코인 투자의 힘이 커진다.
${e||n}`,`변동성을 더 잘 견딜 수 있다.
${e||n}`,`FOMO를 더 잘 이겨낼 수 있다.
${e||n}`,`롤러코스터를 더 잘 탈 수 있다.
${e||n}`,`코인 투자의 진화.
${e||n}`,`멘탈 관리의 도구가 생겼다.
${e||n}`],빌라:[`빌라 운영이 조금은 편해질지도.
${e||n}`,`첫 집의 가치가 올라간다.
${e||n}`,`부동산 투자의 첫걸음이 강화됐다.
${e||n}`,`작은 집의 수익이 올라간다.
${e||n}`,`부동산 투자의 기초가 강화됐다.
${e||n}`,`첫 집의 무게감이 줄어든다.
${e||n}`,`부동산 투자의 진화.
${e||n}`,`작은 집의 가치가 상승한다.
${e||n}`],오피스텔:[`오피스텔 쪽이 한 단계 나아간다.
${e||n}`,`실용적인 투자가 강화됐다.
${e||n}`,`생활의 편의가 더해진다.
${e||n}`,`도시 생활의 질이 올라간다.
${e||n}`,`현실적인 투자의 힘이 커진다.
${e||n}`,`오피스텔의 가치가 상승한다.
${e||n}`,`실용주의 투자의 진화.
${e||n}`,`생활의 편의가 강화됐다.
${e||n}`],아파트:[`아파트는 디테일에서 돈이 난다.
${e||n}`,`한국인의 꿈이 더 가까워진다.
${e||n}`,`안정의 상징이 강화됐다.
${e||n}`,`부동산 투자의 정점이 올라간다.
${e||n}`,`아파트의 가치가 상승한다.
${e||n}`,`안정적인 투자의 힘이 커진다.
${e||n}`,`부동산 투자의 진화.
${e||n}`,`꿈이 현실에 더 가까워진다.
${e||n}`],상가:[`상가는 세팅이 반이다.
${e||n}`,`상권 투자의 힘이 커진다.
${e||n}`,`유동인구의 수익이 올라간다.
${e||n}`,`임대 수익의 달콤함이 커진다.
${e||n}`,`상가의 가치가 상승한다.
${e||n}`,`상권 투자의 진화.
${e||n}`,`임차인의 성공이 내 성공이 된다.
${e||n}`,`상권의 힘이 강화됐다.
${e||n}`],빌딩:[`빌딩은 관리가 곧 수익이다.
${e||n}`,`부동산 투자의 궁극이 강화됐다.
${e||n}`,`스카이라인의 주인이 강해진다.
${e||n}`,`도시의 한 조각이 더 가치있어진다.
${e||n}`,`빌딩의 무게감이 줄어든다.
${e||n}`,`부동산 투자의 완성이 올라간다.
${e||n}`,`스카이라인의 가치가 상승한다.
${e||n}`,`부동산 투자의 진화.
${e||n}`],부동산:[`부동산 운영에 옵션이 하나 추가됐다.
${e||n}`,`월세를 '조금 더' 만들 방법.
${e||n}`,`부동산 투자의 힘이 커진다.
${e||n}`,`집의 가치가 올라간다.
${e||n}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${e||n}`,`부동산 투자의 리스크가 줄어든다.
${e||n}`,`부동산 투자의 진화.
${e||n}`,`집의 무게감이 줄어든다.
${e||n}`],기본:[`새로운 방법이 보였다.
${e||n}`,`선택지가 늘었다.
${e||n}`,`이제부터가 시작일지도.
${e||n}`,`기회의 문이 열렸다.
${e||n}`,`새로운 가능성이 생겼다.
${e||n}`,`진화의 순간.
${e||n}`,`능력이 강화됐다.
${e||n}`,`다음 단계로 나아갈 수 있다.
${e||n}`]};return m(`upgradeUnlock_${l}`,N[l]||N.기본)}if(r.startsWith("✅")&&r.includes("구매!")){const n=y(r),e=r.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),a=((e==null?void 0:e[1])||"").trim(),l=((e==null?void 0:e[2])||"").trim(),L=(V=>{const k=String(V||"");return k.includes("예금")?"예금":k.includes("적금")?"적금":k.includes("미국주식")||k.includes("미장")||k.includes("🇺🇸")?"미국주식":k.includes("코인")||k.includes("₿")||k.includes("암호")?"코인":k.includes("주식")?"국내주식":k.includes("빌딩")?"빌딩":k.includes("상가")?"상가":k.includes("아파트")?"아파트":k.includes("오피스텔")?"오피스텔":k.includes("빌라")?"빌라":k.includes("월세")||k.includes("부동산")?"부동산":k.includes("클릭")||k.includes("노동")||k.includes("업무")||k.includes("CEO")||k.includes("커리어")?"노동":""})(`${a} ${l} ${n}`)||"기본",t=[a,l].filter(Boolean).join(" — ")||n,H={노동:[`일하는 방식이 바뀌었다.
${t}`,`업무 스킬을 장착했다.
${t}`,`손이 더 빨라질 거다. 아마도.
${t}`,`일하는 능력이 강화됐다.
${t}`,`업무 효율이 올라갔다.
${t}`,`노동의 질이 향상됐다.
${t}`,`일하는 방식의 진화.
${t}`,`업무 스킬의 강화.
${t}`],예금:[`예금은 조용히 강해진다.
${t}`,`안정 쪽을 더 단단히 했다.
${t}`,`예금의 수익률이 올라갔다.
${t}`,`안정적인 투자가 강화됐다.
${t}`,`예금의 가치가 상승했다.
${t}`,`안전한 투자의 힘이 커졌다.
${t}`,`예금의 편안함이 더해졌다.
${t}`,`안정적인 투자의 진화.
${t}`],적금:[`루틴을 업그레이드했다.
${t}`,`꾸준함에 부스터 하나.
${t}`,`적금의 루틴이 강화됐다.
${t}`,`꾸준함의 힘이 커졌다.
${t}`,`매일의 습관이 더 강해졌다.
${t}`,`적금의 시간 가치가 올라갔다.
${t}`,`루틴 투자의 힘이 커졌다.
${t}`,`꾸준함의 진화.
${t}`],국내주식:[`차트 싸움에 장비를 추가했다.
${t}`,`국장 대응력 상승.
${t}`,`국장 투자의 힘이 커졌다.
${t}`,`차트의 파도를 더 잘 탈 수 있다.
${t}`,`국장의 변동성에 대응할 수 있다.
${t}`,`투자자의 능력이 강화됐다.
${t}`,`국장 투자의 진화.
${t}`,`차트 싸움의 무기가 강화됐다.
${t}`],미국주식:[`시차를 버틸 장비 장착.
${t}`,`달러 쪽을 조금 더 믿어보기로.
${t}`,`미장 투자의 힘이 커졌다.
${t}`,`시차의 스트레스를 견딜 수 있다.
${t}`,`달러의 무게를 더 잘 견딜 수 있다.
${t}`,`글로벌 투자의 능력이 강화됐다.
${t}`,`미장 투자의 진화.
${t}`,`밤샘의 대가를 더 잘 견딜 수 있다.
${t}`],코인:[`코인판에서 살아남을 장비.
${t}`,`멘탈 보호 장치…였으면.
${t}`,`코인 투자의 힘이 커졌다.
${t}`,`변동성을 더 잘 견딜 수 있다.
${t}`,`FOMO를 더 잘 이겨낼 수 있다.
${t}`,`롤러코스터를 더 잘 탈 수 있다.
${t}`,`코인 투자의 진화.
${t}`,`멘탈 관리의 도구가 생겼다.
${t}`],빌라:[`빌라 운영을 손봤다.
${t}`,`첫 집의 가치가 올라갔다.
${t}`,`부동산 투자의 첫걸음이 강화됐다.
${t}`,`작은 집의 수익이 올라갔다.
${t}`,`부동산 투자의 기초가 강화됐다.
${t}`,`첫 집의 무게감이 줄어들었다.
${t}`,`부동산 투자의 진화.
${t}`,`작은 집의 가치가 상승했다.
${t}`],오피스텔:[`오피스텔 쪽을 업그레이드했다.
${t}`,`실용적인 투자가 강화됐다.
${t}`,`생활의 편의가 더해졌다.
${t}`,`도시 생활의 질이 올라갔다.
${t}`,`현실적인 투자의 힘이 커졌다.
${t}`,`오피스텔의 가치가 상승했다.
${t}`,`실용주의 투자의 진화.
${t}`,`생활의 편의가 강화됐다.
${t}`],아파트:[`아파트는 디테일.
${t}`,`한국인의 꿈이 더 가까워졌다.
${t}`,`안정의 상징이 강화됐다.
${t}`,`부동산 투자의 정점이 올라갔다.
${t}`,`아파트의 가치가 상승했다.
${t}`,`안정적인 투자의 힘이 커졌다.
${t}`,`부동산 투자의 진화.
${t}`,`꿈이 현실에 더 가까워졌다.
${t}`],상가:[`상가는 세팅이 반이다.
${t}`,`상권 투자의 힘이 커졌다.
${t}`,`유동인구의 수익이 올라갔다.
${t}`,`임대 수익의 달콤함이 커졌다.
${t}`,`상가의 가치가 상승했다.
${t}`,`상권 투자의 진화.
${t}`,`임차인의 성공이 내 성공이 된다.
${t}`,`상권의 힘이 강화됐다.
${t}`],빌딩:[`빌딩은 관리가 수익이다.
${t}`,`부동산 투자의 궁극이 강화됐다.
${t}`,`스카이라인의 주인이 강해졌다.
${t}`,`도시의 한 조각이 더 가치있어졌다.
${t}`,`빌딩의 무게감이 줄어들었다.
${t}`,`부동산 투자의 완성이 올라갔다.
${t}`,`스카이라인의 가치가 상승했다.
${t}`,`부동산 투자의 진화.
${t}`],부동산:[`월세 쪽을 손봤다.
${t}`,`부동산 운영이 한 단계 올라갔다.
${t}`,`부동산 투자의 힘이 커졌다.
${t}`,`집의 가치가 올라갔다.
${t}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
${t}`,`부동산 투자의 리스크가 줄어들었다.
${t}`,`부동산 투자의 진화.
${t}`,`집의 무게감이 줄어들었다.
${t}`],기본:[`필요한 걸 갖췄다.
${n}`,`업그레이드 완료. 조금은 편해지겠지.
${n}`,`나 자신에게 투자.
${n}`,`능력이 강화됐다.
${n}`,`진화의 순간.
${n}`,`기회를 잡았다.
${n}`,`다음 단계로 나아갔다.
${n}`,`투자의 힘이 커졌다.
${n}`]};return m(`upgradeBuy_${L}`,H[L]||H.기본)}if(r.startsWith("⚠️")){const n=y(r);return m("warn",[`찜찜한 기분이 남았다.
${n}`,`뭔가 삐끗한 느낌.
${n}`,`일단 기록만 남긴다.
${n}`,`뭔가 이상한 느낌.
${n}`,`불안한 기분이 든다.
${n}`,`주의가 필요할 것 같다.
${n}`,`뭔가 잘못된 것 같다.
${n}`,`경고의 신호가 느껴진다.
${n}`])}const v=y(r);return m("default",[v,`${h("diary.justWrite")}
${v}`,`${h("diary.todayRecord")}
${v}`,`${h("diary.anyway")} ${v}`,`${h("diary.justRecord")}
${v}`,`${h("diary.memo")}
${v}`,`${h("diary.remember")}
${v}`,`${h("diary.recordForLater")}
${v}`,`${h("diary.goodToWrite")}
${v}`,`${h("diary.leaveRecord")}
${v}`])}x();const U=R(c);if(!U)return;const C=document.createElement("p"),d=U.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),E=(d[0]??"").trim(),K=d.slice(1).map(s=>String(s).trim()).filter(Boolean),p=`<span class="diary-voice">${E}</span>`+(K.length?`
<span class="diary-info">${K.join(`
`)}</span>`:"");if(C.innerHTML=`<span class="diary-time">${P}</span>${p}`,!z){console.error("[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.");return}z.prepend(C)}const hn=Object.freeze(Object.defineProperty({__proto__:null,addLog:j,initDiary:dn},Symbol.toStringTag,{value:"Module"}));var Z,nn;const D=!!((nn=(Z=import.meta)==null?void 0:Z.env)!=null&&nn.DEV);function vn(c){const{UPGRADES:$,getCash:S,setCash:o,CAREER_LEVELS:i}=c;function P(){const C=S();document.querySelectorAll(".upgrade-item").forEach(d=>{const E=d.dataset.upgradeId,K=$[E];K&&!K.purchased&&(C>=K.cost?d.classList.add("affordable"):d.classList.remove("affordable"))})}function x(C){document.querySelectorAll(".upgrade-progress").forEach(d=>{const E=d.closest(".upgrade-item");!E||!E.dataset.upgradeId||(Object.entries($).filter(([p,s])=>s.category==="labor"&&!s.unlocked&&!s.purchased).map(([p,s])=>{var M;const r=s.unlockCondition.toString(),g=r.match(/totalClicks\s*>=\s*(\d+)/);if(g)return{id:p,requiredClicks:parseInt(g[1]),upgrade:s};const f=r.match(/careerLevel\s*>=\s*(\d+)/);return f?{id:p,requiredClicks:((M=i[parseInt(f[1])])==null?void 0:M.requiredClicks)||1/0,upgrade:s}:null}).filter(p=>p!==null).sort((p,s)=>p.requiredClicks-s.requiredClicks),d.textContent="")})}function R(){const C=S(),w=document.getElementById("upgradeList"),d=document.getElementById("upgradeCount");if(!w||!d)return;const E=Object.entries($).filter(([s,r])=>r.unlocked&&!r.purchased);E.length===0?d.style.display="none":(d.style.display="",d.textContent=`(${E.length})`);const K=document.getElementById("noUpgradesMessage"),p=document.querySelector('.stats-section[data-section-id="upgrades"]');if(E.length===0){if(w.innerHTML="",K&&(K.textContent=h("ui.noUpgrades"),K.style.display="block"),p&&!p.classList.contains("collapsed")){p.classList.add("collapsed");const s=p.querySelector(".stats-toggle");s&&s.setAttribute("aria-expanded","false")}return}K&&(K.style.display="none"),w.innerHTML="",D&&console.log(`🔄 Regenerating upgrade list with ${E.length} items`),E.forEach(([s,r])=>{const g=document.createElement("div");g.className="upgrade-item",g.dataset.upgradeId=s,C>=r.cost&&g.classList.add("affordable");const f=document.createElement("div");f.className="upgrade-icon",f.textContent=r.icon;const M=document.createElement("div");M.className="upgrade-info";const m=document.createElement("div");m.className="upgrade-name",m.textContent=h(`upgrade.${s}.name`,{},r.name);const y=document.createElement("div");y.className="upgrade-desc",y.textContent=h(`upgrade.${s}.desc`,{},r.desc);const q=J(r.cost);if(r.category==="labor"&&r.unlockCondition)try{const v=document.createElement("div");v.className="upgrade-progress",v.style.fontSize="11px",v.style.color="var(--muted)",v.style.marginTop="4px";const B=Object.entries($).filter(([u,_])=>_.category==="labor"&&!_.unlocked&&!_.purchased).map(([u,_])=>{const A=_.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return A?{id:u,requiredClicks:parseInt(A[1]),upgrade:_}:null}).filter(u=>u!==null).sort((u,_)=>u.requiredClicks-_.requiredClicks)}catch{}M.appendChild(m),M.appendChild(y);const I=document.createElement("div");I.className="upgrade-status",I.textContent=q,I.style.animation="none",I.style.background="rgba(94, 234, 212, 0.12)",I.style.color="var(--accent)",I.style.border="1px solid rgba(94, 234, 212, 0.25)",I.style.borderRadius="999px",g.appendChild(f),g.appendChild(M),g.appendChild(I),g.addEventListener("click",v=>{v.stopPropagation(),D&&console.log("🖱️ Upgrade item clicked!",s),U(s)},!1),D&&g.addEventListener("mousedown",v=>{console.log("🖱️ Mousedown detected on upgrade:",s)}),w.appendChild(g),D&&console.log(`✅ Upgrade item created and appended: ${s}`,g)})}function U(C){D&&(console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",C));const w=S();D&&console.log("Current cash:",w);const d=$[C];if(!d){console.error("업그레이드를 찾을 수 없습니다:",C),D&&console.log("Available upgrade IDs:",Object.keys($));return}if(D&&console.log("Upgrade found:",{name:d.name,cost:d.cost,unlocked:d.unlocked,purchased:d.purchased}),d.purchased){j(h("msg.upgradeAlreadyPurchased")),D&&console.log("Already purchased");return}if(w<d.cost){j(h("msg.upgradeInsufficientFunds",{cost:J(d.cost)})),D&&console.log("Not enough cash. Need:",d.cost,"Have:",w);return}D&&console.log("Purchase successful! Applying effect..."),o(w-d.cost),d.purchased=!0;try{d.effect(),j(h("msg.upgradePurchased",{name:h(`upgrade.${C}.name`,{},d.name),desc:h(`upgrade.${C}.desc`,{},d.desc)})),D&&console.log("Effect applied successfully")}catch(E){console.error(`업그레이드 효과 적용 실패 (${C}):`,E),j(h("msg.upgradeEffectError"))}R(),P(),$n($)}return{updateUpgradeAffordability:P,updateUpgradeProgress:x,updateUpgradeList:R,purchaseUpgrade:U}}const X=3e4,Q="clicksurvivor_lastNicknameChangeAt";function bn(c){const{SAVE_KEY:$,CLOUD_RESTORE_BLOCK_KEY:S,Modal:o,t:i,validateNickname:P,normalizeNickname:x,claimNickname:R,getUser:U,saveGame:C,updateUI:w,Diary:d,LeaderboardUI:E,upsertCloudSave:K,getPlayerNickname:p,setPlayerNickname:s,__IS_DEV__:r}=c;let g=!1,f=0;const M=5;function m(){try{const u=localStorage.getItem($);return u&&JSON.parse(u).nickname||""}catch(u){return console.error("닉네임 확인 실패:",u),""}}function y(){if(g){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const u=m();if(u){s(u);return}g=!0;try{sessionStorage.setItem(S,"1")}catch(_){console.warn("sessionStorage set 실패:",_)}setTimeout(()=>{const _=async O=>{const A=P(O);if(!A.ok){let n="";switch(A.reasonKey){case"empty":n=i("settings.nickname.change.empty");break;case"tooShort":n=i("settings.nickname.change.tooShort");break;case"tooLong":n=i("settings.nickname.change.tooLong");break;case"invalid":n=i("settings.nickname.change.invalid");break;case"banned":n=i("settings.nickname.change.banned");break;default:n=i("settings.nickname.change.invalid")}if(o.openInfoModal(i("modal.error.nicknameFormat.title"),n,"⚠️"),g=!1,f++,f>=M){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),f=0;return}y();return}const{raw:F,key:T}=x(O),b=await U();if(!b){s(F),f=0,C(),d.addLog(i("msg.nicknameSet",{nickname:p()})),d.addLog(i("settings.nickname.change.loginRequired"));try{sessionStorage.removeItem(S)}catch(n){console.warn("sessionStorage remove 실패:",n)}return}try{const n=await R(F,b.id);if(!n.success){if(n.error==="taken"?o.openInfoModal(i("modal.error.nicknameTaken.title"),i("settings.nickname.change.taken"),"⚠️"):o.openInfoModal(i("modal.error.nicknameFormat.title"),i("settings.nickname.change.claimFailed"),"⚠️"),g=!1,f++,f>=M){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),f=0;return}y();return}f=0,s(F),C(),d.addLog(i("msg.nicknameSet",{nickname:p()}));try{localStorage.removeItem("clicksurvivor_needsNicknameChange")}catch{}try{await E.updateLeaderboardEntry(!0)}catch(e){console.error("리더보드 업데이트 실패:",e)}try{sessionStorage.removeItem(S)}catch(e){console.warn("sessionStorage remove 실패:",e)}}catch(n){if(console.error("닉네임 설정 실패:",n),o.openInfoModal(i("modal.error.nicknameFormat.title"),i("settings.nickname.change.claimFailed"),"⚠️"),g=!1,f++,f>=M){r&&console.warn("[Nickname] 최대 재시도 횟수 초과 (에러), 모달 중단"),f=0;return}y()}};o.openInputModal(i("modal.nickname.title"),i("modal.nickname.message"),_,{icon:"✏️",primaryLabel:i("button.confirm"),placeholder:i("modal.nickname.placeholder"),maxLength:6,defaultValue:"",required:!0})},500)}function q(){try{const u=localStorage.getItem(Q);if(!u)return{allowed:!0};const _=parseInt(u,10),A=Date.now()-_;return A>=X?{allowed:!0}:{allowed:!1,remainingSeconds:Math.ceil((X-A)/1e3)}}catch{return{allowed:!0}}}function I(){try{localStorage.setItem(Q,String(Date.now()))}catch(u){console.warn("쿨타임 저장 실패:",u)}}function v(){const u=q();if(!u.allowed){o.openInfoModal(i("modal.error.nicknameLength.title"),i("settings.nickname.change.cooldown",{seconds:u.remainingSeconds||0}),"⏱️");return}const _=p()||"";o.openInputModal(i("settings.nickname.modal.title"),i("settings.nickname.modal.message"),B,{icon:"✏️",primaryLabel:i("settings.nickname.modal.submit"),secondaryLabel:i("settings.nickname.modal.cancel"),placeholder:i("settings.nickname.modal.placeholder"),maxLength:6,defaultValue:_,required:!0})}async function B(u){const _=P(u);if(!_.ok){let b="";switch(_.reasonKey){case"empty":b=i("settings.nickname.change.empty");break;case"tooShort":b=i("settings.nickname.change.tooShort");break;case"tooLong":b=i("settings.nickname.change.tooLong");break;case"invalid":b=i("settings.nickname.change.invalid");break;case"banned":b=i("settings.nickname.change.banned");break;default:b=i("settings.nickname.change.invalid")}o.openInfoModal(i("modal.error.nicknameFormat.title"),b,"⚠️");return}const{raw:O,key:A}=x(u),F=x(p()||"");if(A===F.key){r&&console.log("[Nickname] 변경 없음: 동일한 닉네임");return}const T=await U();if(!T){const b=p();s(O),C(),w(),d.addLog(i("settings.nickname.change.success")),d.addLog(i("settings.nickname.change.loginRequired")),r&&console.log(`[Nickname] 로컬 저장 완료 (비로그인): "${b}" → "${p()}"`);return}try{const b=await R(O,T.id);if(!b.success){b.error==="taken"?(o.openInfoModal(i("modal.error.nicknameTaken.title"),i("settings.nickname.change.taken"),"⚠️"),setTimeout(()=>{v()},500)):o.openInfoModal(i("modal.error.nicknameLength.title"),i("settings.nickname.change.claimFailed"),"⚠️");return}const n=p();s(O),C();try{const e=JSON.parse(localStorage.getItem($)||"{}");await K("seoulsurvival",e),r&&console.log("[Nickname] 클라우드 저장 완료")}catch(e){console.error("클라우드 저장 실패:",e)}try{await E.updateLeaderboardEntry(!0)}catch(e){console.error("리더보드 업데이트 실패:",e)}try{localStorage.removeItem("clicksurvivor_needsNicknameChange"),sessionStorage.removeItem("clicksurvivor_nicknameModalAutoOpened")}catch{}I(),w(),d.addLog(i("settings.nickname.change.success")),r&&console.log(`[Nickname] 변경 완료: "${n}" → "${p()}"`)}catch(b){console.error("닉네임 변경 실패:",b),o.openInfoModal(i("modal.error.nicknameLength.title"),i("settings.nickname.change.claimFailed"),"⚠️")}}return{ensureNicknameModal:y,openNicknameChangeModal:v,handleNicknameChangeFromModal:B,checkNicknameCooldown:q,saveNicknameCooldown:I}}export{hn as D,fn as a,gn as b,j as c,yn as d,bn as e,vn as f,kn as g,_n as h,dn as i};
