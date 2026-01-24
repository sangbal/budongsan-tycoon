import{t as C,g as Z}from"./seoulsurvival-i18n-BhWfeawF.js";import{f as ee,a as ne}from"./seoulsurvival-utils-1Bz_Jm-C.js";import{g as l,r as Ae,C as z,a as X,b as oe,c as te,d as re}from"./seoulsurvival-core-FFZkuy0c.js";import{s as Le,c as Me}from"./seoulsurvival-ui-BR2t6Hg3.js";const he=[{id:"real_estate_mogul",nameKey:"synergy.realEstateMogul.name",descKey:"synergy.realEstateMogul.desc",icon:"🏢",check:n=>n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"property_income",multiplier:1.3},{id:"finance_guru",nameKey:"synergy.financeGuru.name",descKey:"synergy.financeGuru.desc",icon:"💰",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0,effect:"financial_income",multiplier:1.25},{id:"diversification",nameKey:"synergy.diversification.name",descKey:"synergy.diversification.desc",icon:"📊",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0&&n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"all_income",multiplier:1.15},{id:"seoul_ruler",nameKey:"synergy.seoulRuler.name",descKey:"synergy.seoulRuler.desc",icon:"🗼",check:n=>n.buildings>=5,effect:"all_income",multiplier:1.5},{id:"completionist",nameKey:"synergy.completionist.name",descKey:"synergy.completionist.desc",icon:"🏆",check:n=>n.__completionistUnlocked||!1,effect:"all_income",multiplier:2}];function Re(n=l){return he.filter(e=>e.check(n))}function Ee(n,e){const s=Re(n);let a=1;for(const o of s)(o.effect===e||o.effect==="all_income")&&(a*=o.multiplier);return a}function rn(n,e=l){return n*Ee(e,"property_income")}function an(n,e=l){return n*Ee(e,"financial_income")}function Ne(n){const e=Object.values(n).every(s=>s.purchased);l.__completionistUnlocked=e}function cn(n=l){return he.map(e=>({id:e.id,nameKey:e.nameKey,descKey:e.descKey,icon:e.icon,active:e.check(n),multiplier:e.multiplier,effect:e.effect}))}function Pe(n,e){if(n<=0)return 0;const s=n>=1?5:0,a=Math.floor(Math.sqrt(n)*2),o=e>1e12?Math.log10(e/1e12):0;return Math.max(1,Math.floor(a*(1+o)))+s}function ve(){let n=0;for(const e of l.purchasedUpgrades||[]){const s=W.find(a=>a.id===e);s&&(n+=s.cost)}return n}function sn(){const n=l.careerPoints||0,e=ve();return 1+(n+e)*.02}function dn(){const n=l.careerPoints||0,e=ve();return n+e}const W=[{id:"A1_mentor",category:"A",nameKey:"cp.A1.name",descKey:"cp.A1.desc",cost:1,icon:"👨‍🏫",requires:[],effect:{type:"click_multiplier",value:1.2}},{id:"A2_network",category:"A",nameKey:"cp.A2.name",descKey:"cp.A2.desc",cost:2,icon:"🌐",requires:["A1_mentor"],effect:{type:"auto_income_multiplier",value:1.25}},{id:"A3_recognition",category:"A",nameKey:"cp.A3.name",descKey:"cp.A3.desc",cost:3,icon:"🏆",requires:["A2_network"],effect:{type:"starting_cash",value:1e7}},{id:"A4_reputation",category:"A",nameKey:"cp.A4.name",descKey:"cp.A4.desc",cost:5,icon:"⭐",requires:["A3_recognition"],effect:{type:"price_discount",value:.1}},{id:"B1_broker",category:"B",nameKey:"cp.B1.name",descKey:"cp.B1.desc",cost:3,icon:"📊",requires:[],effect:{type:"financial_income_multiplier",value:1.3}},{id:"B2_fund_manager",category:"B",nameKey:"cp.B2.name",descKey:"cp.B2.desc",cost:5,icon:"💼",requires:["B1_broker"],effect:{type:"financial_price_discount",value:.25}},{id:"B3_hedge_fund",category:"B",nameKey:"cp.B3.name",descKey:"cp.B3.desc",cost:8,icon:"🦈",requires:["B2_fund_manager"],effect:{type:"financial_to_property_synergy",value:1.15}},{id:"C1_realtor",category:"C",nameKey:"cp.C1.name",descKey:"cp.C1.desc",cost:3,icon:"🏠",requires:[],effect:{type:"property_income_multiplier",value:1.3}},{id:"C2_builder",category:"C",nameKey:"cp.C2.name",descKey:"cp.C2.desc",cost:5,icon:"🏗️",requires:["C1_realtor"],effect:{type:"property_price_discount",value:.25}},{id:"C3_redeveloper",category:"C",nameKey:"cp.C3.name",descKey:"cp.C3.desc",cost:8,icon:"🌆",requires:["C2_builder"],effect:{type:"property_to_financial_synergy",value:1.15}},{id:"D1_workaholic",category:"D",nameKey:"cp.D1.name",descKey:"cp.D1.desc",cost:3,icon:"💪",requires:[],effect:{type:"click_income_multiplier",value:1.5}},{id:"D2_automation",category:"D",nameKey:"cp.D2.name",descKey:"cp.D2.desc",cost:5,icon:"🤖",requires:["D1_workaholic"],effect:{type:"auto_click_speed",value:2}},{id:"D3_ceo_mentality",category:"D",nameKey:"cp.D3.name",descKey:"cp.D3.desc",cost:8,icon:"👔",requires:["D2_automation"],effect:{type:"click_bonus_chance",value:.05}},{id:"E1_parents",category:"E",nameKey:"cp.E1.name",descKey:"cp.E1.desc",cost:2,icon:"👨‍👩‍👧",requires:[],effect:{type:"starting_deposits",value:5}},{id:"E2_connections",category:"E",nameKey:"cp.E2.name",descKey:"cp.E2.desc",cost:5,icon:"🤝",requires:["E1_parents"],effect:{type:"starting_career",value:1}},{id:"E3_silver_spoon",category:"E",nameKey:"cp.E3.name",descKey:"cp.E3.desc",cost:10,icon:"🥄",requires:["E2_connections"],effect:{type:"starting_bundle",value:{villa:1,career:2}}},{id:"F1_preserve_1",category:"F",nameKey:"cp.F1.name",descKey:"cp.F1.desc",cost:6,icon:"🔒",requires:[],effect:{type:"permanent_slot",value:1}},{id:"F2_preserve_2",category:"F",nameKey:"cp.F2.name",descKey:"cp.F2.desc",cost:15,icon:"🔐",requires:["F1_preserve_1"],effect:{type:"permanent_slot",value:2}},{id:"G1_prediction",category:"G",nameKey:"cp.G1.name",descKey:"cp.G1.desc",cost:7,icon:"🔮",requires:[],effect:{type:"market_event_bonus",value:1.5}},{id:"G2_insider",category:"G",nameKey:"cp.G2.name",descKey:"cp.G2.desc",cost:12,icon:"👁️",requires:["G1_prediction"],effect:{type:"market_event_preview",value:!0}}],we={A:{nameKey:"cp.category.A",icon:"📈",color:"#4ade80"},B:{nameKey:"cp.category.B",icon:"💰",color:"#60a5fa"},C:{nameKey:"cp.category.C",icon:"🏢",color:"#f97316"},D:{nameKey:"cp.category.D",icon:"👆",color:"#a78bfa"},E:{nameKey:"cp.category.E",icon:"🚀",color:"#fbbf24"},F:{nameKey:"cp.category.F",icon:"🔒",color:"#6b7280"},G:{nameKey:"cp.category.G",icon:"🎮",color:"#ec4899"}};function Te(n){const e=W.find(a=>a.id===n);if(!e)return{canPurchase:!1,reason:"invalid_upgrade"};const s=l.purchasedUpgrades||[];if(s.includes(n))return{canPurchase:!1,reason:"already_purchased"};if(l.careerPoints<e.cost)return{canPurchase:!1,reason:"not_enough_cp"};for(const a of e.requires)if(!s.includes(a))return{canPurchase:!1,reason:"requires_not_met",missing:a};return{canPurchase:!0,reason:null}}function ln(n){const{canPurchase:e}=Te(n);if(!e)return!1;const s=W.find(a=>a.id===n);return l.careerPoints-=s.cost,l.purchasedUpgrades||(l.purchasedUpgrades=[]),l.purchasedUpgrades.push(n),!0}function J(){const n={click_multiplier:1,auto_income_multiplier:1,click_income_multiplier:1,financial_income_multiplier:1,property_income_multiplier:1,financial_to_property_synergy:1,property_to_financial_synergy:1,auto_click_speed:1,market_event_bonus:1,price_discount:0,financial_price_discount:0,property_price_discount:0,starting_cash:0,starting_deposits:0,starting_career:0,starting_bundle:null,click_bonus_chance:0,permanent_slot:0,market_event_preview:!1};for(const e of l.purchasedUpgrades||[]){const s=W.find(b=>b.id===e);if(!s)continue;const{type:a,value:o}=s.effect;a.includes("multiplier")||a.includes("synergy")||a==="auto_click_speed"||a==="market_event_bonus"?n[a]=(n[a]||1)*o:a.includes("discount")?n[a]=Math.min(.5,(n[a]||0)+o):a==="permanent_slot"?n[a]=Math.max(n[a]||0,o):a==="market_event_preview"||a==="starting_bundle"?n[a]=o:n[a]=(n[a]||0)+(typeof o=="number"?o:0)}return n}function De(){const n=J(),e={cash:0,deposits:0,career:0,villa:0};return n.starting_cash>0&&(l.cash+=n.starting_cash,e.cash=n.starting_cash),n.starting_deposits>0&&(l.deposits+=n.starting_deposits,e.deposits=n.starting_deposits),n.starting_career>0&&(l.careerLevel=Math.max(l.careerLevel,n.starting_career),e.career=n.starting_career),n.starting_bundle&&(n.starting_bundle.villa&&(l.villas+=n.starting_bundle.villa,l.unlockedProducts.villa=!0,e.villa=n.starting_bundle.villa),n.starting_bundle.career&&(l.careerLevel=Math.max(l.careerLevel,n.starting_bundle.career),e.career=Math.max(e.career,n.starting_bundle.career))),e}function yn(n,e){const a=J().permanent_slot;if(e>=a||!(l.purchasedUpgrades||[]).includes(n))return!1;const o=W.find(S=>S.id===n);if((o==null?void 0:o.category)==="F")return!1;l.permanentSlots||(l.permanentSlots=[]);const b=l.permanentSlots.indexOf(n);return b!==-1&&(l.permanentSlots[b]=null),l.permanentSlots[e]=n,!0}function mn(n){l.permanentSlots&&l.permanentSlots[n]&&(l.permanentSlots[n]=null)}function Oe(){const e=J().permanent_slot,s=[],a=l.purchasedUpgrades||[];if(l.permanentSlots)for(let o=0;o<e;o++){const b=l.permanentSlots[o];b&&a.includes(b)&&s.push(b)}for(const o of a){const b=W.find(S=>S.id===o);(b==null?void 0:b.category)==="F"&&!s.includes(o)&&s.push(o)}l.purchasedUpgrades=s}function Ue(){const n=Pe(l.towers_lifetime,l.lifetimeEarnings);return l.careerPoints+=n,l.totalCareerPoints+=n,Oe(),n}function un(){const n={};for(const e of Object.keys(we))n[e]=W.filter(s=>s.category===e);return n}function bn(n){const e=J(),a={click_power:"click_multiplier",auto_income:"auto_income_multiplier",all_income:"auto_income_multiplier",price_reduction:null}[n]||n;return a===null?1-(e.price_discount||0):e[a]||1}const Ke=["오늘은 체크 하나를 더했다. ({name})","작게나마 성취. {name}라니, 나도 꽤 한다.",`기록해둔다: {name}.
{desc}`,`"{name}" 달성.
{descMemo}`,"별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. ({name})",`또 하나의 마일스톤. {name}.
{desc}`,`작은 성취도 성취다. {name}.
{desc}`,`하루하루가 쌓인다. 오늘은 {name}.
{desc}`,`기록에 하나 더. {name}.
{desc}`,`뿌듯함이 조금씩. {name} 달성.
{desc}`,`이런 게 인생이지. {name}.
{desc}`,`작은 발걸음이 모여 길이 된다. {name}.
{desc}`],xe=[`명함이 바뀌었다. {career}.
{extra}`,`오늘은 좀 뿌듯하다. {career}이라니.
{extra}`,`승진했다. 책임도 같이 딸려온다는데… 일단 축하부터.
{extra}`,`그래, 나도 올라갈 줄 안다. {career}.
{extra}`,`커피가 조금 더 쓰게 느껴진다. {career}의 맛.
{extra}`,`한 단계 올라섰다. {career}.
{extra}`,`노력이 보상받는 순간. {career}.
{extra}`,`새로운 시작. {career}.
{extra}`,`더 높은 곳에서 보는 풍경이 다르다. {career}.
{extra}`,`자리도 바뀌고 마음도 바뀐다. {career}.
{extra}`,`이제야 진짜 시작인가. {career}.
{extra}`,`무게감이 느껴진다. {career}의 무게.
{extra}`],ae={적금:[`자동이체 버튼이 눈에 들어왔다.
{body}`,`천천히 쌓는 쪽으로 방향을 틀었다.
{body}`,`오늘은 '루틴'이 열렸다.
{body}`,`꾸준함의 길이 열렸다.
{body}`,`작은 투자의 문이 열렸다.
{body}`,`시간이 내 편이 되는 선택지.
{body}`,`루틴 투자의 시작.
{body}`,`매일의 습관이 가능해졌다.
{body}`,`인내심의 투자가 열렸다.
{body}`,`작은 것들이 모이는 길.
{body}`],국내주식:[`이제 차트랑 뉴스랑 싸울 차례다.
{body}`,`심장이 약하면 못 할 선택지… 열렸다.
{body}`,`변동성의 문이 열렸다.
{body}`,`국장의 세계로 입문.
{body}`,`차트의 파도를 탈 수 있다.
{body}`,`투자자의 길이 열렸다.
{body}`,`변동성에 도전할 수 있다.
{body}`,`국장의 심장박동을 느낄 수 있다.
{body}`,`위험과 기회의 문.
{body}`,`국장 투자의 시작.
{body}`],미국주식:[`시차를 버티는 돈이 열렸다.
{body}`,`달러 냄새가 난다.
{body}`,`밤샘의 선택지… 드디어.
{body}`,`글로벌 투자의 문이 열렸다.
{body}`,`세계 시장에 발을 담글 수 있다.
{body}`,`미장의 파도를 탈 수 있다.
{body}`,`달러의 무게를 느낄 수 있다.
{body}`,`시차의 스트레스를 견딜 수 있다.
{body}`,`환율의 변동을 경험할 수 있다.
{body}`,`미장 투자의 시작.
{body}`],코인:[`롤러코스터 입장권이 생겼다.
{body}`,`FOMO가 문을 두드린다.
{body}`,`폭등/폭락의 세계가 열렸다.
{body}`,`변동성의 극치를 경험할 수 있다.
{body}`,`멘탈이 시험받는 투자.
{body}`,`코인판의 무게를 견딜 수 있다.
{body}`,`FOMO와 공포 사이의 선택.
{body}`,`디지털 자산의 세계.
{body}`,`심장이 먼저 반응하는 투자.
{body}`,`롤러코스터의 정점에 설 수 있다.
{body}`],빌라:[`첫 '집'이라는 단어가 현실이 됐다.
{body}`,`작아도 내 편이 하나 생긴 기분.
{body}`,`부동산 투자의 첫걸음.
{body}`,`집이라는 단어가 현실이 됐다.
{body}`,`내 공간을 가질 수 있다.
{body}`,`작은 집도 집이다.
{body}`,`부동산의 세계로 입문.
{body}`,`첫 집의 무게감을 느낄 수 있다.
{body}`,`내 이름으로 등기할 수 있다.
{body}`,`부동산 투자의 시작.
{body}`],오피스텔:[`출근 동선이 머리에 그려졌다.
{body}`,`현실적인 선택지가 열렸다.
{body}`,`실용적인 투자가 가능해졌다.
{body}`,`생활의 편의를 살 수 있다.
{body}`,`도시 생활의 현실을 경험할 수 있다.
{body}`,`작은 공간, 큰 만족의 선택.
{body}`,`실용주의의 투자.
{body}`,`생활의 질을 올릴 수 있다.
{body}`,`현실적인 부동산 투자.
{body}`,`도시 생활의 편의를 살 수 있다.
{body}`],아파트:[`꿈이 조금 현실 쪽으로 다가왔다.
{body}`,`안정의 상징이 열렸다.
{body}`,`한국인의 꿈을 살 수 있다.
{body}`,`부동산 투자의 정점.
{body}`,`아파트의 무게감을 느낄 수 있다.
{body}`,`꿈이 현실이 되는 순간.
{body}`,`안정적인 투자가 가능해졌다.
{body}`,`부동산의 대표주자를 살 수 있다.
{body}`,`가치가 보장되는 선택.
{body}`,`한국 사회의 상징을 살 수 있다.
{body}`],상가:[`유동인구라는 단어가 갑자기 무겁다.
{body}`,`장사 잘되길… 진심으로.
{body}`,`상권의 힘을 믿을 수 있다.
{body}`,`유동인구가 내 수익이 될 수 있다.
{body}`,`상권 투자의 묘미를 느낄 수 있다.
{body}`,`임대 수익의 달콤함을 경험할 수 있다.
{body}`,`상가의 가치를 알아볼 수 있다.
{body}`,`상권의 파도를 탈 수 있다.
{body}`,`임차인의 성공이 내 성공이 될 수 있다.
{body}`,`상가 투자의 리스크를 감수할 수 있다.
{body}`],빌딩:[`스카이라인에 욕심이 생겼다.
{body}`,`이제 진짜 '엔드게임' 냄새.
{body}`,`부동산 투자의 정점.
{body}`,`스카이라인의 주인이 될 수 있다.
{body}`,`도시의 한 조각을 소유할 수 있다.
{body}`,`빌딩의 무게감을 느낄 수 있다.
{body}`,`부동산 투자의 완성.
{body}`,`도시의 심장부를 살 수 있다.
{body}`,`스카이라인에 내 이름을 올릴 수 있다.
{body}`,`부동산 투자의 궁극.
{body}`]},Fe=[`문이 하나 열렸다.
{body}`,`다음 장으로 넘어갈 수 있게 됐다.
{body}`,`아직 초반인데도, 벌써 선택지가 늘었다.
{body}`,"드디어. {body}",`새로운 가능성이 열렸다.
{body}`,`선택지가 하나 더 생겼다.
{body}`,`다음 단계로 나아갈 수 있다.
{body}`,`기회의 문이 열렸다.
{body}`,`새로운 길이 보인다.
{body}`,`진행의 길이 열렸다.
{body}`],Be=[`지갑이 얇아서 아무것도 못 했다.
{body}`,`현실 체크. 돈이 없다.
{body}`,`오늘은 참는다. 아직은 무리.
{body}`,`계산기만 두드리고 끝.
{body}`,`통장 잔고가 거짓말을 한다.
{body}`,`돈이 부족하다는 건 늘 아프다.
{body}`,`다시 모아야 한다. 조금 더.
{body}`,`욕심을 접어야 할 때.
{body}`,`현실이 무겁다.
{body}`,`내일을 기다려야 한다.
{body}`],ce={예금:[`일단은 안전한 데에 묶어두자.
{body}`,`불안할 땐 예금이 답이다.
{body}`,`통장에 '쿠션'을 하나 깔았다.
{body}`,`안전함이 최고의 수익률.
{body}`,`무엇보다도 평온함.
{body}`,`돈이 잠들어 있는 게 나쁘지 않다.
{body}`,`은행이 내 편이 되는 순간.
{body}`,`위험은 내일로 미뤄두자.
{body}`,`조용히 쌓이는 게 좋다.
{body}`,`불안할 때는 이게 최선.
{body}`,`돈이 안전하게 지켜지는 느낌.
{body}`,`위험 없는 선택.
{body}`],적금:[`루틴을 샀다. 매일이 쌓이면 언젠가.
{body}`,`천천히, 꾸준히. 적금은 배신을 덜 한다.
{body}`,`버티기 모드 ON.
{body}`,`작은 것들이 모여 큰 것이 된다.
{body}`,`매일의 습관이 미래를 만든다.
{body}`,`꾸준함이 무기다.
{body}`,`서두르지 않고 천천히.
{body}`,`시간이 내 편이 되는 느낌.
{body}`,`작은 투자가 큰 결과를 만든다.
{body}`,`루틴의 힘을 믿는다.
{body}`,`매일 조금씩, 그게 전부다.
{body}`,`인내심이 필요한 투자.
{body}`],국내주식:[`차트가 나를 보더니 웃는 것 같았다.
{body}`,`기대 반, 긴장 반.
{body}`,`뉴스 알람을 켜야 할 것 같다.
{body}`,`변동성의 바다에 뛰어든다.
{body}`,`심장이 뛰는 투자.
{body}`,`국장의 파도를 타본다.
{body}`,`위험과 기회가 공존한다.
{body}`,`차트 한 줄에 모든 게 달렸다.
{body}`,`투자자의 길을 걷는다.
{body}`,`시장의 심장박동을 느낀다.
{body}`,`변동성에 내 심장도 같이 흔들린다.
{body}`,`국장의 무게를 견뎌본다.
{body}`],미국주식:[`달러 환율부터 떠올랐다.
{body}`,`밤에 울리는 알림을 각오했다.
{body}`,`세계로 한 걸음.
{body}`,`시차를 극복하는 투자.
{body}`,`미장의 파도를 타본다.
{body}`,`달러의 무게를 느낀다.
{body}`,`세계 시장에 발을 담근다.
{body}`,`밤샘의 대가를 치른다.
{body}`,`환율이 내 수익을 좌우한다.
{body}`,`글로벌 투자자의 길.
{body}`,`시차 때문에 잠을 설친다.
{body}`,`미장의 리듬에 맞춘다.
{body}`],코인:[`심장 단단히 붙잡고 탔다.
{body}`,`오늘은 FOMO가 이겼다.
{body}`,`롤러코스터에 표를 끊었다.
{body}`,`폭등과 폭락 사이에서 줄타기.
{body}`,`멘탈이 시험받는 투자.
{body}`,`변동성의 극치를 경험한다.
{body}`,`코인판의 무게를 견뎌본다.
{body}`,`FOMO와 공포 사이에서.
{body}`,`디지털 자산의 세계.
{body}`,`심장이 먼저 반응한다.
{body}`,`롤러코스터의 정점에 서 있다.
{body}`,`위험을 감수하는 선택.
{body}`],빌라:[`작아도 시작은 시작이다.
{body}`,`첫 집 느낌… 마음이 조금 놓였다.
{body}`,`벽지 냄새를 상상했다.
{body}`,`첫 부동산. 작지만 소중하다.
{body}`,`집이라는 단어가 현실이 됐다.
{body}`,`내 공간이 생겼다.
{body}`,`작은 집도 집이다.
{body}`,`부동산 투자의 첫걸음.
{body}`,`작은 시작이 큰 결과를 만든다.
{body}`,`첫 집의 무게감.
{body}`,`내 이름으로 등기되는 순간.
{body}`,`부동산의 세계에 입문했다.
{body}`],오피스텔:[`현실적인 선택을 했다.
{body}`,`출근길이 짧아지는 상상을 했다.
{body}`,`관리비 생각은 내일 하자.
{body}`,`실용적인 투자.
{body}`,`출근 동선이 머리에 그려진다.
{body}`,`현실과 이상의 절충.
{body}`,`생활의 편의를 샀다.
{body}`,`도시 생활의 현실.
{body}`,`작은 공간, 큰 만족.
{body}`,`실용주의의 승리.
{body}`,`생활의 질이 올라간다.
{body}`,`현실적인 부동산 투자.
{body}`],아파트:[`꿈이 조금 더 선명해졌다.
{body}`,`안정의 상징을 손에 쥐었다.
{body}`,`괜히 뿌듯하다.
{body}`,`한국인의 꿈을 샀다.
{body}`,`안정의 상징을 손에 쥐었다.
{body}`,`부동산 투자의 정점.
{body}`,`아파트의 무게감.
{body}`,`꿈이 현실이 되는 순간.
{body}`,`안정적인 투자.
{body}`,`부동산의 대표주자.
{body}`,`가치가 보장되는 선택.
{body}`,`한국 사회의 상징.
{body}`],상가:[`유동인구가 돈이 되는 세계.
{body}`,`임차인 운이 따라주길.
{body}`,`간판 불빛을 상상했다.
{body}`,`상권의 힘을 믿는다.
{body}`,`유동인구가 내 수익이다.
{body}`,`상권 투자의 묘미.
{body}`,`임대 수익의 달콤함.
{body}`,`상가의 가치를 알아본다.
{body}`,`유동인구가 곧 돈이다.
{body}`,`상권의 파도를 타본다.
{body}`,`임차인의 성공이 내 성공.
{body}`,`상가 투자의 리스크.
{body}`],빌딩:[`스카이라인을 한 조각 샀다.
{body}`,`이건… 진짜 끝판왕 느낌이다.
{body}`,`도시가 내 편인 것 같았다.
{body}`,`부동산 투자의 정점.
{body}`,`스카이라인의 주인.
{body}`,`도시의 한 조각을 소유한다.
{body}`,`빌딩의 무게감.
{body}`,`부동산 투자의 완성.
{body}`,`도시의 심장부를 샀다.
{body}`,`스카이라인에 내 이름이.
{body}`,`부동산 투자의 궁극.
{body}`,`도시의 한 부분이 내 것이다.
{body}`]},$e=[`결심하고 질렀다.
{body}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
{body}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
{body}`,`한 발 더 나아갔다.
{body}`,`손이 먼저 움직였다.
{body}`,`투자의 길을 걷는다.
{body}`,`미래를 위한 선택.
{body}`,`돈이 돈을 버는 구조.
{body}`,`자산을 늘리는 순간.
{body}`,`투자자의 마음가짐.
{body}`],se={코인:[`손이 떨리기 전에 내렸다.
{body}`,`욕심을 접었다. 오늘은 이쯤.
{body}`,`살아남는 게 먼저다.
{body}`,`FOMO를 이겨냈다.
{body}`,`멘탈을 지키기 위해 내렸다.
{body}`,`롤러코스터에서 내렸다.
{body}`,`변동성에서 벗어났다.
{body}`,`손절의 아픔을 견뎌낸다.
{body}`,`코인판에서 살아남았다.
{body}`,`위험에서 벗어났다.
{body}`],국내주식:[`수익이든 손절이든, 결론은 냈다.
{body}`,`차트와 잠깐 이별.
{body}`,`정리하고 숨 돌린다.
{body}`,`국장의 파도에서 벗어났다.
{body}`,`차트의 무게에서 해방.
{body}`,`투자 포지션을 정리했다.
{body}`,`변동성에서 벗어났다.
{body}`,`국장의 스트레스에서 해방.
{body}`,`정리하고 다음 기회를 본다.
{body}`,`차트와의 관계를 정리했다.
{body}`],미국주식:[`시차도 같이 정리했다.
{body}`,`달러 생각은 잠시 접는다.
{body}`,`잠깐 쉬어가기로 했다.
{body}`,`미장의 밤샘에서 벗어났다.
{body}`,`시차의 스트레스에서 해방.
{body}`,`달러의 무게에서 벗어났다.
{body}`,`미장 투자를 정리했다.
{body}`,`글로벌 투자에서 잠시 휴식.
{body}`,`환율 걱정을 접었다.
{body}`,`미장의 리듬에서 벗어났다.
{body}`],예금:[`안전벨트를 풀었다.
{body}`,`현금이 필요했다.
{body}`,`안전함에서 벗어났다.
{body}`,`예금의 안정성을 포기했다.
{body}`,`현금화의 선택.
{body}`,`안전한 곳에서 돈을 꺼냈다.
{body}`,`예금의 편안함을 잃었다.
{body}`,`현금이 필요해 정리했다.
{body}`,`안전한 투자에서 벗어났다.
{body}`,`예금의 쿠션을 제거했다.
{body}`],적금:[`꾸준함을 잠깐 멈췄다.
{body}`,`루틴을 깼다. 사정이 있었다.
{body}`,`적금의 루틴을 중단했다.
{body}`,`꾸준함을 포기했다.
{body}`,`루틴의 힘을 잃었다.
{body}`,`적금의 안정성을 포기.
{body}`,`매일의 습관을 깼다.
{body}`,`적금의 꾸준함을 중단.
{body}`,`루틴 투자에서 벗어났다.
{body}`,`적금의 시간을 포기했다.
{body}`],빌라:[`정든 것과 이별.
{body}`,`현실적으로 정리했다.
{body}`,`첫 집과 작별.
{body}`,`부동산 투자를 정리했다.
{body}`,`작은 집을 내려놨다.
{body}`,`첫 부동산과 이별.
{body}`,`집의 무게에서 벗어났다.
{body}`,`부동산의 첫걸음을 정리.
{body}`,`작은 집을 포기했다.
{body}`,`첫 집의 추억을 정리.
{body}`],오피스텔:[`동선은 이제 안녕.
{body}`,`정리하고 다음으로.
{body}`,`실용적인 투자를 정리.
{body}`,`출근 동선의 편의를 포기.
{body}`,`현실적인 선택을 정리.
{body}`,`오피스텔의 실용성을 포기.
{body}`,`생활의 편의를 잃었다.
{body}`,`도시 생활의 현실을 정리.
{body}`,`작은 공간을 내려놨다.
{body}`,`현실적인 투자를 정리.
{body}`],아파트:[`꿈을 잠시 내려놓았다.
{body}`,`정리했다. 마음이 좀 쓰다.
{body}`,`한국인의 꿈을 포기.
{body}`,`안정의 상징을 내려놨다.
{body}`,`부동산 투자를 정리.
{body}`,`아파트의 무게에서 벗어났다.
{body}`,`꿈이 현실에서 멀어졌다.
{body}`,`안정적인 투자를 포기.
{body}`,`부동산의 대표주자를 정리.
{body}`,`가치 보장을 포기했다.
{body}`],상가:[`임차인 걱정이 덜었다.
{body}`,`상권이란 게 참…
{body}`,`유동인구의 기회를 포기.
{body}`,`상권 투자를 정리했다.
{body}`,`임대 수익의 달콤함을 포기.
{body}`,`상가의 가치를 내려놨다.
{body}`,`유동인구의 수익을 포기.
{body}`,`상권의 파도에서 벗어났다.
{body}`,`임차인의 성공을 포기.
{body}`,`상가 투자의 리스크를 정리.
{body}`],빌딩:[`도시 한 조각을 내려놨다.
{body}`,`정리했다. 다시 올라가면 된다.
{body}`,`부동산 투자의 정점을 포기.
{body}`,`스카이라인의 주인을 내려놨다.
{body}`,`도시의 한 조각을 포기.
{body}`,`빌딩의 무게에서 벗어났다.
{body}`,`부동산 투자의 완성을 정리.
{body}`,`도시의 심장부를 포기.
{body}`,`스카이라인에서 내 이름을 지웠다.
{body}`,`부동산 투자의 궁극을 정리.
{body}`]},qe=[`정리할 건 정리했다.
{body}`,`가끔은 줄여야 산다.
{body}`,`현금이 필요했다. 그래서 팔았다.
{body}`,`미련은 접어두고 정리.
{body}`,`투자 포지션을 정리했다.
{body}`,`현금화의 선택.
{body}`,`자산을 정리하는 순간.
{body}`,`투자에서 벗어났다.
{body}`,`정리하고 다음 기회를 본다.
{body}`,`미련 없이 정리했다.
{body}`],Ge=[`오늘은 뜻대로 안 됐다.
{body}`,`계획은 늘 계획대로 안 된다.
{body}`,`한 번 더. 다음엔 될 거다.
{body}`,`벽에 부딪혔다.
{body}`,`실패는 또 다른 시작.
{body}`,`좌절은 잠시뿐.
{body}`,`다시 일어서야 한다.
{body}`,`실패도 경험이다.
{body}`,`다음 기회를 기다린다.
{body}`,`실패에서 배운다.
{body}`],ie={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
{body}`,`안정은 조용히 돈을 번다. 오늘도 예금은 예금했다.
{body}`,`예금은 변하지 않는다. 그게 장점.
{body}`,`안정적인 투자는 조용하다.
{body}`,`예금의 평온함이 느껴진다.
{body}`,`변동성 없는 투자의 편안함.
{body}`,`예금은 늘 그 자리다.
{body}`,`안전함의 가치를 느낀다.
{body}`,`예금의 조용한 수익.
{body}`,`변동 없는 투자의 평온.
{body}`],적금:[`루틴이 흔들리는 날이 있다. 그래도 적금은 적금.
{body}`,`꾸준함의 세계에도 이벤트는 온다.
{body}`,`적금의 루틴이 흔들린다.
{body}`,`꾸준함에도 변화가 있다.
{body}`,`적금의 안정성이 시험받는다.
{body}`,`루틴 투자의 변동.
{body}`,`매일의 습관이 흔들린다.
{body}`,`적금의 꾸준함이 시험받는다.
{body}`,`시간이 만드는 투자의 변화.
{body}`,`적금의 루틴이 바뀐다.
{body}`],국내주식:[`차트가 또 날 시험한다.
{body}`,`뉴스 한 줄에 심장이 먼저 반응했다.
{body}`,`국장답게… 오늘도 변동성.
{body}`,`국장의 파도가 높아진다.
{body}`,`차트의 심장박동이 빨라진다.
{body}`,`국장의 변동성이 극대화된다.
{body}`,`뉴스 한 줄이 모든 걸 바꾼다.
{body}`,`국장의 무게가 느껴진다.
{body}`,`차트의 파도를 타야 한다.
{body}`,`국장 투자의 리스크가 커진다.
{body}`],미국주식:[`시차가 오늘따라 더 길게 느껴진다.
{body}`,`달러랑 감정은 분리… 하자.
{body}`,`미장 이벤트는 밤에 더 크게 들린다.
{body}`,`미장의 파도가 높아진다.
{body}`,`시차의 스트레스가 커진다.
{body}`,`달러의 무게가 느껴진다.
{body}`,`미장의 리듬이 바뀐다.
{body}`,`환율의 변동이 심해진다.
{body}`,`밤샘의 대가가 커진다.
{body}`,`글로벌 투자의 무게.
{body}`],코인:[`멘탈이 먼저 흔들린다. 코인은 늘 그렇다.
{body}`,`롤러코스터가 출발했다.
{body}`,`FOMO랑 손절 사이에서 줄타기.
{body}`,`코인판의 파도가 거세진다.
{body}`,`변동성의 극치를 경험한다.
{body}`,`멘탈이 시험받는 순간.
{body}`,`FOMO와 공포 사이에서.
{body}`,`롤러코스터의 정점에 서 있다.
{body}`,`코인판의 무게가 느껴진다.
{body}`,`위험을 감수하는 투자의 극치.
{body}`],빌라:[`동네 분위기가 바뀌면 빌라도 숨을 쉰다.
{body}`,`작은 집도 결국은 시장을 탄다.
{body}`,`부동산 시장의 파도가 느껴진다.
{body}`,`작은 집도 시장의 영향을 받는다.
{body}`,`부동산 투자의 변동성.
{body}`,`동네 분위기의 변화.
{body}`,`작은 집의 가치가 흔들린다.
{body}`,`부동산 시장의 리듬.
{body}`,`첫 집의 무게감이 느껴진다.
{body}`,`부동산 투자의 리스크.
{body}`],오피스텔:[`현실의 수요가 움직이는 소리가 난다.
{body}`,`출근 동선이 바뀌면 월세도 같이 흔들린다.
{body}`,`실용적인 투자도 시장의 영향을 받는다.
{body}`,`생활의 편의가 시장에 좌우된다.
{body}`,`도시 생활의 현실이 바뀐다.
{body}`,`오피스텔의 가치가 흔들린다.
{body}`,`현실적인 투자의 변동성.
{body}`,`생활의 질이 시장에 좌우된다.
{body}`,`실용주의 투자의 리스크.
{body}`,`도시 생활의 현실이 느껴진다.
{body}`],아파트:[`아파트는 '상징'이라더니, 이벤트도 상징처럼 크게 온다.
{body}`,`꿈이 흔들릴 때가 있다.
{body}`,`한국인의 꿈이 시장에 좌우된다.
{body}`,`안정의 상징이 흔들린다.
{body}`,`부동산 투자의 정점이 시험받는다.
{body}`,`아파트의 무게감이 느껴진다.
{body}`,`꿈이 현실에서 멀어질 수 있다.
{body}`,`안정적인 투자도 변동한다.
{body}`,`부동산의 대표주자가 흔들린다.
{body}`,`가치 보장이 시장에 좌우된다.
{body}`],상가:[`유동인구라는 말이 오늘은 무겁다.
{body}`,`장사라는 건 결국 파도 타기.
{body}`,`상권의 힘이 시장에 좌우된다.
{body}`,`유동인구의 수익이 변동한다.
{body}`,`상권 투자의 묘미와 리스크.
{body}`,`임대 수익의 달콤함과 쓴맛.
{body}`,`상가의 가치가 흔들린다.
{body}`,`상권의 파도가 거세진다.
{body}`,`임차인의 성공이 시장에 좌우된다.
{body}`,`상가 투자의 리스크가 커진다.
{body}`],빌딩:[`도시가 요동치면 빌딩도 요동친다.
{body}`,`스카이라인의 공기가 달라졌다.
{body}`,`부동산 투자의 정점이 시험받는다.
{body}`,`스카이라인의 주인이 시장에 좌우된다.
{body}`,`도시의 한 조각이 흔들린다.
{body}`,`빌딩의 무게감이 느껴진다.
{body}`,`부동산 투자의 완성이 시장에 좌우된다.
{body}`,`도시의 심장부가 요동친다.
{body}`,`스카이라인의 이름이 흔들린다.
{body}`,`부동산 투자의 궁극이 시험받는다.
{body}`],노동:[`업무 흐름이 바뀌면 내 하루도 바뀐다.
{body}`,`오늘은 손이 더 바빠질 것 같다.
{body}`,`일의 리듬이 바뀐다.
{body}`,`업무의 흐름이 시장에 좌우된다.
{body}`,`노동의 가치가 변동한다.
{body}`,`일의 무게감이 느껴진다.
{body}`,`업무의 스트레스가 커진다.
{body}`,`노동의 리듬이 시장에 좌우된다.
{body}`,`일의 가치가 흔들린다.
{body}`,`업무의 변동성이 느껴진다.
{body}`],시장:[`시장이 시끄럽다.
{body}`,`뉴스가 난리다.
{body}`,`분위기가 확 바뀌었다.
{body}`,`감정은 접고, 상황만 기록.
{body}`,`시장의 파도가 거세진다.
{body}`,`뉴스 한 줄이 모든 걸 바꾼다.
{body}`,`시장의 무게감이 느껴진다.
{body}`,`변동성의 극치를 경험한다.
{body}`,`시장의 리듬이 바뀐다.
{body}`,`투자의 리스크가 커진다.
{body}`]},de={코인:["심장이 겨우 진정됐다. ({name})",`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
{name}`,`롤러코스터가 멈췄다. 잠시만.
{name}`,`FOMO의 파도가 잠잠해졌다.
{name}`,`변동성의 폭풍이 지나갔다.
{name}`,`멘탈이 겨우 회복됐다.
{name}`,`코인판의 소란이 잠잠해졌다.
{name}`,`위험의 파도가 잠잠해졌다.
{name}`],국내주식:[`차트가 잠깐 조용해졌다.
{name}`,`국장 소란 종료. 숨 한 번.
{name}`,`뉴스의 파도가 잠잠해졌다.
{name}`,`차트의 심장박동이 안정됐다.
{name}`,`국장의 변동성이 잠잠해졌다.
{name}`,`투자자의 심장이 진정됐다.
{name}`,`국장의 무게에서 벗어났다.
{name}`,`차트의 파도가 잠잠해졌다.
{name}`],미국주식:[`밤이 지나갔다.
{name}`,`미장 이벤트 종료. 알림도 잠잠.
{name}`,`시차의 스트레스가 사라졌다.
{name}`,`달러의 무게에서 벗어났다.
{name}`,`미장의 파도가 잠잠해졌다.
{name}`,`밤샘의 대가가 끝났다.
{name}`,`환율의 변동이 잠잠해졌다.
{name}`,`글로벌 투자의 무게에서 벗어났다.
{name}`],부동산:[`동네가 다시 평소 얼굴을 찾았다.
{name}`,`부동산 시장이 안정됐다.
{name}`,`동네 분위기가 평소로 돌아왔다.
{name}`,`부동산 투자의 변동성이 잠잠해졌다.
{name}`,`집의 무게에서 벗어났다.
{name}`,`부동산 시장의 파도가 잠잠해졌다.
{name}`,`부동산 투자의 리스크가 줄어들었다.
{name}`,`동네가 평소의 모습을 찾았다.
{name}`],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},le={코인:[`메모(코인): 멘탈 관리가 수익률이다.
{body}`,`코인 메모.
{name}
{body}`,`코인 투자 노트: 변동성을 견뎌야 한다.
{body}`,`코인 기록: FOMO를 이겨내야 한다.
{body}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
{body}`,`코인 투자 기록: 위험을 감수하는 선택.
{body}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
{body}`,`국장 메모.
{name}
{body}`,`국장 투자 노트: 차트의 파도를 타야 한다.
{body}`,`국장 기록: 변동성을 견뎌야 한다.
{body}`,`국장 메모: 투자자의 심장이 시험받는다.
{body}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
{body}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
{body}`,`미장 메모.
{name}
{body}`,`미장 투자 노트: 밤샘의 대가를 치러야 한다.
{body}`,`미장 기록: 달러의 무게를 견뎌야 한다.
{body}`,`미장 메모: 시차의 스트레스를 견뎌야 한다.
{body}`,`미장 투자 기록: 글로벌 투자의 무게.
{body}`],예금:[`메모(예금): 조용히 이기는 쪽.
{body}`,`예금 투자 노트: 안정이 최고의 수익률.
{body}`,`예금 기록: 변동성 없는 투자의 편안함.
{body}`,`예금 메모: 안전함의 가치.
{body}`,`예금 투자 기록: 조용한 수익.
{body}`],적금:[`메모(적금): 루틴이 무기.
{body}`,`적금 투자 노트: 꾸준함이 무기다.
{body}`,`적금 기록: 매일의 습관이 미래를 만든다.
{body}`,`적금 메모: 시간이 내 편이 되는 투자.
{body}`,`적금 투자 기록: 인내심이 필요한 투자.
{body}`],부동산:[`메모(부동산): 공실은 악몽, 임차인은 복.
{body}`,`동네 메모.
{name}
{body}`,`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
{body}`,`부동산 기록: 시장의 파도를 타야 한다.
{body}`,`부동산 메모: 부동산 투자의 리스크.
{body}`,`부동산 투자 기록: 동네 분위기의 변화.
{body}`],노동:[`메모(노동): 버티는 사람이 이긴다.
{body}`,`노동 노트: 일의 무게감을 견뎌야 한다.
{body}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
{body}`,`노동 메모: 일의 가치가 변동한다.
{body}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
{body}`]},We=[`메모.
{body}`,`적어둔다.
{body}`,`까먹기 전에 기록.
{body}`,`투자 노트에 기록.
{body}`,`기억해둘 것.
{body}`,`나중을 위해 기록.
{body}`],ye={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
{name}`,`업무 스킬이 하나 늘었다.
{name}`,`손끝이 더 빨라질 준비.
{name}`,`일하는 방식이 개선될 것 같다.
{name}`,`업무 효율이 올라갈 것 같다.
{name}`,`노동의 질이 향상될 것 같다.
{name}`,`일하는 능력이 강화됐다.
{name}`,`업무 스킬의 진화.
{name}`],예금:[`예금이 더 조용히 벌어다 주겠지.
{name}`,`안정 쪽에 옵션이 하나 추가됐다.
{name}`,`예금의 수익률이 올라갈 것 같다.
{name}`,`안정적인 투자가 더 강해진다.
{name}`,`예금의 가치가 상승할 것 같다.
{name}`,`안전한 투자의 힘이 커진다.
{name}`,`예금의 편안함이 더해진다.
{name}`,`안정적인 투자의 진화.
{name}`],적금:[`루틴 강화 카드가 열렸다.
{name}`,`꾸준함을 돕는 장치가 생겼다.
{name}`,`적금의 루틴이 강화됐다.
{name}`,`꾸준함의 힘이 커진다.
{name}`,`매일의 습관이 더 강해진다.
{name}`,`적금의 시간 가치가 올라간다.
{name}`,`루틴 투자의 힘이 커진다.
{name}`,`꾸준함의 진화.
{name}`],국내주식:[`차트 싸움에 새 무기가 생겼다.
{name}`,`국장 대응력이 올라갈 것 같다.
{name}`,`국장 투자의 힘이 커진다.
{name}`,`차트의 파도를 더 잘 탈 수 있다.
{name}`,`국장의 변동성에 대응할 수 있다.
{name}`,`투자자의 능력이 강화됐다.
{name}`,`국장 투자의 진화.
{name}`,`차트 싸움의 무기가 강화됐다.
{name}`],미국주식:[`시차를 버틸 장비가 하나 생겼다.
{name}`,`달러 쪽 옵션이 열린다.
{name}`,`미장 투자의 힘이 커진다.
{name}`,`시차의 스트레스를 견딜 수 있다.
{name}`,`달러의 무게를 더 잘 견딜 수 있다.
{name}`,`글로벌 투자의 능력이 강화됐다.
{name}`,`미장 투자의 진화.
{name}`,`밤샘의 대가를 더 잘 견딜 수 있다.
{name}`],코인:[`코인판에서 버틸 도구가 생겼다.
{name}`,`멘탈을 지키는 업그레이드…였으면.
{name}`,`코인 투자의 힘이 커진다.
{name}`,`변동성을 더 잘 견딜 수 있다.
{name}`,`FOMO를 더 잘 이겨낼 수 있다.
{name}`,`롤러코스터를 더 잘 탈 수 있다.
{name}`,`코인 투자의 진화.
{name}`,`멘탈 관리의 도구가 생겼다.
{name}`],빌라:[`빌라 운영이 조금은 편해질지도.
{name}`,`첫 집의 가치가 올라간다.
{name}`,`부동산 투자의 첫걸음이 강화됐다.
{name}`,`작은 집의 수익이 올라간다.
{name}`,`부동산 투자의 기초가 강화됐다.
{name}`,`첫 집의 무게감이 줄어든다.
{name}`,`부동산 투자의 진화.
{name}`,`작은 집의 가치가 상승한다.
{name}`],오피스텔:[`오피스텔 쪽이 한 단계 나아간다.
{name}`,`실용적인 투자가 강화됐다.
{name}`,`생활의 편의가 더해진다.
{name}`,`도시 생활의 질이 올라간다.
{name}`,`현실적인 투자의 힘이 커진다.
{name}`,`오피스텔의 가치가 상승한다.
{name}`,`실용주의 투자의 진화.
{name}`,`생활의 편의가 강화됐다.
{name}`],아파트:[`아파트는 디테일에서 돈이 난다.
{name}`,`한국인의 꿈이 더 가까워진다.
{name}`,`안정의 상징이 강화됐다.
{name}`,`부동산 투자의 정점이 올라간다.
{name}`,`아파트의 가치가 상승한다.
{name}`,`안정적인 투자의 힘이 커진다.
{name}`,`부동산 투자의 진화.
{name}`,`꿈이 현실에 더 가까워진다.
{name}`],상가:[`상가는 세팅이 반이다.
{name}`,`상권 투자의 힘이 커진다.
{name}`,`유동인구의 수익이 올라간다.
{name}`,`임대 수익의 달콤함이 커진다.
{name}`,`상가의 가치가 상승한다.
{name}`,`상권 투자의 진화.
{name}`,`임차인의 성공이 내 성공이 된다.
{name}`,`상권의 힘이 강화됐다.
{name}`],빌딩:[`빌딩은 관리가 곧 수익이다.
{name}`,`부동산 투자의 궁극이 강화됐다.
{name}`,`스카이라인의 주인이 강해진다.
{name}`,`도시의 한 조각이 더 가치있어진다.
{name}`,`빌딩의 무게감이 줄어든다.
{name}`,`부동산 투자의 완성이 올라간다.
{name}`,`스카이라인의 가치가 상승한다.
{name}`,`부동산 투자의 진화.
{name}`],부동산:[`부동산 운영에 옵션이 하나 추가됐다.
{name}`,`월세를 '조금 더' 만들 방법.
{name}`,`부동산 투자의 힘이 커진다.
{name}`,`집의 가치가 올라간다.
{name}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
{name}`,`부동산 투자의 리스크가 줄어든다.
{name}`,`부동산 투자의 진화.
{name}`,`집의 무게감이 줄어든다.
{name}`],기본:[`새로운 방법이 보였다.
{name}`,`선택지가 늘었다.
{name}`,`이제부터가 시작일지도.
{name}`,`기회의 문이 열렸다.
{name}`,`새로운 가능성이 생겼다.
{name}`,`진화의 순간.
{name}`,`능력이 강화됐다.
{name}`,`다음 단계로 나아갈 수 있다.
{name}`]},me={노동:[`일하는 방식이 바뀌었다.
{core}`,`업무 스킬을 장착했다.
{core}`,`손이 더 빨라질 거다. 아마도.
{core}`,`일하는 능력이 강화됐다.
{core}`,`업무 효율이 올라갔다.
{core}`,`노동의 질이 향상됐다.
{core}`,`일하는 방식의 진화.
{core}`,`업무 스킬의 강화.
{core}`],예금:[`예금은 조용히 강해진다.
{core}`,`안정 쪽을 더 단단히 했다.
{core}`,`예금의 수익률이 올라갔다.
{core}`,`안정적인 투자가 강화됐다.
{core}`,`예금의 가치가 상승했다.
{core}`,`안전한 투자의 힘이 커졌다.
{core}`,`예금의 편안함이 더해졌다.
{core}`,`안정적인 투자의 진화.
{core}`],적금:[`루틴을 업그레이드했다.
{core}`,`꾸준함에 부스터 하나.
{core}`,`적금의 루틴이 강화됐다.
{core}`,`꾸준함의 힘이 커졌다.
{core}`,`매일의 습관이 더 강해졌다.
{core}`,`적금의 시간 가치가 올라갔다.
{core}`,`루틴 투자의 힘이 커졌다.
{core}`,`꾸준함의 진화.
{core}`],국내주식:[`차트 싸움에 장비를 추가했다.
{core}`,`국장 대응력 상승.
{core}`,`국장 투자의 힘이 커졌다.
{core}`,`차트의 파도를 더 잘 탈 수 있다.
{core}`,`국장의 변동성에 대응할 수 있다.
{core}`,`투자자의 능력이 강화됐다.
{core}`,`국장 투자의 진화.
{core}`,`차트 싸움의 무기가 강화됐다.
{core}`],미국주식:[`시차를 버틸 장비 장착.
{core}`,`달러 쪽을 조금 더 믿어보기로.
{core}`,`미장 투자의 힘이 커졌다.
{core}`,`시차의 스트레스를 견딜 수 있다.
{core}`,`달러의 무게를 더 잘 견딜 수 있다.
{core}`,`글로벌 투자의 능력이 강화됐다.
{core}`,`미장 투자의 진화.
{core}`,`밤샘의 대가를 더 잘 견딜 수 있다.
{core}`],코인:[`코인판에서 살아남을 장비.
{core}`,`멘탈 보호 장치…였으면.
{core}`,`코인 투자의 힘이 커졌다.
{core}`,`변동성을 더 잘 견딜 수 있다.
{core}`,`FOMO를 더 잘 이겨낼 수 있다.
{core}`,`롤러코스터를 더 잘 탈 수 있다.
{core}`,`코인 투자의 진화.
{core}`,`멘탈 관리의 도구가 생겼다.
{core}`],빌라:[`빌라 운영을 손봤다.
{core}`,`첫 집의 가치가 올라갔다.
{core}`,`부동산 투자의 첫걸음이 강화됐다.
{core}`,`작은 집의 수익이 올라갔다.
{core}`,`부동산 투자의 기초가 강화됐다.
{core}`,`첫 집의 무게감이 줄어들었다.
{core}`,`부동산 투자의 진화.
{core}`,`작은 집의 가치가 상승했다.
{core}`],오피스텔:[`오피스텔 쪽을 업그레이드했다.
{core}`,`실용적인 투자가 강화됐다.
{core}`,`생활의 편의가 더해졌다.
{core}`,`도시 생활의 질이 올라갔다.
{core}`,`현실적인 투자의 힘이 커졌다.
{core}`,`오피스텔의 가치가 상승했다.
{core}`,`실용주의 투자의 진화.
{core}`,`생활의 편의가 강화됐다.
{core}`],아파트:[`아파트는 디테일.
{core}`,`한국인의 꿈이 더 가까워졌다.
{core}`,`안정의 상징이 강화됐다.
{core}`,`부동산 투자의 정점이 올라갔다.
{core}`,`아파트의 가치가 상승했다.
{core}`,`안정적인 투자의 힘이 커졌다.
{core}`,`부동산 투자의 진화.
{core}`,`꿈이 현실에 더 가까워졌다.
{core}`],상가:[`상가는 세팅이 반이다.
{core}`,`상권 투자의 힘이 커졌다.
{core}`,`유동인구의 수익이 올라갔다.
{core}`,`임대 수익의 달콤함이 커졌다.
{core}`,`상가의 가치가 상승했다.
{core}`,`상권 투자의 진화.
{core}`,`임차인의 성공이 내 성공이 된다.
{core}`,`상권의 힘이 강화됐다.
{core}`],빌딩:[`빌딩은 관리가 수익이다.
{core}`,`부동산 투자의 궁극이 강화됐다.
{core}`,`스카이라인의 주인이 강해졌다.
{core}`,`도시의 한 조각이 더 가치있어졌다.
{core}`,`빌딩의 무게감이 줄어들었다.
{core}`,`부동산 투자의 완성이 올라갔다.
{core}`,`스카이라인의 가치가 상승했다.
{core}`,`부동산 투자의 진화.
{core}`],부동산:[`월세 쪽을 손봤다.
{core}`,`부동산 운영이 한 단계 올라갔다.
{core}`,`부동산 투자의 힘이 커졌다.
{core}`,`집의 가치가 올라갔다.
{core}`,`부동산 시장의 파도를 더 잘 탈 수 있다.
{core}`,`부동산 투자의 리스크가 줄어들었다.
{core}`,`부동산 투자의 진화.
{core}`,`집의 무게감이 줄어들었다.
{core}`],기본:[`필요한 걸 갖췄다.
{body}`,`업그레이드 완료. 조금은 편해지겠지.
{body}`,`나 자신에게 투자.
{body}`,`능력이 강화됐다.
{body}`,`진화의 순간.
{body}`,`기회를 잡았다.
{body}`,`다음 단계로 나아갔다.
{body}`,`투자의 힘이 커졌다.
{body}`]},Ve=[`찜찜한 기분이 남았다.
{body}`,`뭔가 삐끗한 느낌.
{body}`,`일단 기록만 남긴다.
{body}`,`뭔가 이상한 느낌.
{body}`,`불안한 기분이 든다.
{body}`,`주의가 필요할 것 같다.
{body}`,`뭔가 잘못된 것 같다.
{body}`,`경고의 신호가 느껴진다.
{body}`],je=["{base}",`{justWrite}
{base}`,`{todayRecord}
{base}`,"{anyway} {base}",`{justRecord}
{base}`,`{memo}
{base}`,`{remember}
{base}`,`{recordForLater}
{base}`,`{goodToWrite}
{base}`,`{leaveRecord}
{base}`],He=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]],ze=["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"];let V=null,j=null,Ce=null;function Ye(n,e){V=n,j=e,Ce=e.sessionStartTime}const Y=n=>String(n).padStart(2,"0"),ue=n=>Math.floor(Math.random()*n),Ie=n=>n.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu,"").trim(),F=n=>Ie(n).replace(/\s+/g," ").trim();function T(n,e){if(!Array.isArray(e)||e.length===0)return"";const s=`__diaryLastPick_${n}`,a=window[s];let o=ue(e.length);return e.length>1&&typeof a=="number"&&o===a&&(o=(o+1+ue(e.length-1))%e.length),window[s]=o,e[o]}function Je(n){const e=String(n||"");for(const[s,a]of He)if(e.includes(s))return a;return""}function D(n,e){let s=n;for(const[a,o]of Object.entries(e))s=s.replace(new RegExp(`\\{${a}\\}`,"g"),o||"");return s.trim()}function Xe(){if(!j)return;const n=new Date,e=n.getFullYear(),s=Y(n.getMonth()+1),a=Y(n.getDate()),o=typeof j.gameStartTime<"u"&&j.gameStartTime?j.gameStartTime:Ce,b=Math.max(1,Math.floor((Date.now()-o)/864e5)+1),S=document.getElementById("diaryHeaderMeta");S&&(S.textContent=`${e}.${s}.${a}(${C("ui.dayCount",{days:b})})`);const E=document.getElementById("diaryMetaDate"),_=document.getElementById("diaryMetaDay");E&&(E.textContent=C("ui.today",{date:`${e}.${s}.${a}`})),_&&(_.textContent=C("ui.dayCount",{days:b}))}function Qe(n){var E,_,f,v,y,g,p,m;const e=String(n||"").trim();if(new RegExp(C("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(e)||/다음\s*업그레이드/.test(e)&&/클릭\s*남/.test(e))return"";if(e.startsWith("🏆")&&(e.includes("업적 달성:")||e.includes("Achievement Unlocked:"))){const t=Ie(e).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[r,c]=t.split(/\s*-\s*/),i=T("achievement",Ke);return D(i,{name:r||"업적",desc:c||"",descMemo:c?`메모: ${c}`:""})}const a=Z()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(e.startsWith("🎉")&&(e.includes("승진했습니다")||/promoted/i.test(e))){const t=e.match(a),r=((E=t==null?void 0:t[1])==null?void 0:E.trim())||"다음 단계",c=(_=t==null?void 0:t[2])==null?void 0:_.trim(),i=c?c.replace(/[()]/g,"").trim():"",d=T("promotion",xe);return D(d,{career:r,extra:i})}const o=Z()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(e.startsWith("🔓")){const t=F(e),r=e.match(o),c=((r==null?void 0:r[1])||"").trim();if(c&&ae[c]){const d=T(`unlock_${c}`,ae[c]);return D(d,{body:t})}const i=T("unlock",Fe);return D(i,{body:t})}if(e.startsWith("💸 자금이 부족합니다")){const t=F(e),r=T("noMoney",Be);return D(r,{body:t})}if(e.startsWith("✅")&&(e.includes("구입했습니다")||/purchased/i.test(e))){const t=F(e),r=e.match(/^✅\s*(.+?)\s+\d/),c=((r==null?void 0:r[1])||"").trim();if(c&&ce[c]){const d=T(`buy_${c}`,ce[c]);return D(d,{body:t})}const i=T("buy",$e);return D(i,{body:t})}if(e.startsWith("💰")&&e.includes("판매했습니다")){const t=F(e),r=e.match(/^💰\s*(.+?)\s+\d/),c=((r==null?void 0:r[1])||"").trim();if(c&&se[c]){const d=T(`sell_${c}`,se[c]);return D(d,{body:t})}const i=T("sell",qe);return D(i,{body:t})}if(e.startsWith("❌")){const t=F(e),r=T("fail",Ge);return D(r,{body:t})}if(e.startsWith("📈")&&e.includes("발생")){const t=F(e),r=(v=(f=e.match(/^📈\s*(.+?)\s*발생/))==null?void 0:f[1])==null?void 0:v.trim(),i=(((g=(y=e.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:y[1])==null?void 0:g.trim())||r||"").trim(),d=Je(`${i} ${t}`)||"시장";window.__diaryLastMarketProduct=d,window.__diaryLastMarketName=i||t;const I=ie[d]||ie.시장,A=T(`market_${d}`,I);return D(A,{body:t})}if(e.startsWith("📉")&&e.includes("종료")){const t=window.__diaryLastMarketProduct||"시장",r=window.__diaryLastMarketName||"",i=["빌라","오피스텔","아파트","상가","빌딩"].includes(t)?"부동산":t,d=de[i]||de.시장,I=T(`marketEnd_${i}`,d);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,D(I,{name:r})}if(e.startsWith("💡")){const t=F(e),r=window.__diaryLastMarketProduct||"",c=window.__diaryLastMarketName||"",d=["빌라","오피스텔","아파트","상가","빌딩"].includes(r)?"부동산":r;if(d&&le[d]){const A=T(`memo_${d}`,le[d]);return D(A,{body:t,name:c})}const I=T("memo",We);return D(I,{body:t})}if(e.startsWith("🎁")&&e.includes("해금")){const t=F(e),r=((m=(p=e.match(/해금:\s*(.+)$/))==null?void 0:p[1])==null?void 0:m.trim())||"",i=(A=>{const u=String(A||"");return u.includes("예금")?"예금":u.includes("적금")?"적금":u.includes("미국주식")||u.includes("미장")||u.includes("🇺🇸")?"미국주식":u.includes("코인")||u.includes("₿")||u.includes("암호")?"코인":u.includes("주식")?"국내주식":u.includes("빌딩")?"빌딩":u.includes("상가")?"상가":u.includes("아파트")?"아파트":u.includes("오피스텔")?"오피스텔":u.includes("빌라")?"빌라":u.includes("월세")||u.includes("부동산")?"부동산":u.includes("클릭")||u.includes("노동")||u.includes("업무")||u.includes("CEO")||u.includes("커리어")?"노동":""})(`${r} ${t}`)||"기본",d=ye[i]||ye.기본,I=T(`upgradeUnlock_${i}`,d);return D(I,{name:r||t})}if(e.startsWith("✅")&&e.includes("구매!")){const t=F(e),r=e.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),c=((r==null?void 0:r[1])||"").trim(),i=((r==null?void 0:r[2])||"").trim(),I=(R=>{const k=String(R||"");return k.includes("예금")?"예금":k.includes("적금")?"적금":k.includes("미국주식")||k.includes("미장")||k.includes("🇺🇸")?"미국주식":k.includes("코인")||k.includes("₿")||k.includes("암호")?"코인":k.includes("주식")?"국내주식":k.includes("빌딩")?"빌딩":k.includes("상가")?"상가":k.includes("아파트")?"아파트":k.includes("오피스텔")?"오피스텔":k.includes("빌라")?"빌라":k.includes("월세")||k.includes("부동산")?"부동산":k.includes("클릭")||k.includes("노동")||k.includes("업무")||k.includes("CEO")||k.includes("커리어")?"노동":""})(`${c} ${i} ${t}`)||"기본",A=[c,i].filter(Boolean).join(" — ")||t,u=me[I]||me.기본,N=T(`upgradeBuy_${I}`,u);return D(N,{core:A,body:t})}if(e.startsWith("⚠️")){const t=F(e),r=T("warn",Ve);return D(r,{body:t})}const b=F(e),S=T("default",je);return D(S,{base:b,justWrite:C("diary.justWrite"),todayRecord:C("diary.todayRecord"),anyway:C("diary.anyway"),justRecord:C("diary.justRecord"),memo:C("diary.memo"),remember:C("diary.remember"),recordForLater:C("diary.recordForLater"),goodToWrite:C("diary.goodToWrite"),leaveRecord:C("diary.leaveRecord")})}function q(n){var g;if(!V||!j||ze.some(p=>n.includes(p)))return;const s=new Date,a=`${Y(s.getHours())}:${Y(s.getMinutes())}`;Xe();const o=Qe(n);if(!o)return;const b=document.createElement("p"),E=o.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),_=(E[0]??"").trim(),f=E.slice(1).map(p=>String(p).trim()).filter(Boolean),v=`<span class="diary-voice">${_}</span>`+(f.length?`
<span class="diary-info">${f.join(`
`)}</span>`:"");if(b.innerHTML=`<span class="diary-time">${a}</span>${v}`,!V){console.error("[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.");return}V.prepend(b);const y=100;for(;V.children.length>y;)(g=V.lastElementChild)==null||g.remove()}const pn=Object.freeze(Object.defineProperty({__proto__:null,addLog:q,initDiary:Ye},Symbol.toStringTag,{value:"Module"}));var _e,ke;const U=!!((ke=(_e=import.meta)==null?void 0:_e.env)!=null&&ke.DEV);function fn(n){const{UPGRADES:e,getCash:s,setCash:a,CAREER_LEVELS:o}=n;function b(){const f=s();document.querySelectorAll(".upgrade-item").forEach(y=>{const g=y.dataset.upgradeId,p=e[g];p&&!p.purchased&&(f>=p.cost?y.classList.add("affordable"):y.classList.remove("affordable"))})}function S(f){document.querySelectorAll(".upgrade-progress").forEach(y=>{const g=y.closest(".upgrade-item");!g||!g.dataset.upgradeId||(Object.entries(e).filter(([m,t])=>t.category==="labor"&&!t.unlocked&&!t.purchased).map(([m,t])=>{var d;const r=t.unlockCondition.toString(),c=r.match(/totalClicks\s*>=\s*(\d+)/);if(c)return{id:m,requiredClicks:parseInt(c[1]),upgrade:t};const i=r.match(/careerLevel\s*>=\s*(\d+)/);return i?{id:m,requiredClicks:((d=o[parseInt(i[1])])==null?void 0:d.requiredClicks)||1/0,upgrade:t}:null}).filter(m=>m!==null).sort((m,t)=>m.requiredClicks-t.requiredClicks),y.textContent="")})}function E(){const f=s(),v=document.getElementById("upgradeList"),y=document.getElementById("upgradeCount");if(!v||!y)return;const g=Object.entries(e).filter(([t,r])=>r.unlocked&&!r.purchased);g.length===0?y.style.display="none":(y.style.display="",y.textContent=`(${g.length})`);const p=document.getElementById("noUpgradesMessage"),m=document.querySelector('.stats-section[data-section-id="upgrades"]');if(g.length===0){if(v.innerHTML="",p&&(p.textContent=C("ui.noUpgrades"),p.style.display="block"),m&&!m.classList.contains("collapsed")){m.classList.add("collapsed");const t=m.querySelector(".stats-toggle");t&&t.setAttribute("aria-expanded","false");const r=m.querySelector(".toggle-icon");r&&(r.textContent="▶")}return}if(m&&m.classList.contains("collapsed")){m.classList.remove("collapsed");const t=m.querySelector(".stats-toggle");t&&t.setAttribute("aria-expanded","true");const r=m.querySelector(".toggle-icon");r&&(r.textContent="▼")}p&&(p.style.display="none"),v.innerHTML="",U&&console.log(`🔄 Regenerating upgrade list with ${g.length} items`),g.forEach(([t,r])=>{const c=document.createElement("div");c.className="upgrade-item",c.dataset.upgradeId=t,f>=r.cost&&c.classList.add("affordable");const i=document.createElement("div");i.className="upgrade-icon",i.textContent=r.icon;const d=document.createElement("div");d.className="upgrade-info";const I=document.createElement("div");I.className="upgrade-name",I.textContent=C(`upgrade.${t}.name`,{},r.name);const A=document.createElement("div");A.className="upgrade-desc",A.textContent=C(`upgrade.${t}.desc`,{},r.desc);const u=ee(r.cost);if(r.category==="labor"&&r.unlockCondition)try{const R=document.createElement("div");R.className="upgrade-progress",R.style.fontSize="11px",R.style.color="var(--muted)",R.style.marginTop="4px";const k=Object.entries(e).filter(([h,M])=>M.category==="labor"&&!M.unlocked&&!M.purchased).map(([h,M])=>{const O=M.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return O?{id:h,requiredClicks:parseInt(O[1]),upgrade:M}:null}).filter(h=>h!==null).sort((h,M)=>h.requiredClicks-M.requiredClicks)}catch{}d.appendChild(I),d.appendChild(A);const N=document.createElement("div");N.className="upgrade-status",N.textContent=u,N.style.animation="none",N.style.background="rgba(94, 234, 212, 0.12)",N.style.color="var(--accent)",N.style.border="1px solid rgba(94, 234, 212, 0.25)",N.style.borderRadius="999px",c.appendChild(i),c.appendChild(d),c.appendChild(N),c.addEventListener("click",R=>{R.stopPropagation(),U&&console.log("🖱️ Upgrade item clicked!",t),_(t)},!1),U&&c.addEventListener("mousedown",R=>{console.log("🖱️ Mousedown detected on upgrade:",t)}),v.appendChild(c),U&&console.log(`✅ Upgrade item created and appended: ${t}`,c)})}function _(f){U&&(console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",f));const v=s();U&&console.log("Current cash:",v);const y=e[f];if(!y){console.error("업그레이드를 찾을 수 없습니다:",f),U&&console.log("Available upgrade IDs:",Object.keys(e));return}if(U&&console.log("Upgrade found:",{name:y.name,cost:y.cost,unlocked:y.unlocked,purchased:y.purchased}),y.purchased){q(C("msg.upgradeAlreadyPurchased")),U&&console.log("Already purchased");return}if(v<y.cost){q(C("msg.upgradeInsufficientFunds",{cost:ee(y.cost)})),U&&console.log("Not enough cash. Need:",y.cost,"Have:",v);return}U&&console.log("Purchase successful! Applying effect..."),a(v-y.cost),y.purchased=!0;try{y.effect(),q(C("msg.upgradePurchased",{name:C(`upgrade.${f}.name`,{},y.name),desc:C(`upgrade.${f}.desc`,{},y.desc)})),U&&console.log("Effect applied successfully")}catch(g){console.error(`업그레이드 효과 적용 실패 (${f}):`,g),q(C("msg.upgradeEffectError"))}E(),b(),Ne(e)}return{updateUpgradeAffordability:b,updateUpgradeProgress:S,updateUpgradeList:E,purchaseUpgrade:_}}const Ze={TICK_INTERVAL_MS:50,AUTO_SAVE_INTERVAL_MS:5e3,LEADERBOARD_THROTTLE_MS:3e4,CLICK_EFFECT_DURATION_MS:300,RELOAD_DELAY_MS:500},gn={MIN_INTERVAL_MS:12e4,RANDOM_RANGE_MS:18e4},be={PERFORMANCE_BONUS_CHANCE:.02,PERFORMANCE_BONUS_MULTIPLIER:10,AUTO_CLICK_CHANCE:1},G={CAREER_FADE_OUT:300,CAREER_BG_TRANSITION:800,CAREER_FADE_IN:500,CAREER_CARD:600};function _n(n){const{state:e,UPGRADES:s,CAREER_LEVELS:a,settings:o,getClickIncome:b,checkCareerPromotion:S,updateUpgradeProgress:E,updateUI:_,elWork:f}=n;function v(){return b()}function y(t){return s.performance_bonus&&s.performance_bonus.purchased&&Math.random()<be.PERFORMANCE_BONUS_CHANCE?{income:t*be.PERFORMANCE_BONUS_MULTIPLIER,bonusApplied:!0}:{income:t,bonusApplied:!1}}function g(){const t=Object.entries(s).filter(([r,c])=>c.category==="labor"&&!c.unlocked&&!c.purchased).map(([r,c])=>{var A;const i=c.unlockCondition.toString(),d=i.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:r,requiredClicks:parseInt(d[1]),upgrade:c};const I=i.match(/careerLevel\s*>=\s*(\d+)/);if(I){const u=parseInt(I[1]),N=((A=a[u])==null?void 0:A.requiredClicks)||1/0;return{id:r,requiredClicks:N,upgrade:c}}return null}).filter(r=>r!==null).sort((r,c)=>r.requiredClicks-c.requiredClicks);if(t.length>0){const r=t[0],c=r.requiredClicks-e.totalClicks;(c===50||c===25||c===10||c===5)&&q(C("msg.nextUpgradeHint",{name:C(`upgrade.${r.id}.name`),remaining:c}))}}function p(t,r){o.particles&&Me(t??0,r??0),f.classList.add("click-effect"),setTimeout(()=>f.classList.remove("click-effect"),Ze.CLICK_EFFECT_DURATION_MS)}function m(t,r){let c=v();const{income:i,bonusApplied:d}=y(c);c=i,d&&q(C("msg.bonusPaid")),e.cash+=c,e.totalClicks+=1,e.totalLaborIncome+=c,e.lifetimeEarnings+=c,g(),S()&&_(),E(),p(t,r),Le(c),_()}return{handleWorkAction:m,calculateClickIncome:v,applyPerformanceBonus:y,checkUpgradeProgress:g}}function kn(n){const{state:e,UPGRADES:s,saveLoadManager:a,LeaderboardUI:o,Diary:b,t:S,updateUI:E,updateAutoWorkUI:_}=n;function f(){e.deposits=0,e.savings=0,e.bonds=0,e.usStocks=0,e.cryptos=0,e.villas=0,e.officetels=0,e.apartments=0,e.shops=0,e.buildings=0,e.towers_run=0,e.depositsLifetime=0,e.savingsLifetime=0,e.bondsLifetime=0,e.usStocksLifetime=0,e.cryptosLifetime=0,e.villasLifetime=0,e.officetelsLifetime=0,e.apartmentsLifetime=0,e.shopsLifetime=0,e.buildingsLifetime=0,__IS_DEV__&&console.warn("[resetHoldings] 보유 수량 초기화 완료")}function v(g){for(const p of Object.values(g))p.unlocked=!1,p.purchased=!1;__IS_DEV__&&console.warn("[resetUpgrades] 업그레이드 초기화 완료")}async function y(g="unknown"){__IS_DEV__&&console.warn(`🔄 자동 프레스티지 실행 (source: ${g})`);try{const p=Ue();p>0&&__IS_DEV__&&console.warn(`💼 경력 포인트 획득: +${p} CP (총 ${e.careerPoints} CP)`),Ae(),f(),v(s),e.currentMarketEvent=null,e.marketEventEndTime=0,e.marketMultiplier=1;const m=De();__IS_DEV__&&(m.cash>0||m.deposits>0||m.career>0||m.villa>0)&&console.warn("🎁 시작 보너스 적용:",m),_();try{E()}catch(t){console.error("❌ UI 업데이트 중 오류:",t)}try{a.saveGame()}catch(t){console.error("❌ 게임 저장 중 오류:",t)}if(e.playerNickname)try{await o.updateLeaderboardEntry(!0)}catch(t){console.error("리더보드 업데이트 실패:",t)}try{b.addLog(S("msg.prestigeComplete"))}catch(t){console.error("일기장 로그 실패:",t)}__IS_DEV__&&console.warn("✅ 프레스티지 완료 (누적 데이터 유지)")}catch(p){throw console.error("❌ 프레스티지 실행 중 치명적 오류:",p),console.error("스택:",p.stack),p}}return{performPrestige:y,resetHoldings:f,resetUpgrades:v}}const pe=new Set;function Se(n){return!n||pe.has(n)?Promise.resolve():new Promise(e=>{const s=new Image;s.onload=()=>{pe.add(n),e()},s.onerror=e,s.src=n})}function hn(){var s,a;const n=l.careerLevel,e=[];return(s=z[n])!=null&&s.bgImage&&e.push(z[n].bgImage),(a=z[n+1])!=null&&a.bgImage&&e.push(z[n+1].bgImage),Promise.all(e.map(Se))}function En(n){const{elWorkArea:e}=n;function s(){const a=oe();if(a&&l.totalClicks>=a.requiredClicks){l.careerLevel+=1;const o=te(),b=re();q(C("msg.promoted",{career:X(l.careerLevel),income:ne(b)})),e&&(e.style.transition=`opacity ${G.CAREER_FADE_OUT}ms ease-out`,e.style.opacity="0.5",setTimeout(()=>{o.bgImage?(e.style.transition=`background-image ${G.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${G.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage=`url('${o.bgImage}')`):(e.style.transition=`background-image ${G.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${G.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),e.style.opacity="1"},G.CAREER_FADE_OUT));const S=document.querySelector(".career-card");S&&(S.style.animation="none",setTimeout(()=>{S.style.animation=`careerPromotion ${G.CAREER_CARD}ms ease-out`},10));const E=document.getElementById("currentCareer");E&&E.setAttribute("aria-label",C("msg.promoted",{career:X(l.careerLevel),income:ne(b)}));const _=z[l.careerLevel+1];return _!=null&&_.bgImage&&Se(_.bgImage),!0}return!1}return{checkCareerPromotion:s,getClickIncome:re,getCurrentCareer:te,getNextCareer:oe,getCareerName:X}}const fe=3e4,ge="clicksurvivor_lastNicknameChangeAt";function vn(n){const{SAVE_KEY:e,CLOUD_RESTORE_BLOCK_KEY:s,Modal:a,t:o,validateNickname:b,normalizeNickname:S,claimNickname:E,getUser:_,saveGame:f,updateUI:v,Diary:y,LeaderboardUI:g,upsertCloudSave:p,getPlayerNickname:m,setPlayerNickname:t,__IS_DEV__:r}=n;let c=!1,i=0;const d=5;function I(){try{const h=localStorage.getItem(e);return h&&JSON.parse(h).nickname||""}catch(h){return console.error("닉네임 확인 실패:",h),""}}function A(){if(c){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const h=I();if(h){t(h);return}c=!0;try{sessionStorage.setItem(s,"1")}catch(M){console.warn("sessionStorage set 실패:",M)}setTimeout(()=>{const M=async K=>{const O=b(K);if(!O.ok){let w="";switch(O.reasonKey){case"empty":w=o("settings.nickname.change.empty");break;case"tooShort":w=o("settings.nickname.change.tooShort");break;case"tooLong":w=o("settings.nickname.change.tooLong");break;case"invalid":w=o("settings.nickname.change.invalid");break;case"banned":w=o("settings.nickname.change.banned");break;default:w=o("settings.nickname.change.invalid")}if(a.openInfoModal(o("modal.error.nicknameFormat.title"),w,"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}A();return}const{raw:B,key:H}=S(K),P=await _();if(!P){t(B),i=0,f(),y.addLog(o("msg.nicknameSet",{nickname:m()})),y.addLog(o("settings.nickname.change.loginRequired"));try{sessionStorage.removeItem(s)}catch(w){console.warn("sessionStorage remove 실패:",w)}return}try{const w=await E(B,P.id);if(!w.success){if(w.error==="taken"?a.openInfoModal(o("modal.error.nicknameTaken.title"),o("settings.nickname.change.taken"),"⚠️"):a.openInfoModal(o("modal.error.nicknameFormat.title"),o("settings.nickname.change.claimFailed"),"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}A();return}i=0,t(B),f(),y.addLog(o("msg.nicknameSet",{nickname:m()}));try{localStorage.removeItem("clicksurvivor_needsNicknameChange")}catch{}try{await g.updateLeaderboardEntry(!0)}catch(L){console.error("리더보드 업데이트 실패:",L)}try{sessionStorage.removeItem(s)}catch(L){console.warn("sessionStorage remove 실패:",L)}}catch(w){if(console.error("닉네임 설정 실패:",w),a.openInfoModal(o("modal.error.nicknameFormat.title"),o("settings.nickname.change.claimFailed"),"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과 (에러), 모달 중단"),i=0;return}A()}};a.openInputModal(o("modal.nickname.title"),o("modal.nickname.message"),M,{icon:"✏️",primaryLabel:o("button.confirm"),placeholder:o("modal.nickname.placeholder"),maxLength:6,defaultValue:"",required:!0})},500)}function u(){try{const h=localStorage.getItem(ge);if(!h)return{allowed:!0};const M=parseInt(h,10),O=Date.now()-M;return O>=fe?{allowed:!0}:{allowed:!1,remainingSeconds:Math.ceil((fe-O)/1e3)}}catch{return{allowed:!0}}}function N(){try{localStorage.setItem(ge,String(Date.now()))}catch(h){console.warn("쿨타임 저장 실패:",h)}}function R(){const h=u();if(!h.allowed){a.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.cooldown",{seconds:h.remainingSeconds||0}),"⏱️");return}const M=m()||"";a.openInputModal(o("settings.nickname.modal.title"),o("settings.nickname.modal.message"),k,{icon:"✏️",primaryLabel:o("settings.nickname.modal.submit"),secondaryLabel:o("settings.nickname.modal.cancel"),placeholder:o("settings.nickname.modal.placeholder"),maxLength:6,defaultValue:M,required:!0})}async function k(h){const M=b(h);if(!M.ok){let P="";switch(M.reasonKey){case"empty":P=o("settings.nickname.change.empty");break;case"tooShort":P=o("settings.nickname.change.tooShort");break;case"tooLong":P=o("settings.nickname.change.tooLong");break;case"invalid":P=o("settings.nickname.change.invalid");break;case"banned":P=o("settings.nickname.change.banned");break;default:P=o("settings.nickname.change.invalid")}a.openInfoModal(o("modal.error.nicknameFormat.title"),P,"⚠️");return}const{raw:K,key:O}=S(h),B=S(m()||"");if(O===B.key){r&&console.log("[Nickname] 변경 없음: 동일한 닉네임");return}const H=await _();if(!H){const P=m();t(K),f(),v(),y.addLog(o("settings.nickname.change.success")),y.addLog(o("settings.nickname.change.loginRequired")),r&&console.log(`[Nickname] 로컬 저장 완료 (비로그인): "${P}" → "${m()}"`);return}try{const P=await E(K,H.id);if(!P.success){P.error==="taken"?(a.openInfoModal(o("modal.error.nicknameTaken.title"),o("settings.nickname.change.taken"),"⚠️"),setTimeout(()=>{R()},500)):a.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.claimFailed"),"⚠️");return}const w=m();t(K),f();try{const L=JSON.parse(localStorage.getItem(e)||"{}");await p("seoulsurvival",L),r&&console.log("[Nickname] 클라우드 저장 완료")}catch(L){console.error("클라우드 저장 실패:",L)}try{await g.updateLeaderboardEntry(!0)}catch(L){console.error("리더보드 업데이트 실패:",L)}try{localStorage.removeItem("clicksurvivor_needsNicknameChange"),sessionStorage.removeItem("clicksurvivor_nicknameModalAutoOpened")}catch{}N(),v(),y.addLog(o("settings.nickname.change.success")),r&&console.log(`[Nickname] 변경 완료: "${w}" → "${m()}"`)}catch(P){console.error("닉네임 변경 실패:",P),a.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.claimFailed"),"⚠️")}}return{ensureNicknameModal:A,openNicknameChangeModal:R,handleNicknameChangeFromModal:k,checkNicknameCooldown:u,saveNicknameCooldown:N}}function Cn(n){const{gameState:e,UPGRADES:s,TIMING:a,MARKET_EVENT_TIMING:o,PROBABILITY:b,getRps:S,getFinancialIncome:E,getPropertyIncome:_,getClickIncome:f,checkCareerPromotion:v,checkMarketEvent:y,checkAchievements:g,checkUpgradeUnlocks:p,startMarketEvent:m,updateUI:t,saveGame:r,Animations:c,elWork:i}=n;let d=null,I=null,A=null,u=null,N=performance.now(),R=!1;function k(L=50){d||(N=performance.now(),d=setInterval(()=>{y(),g(),p();const $=performance.now(),x=Math.min(($-N)/1e3,1);N=$;const Q=S()*x;if(e.cash+=Q,e.lifetimeEarnings+=Q,e.depositsLifetime+=E("deposit",e.deposits)*x,e.savingsLifetime+=E("savings",e.savings)*x,e.bondsLifetime+=E("bond",e.bonds)*x,e.usStocksLifetime+=E("usStock",e.usStocks)*x,e.cryptosLifetime+=E("crypto",e.cryptos)*x,e.villasLifetime+=_("villa",e.villas)*x,e.officetelsLifetime+=_("officetel",e.officetels)*x,e.apartmentsLifetime+=_("apartment",e.apartments)*x,e.shopsLifetime+=_("shop",e.shops)*x,e.buildingsLifetime+=_("building",e.buildings)*x,document.hidden){R=!0;return}R||(R=!0,requestAnimationFrame(()=>{t(),R=!1}))},L))}function h(){I||(I=setInterval(()=>{r&&r()},a.AUTO_SAVE_INTERVAL_MS))}function M(){A||(A=setInterval(()=>{if(e.autoClickEnabled){const L=f();if(e.cash+=L,e.totalClicks+=1,e.totalLaborIncome+=L,e.lifetimeEarnings+=L,v(),i&&(i.classList.remove("auto-click-pulse"),i.offsetHeight,i.classList.add("auto-click-pulse")),c.showIncomeAnimation(L),s.performance_bonus&&s.performance_bonus.purchased&&Math.random()<b.PERFORMANCE_BONUS_CHANCE){const $=L*9;e.cash+=$,e.totalLaborIncome+=$,e.lifetimeEarnings+=$}}},1e3))}function K(){if(u)return;const L=()=>{const $=Math.random()*o.RANDOM_RANGE_MS+o.MIN_INTERVAL_MS;u=setTimeout(()=>{e.marketEventEndTime===0&&m(),L()},$)};L()}function O(){document.addEventListener("visibilitychange",()=>{!document.hidden&&R&&(t(),R=!1)})}function B(){O(),k(50),h(),M(),K()}function H(){d&&(clearInterval(d),d=null),I&&(clearInterval(I),I=null),A&&(clearInterval(A),A=null),u&&(clearTimeout(u),u=null)}function P(){d&&(clearInterval(d),d=null)}function w(L=50){d||k(L)}return{startAllLoops:B,stopAllLoops:H,startTickLoop:k,startAutoSave:h,startAutoClick:M,startMarketEventChecker:K,pauseTickLoop:P,resumeTickLoop:w}}export{we as C,pn as D,gn as M,W as P,Ze as T,sn as a,an as b,rn as c,q as d,cn as e,J as f,bn as g,dn as h,un as i,Te as j,vn as k,kn as l,fn as m,Pe as n,Cn as o,ln as p,hn as q,mn as r,yn as s,Ye as t,En as u,be as v,_n as w};
