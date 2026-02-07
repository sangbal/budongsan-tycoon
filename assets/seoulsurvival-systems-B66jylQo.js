import{t as v,g as te}from"./seoulsurvival-i18n-CFcB2WGI.js";import{f as re,a as ae}from"./seoulsurvival-utils-CSxo2RCp.js";import{g as y,r as we,C as Q,a as ne,b as ce,c as se,d as ie}from"./seoulsurvival-core-CVAlHGxq.js";import{s as Ue,c as De}from"./seoulsurvival-ui-DTgQ_gwj.js";const Le=[{id:"real_estate_mogul",nameKey:"synergy.realEstateMogul.name",descKey:"synergy.realEstateMogul.desc",icon:"🏢",check:n=>n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"property_income",multiplier:1.3},{id:"finance_guru",nameKey:"synergy.financeGuru.name",descKey:"synergy.financeGuru.desc",icon:"💰",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0,effect:"financial_income",multiplier:1.25},{id:"diversification",nameKey:"synergy.diversification.name",descKey:"synergy.diversification.desc",icon:"📊",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0&&n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"all_income",multiplier:1.15},{id:"seoul_ruler",nameKey:"synergy.seoulRuler.name",descKey:"synergy.seoulRuler.desc",icon:"🗼",check:n=>n.buildings>=5,effect:"all_income",multiplier:1.5},{id:"completionist",nameKey:"synergy.completionist.name",descKey:"synergy.completionist.desc",icon:"🏆",check:n=>n.__completionistUnlocked||!1,effect:"all_income",multiplier:2}];function qe(n=y){return Le.filter(e=>e.check(n))}function Me(n,e){const s=qe(n);let t=1;for(const a of s)(a.effect===e||a.effect==="all_income")&&(t*=a.multiplier);return t}function kn(n,e=y){return n*Me(e,"property_income")}function hn(n,e=y){return n*Me(e,"financial_income")}function Be(n){const e=Object.values(n).every(s=>s.purchased);y.__completionistUnlocked=e}function En(n=y){return Le.map(e=>({id:e.id,nameKey:e.nameKey,descKey:e.descKey,icon:e.icon,active:e.check(n),multiplier:e.multiplier,effect:e.effect}))}function xe(n,e){if(n<=0)return 0;const s=n>=1?5:0,t=Math.floor(Math.sqrt(n)*2),a=e>1e12?Math.log10(e/1e12):0;return Math.max(1,Math.floor(t*(1+a)))+s}function Re(){let n=0;for(const e of y.purchasedUpgrades||[]){const s=z.find(t=>t.id===e);s&&(n+=s.cost)}return n}function Cn(){const n=y.careerPoints||0,e=Re();return 1+(n+e)*.02}function Fe(){const n=y.careerPoints||0,e=Re();return n+e}const z=[{id:"I1_auto_start",category:"QUICK_START",nameKey:"cp.I1.name",descKey:"cp.I1.desc",cost:1,icon:"☕",requires:[],effect:{type:"prestige_auto_click",value:1}},{id:"I2_auto_speed",category:"QUICK_START",nameKey:"cp.I2.name",descKey:"cp.I2.desc",cost:5,icon:"⚡",requires:["I1_auto_start"],effect:{type:"prestige_auto_click",value:2}},{id:"I3_auto_turbo",category:"QUICK_START",nameKey:"cp.I3.name",descKey:"cp.I3.desc",cost:12,icon:"🔥",requires:["I2_auto_speed"],effect:{type:"prestige_auto_click",value:4}},{id:"E1_parents",category:"QUICK_START",nameKey:"cp.E1.name",descKey:"cp.E1.desc",cost:2,icon:"👨‍👩‍👧",requires:[],effect:{type:"starting_deposits",value:5}},{id:"E2_connections",category:"QUICK_START",nameKey:"cp.E2.name",descKey:"cp.E2.desc",cost:5,icon:"🤝",requires:["E1_parents"],effect:{type:"starting_career",value:1}},{id:"E3_silver_spoon",category:"QUICK_START",nameKey:"cp.E3.name",descKey:"cp.E3.desc",cost:10,icon:"🥄",requires:["E2_connections"],effect:{type:"starting_bundle",value:{villa:1,career:2}}},{id:"D1_workaholic",category:"LABOR",nameKey:"cp.D1.name",descKey:"cp.D1.desc",cost:3,icon:"💪",requires:[],effect:{type:"click_income_multiplier",value:1.5}},{id:"D2_automation",category:"LABOR",nameKey:"cp.D2.name",descKey:"cp.D2.desc",cost:5,icon:"📊",requires:["D1_workaholic"],effect:{type:"auto_click_speed",value:2}},{id:"D3_ceo_mentality",category:"LABOR",nameKey:"cp.D3.name",descKey:"cp.D3.desc",cost:8,icon:"🎯",requires:["D2_automation"],effect:{type:"click_bonus_chance",value:.05}},{id:"H1_network_basic",category:"LABOR",nameKey:"cp.H1.name",descKey:"cp.H1.desc",cost:1,icon:"🍺",requires:[],effect:{type:"promotion_requirement_reduction",value:.2}},{id:"H2_network_power",category:"LABOR",nameKey:"cp.H2.name",descKey:"cp.H2.desc",cost:5,icon:"🏌️",requires:["H1_network_basic"],effect:{type:"promotion_requirement_reduction",value:.15}},{id:"H3_vip_connections",category:"LABOR",nameKey:"cp.H3.name",descKey:"cp.H3.desc",cost:12,icon:"🏰",requires:["H2_network_power"],effect:{type:"promotion_requirement_reduction",value:.15}},{id:"A1_mentor",category:"BOOST",nameKey:"cp.A1.name",descKey:"cp.A1.desc",cost:1,icon:"👨‍🏫",requires:[],effect:{type:"click_multiplier",value:1.2}},{id:"A2_network",category:"BOOST",nameKey:"cp.A2.name",descKey:"cp.A2.desc",cost:2,icon:"📱",requires:["A1_mentor"],effect:{type:"auto_income_multiplier",value:1.25}},{id:"A3_recognition",category:"BOOST",nameKey:"cp.A3.name",descKey:"cp.A3.desc",cost:3,icon:"🏆",requires:["A2_network"],effect:{type:"starting_cash",value:1e7}},{id:"A4_reputation",category:"BOOST",nameKey:"cp.A4.name",descKey:"cp.A4.desc",cost:5,icon:"⭐",requires:["A3_recognition"],effect:{type:"price_discount",value:.1}},{id:"B1_broker",category:"FINANCIAL",nameKey:"cp.B1.name",descKey:"cp.B1.desc",cost:3,icon:"📊",requires:[],effect:{type:"financial_income_multiplier",value:1.3}},{id:"B2_fund_manager",category:"FINANCIAL",nameKey:"cp.B2.name",descKey:"cp.B2.desc",cost:5,icon:"💼",requires:["B1_broker"],effect:{type:"financial_price_discount",value:.25}},{id:"B3_hedge_fund",category:"FINANCIAL",nameKey:"cp.B3.name",descKey:"cp.B3.desc",cost:8,icon:"🦈",requires:["B2_fund_manager"],effect:{type:"financial_to_property_synergy",value:1.15}},{id:"C1_realtor",category:"PROPERTY",nameKey:"cp.C1.name",descKey:"cp.C1.desc",cost:3,icon:"🏠",requires:[],effect:{type:"property_income_multiplier",value:1.3}},{id:"C2_builder",category:"PROPERTY",nameKey:"cp.C2.name",descKey:"cp.C2.desc",cost:5,icon:"🏗️",requires:["C1_realtor"],effect:{type:"property_price_discount",value:.25}},{id:"C3_redeveloper",category:"PROPERTY",nameKey:"cp.C3.name",descKey:"cp.C3.desc",cost:8,icon:"🌆",requires:["C2_builder"],effect:{type:"property_to_financial_synergy",value:1.15}},{id:"F1_preserve_1",category:"META",nameKey:"cp.F1.name",descKey:"cp.F1.desc",cost:6,icon:"💎",requires:[],effect:{type:"permanent_slot",value:1}},{id:"F2_preserve_2",category:"META",nameKey:"cp.F2.name",descKey:"cp.F2.desc",cost:15,icon:"💎",requires:["F1_preserve_1"],effect:{type:"permanent_slot",value:2}},{id:"G1_prediction",category:"META",nameKey:"cp.G1.name",descKey:"cp.G1.desc",cost:7,icon:"🔮",requires:[],effect:{type:"market_event_bonus",value:1.5}},{id:"G2_insider",category:"META",nameKey:"cp.G2.name",descKey:"cp.G2.desc",cost:12,icon:"📰",requires:["G1_prediction"],effect:{type:"market_event_preview",value:!0}}],$e={QUICK_START:{nameKey:"cp.cat.quickStart",icon:"🎒",color:"#fbbf24"},LABOR:{nameKey:"cp.cat.labor",icon:"💼",color:"#a78bfa"},BOOST:{nameKey:"cp.cat.boost",icon:"📚",color:"#4ade80"},FINANCIAL:{nameKey:"cp.cat.financial",icon:"💵",color:"#60a5fa"},PROPERTY:{nameKey:"cp.cat.property",icon:"🏘️",color:"#f97316"},META:{nameKey:"cp.cat.meta",icon:"⏳",color:"#6b7280"}},vn=["QUICK_START","LABOR","BOOST","FINANCIAL","PROPERTY","META"];function Ge(n){const e=z.find(t=>t.id===n);if(!e)return{canPurchase:!1,reason:"invalid_upgrade"};const s=y.purchasedUpgrades||[];if(s.includes(n))return{canPurchase:!1,reason:"already_purchased"};if(y.careerPoints<e.cost)return{canPurchase:!1,reason:"not_enough_cp"};for(const t of e.requires)if(!s.includes(t))return{canPurchase:!1,reason:"requires_not_met",missing:t};return{canPurchase:!0,reason:null}}function In(n){const{canPurchase:e}=Ge(n);if(!e)return!1;const s=z.find(t=>t.id===n);return y.careerPoints-=s.cost,y.purchasedUpgrades||(y.purchasedUpgrades=[]),y.purchasedUpgrades.push(n),!0}function J(){const n={click_multiplier:1,auto_income_multiplier:1,click_income_multiplier:1,financial_income_multiplier:1,property_income_multiplier:1,financial_to_property_synergy:1,property_to_financial_synergy:1,auto_click_speed:1,market_event_bonus:1,price_discount:0,financial_price_discount:0,property_price_discount:0,starting_cash:0,starting_deposits:0,starting_career:0,starting_bundle:null,click_bonus_chance:0,permanent_slot:0,market_event_preview:!1,promotion_requirement_reduction:0,prestige_auto_click:0};for(const e of y.purchasedUpgrades||[]){const s=z.find(h=>h.id===e);if(!s)continue;const{type:t,value:a}=s.effect;t.includes("multiplier")||t.includes("synergy")||t==="auto_click_speed"||t==="market_event_bonus"?n[t]=(n[t]||1)*a:t.includes("discount")?n[t]=Math.min(.5,(n[t]||0)+a):t==="permanent_slot"?n[t]=Math.max(n[t]||0,a):t==="market_event_preview"||t==="starting_bundle"?n[t]=a:t==="promotion_requirement_reduction"?n[t]=(n[t]||0)+a:t==="prestige_auto_click"?n[t]=Math.max(n[t]||0,a):n[t]=(n[t]||0)+(typeof a=="number"?a:0)}return n}function He(){const n=J(),e={cash:0,deposits:0,career:0,villa:0};return n.starting_cash>0&&(y.cash+=n.starting_cash,e.cash=n.starting_cash),n.starting_deposits>0&&(y.deposits+=n.starting_deposits,e.deposits=n.starting_deposits),n.starting_career>0&&(y.careerLevel=Math.max(y.careerLevel,n.starting_career),e.career=n.starting_career),n.starting_bundle&&(n.starting_bundle.villa&&(y.villas+=n.starting_bundle.villa,y.unlockedProducts.villa=!0,e.villa=n.starting_bundle.villa),n.starting_bundle.career&&(y.careerLevel=Math.max(y.careerLevel,n.starting_bundle.career),e.career=Math.max(e.career,n.starting_bundle.career))),e}function An(n,e){const t=J().permanent_slot;if(e>=t||!(y.purchasedUpgrades||[]).includes(n))return!1;const a=z.find(L=>L.id===n);if(a!=null&&a.id.startsWith("F"))return!1;y.permanentSlots||(y.permanentSlots=[]);const h=y.permanentSlots.indexOf(n);return h!==-1&&(y.permanentSlots[h]=null),y.permanentSlots[e]=n,!0}function Sn(n){y.permanentSlots&&y.permanentSlots[n]&&(y.permanentSlots[n]=null)}function We(){const n=xe(y.towers_lifetime,y.lifetimeEarnings);return y.careerPoints+=n,y.totalCareerPoints+=n,n}function Ln(){const n={};for(const e of Object.keys($e))n[e]=z.filter(s=>s.category===e);return n}function Mn(n){const e=J(),t={click_power:"click_multiplier",auto_income:"auto_income_multiplier",all_income:"auto_income_multiplier",price_reduction:null}[n]||n;return t===null?1-(e.price_discount||0):e[t]||1}function Ve(){return 1+Fe()*.01}function je(){return J().promotion_requirement_reduction||0}function Ye(){const n=je();return Math.max(.5,1-n)}function ze(){return J().prestige_auto_click||0}function Qe(n){const e=Ve(),s=Ye();return Math.ceil(n*s/e)}const Je=["오늘은 체크 하나를 더했다. ({name})","작게나마 성취. {name}라니, 나도 꽤 한다.",`기록해둔다: {name}.
{desc}`,`"{name}" 달성.
{descMemo}`,"별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. ({name})",`또 하나의 마일스톤. {name}.
{desc}`,`작은 성취도 성취다. {name}.
{desc}`,`하루하루가 쌓인다. 오늘은 {name}.
{desc}`,`기록에 하나 더. {name}.
{desc}`,`뿌듯함이 조금씩. {name} 달성.
{desc}`,`이런 게 인생이지. {name}.
{desc}`,`작은 발걸음이 모여 길이 된다. {name}.
{desc}`],Xe=[`명함이 바뀌었다. {career}.
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
{extra}`],de={적금:[`자동이체 버튼이 눈에 들어왔다.
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
{body}`]},Ze=[`문이 하나 열렸다.
{body}`,`다음 장으로 넘어갈 수 있게 됐다.
{body}`,`아직 초반인데도, 벌써 선택지가 늘었다.
{body}`,"드디어. {body}",`새로운 가능성이 열렸다.
{body}`,`선택지가 하나 더 생겼다.
{body}`,`다음 단계로 나아갈 수 있다.
{body}`,`기회의 문이 열렸다.
{body}`,`새로운 길이 보인다.
{body}`,`진행의 길이 열렸다.
{body}`],en=[`지갑이 얇아서 아무것도 못 했다.
{body}`,`현실 체크. 돈이 없다.
{body}`,`오늘은 참는다. 아직은 무리.
{body}`,`계산기만 두드리고 끝.
{body}`,`통장 잔고가 거짓말을 한다.
{body}`,`돈이 부족하다는 건 늘 아프다.
{body}`,`다시 모아야 한다. 조금 더.
{body}`,`욕심을 접어야 할 때.
{body}`,`현실이 무겁다.
{body}`,`내일을 기다려야 한다.
{body}`],le={예금:[`일단은 안전한 데에 묶어두자.
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
{body}`]},nn=[`결심하고 질렀다.
{body}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
{body}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
{body}`,`한 발 더 나아갔다.
{body}`,`손이 먼저 움직였다.
{body}`,`투자의 길을 걷는다.
{body}`,`미래를 위한 선택.
{body}`,`돈이 돈을 버는 구조.
{body}`,`자산을 늘리는 순간.
{body}`,`투자자의 마음가짐.
{body}`],ye={코인:[`손이 떨리기 전에 내렸다.
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
{body}`]},on=[`정리할 건 정리했다.
{body}`,`가끔은 줄여야 산다.
{body}`,`현금이 필요했다. 그래서 팔았다.
{body}`,`미련은 접어두고 정리.
{body}`,`투자 포지션을 정리했다.
{body}`,`현금화의 선택.
{body}`,`자산을 정리하는 순간.
{body}`,`투자에서 벗어났다.
{body}`,`정리하고 다음 기회를 본다.
{body}`,`미련 없이 정리했다.
{body}`],tn=[`오늘은 뜻대로 안 됐다.
{body}`,`계획은 늘 계획대로 안 된다.
{body}`,`한 번 더. 다음엔 될 거다.
{body}`,`벽에 부딪혔다.
{body}`,`실패는 또 다른 시작.
{body}`,`좌절은 잠시뿐.
{body}`,`다시 일어서야 한다.
{body}`,`실패도 경험이다.
{body}`,`다음 기회를 기다린다.
{body}`,`실패에서 배운다.
{body}`],me={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
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
{body}`]},ue={코인:["심장이 겨우 진정됐다. ({name})",`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
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
{name}`],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},be={코인:[`메모(코인): 멘탈 관리가 수익률이다.
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
{body}`]},rn=[`메모.
{body}`,`적어둔다.
{body}`,`까먹기 전에 기록.
{body}`,`투자 노트에 기록.
{body}`,`기억해둘 것.
{body}`,`나중을 위해 기록.
{body}`],pe={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
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
{name}`]},fe={노동:[`일하는 방식이 바뀌었다.
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
{body}`]},an=[`찜찜한 기분이 남았다.
{body}`,`뭔가 삐끗한 느낌.
{body}`,`일단 기록만 남긴다.
{body}`,`뭔가 이상한 느낌.
{body}`,`불안한 기분이 든다.
{body}`,`주의가 필요할 것 같다.
{body}`,`뭔가 잘못된 것 같다.
{body}`,`경고의 신호가 느껴진다.
{body}`],cn=["{base}",`{justWrite}
{base}`,`{todayRecord}
{base}`,"{anyway} {base}",`{justRecord}
{base}`,`{memo}
{base}`,`{remember}
{base}`,`{recordForLater}
{base}`,`{goodToWrite}
{base}`,`{leaveRecord}
{base}`],sn=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]],dn=["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"];let j=null,Y=null,Te=null;const ge=new Map;let X=null,Z=null;function ln(n,e){j=n,Y=e,Te=e.sessionStartTime}const ee=n=>String(n).padStart(2,"0"),_e=n=>Math.floor(Math.random()*n),Ne=n=>n.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu,"").trim(),F=n=>Ne(n).replace(/\s+/g," ").trim();function P(n,e){if(!Array.isArray(e)||e.length===0)return"";const s=ge.get(n);let t=_e(e.length);return e.length>1&&typeof s=="number"&&t===s&&(t=(t+1+_e(e.length-1))%e.length),ge.set(n,t),e[t]}function yn(n){const e=String(n||"");for(const[s,t]of sn)if(e.includes(s))return t;return""}function O(n,e){let s=n;for(const[t,a]of Object.entries(e))s=s.replace(new RegExp(`\\{${t}\\}`,"g"),a||"");return s.trim()}function mn(){if(!Y)return;const n=new Date,e=n.getFullYear(),s=ee(n.getMonth()+1),t=ee(n.getDate()),a=typeof Y.gameStartTime<"u"&&Y.gameStartTime?Y.gameStartTime:Te,h=Math.max(1,Math.floor((Date.now()-a)/864e5)+1),L=document.getElementById("diaryHeaderMeta");L&&(L.textContent=`${e}.${s}.${t}(${v("ui.dayCount",{days:h})})`);const _=document.getElementById("diaryMetaDate"),E=document.getElementById("diaryMetaDay");_&&(_.textContent=v("ui.today",{date:`${e}.${s}.${t}`})),E&&(E.textContent=v("ui.dayCount",{days:h}))}function un(n){var _,E,b,C,l,f,p,m;const e=String(n||"").trim();if(new RegExp(v("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(e)||/다음\s*업그레이드/.test(e)&&/클릭\s*남/.test(e))return"";if(e.startsWith("🏆")&&(e.includes("업적 달성:")||e.includes("Achievement Unlocked:"))){const o=Ne(e).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[r,c]=o.split(/\s*-\s*/),i=P("achievement",Je);return O(i,{name:r||"업적",desc:c||"",descMemo:c?`메모: ${c}`:""})}const t=te()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(e.startsWith("🎉")&&(e.includes("승진했습니다")||/promoted/i.test(e))){const o=e.match(t),r=((_=o==null?void 0:o[1])==null?void 0:_.trim())||"다음 단계",c=(E=o==null?void 0:o[2])==null?void 0:E.trim(),i=c?c.replace(/[()]/g,"").trim():"",d=P("promotion",Xe);return O(d,{career:r,extra:i})}const a=te()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(e.startsWith("🔓")){const o=F(e),r=e.match(a),c=((r==null?void 0:r[1])||"").trim();if(c&&de[c]){const d=P(`unlock_${c}`,de[c]);return O(d,{body:o})}const i=P("unlock",Ze);return O(i,{body:o})}if(e.startsWith("💸 자금이 부족합니다")){const o=F(e),r=P("noMoney",en);return O(r,{body:o})}if(e.startsWith("✅")&&(e.includes("구입했습니다")||/purchased/i.test(e))){const o=F(e),r=e.match(/^✅\s*(.+?)\s+\d/),c=((r==null?void 0:r[1])||"").trim();if(c&&le[c]){const d=P(`buy_${c}`,le[c]);return O(d,{body:o})}const i=P("buy",nn);return O(i,{body:o})}if(e.startsWith("💰")&&e.includes("판매했습니다")){const o=F(e),r=e.match(/^💰\s*(.+?)\s+\d/),c=((r==null?void 0:r[1])||"").trim();if(c&&ye[c]){const d=P(`sell_${c}`,ye[c]);return O(d,{body:o})}const i=P("sell",on);return O(i,{body:o})}if(e.startsWith("❌")){const o=F(e),r=P("fail",tn);return O(r,{body:o})}if(e.startsWith("📈")&&e.includes("발생")){const o=F(e),r=(C=(b=e.match(/^📈\s*(.+?)\s*발생/))==null?void 0:b[1])==null?void 0:C.trim(),i=(((f=(l=e.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:l[1])==null?void 0:f.trim())||r||"").trim(),d=yn(`${i} ${o}`)||"시장";X=d,Z=i||o;const I=me[d]||me.시장,A=P(`market_${d}`,I);return O(A,{body:o})}if(e.startsWith("📉")&&e.includes("종료")){const o=X||"시장",r=Z||"",i=["빌라","오피스텔","아파트","상가","빌딩"].includes(o)?"부동산":o,d=ue[i]||ue.시장,I=P(`marketEnd_${i}`,d);return X=null,Z=null,O(I,{name:r})}if(e.startsWith("💡")){const o=F(e),r=X||"",c=Z||"",d=["빌라","오피스텔","아파트","상가","빌딩"].includes(r)?"부동산":r;if(d&&be[d]){const A=P(`memo_${d}`,be[d]);return O(A,{body:o,name:c})}const I=P("memo",rn);return O(I,{body:o})}if(e.startsWith("🎁")&&e.includes("해금")){const o=F(e),r=((m=(p=e.match(/해금:\s*(.+)$/))==null?void 0:p[1])==null?void 0:m.trim())||"",i=(A=>{const u=String(A||"");return u.includes("예금")?"예금":u.includes("적금")?"적금":u.includes("미국주식")||u.includes("미장")||u.includes("🇺🇸")?"미국주식":u.includes("코인")||u.includes("₿")||u.includes("암호")?"코인":u.includes("주식")?"국내주식":u.includes("빌딩")?"빌딩":u.includes("상가")?"상가":u.includes("아파트")?"아파트":u.includes("오피스텔")?"오피스텔":u.includes("빌라")?"빌라":u.includes("월세")||u.includes("부동산")?"부동산":u.includes("클릭")||u.includes("노동")||u.includes("업무")||u.includes("CEO")||u.includes("커리어")?"노동":""})(`${r} ${o}`)||"기본",d=pe[i]||pe.기본,I=P(`upgradeUnlock_${i}`,d);return O(I,{name:r||o})}if(e.startsWith("✅")&&e.includes("구매!")){const o=F(e),r=e.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),c=((r==null?void 0:r[1])||"").trim(),i=((r==null?void 0:r[2])||"").trim(),I=(M=>{const g=String(M||"");return g.includes("예금")?"예금":g.includes("적금")?"적금":g.includes("미국주식")||g.includes("미장")||g.includes("🇺🇸")?"미국주식":g.includes("코인")||g.includes("₿")||g.includes("암호")?"코인":g.includes("주식")?"국내주식":g.includes("빌딩")?"빌딩":g.includes("상가")?"상가":g.includes("아파트")?"아파트":g.includes("오피스텔")?"오피스텔":g.includes("빌라")?"빌라":g.includes("월세")||g.includes("부동산")?"부동산":g.includes("클릭")||g.includes("노동")||g.includes("업무")||g.includes("CEO")||g.includes("커리어")?"노동":""})(`${c} ${i} ${o}`)||"기본",A=[c,i].filter(Boolean).join(" — ")||o,u=fe[I]||fe.기본,R=P(`upgradeBuy_${I}`,u);return O(R,{core:A,body:o})}if(e.startsWith("⚠️")){const o=F(e),r=P("warn",an);return O(r,{body:o})}const h=F(e),L=P("default",cn);return O(L,{base:h,justWrite:v("diary.justWrite"),todayRecord:v("diary.todayRecord"),anyway:v("diary.anyway"),justRecord:v("diary.justRecord"),memo:v("diary.memo"),remember:v("diary.remember"),recordForLater:v("diary.recordForLater"),goodToWrite:v("diary.goodToWrite"),leaveRecord:v("diary.leaveRecord")})}function G(n){var f;if(!j||!Y||dn.some(p=>n.includes(p)))return;const s=new Date,t=`${ee(s.getHours())}:${ee(s.getMinutes())}`;mn();const a=un(n);if(!a)return;const h=document.createElement("p"),_=a.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),E=(_[0]??"").trim(),b=_.slice(1).map(p=>String(p).trim()).filter(Boolean),C=`<span class="diary-voice">${E}</span>`+(b.length?`
<span class="diary-info">${b.join(`
`)}</span>`:"");if(h.innerHTML=`<span class="diary-time">${t}</span>${C}`,!j){console.error("[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.");return}j.prepend(h);const l=100;for(;j.children.length>l;)(f=j.lastElementChild)==null||f.remove()}const Rn=Object.freeze(Object.defineProperty({__proto__:null,addLog:G,initDiary:ln},Symbol.toStringTag,{value:"Module"}));var ve,Ie;const B=!!((Ie=(ve=import.meta)==null?void 0:ve.env)!=null&&Ie.DEV);function Tn(n){const{UPGRADES:e,getCash:s,setCash:t,CAREER_LEVELS:a}=n;function h(){const b=s();document.querySelectorAll(".upgrade-item").forEach(l=>{const f=l.dataset.upgradeId,p=e[f];p&&!p.purchased&&(b>=p.cost?l.classList.add("affordable"):l.classList.remove("affordable"))})}function L(b){document.querySelectorAll(".upgrade-progress").forEach(l=>{const f=l.closest(".upgrade-item");!f||!f.dataset.upgradeId||(Object.entries(e).filter(([m,o])=>o.category==="labor"&&!o.unlocked&&!o.purchased).map(([m,o])=>{var d;const r=o.unlockCondition.toString(),c=r.match(/totalClicks\s*>=\s*(\d+)/);if(c)return{id:m,requiredClicks:parseInt(c[1]),upgrade:o};const i=r.match(/careerLevel\s*>=\s*(\d+)/);return i?{id:m,requiredClicks:((d=a[parseInt(i[1])])==null?void 0:d.requiredClicks)||1/0,upgrade:o}:null}).filter(m=>m!==null).sort((m,o)=>m.requiredClicks-o.requiredClicks),l.textContent="")})}function _(){const b=s(),C=document.getElementById("upgradeList"),l=document.getElementById("upgradeCount");if(!C||!l)return;const f=Object.entries(e).filter(([o,r])=>r.unlocked&&!r.purchased);f.length===0?l.style.display="none":(l.style.display="",l.textContent=`(${f.length})`);const p=document.getElementById("noUpgradesMessage"),m=document.querySelector('.stats-section[data-section-id="upgrades"]');if(f.length===0){if(C.innerHTML="",p&&(p.textContent=v("ui.noUpgrades"),p.style.display="block"),m&&!m.classList.contains("collapsed")){m.classList.add("collapsed");const o=m.querySelector(".stats-toggle");o&&o.setAttribute("aria-expanded","false");const r=m.querySelector(".toggle-icon");r&&(r.textContent="▶")}return}if(m&&m.classList.contains("collapsed")){m.classList.remove("collapsed");const o=m.querySelector(".stats-toggle");o&&o.setAttribute("aria-expanded","true");const r=m.querySelector(".toggle-icon");r&&(r.textContent="▼")}p&&(p.style.display="none"),C.innerHTML="",B&&console.log(`🔄 Regenerating upgrade list with ${f.length} items`),f.forEach(([o,r])=>{const c=document.createElement("div");c.className="upgrade-item",c.dataset.upgradeId=o,b>=r.cost&&c.classList.add("affordable");const i=document.createElement("div");i.className="upgrade-icon",i.textContent=r.icon;const d=document.createElement("div");d.className="upgrade-info";const I=document.createElement("div");I.className="upgrade-name",I.textContent=v(`upgrade.${o}.name`,{},r.name);const A=document.createElement("div");A.className="upgrade-desc",A.textContent=v(`upgrade.${o}.desc`,{},r.desc);const u=re(r.cost);if(r.category==="labor"&&r.unlockCondition)try{const M=document.createElement("div");M.className="upgrade-progress",M.style.fontSize="11px",M.style.color="var(--muted)",M.style.marginTop="4px";const g=Object.entries(e).filter(([k,S])=>S.category==="labor"&&!S.unlocked&&!S.purchased).map(([k,S])=>{const U=S.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return U?{id:k,requiredClicks:parseInt(U[1]),upgrade:S}:null}).filter(k=>k!==null).sort((k,S)=>k.requiredClicks-S.requiredClicks)}catch{}d.appendChild(I),d.appendChild(A);const R=document.createElement("div");R.className="upgrade-status",R.textContent=u,R.style.animation="none",R.style.background="rgba(94, 234, 212, 0.12)",R.style.color="var(--accent)",R.style.border="1px solid rgba(94, 234, 212, 0.25)",R.style.borderRadius="999px",c.appendChild(i),c.appendChild(d),c.appendChild(R),c.addEventListener("click",M=>{M.stopPropagation(),B&&console.log("🖱️ Upgrade item clicked!",o),E(o)},!1),B&&c.addEventListener("mousedown",M=>{console.log("🖱️ Mousedown detected on upgrade:",o)}),C.appendChild(c),B&&console.log(`✅ Upgrade item created and appended: ${o}`,c)})}function E(b){B&&(console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",b));const C=s();B&&console.log("Current cash:",C);const l=e[b];if(!l){console.error("업그레이드를 찾을 수 없습니다:",b),B&&console.log("Available upgrade IDs:",Object.keys(e));return}if(B&&console.log("Upgrade found:",{name:l.name,cost:l.cost,unlocked:l.unlocked,purchased:l.purchased}),l.purchased){G(v("msg.upgradeAlreadyPurchased")),B&&console.log("Already purchased");return}if(C<l.cost){G(v("msg.upgradeInsufficientFunds",{cost:re(l.cost)})),B&&console.log("Not enough cash. Need:",l.cost,"Have:",C);return}B&&console.log("Purchase successful! Applying effect..."),t(C-l.cost),l.purchased=!0;try{l.effect(),G(v("msg.upgradePurchased",{name:v(`upgrade.${b}.name`,{},l.name),desc:v(`upgrade.${b}.desc`,{},l.desc)})),B&&console.log("Effect applied successfully")}catch(f){console.error(`업그레이드 효과 적용 실패 (${b}):`,f),G(v("msg.upgradeEffectError"))}_(),h(),Be(e)}return{updateUpgradeAffordability:h,updateUpgradeProgress:L,updateUpgradeList:_,purchaseUpgrade:E}}const bn={TICK_INTERVAL_MS:50,AUTO_SAVE_INTERVAL_MS:5e3,LEADERBOARD_THROTTLE_MS:3e4,CLICK_EFFECT_DURATION_MS:300,RELOAD_DELAY_MS:500},Nn={MIN_INTERVAL_MS:12e4,RANDOM_RANGE_MS:18e4},ke={PERFORMANCE_BONUS_CHANCE:.02,PERFORMANCE_BONUS_MULTIPLIER:10,AUTO_CLICK_CHANCE:1},H={CAREER_FADE_OUT:300,CAREER_BG_TRANSITION:800,CAREER_FADE_IN:500,CAREER_CARD:600};function Pn(n){const{state:e,UPGRADES:s,CAREER_LEVELS:t,settings:a,getClickIncome:h,checkCareerPromotion:L,updateUpgradeProgress:_,updateUI:E,elWork:b}=n;function C(){return h()}function l(o){return s.performance_bonus&&s.performance_bonus.purchased&&Math.random()<ke.PERFORMANCE_BONUS_CHANCE?{income:o*ke.PERFORMANCE_BONUS_MULTIPLIER,bonusApplied:!0}:{income:o,bonusApplied:!1}}function f(){const o=Object.entries(s).filter(([r,c])=>c.category==="labor"&&!c.unlocked&&!c.purchased).map(([r,c])=>{var A;const i=c.unlockCondition.toString(),d=i.match(/totalClicks\s*>=\s*(\d+)/);if(d)return{id:r,requiredClicks:parseInt(d[1]),upgrade:c};const I=i.match(/careerLevel\s*>=\s*(\d+)/);if(I){const u=parseInt(I[1]),R=((A=t[u])==null?void 0:A.requiredClicks)||1/0;return{id:r,requiredClicks:R,upgrade:c}}return null}).filter(r=>r!==null).sort((r,c)=>r.requiredClicks-c.requiredClicks);if(o.length>0){const r=o[0],c=r.requiredClicks-e.totalClicks;(c===50||c===25||c===10||c===5)&&G(v("msg.nextUpgradeHint",{name:v(`upgrade.${r.id}.name`),remaining:c}))}}function p(o,r){a.particles&&De(o??0,r??0),b.classList.add("click-effect"),setTimeout(()=>b.classList.remove("click-effect"),bn.CLICK_EFFECT_DURATION_MS)}function m(o,r){let c=C();const{income:i,bonusApplied:d}=l(c);c=i,d&&G(v("msg.bonusPaid")),e.cash+=c,e.totalClicks+=1,e.totalLaborIncome+=c,e.lifetimeEarnings+=c,f(),L()&&E(),_(),p(o,r),Ue(c),E()}return{handleWorkAction:m,calculateClickIncome:C,applyPerformanceBonus:l,checkUpgradeProgress:f}}var Ae,Se;const V=!!((Se=(Ae=import.meta)==null?void 0:Ae.env)!=null&&Se.DEV);function On(n){const{state:e,UPGRADES:s,saveLoadManager:t,LeaderboardUI:a,Diary:h,t:L,updateUI:_,updateAutoWorkUI:E}=n;function b(){e.deposits=0,e.savings=0,e.bonds=0,e.usStocks=0,e.cryptos=0,e.villas=0,e.officetels=0,e.apartments=0,e.shops=0,e.buildings=0,e.towers_run=0,e.depositsLifetime=0,e.savingsLifetime=0,e.bondsLifetime=0,e.usStocksLifetime=0,e.cryptosLifetime=0,e.villasLifetime=0,e.officetelsLifetime=0,e.apartmentsLifetime=0,e.shopsLifetime=0,e.buildingsLifetime=0,V&&console.warn("[resetHoldings] 보유 수량 초기화 완료")}function C(f){for(const p of Object.values(f))p.unlocked=!1,p.purchased=!1;V&&console.warn("[resetUpgrades] 업그레이드 초기화 완료")}async function l(f="unknown"){V&&console.warn(`🔄 자동 프레스티지 실행 (source: ${f})`);try{const p=We();p>0&&V&&console.warn(`💼 경력 포인트 획득: +${p} CP (총 ${e.careerPoints} CP)`),we(),b(),C(s),e.currentMarketEvent=null,e.marketEventEndTime=0,e.marketMultiplier=1;const m=He();V&&(m.cash>0||m.deposits>0||m.career>0||m.villa>0)&&console.warn("🎁 시작 보너스 적용:",m),E();try{_()}catch(o){console.error("❌ UI 업데이트 중 오류:",o)}try{t.saveGame()}catch(o){console.error("❌ 게임 저장 중 오류:",o)}if(e.playerNickname)try{await a.updateLeaderboardEntry(!0)}catch(o){console.error("리더보드 업데이트 실패:",o)}try{h.addLog(L("msg.prestigeComplete"))}catch(o){console.error("일기장 로그 실패:",o)}V&&console.warn("✅ 프레스티지 완료 (누적 데이터 유지)")}catch(p){throw console.error("❌ 프레스티지 실행 중 치명적 오류:",p),console.error("스택:",p.stack),p}}return{performPrestige:l,resetHoldings:b,resetUpgrades:C}}const he=new Set;function Pe(n){return!n||he.has(n)?Promise.resolve():new Promise(e=>{const s=new Image;s.onload=()=>{he.add(n),e()},s.onerror=e,s.src=n})}function Kn(){var s,t;const n=y.careerLevel,e=[];return(s=Q[n])!=null&&s.bgImage&&e.push(Q[n].bgImage),(t=Q[n+1])!=null&&t.bgImage&&e.push(Q[n+1].bgImage),Promise.all(e.map(Pe))}function wn(n){const{elWorkArea:e}=n;function s(){const t=ce();if(!t)return!1;const a=Qe(t.requiredClicks);if(y.totalClicks>=a){y.careerLevel+=1;const h=se(),L=ie();G(v("msg.promoted",{career:ne(y.careerLevel),income:ae(L)})),e&&(e.style.transition=`opacity ${H.CAREER_FADE_OUT}ms ease-out`,e.style.opacity="0.5",setTimeout(()=>{h.bgImage?(e.style.transition=`background-image ${H.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${H.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage=`url('${h.bgImage}')`):(e.style.transition=`background-image ${H.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${H.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),e.style.opacity="1"},H.CAREER_FADE_OUT));const _=document.querySelector(".career-card");_&&(_.style.animation="none",setTimeout(()=>{_.style.animation=`careerPromotion ${H.CAREER_CARD}ms ease-out`},10));const E=document.getElementById("currentCareer");E&&E.setAttribute("aria-label",v("msg.promoted",{career:ne(y.careerLevel),income:ae(L)}));const b=Q[y.careerLevel+1];return b!=null&&b.bgImage&&Pe(b.bgImage),!0}return!1}return{checkCareerPromotion:s,getClickIncome:ie,getCurrentCareer:se,getNextCareer:ce,getCareerName:ne}}const Ee=3e4,Ce="clicksurvivor_lastNicknameChangeAt";function Un(n){const{SAVE_KEY:e,CLOUD_RESTORE_BLOCK_KEY:s,Modal:t,t:a,validateNickname:h,normalizeNickname:L,claimNickname:_,getUser:E,saveGame:b,updateUI:C,Diary:l,LeaderboardUI:f,upsertCloudSave:p,getPlayerNickname:m,setPlayerNickname:o,__IS_DEV__:r}=n;let c=!1,i=0;const d=5;function I(){try{const k=localStorage.getItem(e);return k&&JSON.parse(k).nickname||""}catch(k){return console.error("닉네임 확인 실패:",k),""}}function A(){if(c){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const k=I();if(k){o(k);return}c=!0;try{sessionStorage.setItem(s,"1")}catch(S){console.warn("sessionStorage set 실패:",S)}setTimeout(()=>{const S=async x=>{const U=h(x);if(!U.ok){let N="";switch(U.reasonKey){case"empty":N=a("settings.nickname.change.empty");break;case"tooShort":N=a("settings.nickname.change.tooShort");break;case"tooLong":N=a("settings.nickname.change.tooLong");break;case"invalid":N=a("settings.nickname.change.invalid");break;case"banned":N=a("settings.nickname.change.banned");break;default:N=a("settings.nickname.change.invalid")}if(t.openInfoModal(a("modal.error.nicknameFormat.title"),N,"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}A();return}const{raw:$,key:W}=L(x),T=await E();if(!T){o($),i=0,b(),l.addLog(a("msg.nicknameSet",{nickname:m()})),l.addLog(a("settings.nickname.change.loginRequired"));try{sessionStorage.removeItem(s)}catch(N){console.warn("sessionStorage remove 실패:",N)}return}try{const N=await _($,T.id);if(!N.success){if(N.error==="taken"?t.openInfoModal(a("modal.error.nicknameTaken.title"),a("settings.nickname.change.taken"),"⚠️"):t.openInfoModal(a("modal.error.nicknameFormat.title"),a("settings.nickname.change.claimFailed"),"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}A();return}i=0,o($),b(),l.addLog(a("msg.nicknameSet",{nickname:m()}));try{localStorage.removeItem("clicksurvivor_needsNicknameChange")}catch{}try{await f.updateLeaderboardEntry(!0)}catch(D){console.error("리더보드 업데이트 실패:",D)}try{sessionStorage.removeItem(s)}catch(D){console.warn("sessionStorage remove 실패:",D)}}catch(N){if(console.error("닉네임 설정 실패:",N),t.openInfoModal(a("modal.error.nicknameFormat.title"),a("settings.nickname.change.claimFailed"),"⚠️"),c=!1,i++,i>=d){r&&console.warn("[Nickname] 최대 재시도 횟수 초과 (에러), 모달 중단"),i=0;return}A()}};t.openInputModal(a("modal.nickname.title"),a("modal.nickname.message"),S,{icon:"✏️",primaryLabel:a("button.confirm"),placeholder:a("modal.nickname.placeholder"),maxLength:6,defaultValue:"",required:!0})},500)}function u(){try{const k=localStorage.getItem(Ce);if(!k)return{allowed:!0};const S=parseInt(k,10),U=Date.now()-S;return U>=Ee?{allowed:!0}:{allowed:!1,remainingSeconds:Math.ceil((Ee-U)/1e3)}}catch{return{allowed:!0}}}function R(){try{localStorage.setItem(Ce,String(Date.now()))}catch(k){console.warn("쿨타임 저장 실패:",k)}}function M(){const k=u();if(!k.allowed){t.openInfoModal(a("modal.error.nicknameLength.title"),a("settings.nickname.change.cooldown",{seconds:k.remainingSeconds||0}),"⏱️");return}const S=m()||"";t.openInputModal(a("settings.nickname.modal.title"),a("settings.nickname.modal.message"),g,{icon:"✏️",primaryLabel:a("settings.nickname.modal.submit"),secondaryLabel:a("settings.nickname.modal.cancel"),placeholder:a("settings.nickname.modal.placeholder"),maxLength:6,defaultValue:S,required:!0})}async function g(k){const S=h(k);if(!S.ok){let T="";switch(S.reasonKey){case"empty":T=a("settings.nickname.change.empty");break;case"tooShort":T=a("settings.nickname.change.tooShort");break;case"tooLong":T=a("settings.nickname.change.tooLong");break;case"invalid":T=a("settings.nickname.change.invalid");break;case"banned":T=a("settings.nickname.change.banned");break;default:T=a("settings.nickname.change.invalid")}t.openInfoModal(a("modal.error.nicknameFormat.title"),T,"⚠️");return}const{raw:x,key:U}=L(k),$=L(m()||"");if(U===$.key){r&&console.log("[Nickname] 변경 없음: 동일한 닉네임");return}const W=await E();if(!W){const T=m();o(x),b(),C(),l.addLog(a("settings.nickname.change.success")),l.addLog(a("settings.nickname.change.loginRequired")),r&&console.log(`[Nickname] 로컬 저장 완료 (비로그인): "${T}" → "${m()}"`);return}try{const T=await _(x,W.id);if(!T.success){T.error==="taken"?(t.openInfoModal(a("modal.error.nicknameTaken.title"),a("settings.nickname.change.taken"),"⚠️"),setTimeout(()=>{M()},500)):t.openInfoModal(a("modal.error.nicknameLength.title"),a("settings.nickname.change.claimFailed"),"⚠️");return}const N=m();o(x),b();try{const D=JSON.parse(localStorage.getItem(e)||"{}");await p("seoulsurvival",D),r&&console.log("[Nickname] 클라우드 저장 완료")}catch(D){console.error("클라우드 저장 실패:",D)}try{await f.updateLeaderboardEntry(!0)}catch(D){console.error("리더보드 업데이트 실패:",D)}try{localStorage.removeItem("clicksurvivor_needsNicknameChange"),sessionStorage.removeItem("clicksurvivor_nicknameModalAutoOpened")}catch{}R(),C(),l.addLog(a("settings.nickname.change.success")),r&&console.log(`[Nickname] 변경 완료: "${N}" → "${m()}"`)}catch(T){console.error("닉네임 변경 실패:",T),t.openInfoModal(a("modal.error.nicknameLength.title"),a("settings.nickname.change.claimFailed"),"⚠️")}}return{ensureNicknameModal:A,openNicknameChangeModal:M,handleNicknameChangeFromModal:g,checkNicknameCooldown:u,saveNicknameCooldown:R}}function Dn(n){const{gameState:e,UPGRADES:s,TIMING:t,MARKET_EVENT_TIMING:a,PROBABILITY:h,getRps:L,getFinancialIncome:_,getPropertyIncome:E,getClickIncome:b,checkCareerPromotion:C,checkMarketEvent:l,checkAchievements:f,checkUpgradeUnlocks:p,startMarketEvent:m,updateUI:o,saveGame:r,Animations:c,elWork:i}=n;let d=null,I=null,A=null,u=null,R=performance.now(),M=!1,g=0;const k=10;function S(w=50){d||(R=performance.now(),g=0,d=setInterval(()=>{g++,g>=k&&(g=0,l(),f(),p());const q=performance.now(),K=Math.min((q-R)/1e3,1);R=q;const oe=L()*K;if(e.cash+=oe,e.lifetimeEarnings+=oe,e.depositsLifetime+=_("deposit",e.deposits)*K,e.savingsLifetime+=_("savings",e.savings)*K,e.bondsLifetime+=_("bond",e.bonds)*K,e.usStocksLifetime+=_("usStock",e.usStocks)*K,e.cryptosLifetime+=_("crypto",e.cryptos)*K,e.villasLifetime+=E("villa",e.villas)*K,e.officetelsLifetime+=E("officetel",e.officetels)*K,e.apartmentsLifetime+=E("apartment",e.apartments)*K,e.shopsLifetime+=E("shop",e.shops)*K,e.buildingsLifetime+=E("building",e.buildings)*K,document.hidden){M=!0;return}M||(M=!0,requestAnimationFrame(()=>{o(),M=!1}))},w))}function x(){I||(I=setInterval(()=>{r&&r()},t.AUTO_SAVE_INTERVAL_MS))}function U(w=!0){const q=b();if(e.cash+=q,e.totalClicks+=1,e.totalLaborIncome+=q,e.lifetimeEarnings+=q,C(),w&&i&&(i.classList.remove("auto-click-pulse"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{i&&i.classList.add("auto-click-pulse")})})),w&&c.showIncomeAnimation(q),s.performance_bonus&&s.performance_bonus.purchased&&Math.random()<h.PERFORMANCE_BONUS_CHANCE){const K=q*9;e.cash+=K,e.totalLaborIncome+=K,e.lifetimeEarnings+=K}}function $(){if(A)return;let w=0;A=setInterval(()=>{w++;const q=ze();if(q>0){const K=4/q;w%K===0&&U(!0)}w%4===0&&e.autoClickEnabled&&U(!0),w>=1e3&&(w=0)},250)}function W(){if(u)return;const w=()=>{const q=Math.random()*a.RANDOM_RANGE_MS+a.MIN_INTERVAL_MS;u=setTimeout(()=>{e.marketEventEndTime===0&&m(),w()},q)};w()}function T(){document.addEventListener("visibilitychange",()=>{!document.hidden&&M&&(o(),M=!1)})}function N(){T(),S(50),x(),$(),W()}function D(){d&&(clearInterval(d),d=null),I&&(clearInterval(I),I=null),A&&(clearInterval(A),A=null),u&&(clearTimeout(u),u=null)}function Oe(){d&&(clearInterval(d),d=null)}function Ke(w=50){d||S(w)}return{startAllLoops:N,stopAllLoops:D,startTickLoop:S,startAutoSave:x,startAutoClick:$,startMarketEventChecker:W,pauseTickLoop:Oe,resumeTickLoop:Ke}}export{vn as C,Rn as D,Nn as M,z as P,bn as T,Cn as a,hn as b,kn as c,xe as d,Fe as e,G as f,Mn as g,En as h,J as i,Ln as j,$e as k,Ge as l,Un as m,On as n,Tn as o,In as p,Dn as q,Sn as r,An as s,Kn as t,ln as u,wn as v,ke as w,Pn as x};
