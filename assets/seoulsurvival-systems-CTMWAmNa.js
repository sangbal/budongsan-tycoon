import{g as q}from"./seoulsurvival-core-CJiihPXh.js";import{f as Y}from"./seoulsurvival-utils-f-440Gye.js";import{t as y,g as J}from"./seoulsurvival-i18n-CHj7PW_g.js";const en=[{id:"real_estate_mogul",nameKey:"synergy.realEstateMogul.name",descKey:"synergy.realEstateMogul.desc",icon:"🏢",check:r=>r.villas>0&&r.officetels>0&&r.apartments>0&&r.shops>0&&r.buildings>0,effect:"property_income",multiplier:1.3},{id:"finance_guru",nameKey:"synergy.financeGuru.name",descKey:"synergy.financeGuru.desc",icon:"💰",check:r=>r.deposits>0&&r.savings>0&&r.bonds>0&&r.usStocks>0&&r.cryptos>0,effect:"financial_income",multiplier:1.25},{id:"diversification",nameKey:"synergy.diversification.name",descKey:"synergy.diversification.desc",icon:"📊",check:r=>r.deposits>0&&r.savings>0&&r.bonds>0&&r.usStocks>0&&r.cryptos>0&&r.villas>0&&r.officetels>0&&r.apartments>0&&r.shops>0&&r.buildings>0,effect:"all_income",multiplier:1.15},{id:"seoul_ruler",nameKey:"synergy.seoulRuler.name",descKey:"synergy.seoulRuler.desc",icon:"🗼",check:r=>r.buildings>=5,effect:"all_income",multiplier:1.5},{id:"completionist",nameKey:"synergy.completionist.name",descKey:"synergy.completionist.desc",icon:"🏆",check:r=>r.__completionistUnlocked||!1,effect:"all_income",multiplier:2}];function $n(r=q){return en.filter(a=>a.check(r))}function tn(r,a){const M=$n(r);let u=1;for(const s of M)(s.effect===a||s.effect==="all_income")&&(u*=s.multiplier);return u}function fn(r,a=q){return r*tn(a,"property_income")}function yn(r,a=q){return r*tn(a,"financial_income")}function cn(r){const a=Object.values(r).every(M=>M.purchased);q.__completionistUnlocked=a}function kn(r=q){return en.map(a=>({id:a.id,nameKey:a.nameKey,descKey:a.descKey,icon:a.icon,active:a.check(r),multiplier:a.multiplier,effect:a.effect}))}const ln=[{id:"click_master",nameKey:"prestige.clickMaster.name",descKey:"prestige.clickMaster.desc",minTowers:1,tier:1,icon:"👆",effect:r=>({type:"click_power",multiplier:1+r*.1})},{id:"auto_income_boost",nameKey:"prestige.autoIncomeBoost.name",descKey:"prestige.autoIncomeBoost.desc",minTowers:1,tier:1,icon:"🤖",effect:r=>({type:"auto_income",multiplier:1+r*.05})},{id:"discount_master",nameKey:"prestige.discountMaster.name",descKey:"prestige.discountMaster.desc",minTowers:1,tier:1,icon:"💸",effect:r=>({type:"price_reduction",multiplier:Math.max(.5,1-r*.02)})},{id:"starting_capital",nameKey:"prestige.startingCapital.name",descKey:"prestige.startingCapital.desc",minTowers:1,tier:1,icon:"💰",effect:r=>({type:"starting_cash",amount:r*1e6})},{id:"upgrade_power",nameKey:"prestige.upgradePower.name",descKey:"prestige.upgradePower.desc",minTowers:3,tier:2,icon:"⚡",effect:r=>({type:"upgrade_multiplier",multiplier:1+(r-2)*.2})},{id:"offline_boost",nameKey:"prestige.offlineBoost.name",descKey:"prestige.offlineBoost.desc",minTowers:3,tier:2,icon:"⏰",effect:r=>({type:"offline_time",multiplier:1+(r-2)*.5})},{id:"special_upgrades",nameKey:"prestige.specialUpgrades.name",descKey:"prestige.specialUpgrades.desc",minTowers:5,tier:3,icon:"🎁",effect:r=>({type:"unlock_special",enabled:!0})},{id:"synergy_master",nameKey:"prestige.synergyMaster.name",descKey:"prestige.synergyMaster.desc",minTowers:5,tier:3,icon:"🔗",effect:r=>({type:"synergy_boost",multiplier:1.25})},{id:"time_warp",nameKey:"prestige.timeWarp.name",descKey:"prestige.timeWarp.desc",minTowers:10,tier:4,icon:"⏩",effect:r=>({type:"tick_speed",multiplier:1+(r-9)*.1})},{id:"ultimate_power",nameKey:"prestige.ultimatePower.name",descKey:"prestige.ultimatePower.desc",minTowers:10,tier:4,icon:"⭐",effect:r=>({type:"all_income",multiplier:1+(r-9)*.5})}];function rn(){const r=q.towers_lifetime;return ln.filter(a=>r>=a.minTowers).map(a=>({...a,effectValue:a.effect(r)}))}function hn(r){const a=rn();let M=1;for(const u of a)u.effectValue.type===r&&(M*=u.effectValue.multiplier||1);return M}function dn(){q.towers_lifetime;const r={click_power:1,auto_income:1,price_reduction:1,starting_cash:0,upgrade_multiplier:1,offline_time:1,unlock_special:!1,synergy_boost:1,tick_speed:1,all_income:1},a=rn();for(const M of a){const{type:u,multiplier:s,amount:x,enabled:A}=M.effectValue;switch(u){case"starting_cash":r.starting_cash+=x||0;break;case"unlock_special":r.unlock_special=A||!1;break;default:r[u]!==void 0&&s!==void 0&&(r[u]*=s);break}}return r}function _n(){return dn().starting_cash}let G=null,j=null,sn=null;function un(r,a){G=r,j=a,sn=a.sessionStartTime}function H(r){if(!G||!j||["🧪","v2.","v3.","Cookie Clicker","업그레이드 시스템","DOM 참조","성능 최적화","자동 저장 시스템","업그레이드 클릭","커리어 진행률","구현 완료","수정 완료","정상화","작동 중","활성화","해결","버그 수정","최적화","개편","벤치마킹"].some(c=>r.includes(c)))return;const u=c=>String(c).padStart(2,"0"),s=new Date,x=`${u(s.getHours())}:${u(s.getMinutes())}`;function A(){if(!j)return;const c=s.getFullYear(),i=u(s.getMonth()+1),p=u(s.getDate()),P=typeof j.gameStartTime<"u"&&j.gameStartTime?j.gameStartTime:sn,v=Math.max(1,Math.floor((Date.now()-P)/864e5)+1),m=document.getElementById("diaryHeaderMeta");m&&(m.textContent=`${c}.${i}.${p}(${y("ui.dayCount",{days:v})})`);const k=document.getElementById("diaryMetaDate"),F=document.getElementById("diaryMetaDay");k&&(k.textContent=y("ui.today",{date:`${c}.${i}.${p}`})),F&&(F.textContent=y("ui.dayCount",{days:v}))}function W(c){var N,C,b,U,R,h,w,O;const i=String(c||"").trim();if(new RegExp(y("msg.nextUpgradeHint",{remaining:"\\d+",name:".*"}).replace(/\{remaining\}/g,"\\d+").replace(/\{name\}/g,".*"),"i").test(i)||/다음\s*업그레이드/.test(i)&&/클릭\s*남/.test(i))return"";const P=n=>n.replace(/^[✅❌💸💰🏆🎉🎁📈📉🔓⚠️💡]+\s*/gu,"").trim(),v=n=>Math.floor(Math.random()*n),m=(n,e)=>{if(!Array.isArray(e)||e.length===0)return"";const o=`__diaryLastPick_${n}`,l=window[o];let K=v(e.length);return e.length>1&&typeof l=="number"&&K===l&&(K=(K+1+v(e.length-1))%e.length),window[o]=K,e[K]},k=n=>P(n).replace(/\s+/g," ").trim();if(y("msg.achievementUnlocked",{name:"",desc:""}).split(":")[0]+"",i.startsWith("🏆")&&(i.includes("업적 달성:")||i.includes("Achievement Unlocked:"))){const n=P(i).replace(/^(업적 달성|Achievement Unlocked):\s*/i,""),[e,o]=n.split(/\s*-\s*/);return m("achievement",[`오늘은 체크 하나를 더했다. (${e||"업적"})`,`작게나마 성취. ${e||"업적"}라니, 나도 꽤 한다.`,`기록해둔다: ${e||"업적"}.
${o||""}`.trim(),`"${e||"업적"}" 달성.
${o?`메모: ${o}`:""}`.trim(),`별거 아닌 듯한데, 이런 게 쌓여서 사람이 된다. (${e||"업적"})`,`또 하나의 마일스톤. ${e||"업적"}.
${o||""}`.trim(),`작은 성취도 성취다. ${e||"업적"}.
${o||""}`.trim(),`하루하루가 쌓인다. 오늘은 ${e||"업적"}.
${o||""}`.trim(),`기록에 하나 더. ${e||"업적"}.
${o||""}`.trim(),`뿌듯함이 조금씩. ${e||"업적"} 달성.
${o||""}`.trim(),`이런 게 인생이지. ${e||"업적"}.
${o||""}`.trim(),`작은 발걸음이 모여 길이 된다. ${e||"업적"}.
${o||""}`.trim()])}const F=J()==="en"?/🎉\s*(.+?)\s+promoted!?(\s*\(.*\))?/i:/🎉\s*(.+?)으로\s*승진했습니다!?(\s*\(.*\))?/;if(i.startsWith("🎉")&&(i.includes("승진했습니다")||/promoted/i.test(i))){const n=i.match(F),e=(N=n==null?void 0:n[1])==null?void 0:N.trim(),o=(C=n==null?void 0:n[2])==null?void 0:C.trim(),l=o?o.replace(/[()]/g,"").trim():"";return m("promotion",[`명함이 바뀌었다. ${e||"다음 단계"}.
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
${l}`.trim()])}const D=J()==="en"?/^🔓\s*(.+?)\s+unlocked/i:/^🔓\s*(.+?)이\s*해금/;if(i.startsWith("🔓")){const n=k(i),e=i.match(D),o=((e==null?void 0:e[1])||"").trim(),l={적금:[`자동이체 버튼이 눈에 들어왔다.
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
${n}`]};return o&&l[o]?m(`unlock_${o}`,l[o]):m("unlock",[`문이 하나 열렸다.
${n}`,`다음 장으로 넘어갈 수 있게 됐다.
${n}`,`아직 초반인데도, 벌써 선택지가 늘었다.
${n}`,`드디어. ${n}`,`새로운 가능성이 열렸다.
${n}`,`선택지가 하나 더 생겼다.
${n}`,`다음 단계로 나아갈 수 있다.
${n}`,`기회의 문이 열렸다.
${n}`,`새로운 길이 보인다.
${n}`,`진행의 길이 열렸다.
${n}`])}if(i.startsWith("💸 자금이 부족합니다")){const n=k(i);return m("noMoney",[`지갑이 얇아서 아무것도 못 했다.
${n}`,`현실 체크. 돈이 없다.
${n}`,`오늘은 참는다. 아직은 무리.
${n}`,`계산기만 두드리고 끝.
${n}`,`통장 잔고가 거짓말을 한다.
${n}`,`돈이 부족하다는 건 늘 아프다.
${n}`,`다시 모아야 한다. 조금 더.
${n}`,`욕심을 접어야 할 때.
${n}`,`현실이 무겁다.
${n}`,`내일을 기다려야 한다.
${n}`])}if(i.startsWith("✅")&&(i.includes("구입했습니다")||/purchased/i.test(i))){const n=k(i),e=i.match(/^✅\s*(.+?)\s+\d/),o=((e==null?void 0:e[1])||"").trim(),l={예금:[`일단은 안전한 데에 묶어두자.
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
${n}`]};return o&&l[o]?m(`buy_${o}`,l[o]):m("buy",[`결심하고 질렀다.
${n}`,`통장 잔고가 줄어들었다. 대신 미래를 샀다.
${n}`,`이건 소비가 아니라 투자라고… 스스로에게 말했다.
${n}`,`한 발 더 나아갔다.
${n}`,`손이 먼저 움직였다.
${n}`,`투자의 길을 걷는다.
${n}`,`미래를 위한 선택.
${n}`,`돈이 돈을 버는 구조.
${n}`,`자산을 늘리는 순간.
${n}`,`투자자의 마음가짐.
${n}`])}if(i.startsWith("💰")&&i.includes("판매했습니다")){const n=k(i),e=i.match(/^💰\s*(.+?)\s+\d/),o=((e==null?void 0:e[1])||"").trim(),l={코인:[`손이 떨리기 전에 내렸다.
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
${n}`]};return o&&l[o]?m(`sell_${o}`,l[o]):m("sell",[`정리할 건 정리했다.
${n}`,`가끔은 줄여야 산다.
${n}`,`현금이 필요했다. 그래서 팔았다.
${n}`,`미련은 접어두고 정리.
${n}`,`투자 포지션을 정리했다.
${n}`,`현금화의 선택.
${n}`,`자산을 정리하는 순간.
${n}`,`투자에서 벗어났다.
${n}`,`정리하고 다음 기회를 본다.
${n}`,`미련 없이 정리했다.
${n}`])}if(i.startsWith("❌")){const n=k(i);return m("fail",[`오늘은 뜻대로 안 됐다.
${n}`,`계획은 늘 계획대로 안 된다.
${n}`,`한 번 더. 다음엔 될 거다.
${n}`,`벽에 부딪혔다.
${n}`,`실패는 또 다른 시작.
${n}`,`좌절은 잠시뿐.
${n}`,`다시 일어서야 한다.
${n}`,`실패도 경험이다.
${n}`,`다음 기회를 기다린다.
${n}`,`실패에서 배운다.
${n}`])}if(i.startsWith("📈")&&i.includes("발생")){const n=k(i),e=(U=(b=i.match(/^📈\s*(.+?)\s*발생/))==null?void 0:b[1])==null?void 0:U.trim(),l=(((h=(R=i.match(/^📈\s*시장 이벤트 발생:\s*(.+?)\s*\(/))==null?void 0:R[1])==null?void 0:h.trim())||e||"").trim(),I=(V=>{const z=String(V||""),f=[["빌딩","빌딩"],["상가","상가"],["아파트","아파트"],["오피스텔","오피스텔"],["빌라","빌라"],["코인","코인"],["암호","코인"],["크립토","코인"],["₿","코인"],["미국","미국주식"],["🇺🇸","미국주식"],["달러","미국주식"],["주식","국내주식"],["코스피","국내주식"],["코스닥","국내주식"],["적금","적금"],["예금","예금"],["노동","노동"],["클릭","노동"],["업무","노동"]];for(const[on,an]of f)if(z.includes(on))return an;return""})(`${l} ${n}`)||"시장";window.__diaryLastMarketProduct=I,window.__diaryLastMarketName=l||n;const t={예금:[`예금 쪽은 흔들려도 티가 덜 난다. 그게 장점이자 단점.
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
${n}`]};return m(`market_${I}`,t[I]||t.시장)}if(i.startsWith("📉")&&i.includes("종료")){const n=window.__diaryLastMarketProduct||"시장",e=window.__diaryLastMarketName||"",o={코인:[`심장이 겨우 진정됐다. (${e||"이벤트 종료"})`,`코인 장은 끝날 때까지 끝난 게 아니다. 오늘은 일단 끝.
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
${e||""}`.trim()],시장:["소란이 잠잠해졌다.","폭풍 지나가고 고요.","이제 평소대로.","시장의 파도가 잠잠해졌다.","뉴스의 소란이 끝났다.","변동성이 안정됐다.","투자의 리스크가 줄어들었다.","시장의 무게에서 벗어났다."]},K=["빌라","오피스텔","아파트","상가","빌딩"].includes(n)?"부동산":n,I=m(`marketEnd_${K}`,o[K]||o.시장);return window.__diaryLastMarketProduct=null,window.__diaryLastMarketName=null,I}if(i.startsWith("💡")){const n=k(i),e=window.__diaryLastMarketProduct||"",o=window.__diaryLastMarketName||"",l={코인:[`메모(코인): 멘탈 관리가 수익률이다.
${n}`,`코인 메모.
${o?`(${o})
`:""}${n}`.trim(),`코인 투자 노트: 변동성을 견뎌야 한다.
${n}`,`코인 기록: FOMO를 이겨내야 한다.
${n}`,`코인 메모: 롤러코스터의 정점에서 내려야 한다.
${n}`,`코인 투자 기록: 위험을 감수하는 선택.
${n}`],국내주식:[`메모(국장): 뉴스 한 줄에 흔들리지 말 것.
${n}`,`국장 메모.
${o?`(${o})
`:""}${n}`.trim(),`국장 투자 노트: 차트의 파도를 타야 한다.
${n}`,`국장 기록: 변동성을 견뎌야 한다.
${n}`,`국장 메모: 투자자의 심장이 시험받는다.
${n}`,`국장 투자 기록: 국장의 무게를 견뎌야 한다.
${n}`],미국주식:[`메모(미장): 시차 + 환율 = 체력.
${n}`,`미장 메모.
${o?`(${o})
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
${o?`(${o})
`:""}${n}`.trim(),`부동산 투자 노트: 집의 무게감을 견뎌야 한다.
${n}`,`부동산 기록: 시장의 파도를 타야 한다.
${n}`,`부동산 메모: 부동산 투자의 리스크.
${n}`,`부동산 투자 기록: 동네 분위기의 변화.
${n}`],노동:[`메모(노동): 버티는 사람이 이긴다.
${n}`,`노동 노트: 일의 무게감을 견뎌야 한다.
${n}`,`노동 기록: 업무의 리듬이 시장에 좌우된다.
${n}`,`노동 메모: 일의 가치가 변동한다.
${n}`,`노동 투자 기록: 업무의 스트레스를 견뎌야 한다.
${n}`]},I=["빌라","오피스텔","아파트","상가","빌딩"].includes(e)?"부동산":e;return I&&l[I]?m(`memo_${I}`,l[I]):m("memo",[`메모.
${n}`,`적어둔다.
${n}`,`까먹기 전에 기록.
${n}`,`투자 노트에 기록.
${n}`,`기억해둘 것.
${n}`,`나중을 위해 기록.
${n}`])}if(i.startsWith("🎁")&&i.includes("해금")){const n=k(i),e=((O=(w=i.match(/해금:\s*(.+)$/))==null?void 0:w[1])==null?void 0:O.trim())||"",l=(I=>{const t=String(I||"");return t.includes("예금")?"예금":t.includes("적금")?"적금":t.includes("미국주식")||t.includes("미장")||t.includes("🇺🇸")?"미국주식":t.includes("코인")||t.includes("₿")||t.includes("암호")?"코인":t.includes("주식")?"국내주식":t.includes("빌딩")?"빌딩":t.includes("상가")?"상가":t.includes("아파트")?"아파트":t.includes("오피스텔")?"오피스텔":t.includes("빌라")?"빌라":t.includes("월세")||t.includes("부동산")?"부동산":t.includes("클릭")||t.includes("노동")||t.includes("업무")||t.includes("CEO")||t.includes("커리어")?"노동":""})(`${e} ${n}`)||"기본",K={노동:[`일을 '덜 힘들게' 만드는 방법이 생겼다.
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
${e||n}`]};return m(`upgradeUnlock_${l}`,K[l]||K.기본)}if(i.startsWith("✅")&&i.includes("구매!")){const n=k(i),e=i.match(/^✅\s*(.+?)\s*구매!\s*(.*)$/),o=((e==null?void 0:e[1])||"").trim(),l=((e==null?void 0:e[2])||"").trim(),I=(z=>{const f=String(z||"");return f.includes("예금")?"예금":f.includes("적금")?"적금":f.includes("미국주식")||f.includes("미장")||f.includes("🇺🇸")?"미국주식":f.includes("코인")||f.includes("₿")||f.includes("암호")?"코인":f.includes("주식")?"국내주식":f.includes("빌딩")?"빌딩":f.includes("상가")?"상가":f.includes("아파트")?"아파트":f.includes("오피스텔")?"오피스텔":f.includes("빌라")?"빌라":f.includes("월세")||f.includes("부동산")?"부동산":f.includes("클릭")||f.includes("노동")||f.includes("업무")||f.includes("CEO")||f.includes("커리어")?"노동":""})(`${o} ${l} ${n}`)||"기본",t=[o,l].filter(Boolean).join(" — ")||n,V={노동:[`일하는 방식이 바뀌었다.
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
${n}`]};return m(`upgradeBuy_${I}`,V[I]||V.기본)}if(i.startsWith("⚠️")){const n=k(i);return m("warn",[`찜찜한 기분이 남았다.
${n}`,`뭔가 삐끗한 느낌.
${n}`,`일단 기록만 남긴다.
${n}`,`뭔가 이상한 느낌.
${n}`,`불안한 기분이 든다.
${n}`,`주의가 필요할 것 같다.
${n}`,`뭔가 잘못된 것 같다.
${n}`,`경고의 신호가 느껴진다.
${n}`])}const $=k(i);return m("default",[$,`${y("diary.justWrite")}
${$}`,`${y("diary.todayRecord")}
${$}`,`${y("diary.anyway")} ${$}`,`${y("diary.justRecord")}
${$}`,`${y("diary.memo")}
${$}`,`${y("diary.remember")}
${$}`,`${y("diary.recordForLater")}
${$}`,`${y("diary.goodToWrite")}
${$}`,`${y("diary.leaveRecord")}
${$}`])}A();const B=W(r);if(!B)return;const _=document.createElement("p"),d=B.replace(/</g,"&lt;").replace(/>/g,"&gt;").split(`
`),S=(d[0]??"").trim(),L=d.slice(1).map(c=>String(c).trim()).filter(Boolean),g=`<span class="diary-voice">${S}</span>`+(L.length?`
<span class="diary-info">${L.join(`
`)}</span>`:"");if(_.innerHTML=`<span class="diary-time">${x}</span>${g}`,!G){console.error("[Diary] ❌ elLog is null in addLog! Cannot add log entry. Diary was not initialized.");return}G.prepend(_)}const bn=Object.freeze(Object.defineProperty({__proto__:null,addLog:H,initDiary:un},Symbol.toStringTag,{value:"Module"}));var Z,nn;const T=!!((nn=(Z=import.meta)==null?void 0:Z.env)!=null&&nn.DEV);function wn(r){const{UPGRADES:a,getCash:M,setCash:u,CAREER_LEVELS:s}=r;function x(){const _=M();document.querySelectorAll(".upgrade-item").forEach(d=>{const S=d.dataset.upgradeId,L=a[S];L&&!L.purchased&&(_>=L.cost?d.classList.add("affordable"):d.classList.remove("affordable"))})}function A(_){document.querySelectorAll(".upgrade-progress").forEach(d=>{const S=d.closest(".upgrade-item");!S||!S.dataset.upgradeId||(Object.entries(a).filter(([g,c])=>c.category==="labor"&&!c.unlocked&&!c.purchased).map(([g,c])=>{var v;const i=c.unlockCondition.toString(),p=i.match(/totalClicks\s*>=\s*(\d+)/);if(p)return{id:g,requiredClicks:parseInt(p[1]),upgrade:c};const P=i.match(/careerLevel\s*>=\s*(\d+)/);return P?{id:g,requiredClicks:((v=s[parseInt(P[1])])==null?void 0:v.requiredClicks)||1/0,upgrade:c}:null}).filter(g=>g!==null).sort((g,c)=>g.requiredClicks-c.requiredClicks),d.textContent="")})}function W(){const _=M(),E=document.getElementById("upgradeList"),d=document.getElementById("upgradeCount");if(!E||!d)return;const S=Object.entries(a).filter(([c,i])=>i.unlocked&&!i.purchased);S.length===0?d.style.display="none":(d.style.display="",d.textContent=`(${S.length})`);const L=document.getElementById("noUpgradesMessage"),g=document.querySelector('.stats-section[data-section-id="upgrades"]');if(S.length===0){if(E.innerHTML="",L&&(L.textContent=y("ui.noUpgrades"),L.style.display="block"),g&&!g.classList.contains("collapsed")){g.classList.add("collapsed");const c=g.querySelector(".stats-toggle");c&&c.setAttribute("aria-expanded","false")}return}L&&(L.style.display="none"),E.innerHTML="",T&&console.log(`🔄 Regenerating upgrade list with ${S.length} items`),S.forEach(([c,i])=>{const p=document.createElement("div");p.className="upgrade-item",p.dataset.upgradeId=c,_>=i.cost&&p.classList.add("affordable");const P=document.createElement("div");P.className="upgrade-icon",P.textContent=i.icon;const v=document.createElement("div");v.className="upgrade-info";const m=document.createElement("div");m.className="upgrade-name",m.textContent=y(`upgrade.${c}.name`,{},i.name);const k=document.createElement("div");k.className="upgrade-desc",k.textContent=y(`upgrade.${c}.desc`,{},i.desc);const F=Y(i.cost);if(i.category==="labor"&&i.unlockCondition)try{const $=document.createElement("div");$.className="upgrade-progress",$.style.fontSize="11px",$.style.color="var(--muted)",$.style.marginTop="4px";const N=Object.entries(a).filter(([C,b])=>b.category==="labor"&&!b.unlocked&&!b.purchased).map(([C,b])=>{const R=b.unlockCondition.toString().match(/totalClicks\s*>=\s*(\d+)/);return R?{id:C,requiredClicks:parseInt(R[1]),upgrade:b}:null}).filter(C=>C!==null).sort((C,b)=>C.requiredClicks-b.requiredClicks)}catch{}v.appendChild(m),v.appendChild(k);const D=document.createElement("div");D.className="upgrade-status",D.textContent=F,D.style.animation="none",D.style.background="rgba(94, 234, 212, 0.12)",D.style.color="var(--accent)",D.style.border="1px solid rgba(94, 234, 212, 0.25)",D.style.borderRadius="999px",p.appendChild(P),p.appendChild(v),p.appendChild(D),p.addEventListener("click",$=>{$.stopPropagation(),T&&console.log("🖱️ Upgrade item clicked!",c),B(c)},!1),T&&p.addEventListener("mousedown",$=>{console.log("🖱️ Mousedown detected on upgrade:",c)}),E.appendChild(p),T&&console.log(`✅ Upgrade item created and appended: ${c}`,p)})}function B(_){T&&(console.log("=== PURCHASE UPGRADE DEBUG ==="),console.log("Attempting to purchase:",_));const E=M();T&&console.log("Current cash:",E);const d=a[_];if(!d){console.error("업그레이드를 찾을 수 없습니다:",_),T&&console.log("Available upgrade IDs:",Object.keys(a));return}if(T&&console.log("Upgrade found:",{name:d.name,cost:d.cost,unlocked:d.unlocked,purchased:d.purchased}),d.purchased){H(y("msg.upgradeAlreadyPurchased")),T&&console.log("Already purchased");return}if(E<d.cost){H(y("msg.upgradeInsufficientFunds",{cost:Y(d.cost)})),T&&console.log("Not enough cash. Need:",d.cost,"Have:",E);return}T&&console.log("Purchase successful! Applying effect..."),u(E-d.cost),d.purchased=!0;try{d.effect(),H(y("msg.upgradePurchased",{name:y(`upgrade.${_}.name`,{},d.name),desc:y(`upgrade.${_}.desc`,{},d.desc)})),T&&console.log("Effect applied successfully")}catch(S){console.error(`업그레이드 효과 적용 실패 (${_}):`,S),H("⚠️ 업그레이드 효과 적용 중 오류 발생")}W(),x(),cn(a)}return{updateUpgradeAffordability:x,updateUpgradeProgress:A,updateUpgradeList:W,purchaseUpgrade:B}}const Q=3e4,X="clicksurvivor_lastNicknameChangeAt";function vn(r){const{SAVE_KEY:a,CLOUD_RESTORE_BLOCK_KEY:M,Modal:u,t:s,validateNickname:x,normalizeNickname:A,claimNickname:W,getUser:B,saveGame:_,updateUI:E,Diary:d,LeaderboardUI:S,upsertCloudSave:L,getPlayerNickname:g,setPlayerNickname:c,__IS_DEV__:i}=r;let p=!1;function P(){try{const $=localStorage.getItem(a);return $&&JSON.parse($).nickname||""}catch($){return console.error("닉네임 확인 실패:",$),""}}function v(){if(p){console.log("⏭️ 닉네임 모달: 이미 이번 세션에서 표시됨");return}const $=P();if($){c($);return}p=!0;try{sessionStorage.setItem(M,"1")}catch(N){console.warn("sessionStorage set 실패:",N)}setTimeout(()=>{const N=async C=>{const b=x(C);if(!b.ok){let w="";switch(b.reasonKey){case"empty":w=s("settings.nickname.change.empty");break;case"tooShort":w=s("settings.nickname.change.tooShort");break;case"tooLong":w=s("settings.nickname.change.tooLong");break;case"invalid":w=s("settings.nickname.change.invalid");break;case"banned":w=s("settings.nickname.change.banned");break;default:w=s("settings.nickname.change.invalid")}u.openInfoModal(s("modal.error.nicknameFormat.title"),w,"⚠️"),p=!1,v();return}const{raw:U,key:R}=A(C),h=await B();if(!h){c(U),_(),d.addLog(s("msg.nicknameSet",{nickname:g()})),d.addLog(s("settings.nickname.change.loginRequired"));try{sessionStorage.removeItem(M)}catch(w){console.warn("sessionStorage remove 실패:",w)}return}try{const w=await W(U,h.id);if(!w.success){w.error==="taken"?u.openInfoModal(s("modal.error.nicknameTaken.title"),s("settings.nickname.change.taken"),"⚠️"):u.openInfoModal(s("modal.error.nicknameFormat.title"),s("settings.nickname.change.claimFailed"),"⚠️"),p=!1,v();return}c(U),_(),d.addLog(s("msg.nicknameSet",{nickname:g()}));try{localStorage.removeItem("clicksurvivor_needsNicknameChange")}catch{}try{await S.updateLeaderboardEntry(!0)}catch(O){console.error("리더보드 업데이트 실패:",O)}try{sessionStorage.removeItem(M)}catch(O){console.warn("sessionStorage remove 실패:",O)}}catch(w){console.error("닉네임 설정 실패:",w),u.openInfoModal(s("modal.error.nicknameFormat.title"),s("settings.nickname.change.claimFailed"),"⚠️"),p=!1,v()}};u.openInputModal(s("modal.nickname.title"),s("modal.nickname.message"),N,{icon:"✏️",primaryLabel:s("button.confirm"),placeholder:s("modal.nickname.placeholder"),maxLength:6,defaultValue:"",required:!0})},500)}function m(){try{const $=localStorage.getItem(X);if(!$)return{allowed:!0};const N=parseInt($,10),b=Date.now()-N;return b>=Q?{allowed:!0}:{allowed:!1,remainingSeconds:Math.ceil((Q-b)/1e3)}}catch{return{allowed:!0}}}function k(){try{localStorage.setItem(X,String(Date.now()))}catch($){console.warn("쿨타임 저장 실패:",$)}}function F(){const $=m();if(!$.allowed){u.openInfoModal(s("modal.error.nicknameLength.title"),s("settings.nickname.change.cooldown",{seconds:$.remainingSeconds||0}),"⏱️");return}const N=g()||"";u.openInputModal(s("settings.nickname.modal.title"),s("settings.nickname.modal.message"),D,{icon:"✏️",primaryLabel:s("settings.nickname.modal.submit"),secondaryLabel:s("settings.nickname.modal.cancel"),placeholder:s("settings.nickname.modal.placeholder"),maxLength:6,defaultValue:N,required:!0})}async function D($){const N=x($);if(!N.ok){let h="";switch(N.reasonKey){case"empty":h=s("settings.nickname.change.empty");break;case"tooShort":h=s("settings.nickname.change.tooShort");break;case"tooLong":h=s("settings.nickname.change.tooLong");break;case"invalid":h=s("settings.nickname.change.invalid");break;case"banned":h=s("settings.nickname.change.banned");break;default:h=s("settings.nickname.change.invalid")}u.openInfoModal(s("modal.error.nicknameFormat.title"),h,"⚠️");return}const{raw:C,key:b}=A($),U=A(g()||"");if(b===U.key){i&&console.log("[Nickname] 변경 없음: 동일한 닉네임");return}const R=await B();if(!R){const h=g();c(C),_(),E(),d.addLog(s("settings.nickname.change.success")),d.addLog(s("settings.nickname.change.loginRequired")),i&&console.log(`[Nickname] 로컬 저장 완료 (비로그인): "${h}" → "${g()}"`);return}try{const h=await W(C,R.id);if(!h.success){h.error==="taken"?(u.openInfoModal(s("modal.error.nicknameTaken.title"),s("settings.nickname.change.taken"),"⚠️"),setTimeout(()=>{F()},500)):u.openInfoModal(s("modal.error.nicknameLength.title"),s("settings.nickname.change.claimFailed"),"⚠️");return}const w=g();c(C),_();try{const O=JSON.parse(localStorage.getItem(a)||"{}");await L("seoulsurvival",O),i&&console.log("[Nickname] 클라우드 저장 완료")}catch(O){console.error("클라우드 저장 실패:",O)}try{await S.updateLeaderboardEntry(!0)}catch(O){console.error("리더보드 업데이트 실패:",O)}try{localStorage.removeItem("clicksurvivor_needsNicknameChange"),sessionStorage.removeItem("clicksurvivor_nicknameModalAutoOpened")}catch{}k(),E(),d.addLog(s("settings.nickname.change.success")),i&&console.log(`[Nickname] 변경 완료: "${w}" → "${g()}"`)}catch(h){console.error("닉네임 변경 실패:",h),u.openInfoModal(s("modal.error.nicknameLength.title"),s("settings.nickname.change.claimFailed"),"⚠️")}}return{ensureNicknameModal:v,openNicknameChangeModal:F,handleNicknameChangeFromModal:D,checkNicknameCooldown:m,saveNicknameCooldown:k}}export{bn as D,yn as a,fn as b,H as c,kn as d,vn as e,wn as f,hn as g,_n as h,un as i};
