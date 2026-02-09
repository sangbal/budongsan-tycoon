import{t as E,g as Ce}from"./seoulsurvival-i18n-CHedcszT.js";import{f as Ee,a as ve}from"./seoulsurvival-utils-COeNJCxP.js";import{g as l,r as an,C as J,a as de,b as Ie,c as Ae,d as Se}from"./seoulsurvival-core-he2MET02.js";import{s as cn,c as sn}from"./seoulsurvival-ui-Du4SuCBK.js";let Z=null,le="";function dn(n){return`${n.deposits},${n.savings},${n.bonds},${n.usStocks},${n.cryptos},${n.villas},${n.officetels},${n.apartments},${n.shops},${n.buildings},${n.__completionistUnlocked||!1}`}function ln(){Z=null,le=""}const We=[{id:"real_estate_mogul",nameKey:"synergy.realEstateMogul.name",descKey:"synergy.realEstateMogul.desc",icon:"🏢",check:n=>n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"property_income",multiplier:1.3},{id:"finance_guru",nameKey:"synergy.financeGuru.name",descKey:"synergy.financeGuru.desc",icon:"💰",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0,effect:"financial_income",multiplier:1.25},{id:"diversification",nameKey:"synergy.diversification.name",descKey:"synergy.diversification.desc",icon:"📊",check:n=>n.deposits>0&&n.savings>0&&n.bonds>0&&n.usStocks>0&&n.cryptos>0&&n.villas>0&&n.officetels>0&&n.apartments>0&&n.shops>0&&n.buildings>0,effect:"all_income",multiplier:1.15},{id:"seoul_ruler",nameKey:"synergy.seoulRuler.name",descKey:"synergy.seoulRuler.desc",icon:"🗼",check:n=>n.buildings>=5,effect:"all_income",multiplier:1.5},{id:"completionist",nameKey:"synergy.completionist.name",descKey:"synergy.completionist.desc",icon:"🏆",check:n=>n.__completionistUnlocked||!1,effect:"all_income",multiplier:2}];function yn(n=l){const e=dn(n);return Z&&le===e||(Z=We.filter(c=>c.check(n)),le=e),Z}function je(n,e){const c=yn(n);let s=1;for(const o of c)(o.effect===e||o.effect==="all_income")&&(s*=o.multiplier);return s}function Vn(n,e=l){return n*je(e,"property_income")}function Yn(n,e=l){return n*je(e,"financial_income")}function un(n){const e=Object.values(n).every(c=>c.purchased);l.__completionistUnlocked=e}function zn(n=l){return We.map(e=>({id:e.id,nameKey:e.nameKey,descKey:e.descKey,icon:e.icon,active:e.check(n),multiplier:e.multiplier,effect:e.effect}))}let ae=null,ye="",ee=null,ue="";function mn(){return(l.purchasedUpgrades||[]).join(",")}function bn(){const n=l.careerPoints||0,e=l.purchasedUpgrades||[];return`${n},${e.length}`}function me(){ae=null,ye="",ee=null,ue=""}function pn(n,e){if(n<=0)return 0;const c=n>=1?5:0,s=Math.floor(Math.sqrt(n)*2),o=e>1e12?Math.log10(e/1e12):0;return Math.max(1,Math.floor(s*(1+o)))+c}function Ve(){let n=0;for(const e of l.purchasedUpgrades||[]){const c=X.find(s=>s.id===e);c&&(n+=c.cost)}return n}function Qn(){const n=bn();if(ee!==null&&ue===n)return ee;const e=l.careerPoints||0,c=Ve();return ee=1+(e+c)*.02,ue=n,ee}function fn(){const n=l.careerPoints||0,e=Ve();return n+e}const X=[{id:"I1_auto_start",category:"QUICK_START",nameKey:"cp.I1.name",descKey:"cp.I1.desc",cost:1,icon:"☕",requires:[],effect:{type:"prestige_auto_click",value:1}},{id:"I2_auto_speed",category:"QUICK_START",nameKey:"cp.I2.name",descKey:"cp.I2.desc",cost:5,icon:"⚡",requires:["I1_auto_start"],effect:{type:"prestige_auto_click",value:2}},{id:"I3_auto_turbo",category:"QUICK_START",nameKey:"cp.I3.name",descKey:"cp.I3.desc",cost:12,icon:"🔥",requires:["I2_auto_speed"],effect:{type:"prestige_auto_click",value:4}},{id:"E1_parents",category:"QUICK_START",nameKey:"cp.E1.name",descKey:"cp.E1.desc",cost:2,icon:"👨‍👩‍👧",requires:[],effect:{type:"starting_deposits",value:5}},{id:"E2_connections",category:"QUICK_START",nameKey:"cp.E2.name",descKey:"cp.E2.desc",cost:5,icon:"🤝",requires:["E1_parents"],effect:{type:"starting_career",value:1}},{id:"E3_silver_spoon",category:"QUICK_START",nameKey:"cp.E3.name",descKey:"cp.E3.desc",cost:10,icon:"🥄",requires:["E2_connections"],effect:{type:"starting_bundle",value:{villa:1,career:2}}},{id:"D1_workaholic",category:"LABOR",nameKey:"cp.D1.name",descKey:"cp.D1.desc",cost:3,icon:"💪",requires:[],effect:{type:"click_income_multiplier",value:1.5}},{id:"D2_automation",category:"LABOR",nameKey:"cp.D2.name",descKey:"cp.D2.desc",cost:5,icon:"📊",requires:["D1_workaholic"],effect:{type:"auto_click_speed",value:2}},{id:"D3_ceo_mentality",category:"LABOR",nameKey:"cp.D3.name",descKey:"cp.D3.desc",cost:8,icon:"🎯",requires:["D2_automation"],effect:{type:"click_bonus_chance",value:.05}},{id:"H1_network_basic",category:"LABOR",nameKey:"cp.H1.name",descKey:"cp.H1.desc",cost:1,icon:"🍺",requires:[],effect:{type:"promotion_requirement_reduction",value:.2}},{id:"H2_network_power",category:"LABOR",nameKey:"cp.H2.name",descKey:"cp.H2.desc",cost:5,icon:"🏌️",requires:["H1_network_basic"],effect:{type:"promotion_requirement_reduction",value:.15}},{id:"H3_vip_connections",category:"LABOR",nameKey:"cp.H3.name",descKey:"cp.H3.desc",cost:12,icon:"🏰",requires:["H2_network_power"],effect:{type:"promotion_requirement_reduction",value:.15}},{id:"A1_mentor",category:"BOOST",nameKey:"cp.A1.name",descKey:"cp.A1.desc",cost:1,icon:"👨‍🏫",requires:[],effect:{type:"click_multiplier",value:1.2}},{id:"A2_network",category:"BOOST",nameKey:"cp.A2.name",descKey:"cp.A2.desc",cost:2,icon:"📱",requires:["A1_mentor"],effect:{type:"auto_income_multiplier",value:1.25}},{id:"A3_recognition",category:"BOOST",nameKey:"cp.A3.name",descKey:"cp.A3.desc",cost:3,icon:"🏆",requires:["A2_network"],effect:{type:"starting_cash",value:1e7}},{id:"A4_reputation",category:"BOOST",nameKey:"cp.A4.name",descKey:"cp.A4.desc",cost:5,icon:"⭐",requires:["A3_recognition"],effect:{type:"price_discount",value:.1}},{id:"B1_broker",category:"FINANCIAL",nameKey:"cp.B1.name",descKey:"cp.B1.desc",cost:3,icon:"📊",requires:[],effect:{type:"financial_income_multiplier",value:1.3}},{id:"B2_fund_manager",category:"FINANCIAL",nameKey:"cp.B2.name",descKey:"cp.B2.desc",cost:5,icon:"💼",requires:["B1_broker"],effect:{type:"financial_price_discount",value:.25}},{id:"B3_hedge_fund",category:"FINANCIAL",nameKey:"cp.B3.name",descKey:"cp.B3.desc",cost:8,icon:"🦈",requires:["B2_fund_manager"],effect:{type:"financial_to_property_synergy",value:1.15}},{id:"C1_realtor",category:"PROPERTY",nameKey:"cp.C1.name",descKey:"cp.C1.desc",cost:3,icon:"🏠",requires:[],effect:{type:"property_income_multiplier",value:1.3}},{id:"C2_builder",category:"PROPERTY",nameKey:"cp.C2.name",descKey:"cp.C2.desc",cost:5,icon:"🏗️",requires:["C1_realtor"],effect:{type:"property_price_discount",value:.25}},{id:"C3_redeveloper",category:"PROPERTY",nameKey:"cp.C3.name",descKey:"cp.C3.desc",cost:8,icon:"🌆",requires:["C2_builder"],effect:{type:"property_to_financial_synergy",value:1.15}},{id:"F1_preserve_1",category:"META",nameKey:"cp.F1.name",descKey:"cp.F1.desc",cost:6,icon:"💎",requires:[],effect:{type:"permanent_slot",value:1}},{id:"F2_preserve_2",category:"META",nameKey:"cp.F2.name",descKey:"cp.F2.desc",cost:15,icon:"💎",requires:["F1_preserve_1"],effect:{type:"permanent_slot",value:2}},{id:"G1_prediction",category:"META",nameKey:"cp.G1.name",descKey:"cp.G1.desc",cost:7,icon:"🔮",requires:[],effect:{type:"market_event_bonus",value:1.5}},{id:"G2_insider",category:"META",nameKey:"cp.G2.name",descKey:"cp.G2.desc",cost:12,icon:"📰",requires:["G1_prediction"],effect:{type:"market_event_preview",value:!0}}],gn={QUICK_START:{nameKey:"cp.cat.quickStart",icon:"🎒",color:"#fbbf24"},LABOR:{nameKey:"cp.cat.labor",icon:"💼",color:"#a78bfa"},BOOST:{nameKey:"cp.cat.boost",icon:"📚",color:"#4ade80"},FINANCIAL:{nameKey:"cp.cat.financial",icon:"💵",color:"#60a5fa"},PROPERTY:{nameKey:"cp.cat.property",icon:"🏘️",color:"#f97316"},META:{nameKey:"cp.cat.meta",icon:"⏳",color:"#6b7280"}},Xn=["QUICK_START","LABOR","BOOST","FINANCIAL","PROPERTY","META"];function _n(n){const e=X.find(s=>s.id===n);if(!e)return{canPurchase:!1,reason:"invalid_upgrade"};const c=l.purchasedUpgrades||[];if(c.includes(n))return{canPurchase:!1,reason:"already_purchased"};if(l.careerPoints<e.cost)return{canPurchase:!1,reason:"not_enough_cp"};for(const s of e.requires)if(!c.includes(s))return{canPurchase:!1,reason:"requires_not_met",missing:s};return{canPurchase:!0,reason:null}}function Jn(n){const{canPurchase:e}=_n(n);if(!e)return!1;const c=X.find(s=>s.id===n);return l.careerPoints-=c.cost,l.purchasedUpgrades||(l.purchasedUpgrades=[]),l.purchasedUpgrades.push(n),me(),!0}function ne(){const n=mn();if(ae&&ye===n)return ae;const e={click_multiplier:1,auto_income_multiplier:1,click_income_multiplier:1,financial_income_multiplier:1,property_income_multiplier:1,financial_to_property_synergy:1,property_to_financial_synergy:1,auto_click_speed:1,market_event_bonus:1,price_discount:0,financial_price_discount:0,property_price_discount:0,starting_cash:0,starting_deposits:0,starting_career:0,starting_bundle:null,click_bonus_chance:0,permanent_slot:0,market_event_preview:!1,promotion_requirement_reduction:0,prestige_auto_click:0};for(const c of l.purchasedUpgrades||[]){const s=X.find(M=>M.id===c);if(!s)continue;const{type:o,value:b}=s.effect;o.includes("multiplier")||o.includes("synergy")||o==="auto_click_speed"||o==="market_event_bonus"?e[o]=(e[o]||1)*b:o.includes("discount")?e[o]=Math.min(.5,(e[o]||0)+b):o==="permanent_slot"?e[o]=Math.max(e[o]||0,b):o==="market_event_preview"||o==="starting_bundle"?e[o]=b:o==="promotion_requirement_reduction"?e[o]=(e[o]||0)+b:o==="prestige_auto_click"?e[o]=Math.max(e[o]||0,b):e[o]=(e[o]||0)+(typeof b=="number"?b:0)}return ae=e,ye=n,e}function hn(){const n=ne(),e={cash:0,deposits:0,career:0,villa:0};return n.starting_cash>0&&(l.cash+=n.starting_cash,e.cash=n.starting_cash),n.starting_deposits>0&&(l.deposits+=n.starting_deposits,e.deposits=n.starting_deposits),n.starting_career>0&&(l.careerLevel=Math.max(l.careerLevel,n.starting_career),e.career=n.starting_career),n.starting_bundle&&(n.starting_bundle.villa&&(l.villas+=n.starting_bundle.villa,l.unlockedProducts.villa=!0,e.villa=n.starting_bundle.villa),n.starting_bundle.career&&(l.careerLevel=Math.max(l.careerLevel,n.starting_bundle.career),e.career=Math.max(e.career,n.starting_bundle.career))),e}function Zn(n,e){const s=ne().permanent_slot;if(e>=s||!(l.purchasedUpgrades||[]).includes(n))return!1;const o=X.find(M=>M.id===n);if(o!=null&&o.id.startsWith("F"))return!1;l.permanentSlots||(l.permanentSlots=[]);const b=l.permanentSlots.indexOf(n);return b!==-1&&(l.permanentSlots[b]=null),l.permanentSlots[e]=n,!0}function eo(n){l.permanentSlots&&l.permanentSlots[n]&&(l.permanentSlots[n]=null)}function kn(){const n=pn(l.towers_lifetime,l.lifetimeEarnings);return l.careerPoints+=n,l.totalCareerPoints+=n,me(),n}function no(){const n={};for(const e of Object.keys(gn))n[e]=X.filter(c=>c.category===e);return n}function oo(n){const e=ne(),s={click_power:"click_multiplier",auto_income:"auto_income_multiplier",all_income:"auto_income_multiplier",price_reduction:null}[n]||n;return s===null?1-(e.price_discount||0):e[s]||1}function Cn(){return 1+fn()*.01}function En(){return ne().promotion_requirement_reduction||0}function vn(){const n=En();return Math.max(.5,1-n)}function In(){return ne().prestige_auto_click||0}function An(n){const e=Cn(),c=vn();return Math.ceil(n*c/e)}const Sn=["오늘은 체크 하나를 더했다. ({name})","작게나마 성취. {name}라니, 나도 꽤 한다.",`기록해둔다: {name}.
{desc}`,`"{name}" 달성.
{descMemo}`,"별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. ({name})",`또 하나의 마일스톤. {name}.
{desc}`,`작은 성취도 성취다. {name}.
{desc}`,`하루하루가 쌓인다. 오늘은 {name}.
{desc}`,`기록에 하나 더. {name}.
{desc}`,`뿌듯함이 조금씩. {name} 달성.
{desc}`,`이런 게 인생이지. {name}.
{desc}`,`작은 발걸음이 모여 길이 된다. {name}.
{desc}`],Mn=[`명함이 바뀌었다. {career}.
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
{extra}`],Me={적금:[`자동이체 버튼이 눈에 들어왔다.
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
{body}`]},Ln=[`문이 하나 열렸다.
{body}`,`다음 장으로 넘어갈 수 있게 됐다.
{body}`,`아직 초반인데도, 벌써 선택지가 늘었다.
{body}`,"드디어. {body}",`새로운 가능성이 열렸다.
{body}`,`선택지가 하나 더 생겼다.
{body}`,`다음 단계로 나아갈 수 있다.
{body}`,`기회의 문이 열렸다.
{body}`,`새로운 길이 보인다.
{body}`,`진행의 길이 열렸다.
{body}`],Rn=[`지갑이 얇아서 아무것도 못 했다.
{body}`,`현실 체크. 돈이 없다.
{body}`,`오늘은 참는다. 아직은 무리.
{body}`,`계산기만 두드리고 끝.
{body}`,`통장 잔고가 거짓말을 한다.
{body}`,`돈이 부족하다는 건 늘 아프다.
{body}`,`다시 모아야 한다. 조금 더.
{body}`,`욕심을 접어야 할 때.
{body}`,`현실이 무겁다.
{body}`,`내일을 기다려야 한다.
{body}`],Le={예금:[`일단은 안전한 데에 묶어두자.
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
{body}`]},Tn=[`결심하고 질렀다.
{body}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
{body}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
{body}`,`한 발 더 나아갔다.
{body}`,`손이 먼저 움직였다.
{body}`,`투자의 길을 걷는다.
{body}`,`미래를 위한 선택.
{body}`,`돈이 돈을 버는 구조.
{body}`,`자산을 늘리는 순간.
{body}`,`투자자의 마음가짐.
{body}`],Re={코인:[`손이 떨리기 전에 내렸다.
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
{body}`]},Nn=[`정리할 건 정리했다.
{body}`,`가끔은 줄여야 산다.
{body}`,`현금이 필요했다. 그래서 팔았다.
{body}`,`미련은 접어두고 정리.
{body}`,`투자 포지션을 정리했다.
{body}`,`현금화의 선택.
{body}`,`자산을 정리하는 순간.
{body}`,`투자에서 벗어났다.
{body}`,`정리하고 다음 기회를 본다.
{body}`,`미련 없이 정리했다.
{body}`],Pn=[`오늘은 뜻대로 안 됐다.
{body}`,`계획은 늘 계획대로 안 된다.
{body}`,`한 번 더. 다음엔 될 거다.
{body}`,`벽에 부딪혔다.
{body}`,`실패는 또 다른 시작.
{body}`,`좌절은 잠시뿐.
{body}`,`다시 일어서야 한다.
{body}`,`실패도 경험이다.
{body}`,`다음 기회를 기다린다.
{body}`,`실패에서 배운다.
{body}`],Te={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
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
{body}`]},Ne={코인:["심장이 겨우 진정됐다. ({name})",`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
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
{name}`],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},Pe={코인:[`메모(코인): 멘탈 관리가 수익률이다.
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
{body}`]},On=[`메모.
{body}`,`적어둔다.
{body}`,`까먹기 전에 기록.
{body}`,`투자 노트에 기록.
{body}`,`기억해둘 것.
{body}`,`나중을 위해 기록.
{body}`],Oe={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
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
{name}`]},Ke={노동:[`일하는 방식이 바뀌었다.
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
{body}`]},Kn=[`찜찜한 기분이 남았다.
{body}`,`뭔가 삐끗한 느낌.
{body}`,`일단 기록만 남긴다.
{body}`,`뭔가 이상한 느낌.
{body}`,`불안한 기분이 든다.
{body}`,`주의가 필요할 것 같다.
{body}`,`뭔가 잘못된 것 같다.
{body}`,`경고의 신호가 느껴진다.
{body}`],wn=["{base}",`{justWrite}
{base}`,`{todayRecord}
{base}`,"{anyway} {base}",`{justRecord}
{base}`,`{memo}
{base}`,`{remember}
{base}`,`{recordForLater}
{base}`,`{goodToWrite}
{base}`,`{leaveRecord}
{base}`],Un=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]],Dn=["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"];let z=null,Q=null,Ye=null;const we=new Map;let te=null,re=null;function qn(n,e){z=n,Q=e,Ye=e.sessionStartTime}const ce=n=>String(n).padStart(2,"0"),Ue=n=>Math.floor(Math.random()*n),ze=n=>n.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu,"").trim(),G=n=>ze(n).replace(/\s+/g," ").trim();function O(n,e){if(!Array.isArray(e)||e.length===0)return"";const c=we.get(n);let s=Ue(e.length);return e.length>1&&typeof c=="number"&&s===c&&(s=(s+1+Ue(e.length-1))%e.length),we.set(n,s),e[s]}function $n(n){const e=String(n||"");for(const[c,s]of Un)if(e.includes(c))return s;return""}function K(n,e){let c=n;for(const[s,o]of Object.entries(e))c=c.replace(new RegExp(`\\{${s}\\}`,"g"),o||"");return c.trim()}function Bn(){if(!Q)return;const n=new Date,e=n.getFullYear(),c=ce(n.getMonth()+1),s=ce(n.getDate()),o=typeof Q.gameStartTime<"u"&&Q.gameStartTime?Q.gameStartTime:Ye,b=Math.max(1,Math.floor((Date.now()-o)/864e5)+1),M=document.getElementById("diaryHeaderMeta");M&&(M.textContent=`${e}.${c}.${s}(${E("ui.dayCount",{days:b})})`);const A=document.getElementById("diaryMetaDate"),k=document.getElementById("diaryMetaDay");A&&(A.textContent=E("ui.today",{date:`${e}.${c}.${s}`})),k&&(k.textContent=E("ui.dayCount",{days:b}))}function Fn(n){var A,k,m,C,d,h,f,u;const e=String(n||"").trim();if(new RegExp(E("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(e)||/다음\s*업그레이드/.test(e)&&/클릭\s*남/.test(e))return"";if(e.startsWith("🏆")&&(e.includes("업적 달성:")||e.includes("Achievement Unlocked:"))){const t=ze(e).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[r,a]=t.split(/\s*-\s*/),i=O("achievement",Sn);return K(i,{name:r||"업적",desc:a||"",descMemo:a?`메모: ${a}`:""})}const s=Ce()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(e.startsWith("🎉")&&(e.includes("승진했습니다")||/promoted/i.test(e))){const t=e.match(s),r=((A=t==null?void 0:t[1])==null?void 0:A.trim())||"다음 단계",a=(k=t==null?void 0:t[2])==null?void 0:k.trim(),i=a?a.replace(/[()]/g,"").trim():"",y=O("promotion",Mn);return K(y,{career:r,extra:i})}const o=Ce()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(e.startsWith("🔓")){const t=G(e),r=e.match(o),a=((r==null?void 0:r[1])||"").trim();if(a&&Me[a]){const y=O(`unlock_${a}`,Me[a]);return K(y,{body:t})}const i=O("unlock",Ln);return K(i,{body:t})}if(e.startsWith("💸 자금이 부족합니다")){const t=G(e),r=O("noMoney",Rn);return K(r,{body:t})}if(e.startsWith("✅")&&(e.includes("구입했습니다")||/purchased/i.test(e))){const t=G(e),r=e.match(/^✅\s*(.+?)\s+\d/),a=((r==null?void 0:r[1])||"").trim();if(a&&Le[a]){const y=O(`buy_${a}`,Le[a]);return K(y,{body:t})}const i=O("buy",Tn);return K(i,{body:t})}if(e.startsWith("💰")&&e.includes("판매했습니다")){const t=G(e),r=e.match(/^💰\s*(.+?)\s+\d/),a=((r==null?void 0:r[1])||"").trim();if(a&&Re[a]){const y=O(`sell_${a}`,Re[a]);return K(y,{body:t})}const i=O("sell",Nn);return K(i,{body:t})}if(e.startsWith("❌")){const t=G(e),r=O("fail",Pn);return K(r,{body:t})}if(e.startsWith("📈")&&e.includes("발생")){const t=G(e),r=(C=(m=e.match(/^📈\s*(.+?)\s*발생/))==null?void 0:m[1])==null?void 0:C.trim(),i=(((h=(d=e.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:d[1])==null?void 0:h.trim())||r||"").trim(),y=$n(`${i} ${t}`)||"시장";te=y,re=i||t;const S=Te[y]||Te.시장,v=O(`market_${y}`,S);return K(v,{body:t})}if(e.startsWith("📉")&&e.includes("종료")){const t=te||"시장",r=re||"",i=["빌라","오피스텔","아파트","상가","빌딩"].includes(t)?"부동산":t,y=Ne[i]||Ne.시장,S=O(`marketEnd_${i}`,y);return te=null,re=null,K(S,{name:r})}if(e.startsWith("💡")){const t=G(e),r=te||"",a=re||"",y=["빌라","오피스텔","아파트","상가","빌딩"].includes(r)?"부동산":r;if(y&&Pe[y]){const v=O(`memo_${y}`,Pe[y]);return K(v,{body:t,name:a})}const S=O("memo",On);return K(S,{body:t})}if(e.startsWith("🎁")&&e.includes("해금")){const t=G(e),r=((u=(f=e.match(/해금:\s*(.+)$/))==null?void 0:f[1])==null?void 0:u.trim())||"",i=(v=>{const p=String(v||"");return p.includes("예금")?"예금":p.includes("적금")?"적금":p.includes("미국주식")||p.includes("미장")||p.includes("🇺🇸")?"미국주식":p.includes("코인")||p.includes("₿")||p.includes("암호")?"코인":p.includes("주식")?"국내주식":p.includes("빌딩")?"빌딩":p.includes("상가")?"상가":p.includes("아파트")?"아파트":p.includes("오피스텔")?"오피스텔":p.includes("빌라")?"빌라":p.includes("월세")||p.includes("부동산")?"부동산":p.includes("클릭")||p.includes("노동")||p.includes("업무")||p.includes("CEO")||p.includes("커리어")?"노동":""})(`${r} ${t}`)||"기본",y=Oe[i]||Oe.기본,S=O(`upgradeUnlock_${i}`,y);return K(S,{name:r||t})}if(e.startsWith("✅")&&e.includes("구매!")){const t=G(e),r=e.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),a=((r==null?void 0:r[1])||"").trim(),i=((r==null?void 0:r[2])||"").trim(),S=(T=>{const _=String(T||"");return _.includes("예금")?"예금":_.includes("적금")?"적금":_.includes("미국주식")||_.includes("미장")||_.includes("🇺🇸")?"미국주식":_.includes("코인")||_.includes("₿")||_.includes("암호")?"코인":_.includes("주식")?"국내주식":_.includes("빌딩")?"빌딩":_.includes("상가")?"상가":_.includes("아파트")?"아파트":_.includes("오피스텔")?"오피스텔":_.includes("빌라")?"빌라":_.includes("월세")||_.includes("부동산")?"부동산":_.includes("클릭")||_.includes("노동")||_.includes("업무")||_.includes("CEO")||_.includes("커리어")?"노동":""})(`${a} ${i} ${t}`)||"기본",v=[a,i].filter(Boolean).join(" — ")||t,p=Ke[S]||Ke.기본,P=O(`upgradeBuy_${S}`,p);return K(P,{core:v,body:t})}if(e.startsWith("⚠️")){const t=G(e),r=O("warn",Kn);return K(r,{body:t})}const b=G(e),M=O("default",wn);return K(M,{base:b,justWrite:E("diary.justWrite"),todayRecord:E("diary.todayRecord"),anyway:E("diary.anyway"),justRecord:E("diary.justRecord"),memo:E("diary.memo"),remember:E("diary.remember"),recordForLater:E("diary.recordForLater"),goodToWrite:E("diary.goodToWrite"),leaveRecord:E("diary.leaveRecord")})}function j(n){var h;if(!z||!Q||Dn.some(f=>n.includes(f)))return;const c=new Date,s=`${ce(c.getHours())}:${ce(c.getMinutes())}`;Bn();const o=Fn(n);if(!o)return;const b=document.createElement("p"),A=o.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),k=(A[0]??"").trim(),m=A.slice(1).map(f=>String(f).trim()).filter(Boolean),C=`<span class="diary-voice">${k}</span>`+(m.length?`
<span class="diary-info">${m.join(`
`)}</span>`:"");if(b.innerHTML=`<span class="diary-time">${s}</span>${C}`,!z){console.error("[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.");return}z.prepend(b);const d=100;for(;z.children.length>d;)(h=z.lastElementChild)==null||h.remove()}const to=Object.freeze(Object.defineProperty({__proto__:null,addLog:j,initDiary:qn},Symbol.toStringTag,{value:"Module"}));var Fe,xe;const F=!!((xe=(Fe=import.meta)==null?void 0:Fe.env)!=null&&xe.DEV);function ro(n){const{UPGRADES:e,getCash:c,setCash:s,CAREER_LEVELS:o}=n;function b(){const m=c();document.querySelectorAll(".upgrade-item").forEach(d=>{const h=d.dataset.upgradeId,f=e[h];f&&!f.purchased&&(m>=f.cost?d.classList.add("affordable"):d.classList.remove("affordable"))})}function M(m){document.querySelectorAll(".upgrade-progress").forEach(d=>{const h=d.closest(".upgrade-item");!h||!h.dataset.upgradeId||(Object.entries(e).filter(([u,t])=>t.category==="labor"&&!t.unlocked&&!t.purchased).map(([u,t])=>{var y;const r=t.unlockCondition.toString(),a=r.match(/totalClicks\s*>=\s*(\d+)/);if(a)return{id:u,requiredClicks:parseInt(a[1]),upgrade:t};const i=r.match(/careerLevel\s*>=\s*(\d+)/);return i?{id:u,requiredClicks:((y=o[parseInt(i[1])])==null?void 0:y.requiredClicks)||1/0,upgrade:t}:null}).filter(u=>u!==null).sort((u,t)=>u.requiredClicks-t.requiredClicks),d.textContent="")})}function A(){const m=c(),C=document.getElementById("upgradeList"),d=document.getElementById("upgradeCount");if(!C||!d)return;const h=Object.entries(e).filter(([t,r])=>r.unlocked&&!r.purchased);h.length===0?d.style.display="none":(d.style.display="",d.textContent=`(${h.length})`);const f=document.getElementById("noUpgradesMessage"),u=document.querySelector('.stats-section[data-section-id="upgrades"]');if(h.length===0){if(C.innerHTML="",f&&(f.textContent=E("ui.noUpgrades"),f.style.display="block"),u&&!u.classList.contains("collapsed")){u.classList.add("collapsed");const t=u.querySelector(".stats-toggle");t&&t.setAttribute("aria-expanded","false");const r=u.querySelector(".toggle-icon");r&&(r.textContent="▶")}return}if(u&&u.classList.contains("collapsed")){u.classList.remove("collapsed");const t=u.querySelector(".stats-toggle");t&&t.setAttribute("aria-expanded","true");const r=u.querySelector(".toggle-icon");r&&(r.textContent="▼")}f&&(f.style.display="none"),C.innerHTML="",F&&`${h.length}`,h.forEach(([t,r])=>{const a=document.createElement("div");a.className="upgrade-item",a.dataset.upgradeId=t,m>=r.cost&&a.classList.add("affordable");const i=document.createElement("div");i.className="upgrade-icon",i.textContent=r.icon;const y=document.createElement("div");y.className="upgrade-info";const S=document.createElement("div");S.className="upgrade-name",S.textContent=E(`upgrade.${t}.name`,{},r.name);const v=document.createElement("div");v.className="upgrade-desc",v.textContent=E(`upgrade.${t}.desc`,{},r.desc);const p=Ee(r.cost);if(r.category==="labor"&&r.unlockCondition)try{const T=document.createElement("div");T.className="upgrade-progress",T.style.fontSize="11px",T.style.color="var(--muted)",T.style.marginTop="4px";const _=Object.entries(e).filter(([g,I])=>I.category==="labor"&&!I.unlocked&&!I.purchased).map(([g,I])=>{const q=I.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return q?{id:g,requiredClicks:parseInt(q[1]),upgrade:I}:null}).filter(g=>g!==null).sort((g,I)=>g.requiredClicks-I.requiredClicks)}catch{}y.appendChild(S),y.appendChild(v);const P=document.createElement("div");P.className="upgrade-status",P.textContent=p,P.style.animation="none",P.style.background="rgba(94, 234, 212, 0.12)",P.style.color="var(--accent)",P.style.border="1px solid rgba(94, 234, 212, 0.25)",P.style.borderRadius="999px",a.appendChild(i),a.appendChild(y),a.appendChild(P),a.addEventListener("click",T=>{T.stopPropagation(),k(t)},!1),F&&a.addEventListener("mousedown",T=>{}),C.appendChild(a),F&&`${t}`})}function k(m){const C=c(),d=e[m];if(!d){console.error("업그레이드를 찾을 수 없습니다:",m),F&&Object.keys(e);return}if(F&&(d.name,d.cost,d.unlocked,d.purchased),d.purchased){j(E("msg.upgradeAlreadyPurchased"));return}if(C<d.cost){j(E("msg.upgradeInsufficientFunds",{cost:Ee(d.cost)})),F&&d.cost;return}s(C-d.cost),d.purchased=!0;try{d.effect(),j(E("msg.upgradePurchased",{name:E(`upgrade.${m}.name`,{},d.name),desc:E(`upgrade.${m}.desc`,{},d.desc)}))}catch(h){console.error(`업그레이드 효과 적용 실패 (${m}):`,h),j(E("msg.upgradeEffectError"))}A(),b(),un(e),ln(),me()}return{updateUpgradeAffordability:b,updateUpgradeProgress:M,updateUpgradeList:A,purchaseUpgrade:k}}const xn={TICK_INTERVAL_MS:50,AUTO_SAVE_INTERVAL_MS:5e3,LEADERBOARD_THROTTLE_MS:3e4,CLICK_EFFECT_DURATION_MS:300,RELOAD_DELAY_MS:500},ao={MIN_INTERVAL_MS:12e4,RANDOM_RANGE_MS:18e4},De={PERFORMANCE_BONUS_CHANCE:.02,PERFORMANCE_BONUS_MULTIPLIER:10,AUTO_CLICK_CHANCE:1},V={CAREER_FADE_OUT:300,CAREER_BG_TRANSITION:800,CAREER_FADE_IN:500,CAREER_CARD:600};function co(n){const{state:e,UPGRADES:c,CAREER_LEVELS:s,settings:o,getClickIncome:b,checkCareerPromotion:M,updateUpgradeProgress:A,updateUI:k,elWork:m}=n;function C(){return b()}function d(t){return c.performance_bonus&&c.performance_bonus.purchased&&Math.random()<De.PERFORMANCE_BONUS_CHANCE?{income:t*De.PERFORMANCE_BONUS_MULTIPLIER,bonusApplied:!0}:{income:t,bonusApplied:!1}}function h(){const t=Object.entries(c).filter(([r,a])=>a.category==="labor"&&!a.unlocked&&!a.purchased).map(([r,a])=>{var v;const i=a.unlockCondition.toString(),y=i.match(/totalClicks\s*>=\s*(\d+)/);if(y)return{id:r,requiredClicks:parseInt(y[1]),upgrade:a};const S=i.match(/careerLevel\s*>=\s*(\d+)/);if(S){const p=parseInt(S[1]),P=((v=s[p])==null?void 0:v.requiredClicks)||1/0;return{id:r,requiredClicks:P,upgrade:a}}return null}).filter(r=>r!==null).sort((r,a)=>r.requiredClicks-a.requiredClicks);if(t.length>0){const r=t[0],a=r.requiredClicks-e.totalClicks;(a===50||a===25||a===10||a===5)&&j(E("msg.nextUpgradeHint",{name:E(`upgrade.${r.id}.name`),remaining:a}))}}function f(t,r){o.particles&&sn(t??0,r??0),m.classList.add("click-effect"),setTimeout(()=>m.classList.remove("click-effect"),xn.CLICK_EFFECT_DURATION_MS)}function u(t,r){let a=C();const{income:i,bonusApplied:y}=d(a);a=i,y&&j(E("msg.bonusPaid")),e.cash+=a,e.totalClicks+=1,e.totalLaborIncome+=a,e.lifetimeEarnings+=a,h(),M()&&k(),A(),f(t,r),cn(a),k()}return{handleWorkAction:u,calculateClickIncome:C,applyPerformanceBonus:d,checkUpgradeProgress:h}}var Ge,He;const Y=!!((He=(Ge=import.meta)==null?void 0:Ge.env)!=null&&He.DEV);function so(n){const{state:e,UPGRADES:c,saveLoadManager:s,LeaderboardUI:o,Diary:b,t:M,updateUI:A,updateAutoWorkUI:k}=n;function m(){e.deposits=0,e.savings=0,e.bonds=0,e.usStocks=0,e.cryptos=0,e.villas=0,e.officetels=0,e.apartments=0,e.shops=0,e.buildings=0,e.towers_run=0,e.depositsLifetime=0,e.savingsLifetime=0,e.bondsLifetime=0,e.usStocksLifetime=0,e.cryptosLifetime=0,e.villasLifetime=0,e.officetelsLifetime=0,e.apartmentsLifetime=0,e.shopsLifetime=0,e.buildingsLifetime=0,Y&&console.warn("[resetHoldings] 보유 수량 초기화 완료")}function C(h){for(const f of Object.values(h))f.unlocked=!1,f.purchased=!1;Y&&console.warn("[resetUpgrades] 업그레이드 초기화 완료")}async function d(h="unknown"){Y&&console.warn(`🔄 자동 프레스티지 실행 (source: ${h})`);try{const f=kn();f>0&&Y&&console.warn(`💼 경력 포인트 획득: +${f} CP (총 ${e.careerPoints} CP)`),an(),m(),C(c),e.currentMarketEvent=null,e.marketEventEndTime=0,e.marketMultiplier=1;const u=hn();Y&&(u.cash>0||u.deposits>0||u.career>0||u.villa>0)&&console.warn("🎁 시작 보너스 적용:",u),k();try{A()}catch(t){console.error("❌ UI 업데이트 중 오류:",t)}try{s.saveGame()}catch(t){console.error("❌ 게임 저장 중 오류:",t)}if(e.playerNickname)try{await o.updateLeaderboardEntry(!0)}catch(t){console.error("리더보드 업데이트 실패:",t)}try{b.addLog(M("msg.prestigeComplete"))}catch(t){console.error("일기장 로그 실패:",t)}Y&&console.warn("✅ 프레스티지 완료 (누적 데이터 유지)")}catch(f){throw console.error("❌ 프레스티지 실행 중 치명적 오류:",f),console.error("스택:",f.stack),f}}return{performPrestige:d,resetHoldings:m,resetUpgrades:C}}const qe=new Set;function Qe(n){return!n||qe.has(n)?Promise.resolve():new Promise(e=>{const c=new Image;c.onload=()=>{qe.add(n),e()},c.onerror=e,c.src=n})}function io(){var c,s;const n=l.careerLevel,e=[];return(c=J[n])!=null&&c.bgImage&&e.push(J[n].bgImage),(s=J[n+1])!=null&&s.bgImage&&e.push(J[n+1].bgImage),Promise.all(e.map(Qe))}function lo(n){const{elWorkArea:e}=n;function c(){const s=Ie();if(!s)return!1;const o=An(s.requiredClicks);if(l.totalClicks>=o){l.careerLevel+=1;const b=Ae(),M=Se();j(E("msg.promoted",{career:de(l.careerLevel),income:ve(M)})),e&&(e.style.transition=`opacity ${V.CAREER_FADE_OUT}ms ease-out`,e.style.opacity="0.5",setTimeout(()=>{b.bgImage?(e.style.transition=`background-image ${V.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${V.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage=`url('${b.bgImage}')`):(e.style.transition=`background-image ${V.CAREER_BG_TRANSITION}ms ease-in-out, opacity ${V.CAREER_FADE_IN}ms ease-in`,e.style.backgroundImage="radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)"),e.style.opacity="1"},V.CAREER_FADE_OUT));const A=document.querySelector(".career-card");A&&(A.style.animation="none",setTimeout(()=>{A.style.animation=`careerPromotion ${V.CAREER_CARD}ms ease-out`},10));const k=document.getElementById("currentCareer");k&&k.setAttribute("aria-label",E("msg.promoted",{career:de(l.careerLevel),income:ve(M)}));const m=J[l.careerLevel+1];return m!=null&&m.bgImage&&Qe(m.bgImage),!0}return!1}return{checkCareerPromotion:c,getClickIncome:Se,getCurrentCareer:Ae,getNextCareer:Ie,getCareerName:de}}const $e=3e4,Be="clicksurvivor_lastNicknameChangeAt";function yo(n){const{SAVE_KEY:e,CLOUD_RESTORE_BLOCK_KEY:c,Modal:s,t:o,validateNickname:b,normalizeNickname:M,claimNickname:A,getUser:k,saveGame:m,updateUI:C,Diary:d,LeaderboardUI:h,upsertCloudSave:f,getPlayerNickname:u,setPlayerNickname:t,__IS_DEV__:r}=n;let a=!1,i=0;const y=5;function S(){try{const g=localStorage.getItem(e);return g&&JSON.parse(g).nickname||""}catch(g){return console.error("닉네임 확인 실패:",g),""}}function v(){if(a)return;const g=S();if(g){t(g);return}a=!0;try{sessionStorage.setItem(c,"1")}catch(I){console.warn("sessionStorage set 실패:",I)}setTimeout(()=>{const I=async D=>{const q=b(D);if(!q.ok){let N="";switch(q.reasonKey){case"empty":N=o("settings.nickname.change.empty");break;case"tooShort":N=o("settings.nickname.change.tooShort");break;case"tooLong":N=o("settings.nickname.change.tooLong");break;case"invalid":N=o("settings.nickname.change.invalid");break;case"banned":N=o("settings.nickname.change.banned");break;default:N=o("settings.nickname.change.invalid")}if(s.openInfoModal(o("modal.error.nicknameFormat.title"),N,"⚠️"),a=!1,i++,i>=y){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}v();return}const{raw:B,key:W}=M(D),L=await k();if(!L){t(B),i=0,m(),d.addLog(o("msg.nicknameSet",{nickname:u()})),d.addLog(o("settings.nickname.change.loginRequired"));try{sessionStorage.removeItem(c)}catch(N){console.warn("sessionStorage remove 실패:",N)}return}try{const N=await A(B,L.id);if(!N.success){if(N.error==="taken"?s.openInfoModal(o("modal.error.nicknameTaken.title"),o("settings.nickname.change.taken"),"⚠️"):s.openInfoModal(o("modal.error.nicknameFormat.title"),o("settings.nickname.change.claimFailed"),"⚠️"),a=!1,i++,i>=y){r&&console.warn("[Nickname] 최대 재시도 횟수 초과, 모달 중단"),i=0;return}v();return}i=0,t(B),m(),d.addLog(o("msg.nicknameSet",{nickname:u()}));try{localStorage.removeItem("clicksurvivor_needsNicknameChange")}catch{}try{await h.updateLeaderboardEntry(!0)}catch($){console.error("리더보드 업데이트 실패:",$)}try{sessionStorage.removeItem(c)}catch($){console.warn("sessionStorage remove 실패:",$)}}catch(N){if(console.error("닉네임 설정 실패:",N),s.openInfoModal(o("modal.error.nicknameFormat.title"),o("settings.nickname.change.claimFailed"),"⚠️"),a=!1,i++,i>=y){r&&console.warn("[Nickname] 최대 재시도 횟수 초과 (에러), 모달 중단"),i=0;return}v()}};s.openInputModal(o("modal.nickname.title"),o("modal.nickname.message"),I,{icon:"✏️",primaryLabel:o("button.confirm"),placeholder:o("modal.nickname.placeholder"),maxLength:6,defaultValue:"",required:!0})},500)}function p(){try{const g=localStorage.getItem(Be);if(!g)return{allowed:!0};const I=parseInt(g,10),q=Date.now()-I;return q>=$e?{allowed:!0}:{allowed:!1,remainingSeconds:Math.ceil(($e-q)/1e3)}}catch{return{allowed:!0}}}function P(){try{localStorage.setItem(Be,String(Date.now()))}catch(g){console.warn("쿨타임 저장 실패:",g)}}function T(){const g=p();if(!g.allowed){s.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.cooldown",{seconds:g.remainingSeconds||0}),"⏱️");return}const I=u()||"";s.openInputModal(o("settings.nickname.modal.title"),o("settings.nickname.modal.message"),_,{icon:"✏️",primaryLabel:o("settings.nickname.modal.submit"),secondaryLabel:o("settings.nickname.modal.cancel"),placeholder:o("settings.nickname.modal.placeholder"),maxLength:6,defaultValue:I,required:!0})}async function _(g){const I=b(g);if(!I.ok){let L="";switch(I.reasonKey){case"empty":L=o("settings.nickname.change.empty");break;case"tooShort":L=o("settings.nickname.change.tooShort");break;case"tooLong":L=o("settings.nickname.change.tooLong");break;case"invalid":L=o("settings.nickname.change.invalid");break;case"banned":L=o("settings.nickname.change.banned");break;default:L=o("settings.nickname.change.invalid")}s.openInfoModal(o("modal.error.nicknameFormat.title"),L,"⚠️");return}const{raw:D,key:q}=M(g),B=M(u()||"");if(q===B.key)return;const W=await k();if(!W){const L=u();t(D),m(),C(),d.addLog(o("settings.nickname.change.success")),d.addLog(o("settings.nickname.change.loginRequired")),r&&`${L}${u()}`;return}try{const L=await A(D,W.id);if(!L.success){L.error==="taken"?(s.openInfoModal(o("modal.error.nicknameTaken.title"),o("settings.nickname.change.taken"),"⚠️"),setTimeout(()=>{T()},500)):s.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.claimFailed"),"⚠️");return}const N=u();t(D),m();try{const $=JSON.parse(localStorage.getItem(e)||"{}");await f("seoulsurvival",$)}catch($){console.error("클라우드 저장 실패:",$)}try{await h.updateLeaderboardEntry(!0)}catch($){console.error("리더보드 업데이트 실패:",$)}try{localStorage.removeItem("clicksurvivor_needsNicknameChange"),sessionStorage.removeItem("clicksurvivor_nicknameModalAutoOpened")}catch{}P(),C(),d.addLog(o("settings.nickname.change.success")),r&&`${N}${u()}`}catch(L){console.error("닉네임 변경 실패:",L),s.openInfoModal(o("modal.error.nicknameLength.title"),o("settings.nickname.change.claimFailed"),"⚠️")}}return{ensureNicknameModal:v,openNicknameChangeModal:T,handleNicknameChangeFromModal:_,checkNicknameCooldown:p,saveNicknameCooldown:P}}function uo(n){const{gameState:e,UPGRADES:c,settings:s,TIMING:o,MARKET_EVENT_TIMING:b,PROBABILITY:M,getRps:A,getFinancialIncome:k,getPropertyIncome:m,getClickIncome:C,checkCareerPromotion:d,checkMarketEvent:h,checkAchievements:f,checkUpgradeUnlocks:u,startMarketEvent:t,updateUI:r,saveGame:a,Animations:i,notificationManager:y,formatNumber:S,t:v,elWork:p,referralSystem:P}=n;let T=null,_=null,g=null,I=null,D=null,q=!1,B=null,W=performance.now(),L=!1,N=0;const $=20;let be={played_10min:!1};function se(R=50){T||(W=performance.now(),N=0,T=setInterval(()=>{const w=document.hidden;N++,N>=$&&(N=0,w||(h(),f(),u()));const x=performance.now(),U=Math.min((x-W)/1e3,1);W=x;const H=A()*U;if(e.cash+=H,e.lifetimeEarnings+=H,e.depositsLifetime+=k("deposit",e.deposits)*U,e.savingsLifetime+=k("savings",e.savings)*U,e.bondsLifetime+=k("bond",e.bonds)*U,e.usStocksLifetime+=k("usStock",e.usStocks)*U,e.cryptosLifetime+=k("crypto",e.cryptos)*U,e.villasLifetime+=m("villa",e.villas)*U,e.officetelsLifetime+=m("officetel",e.officetels)*U,e.apartmentsLifetime+=m("apartment",e.apartments)*U,e.shopsLifetime+=m("shop",e.shops)*U,e.buildingsLifetime+=m("building",e.buildings)*U,w){L=!0;return}L||(L=!0,requestAnimationFrame(()=>{r(),L=!1}))},R))}function pe(){if(_)return;const R=typeof requestIdleCallback=="function"?requestIdleCallback:w=>setTimeout(w,0);_=setInterval(()=>{a&&R(()=>{a()})},o.AUTO_SAVE_INTERVAL_MS)}function fe(R=!0){const w=C();if(e.cash+=w,e.totalClicks+=1,e.totalLaborIncome+=w,e.lifetimeEarnings+=w,d(),R&&p&&(p.classList.contains("auto-click-pulse")&&p.classList.remove("auto-click-pulse"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{p&&p.classList.add("auto-click-pulse")})})),R&&i.showIncomeAnimation(w),c.performance_bonus&&c.performance_bonus.purchased&&Math.random()<M.PERFORMANCE_BONUS_CHANCE){const x=w*9;e.cash+=x,e.totalLaborIncome+=x,e.lifetimeEarnings+=x}}function ge(){if(g)return;let R=0;g=setInterval(()=>{R++;const w=!document.hidden,x=In();if(x>0){const U=4/x;R%U===0&&fe(w)}R%4===0&&e.autoClickEnabled&&fe(w),R>=1e3&&(R=0)},250)}function _e(){if(I)return;const R=()=>{const w=Math.random()*b.RANDOM_RANGE_MS+b.MIN_INTERVAL_MS;I=setTimeout(()=>{e.marketEventEndTime===0&&t(),R()},w)};R()}function he(){P&&(D||(D=setInterval(()=>{Xe()},3e4)))}function Xe(){if(!P)return;const R=6e5;!be.played_10min&&e.totalPlayTime>=R&&(be.played_10min=!0,P.checkReferralMilestones("played_10min",R))}function Je(){q||(B=()=>{if(document.hidden)e.lastActiveTime=Date.now();else{const R=Date.now()-(e.lastActiveTime||Date.now()),w=300*1e3,x=7200;if(R>=w&&(s!=null&&s.browserNotifications)){const U=Math.min(R/1e3,x),H=A()*U;if(H>0){e.cash+=H,e.lifetimeEarnings+=H;const oe=Math.floor(R/6e4),ie=Math.floor(oe/60),ke=oe%60,tn=ie>0?v?v("notification.offlineIncome.body",{time:`${ie}h ${ke}m`,income:S?S(H):Math.floor(H).toLocaleString()}):`${ie}h ${ke}m`:v?v("notification.offlineIncome.body",{time:`${oe}m`,income:S?S(H):Math.floor(H).toLocaleString()}):`${oe}m`,rn=v?v("notification.offlineIncome.title"):"Offline Income";y&&y.showNotification(rn,tn,{tag:"offline-income"})}}W=performance.now(),L&&(r(),L=!1)}},document.addEventListener("visibilitychange",B),q=!0)}function Ze(){Je(),se(50),pe(),ge(),_e(),he()}function en(){T&&(clearInterval(T),T=null),_&&(clearInterval(_),_=null),g&&(clearInterval(g),g=null),I&&(clearTimeout(I),I=null),D&&(clearInterval(D),D=null),B&&(document.removeEventListener("visibilitychange",B),B=null,q=!1)}function nn(){T&&(clearInterval(T),T=null)}function on(R=50){T||se(R)}return{startAllLoops:Ze,stopAllLoops:en,startTickLoop:se,startAutoSave:pe,startAutoClick:ge,startMarketEventChecker:_e,startReferralMilestoneChecker:he,pauseTickLoop:nn,resumeTickLoop:on}}export{Xn as C,to as D,ao as M,X as P,xn as T,Qn as a,Yn as b,Vn as c,fn as d,pn as e,j as f,oo as g,zn as h,ln as i,ne as j,no as k,gn as l,_n as m,yo as n,so as o,Jn as p,ro as q,eo as r,Zn as s,uo as t,io as u,qn as v,lo as w,De as x,co as y};
