const b={kimchi_1:{id:"kimchi_1",name:"배추김치",emoji:"🥬",price:5e3,desc:"엄마의 손맛이 담긴 기본 김치"},kimchi_2:{id:"kimchi_2",name:"깍두기",emoji:"🧊",price:8e3,recipe:{kimchi_1:2},desc:"아삭아삭한 식감의 무김치"},kimchi_3:{id:"kimchi_3",name:"총각김치",emoji:"🥕",price:15e3,recipe:{kimchi_1:5},desc:"알싸한 맛의 무청 김치"},kimchi_4:{id:"kimchi_4",name:"묵은지",emoji:"🏺",price:25e3,recipe:{kimchi_1:3,kimchi_2:3},desc:"깊은 맛이 우러나는 숙성 김치"},kimchi_5:{id:"kimchi_5",name:"100년 숙성",emoji:"💎",price:5e4,recipe:{kimchi_1:5,kimchi_2:5,kimchi_3:2,kimchi_4:1},desc:"박물관에 가야 할 것 같은 전설의 김치"},enzyme_vial:{id:"enzyme_vial",name:"효소 앰플",emoji:"🧪",price:0,recipe:{kimchi_1:50},desc:"연구에 쓰이는 고농축 유산균 효소"},kimchi_sauce:{id:"kimchi_sauce",name:"만능 김치소스",emoji:"🥣",price:25e3,recipe:{kimchi_1:3,enzyme_vial:1},desc:"어떤 음식도 서울의 맛으로 바꾸는 마법의 소스"},kimchi_fried_rice:{id:"kimchi_fried_rice",name:"김치볶음밥",emoji:"🍳",price:45e3,recipe:{kimchi_sauce:1,kimchi_2:1},desc:"가장 대중적이지만 가장 안정적인 수익원"},kimchi_tangsuyuk:{id:"kimchi_tangsuyuk",name:"김치 탕수육",emoji:"🍖",price:12e4,recipe:{kimchi_sauce:2,kimchi_3:1},desc:"고기와 한 몸이 된 김치. 퓨전 문명의 정점."},kimchi_pasta:{id:"kimchi_pasta",name:"김치 파스타",emoji:"🍝",price:25e4,recipe:{kimchi_sauce:2,kimchi_tangsuyuk:1},desc:"동서양의 대화합. 이탈리아도 인정했다."},kimchi_dining:{id:"kimchi_dining",name:"김치 파인다이닝",emoji:"🍽️",price:1e6,recipe:{kimchi_sauce:5,kimchi_fried_rice:2,kimchi_tangsuyuk:1,kimchi_pasta:1,kimchi_1:10},desc:"코스 요리의 시작부터 끝까지 김치다."}},E={line_base_cost:1e5,line_cost_growth:2,refund_rate:.8},n={eq_mom_fridge:{id:"eq_mom_fridge",act:1,type:"equipment",name:"우리집 주방",tier:1,cost:0,effects:{batch:1},desc:"빌라의 좁은 주방. 김치를 겨우 담그는 시작점."},eq_dimchae:{id:"eq_dimchae",act:1,type:"equipment",name:"공유 주방",tier:2,cost:5e4,effects:{batch:5},desc:"시간제로 빌리는 넓은 주방. 작업 효율이 올라간다."},eq_community_work:{id:"eq_community_work",act:1,type:"equipment",name:"소규모 식품공장",tier:3,cost:2e5,effects:{batch:15},desc:"정식 식품 제조 허가를 받은 작은 공장."},eq_small_workshop:{id:"eq_small_workshop",act:1,type:"equipment",name:"현대식 센트럴 키친",tier:4,cost:8e5,effects:{batch:40},desc:"최신 장비로 무장한 전문 요리 거점."},eq_haccp_factory:{id:"eq_haccp_factory",act:1,type:"equipment",name:"글로벌 HACCP 공장",tier:5,cost:25e5,effects:{batch:100},desc:"철저한 위생 관리와 자동화 라인의 정점."},wk_me:{id:"wk_me",act:1,type:"worker",name:"나 혼자",tier:1,cost:0,effects:{prodSpeed:0},desc:"배추 절이기부터 포장까지 전부 혼자 한다."},wk_mom:{id:"wk_mom",act:1,type:"worker",name:"가족의 도움",tier:2,cost:3e4,effects:{prodSpeed:1},desc:"엄마의 비법과 가족의 손길이 더해진다."},wk_alba:{id:"wk_alba",act:1,type:"worker",name:"열정적인 알바생들",tier:3,cost:15e4,effects:{prodSpeed:3},desc:"패기 넘치는 알바생들이 활기를 불어넣는다."},wk_team:{id:"wk_team",act:1,type:"worker",name:"의리의 생산팀",tier:4,cost:5e5,effects:{prodSpeed:8},desc:"눈빛만 봐도 통하는 베테랑 생산 정예반."},wk_shift:{id:"wk_shift",act:1,type:"worker",name:"24시간 베테랑 교대조",tier:5,cost:2e6,effects:{prodSpeed:20},desc:"숙련된 인력들이 3교대로 끊임없이 생산한다."},lg_box:{id:"lg_box",act:1,type:"storage",name:"우리집 거실",tier:1,cost:0,effects:{moveBatch:1},desc:"포장된 김치가 쌓여가는 좁은 거실."},lg_pallet:{id:"lg_pallet",act:1,type:"storage",name:"허름한 냉장창고",tier:2,cost:2e4,effects:{moveBatch:5},desc:"신선도 유지가 가능한 작은 저장 창고."},lg_cont_small:{id:"lg_cont_small",act:1,type:"storage",name:"외곽 임대 컨테이너",tier:3,cost:1e5,effects:{moveBatch:15},desc:"본격적인 물류 이동을 위한 규격화 공간."},lg_warehouse:{id:"lg_warehouse",act:1,type:"storage",name:"대형 물류 창고",tier:4,cost:5e5,effects:{moveBatch:40},desc:"체계적인 선입선출이 이루어지는 대형 기지."},lg_center_hub:{id:"lg_center_hub",act:1,type:"storage",name:"최첨단 스마트 허브",tier:5,cost:2e6,effects:{moveBatch:100},desc:"모든 데이터가 실시간으로 관리되는 물류 거점."},tr_hand:{id:"tr_hand",act:1,type:"transporter",name:"나 혼자",tier:1,cost:0,effects:{moveSpeed:0},desc:"직접 상자를 들고 계단을 오르내린다."},tr_cart:{id:"tr_cart",act:1,type:"transporter",name:"우체국 집배원",tier:2,cost:3e4,effects:{moveSpeed:1},desc:"든든한 우체국 서비스를 통해 안정적으로 배송한다."},tr_truck:{id:"tr_truck",act:1,type:"transporter",name:"당일배송 택배",tier:3,cost:15e4,effects:{moveSpeed:3},desc:"전국 어디든 하루 만에 도달하는 택배 시스템."},tr_fleet:{id:"tr_fleet",act:1,type:"transporter",name:"직영 배송 네트워크",tier:4,cost:5e5,effects:{moveSpeed:8},desc:"우리 브랜드만의 전용 차량과 배송 인력팀."},tr_auto_sys:{id:"tr_auto_sys",act:1,type:"transporter",name:"AI 자동화 로봇",tier:5,cost:2e6,effects:{moveSpeed:20},desc:"무인 자율 주행 로봇이 최적의 경로로 운송한다."},mk_neighborhood:{id:"mk_neighborhood",act:1,type:"market",name:"집 근처 직거래",tier:1,cost:0,effects:{sellAmount:1},desc:"이웃 사람들에게 직접 만나서 판매한다."},mk_supermarket:{id:"mk_supermarket",act:1,type:"market",name:"동네 슈퍼 매대",tier:2,cost:5e4,effects:{sellAmount:5},desc:"슈퍼마켓 입구 좋은 자리를 차지했다."},mk_online:{id:"mk_online",act:1,type:"market",name:"온라인 스토어 입점",tier:3,cost:2e5,effects:{sellAmount:15},desc:"전 국민을 상대로 한 24시간 오픈 매장."},mk_franchise:{id:"mk_franchise",act:1,type:"market",name:"라이브커머스 진출",tier:4,cost:8e5,effects:{sellAmount:40},desc:"방송 즉시 주문이 쏟아지는 실시간 판매 채널."},mk_enterprise:{id:"mk_enterprise",act:1,type:"market",name:"강남 글로벌 사옥",tier:5,cost:25e5,effects:{sellAmount:100},desc:"기업 간 대규모 계약이 성사되는 럭셔리 사무실."},so_solo:{id:"so_solo",act:1,type:"salesOrg",name:"나 혼자",tier:1,cost:0,effects:{sellSpeed:0},desc:"전단지를 돌리며 직접 구매자를 찾아다닌다."},so_alba:{id:"so_alba",act:1,type:"salesOrg",name:"친절한 시식 판매원",tier:2,cost:3e4,effects:{sellSpeed:1},desc:"맛을 본 사람들이 지갑을 열게 만드는 판매 장인."},so_contract:{id:"so_contract",act:1,type:"salesOrg",name:"계약직 영업사원",tier:3,cost:15e4,effects:{sellSpeed:3},desc:"실적 기반으로 김치를 전국에 알리는 전문가."},so_team:{id:"so_team",act:1,type:"salesOrg",name:"소수정예 영업팀",tier:4,cost:5e5,effects:{sellSpeed:8},desc:"기업 홍보와 마케팅 전략을 실행하는 정예 멤버."},so_hq:{id:"so_hq",act:1,type:"salesOrg",name:"글로벌 영업본부",tier:5,cost:2e6,effects:{sellSpeed:20},desc:"전 세계 유통망을 관리하는 거대 판매 조직."}},M={unlock_kkakdugi:{id:"unlock_kkakdugi",name:"깍두기 레시피 연구",cost:1e5,costItems:{kimchi_1:50},type:"unlock",productId:"kimchi_2",desc:"무를 썰어 맵게 버무리는 법을 배운다."},unlock_chonggak:{id:"unlock_chonggak",name:"총각김치 레시피 연구",cost:5e5,costItems:{kimchi_2:100},prereq:"unlock_kkakdugi",type:"unlock",productId:"kimchi_3",desc:"작은 무의 아삭함을 살리는 비법."},unlock_muegenji:{id:"unlock_muegenji",name:"묵은지 숙성법",cost:1e6,costItems:{kimchi_3:100},prereq:"unlock_chonggak",type:"unlock",productId:"kimchi_4",desc:"깊은 맛을 내는 장기 숙성 기술."},unlock_100y:{id:"unlock_100y",name:"100년 숙성 비기",cost:5e6,costItems:{kimchi_4:200},prereq:"unlock_muegenji",type:"unlock",productId:"kimchi_5",desc:"가문의 비법을 복원한다."},fermentation_lab:{id:"fermentation_lab",name:"발효 실험실 구축",cost:1e6,costItems:{kimchi_1:500},prereq:"unlock_kkakdugi",type:"unlock",productId:"enzyme_vial",desc:"김치에서 효소를 추출할 수 있게 된다."},global_efficiency:{id:"global_efficiency",name:"유산균 강화 연구",cost:2e6,costEnzyme:50,prereq:"fermentation_lab",type:"buff",effects:{priceMult:1.2},desc:"모든 김치의 판매 가격이 20% 상승한다."},unlock_sauce:{id:"unlock_sauce",name:"만능 소스 개발",cost:15e5,costEnzyme:30,prereq:"fermentation_lab",type:"unlock",productId:"kimchi_sauce",desc:"모든 요리의 베이스가 될 소스를 개발한다."},unlock_rice:{id:"unlock_rice",name:"K-볶음밥 레시피",cost:25e5,costEnzyme:60,prereq:"unlock_sauce",type:"unlock",productId:"kimchi_fried_rice",desc:"김치소스와 밥의 완벽한 조화."},unlock_fusion:{id:"unlock_fusion",name:"퓨전 중식 연구",cost:5e6,costEnzyme:100,prereq:"unlock_rice",type:"unlock",productId:"kimchi_tangsuyuk",desc:"김치와 튀긴 고기의 무시무시한 결합."},unlock_pasta:{id:"unlock_pasta",name:"김치 파스타 연구",cost:1e7,costEnzyme:200,type:"unlock",productId:"kimchi_pasta",desc:"이탈리아의 면과 서울의 소스가 만났다."},unlock_dining:{id:"unlock_dining",name:"파인다이닝 런칭",cost:5e7,costEnzyme:500,type:"unlock",productId:"kimchi_dining",desc:"김치를 예술의 경지로 끌어올린다."},star_kimchi_ship:{id:"star_kimchi_ship",name:"스타김치십 프로젝트",cost:1e8,costEnzyme:1e3,costItems:{kimchi_dining:10},type:"prestige",desc:"서울타워를 발사대로 개조하여 우주로 김치를 실어 나른다. (발사 시 게임 초기화 및 AM 획득)"}},I={am_prod_speed:{id:"am_prod_speed",name:"A1. 더 빠른 손",cost:1,desc:"모든 생산 라인 생산속도 +25%",effects:{prodSpeedMult:1.25}},am_cost_reduce:{id:"am_cost_reduce",name:"A2. 원가 절감",cost:1,desc:"레시피 입력 소모량 -10%",effects:{costReduce:.1}},am_warehouse:{id:"am_warehouse",name:"B1. 더 큰 창고",cost:1,desc:"Keep 수용량(Cap) +50%",effects:{capMult:1.5}},am_auto_logi:{id:"am_auto_logi",name:"B2. 분류 자동화",cost:1,desc:"물류 속도 +40% (분류 최적화)",effects:{moveSpeedMult:1.4}},am_sales_org:{id:"am_sales_org",name:"C1. 판매 조직",cost:1,desc:"판매 처리 속도 +40%",effects:{sellSpeedMult:1.4}},am_premium:{id:"am_premium",name:"C2. 브랜드 프리미엄",cost:1,desc:"판매 단가 +10%",effects:{priceMult:1.1}},am_res_eff:{id:"am_res_eff",name:"D1. 연구 효율",cost:1,desc:"연구 효소 요구량 -20%",effects:{researchEnzymeReduce:.2}},am_res_cost:{id:"am_res_cost",name:"D2. 연구비 절감",cost:1,desc:"연구 현금 비용 -15%",effects:{researchCashReduce:.15}},am_start_cash:{id:"am_start_cash",name:"E1. 시작 자본",cost:1,desc:"프레스티지 후 시작 현금 +50%",effects:{startCashMult:1.5}},am_start_buff:{id:"am_start_buff",name:"E2. 초반 가속",cost:1,desc:"시작 후 5분간 생산속도 +25%",effects:{startBuffDuration:3e5,startBuffVal:1.25}}},x={a01:{id:"a01",title:"엄마의 냉장고",desc:"게임 시작 (첫 생산 1회)",rewardLog:"l01"},a02:{id:"a02",title:"첫 판매",desc:"배추김치 10개 판매",rewardBanner:"장사 시작"},a03:{id:"a03",title:"부녀회 가입",desc:"김치 냉장고(설비 T2) 구매",rewardLog:"l02"},a04:{id:"a04",title:"좌판 개시",desc:"동네 시장(시장 T2) 해금",rewardLog:"l03"},a05:{id:"a05",title:"물류의 시작",desc:"물류 인력 1명 고용",rewardLog:"l04"},a06:{id:"a06",title:"자동판매의 시작",desc:"판매 알바(조직 T2) 고용",rewardCheck:"판매 자동화"},a07:{id:"a07",title:"발효실험실 1호",desc:"발효실험실 해금 (효소 오픈)",rewardLog:"l05"},a08:{id:"a08",title:"소스는 베이스다",desc:"김치소스 해금",rewardLog:"l06"},a09:{id:"a09",title:"첫 퓨전",desc:"김치 탕수육 해금",rewardCheck:"퓨전 카운트"},a10:{id:"a10",title:"파인다이닝 오픈",desc:"김치 파인다이닝 해금",rewardCheck:"발사 준비"},a11:{id:"a11",title:"미래 재료 1호",desc:"신소재 해금 (Act3 프리뷰)",rewardLog:"l07"},a12:{id:"a12",title:"클린룸 입성",desc:"반도체 SoC 해금 (Act3)",rewardCheck:"미래산업 생산"},a13:{id:"a13",title:"연산의 시대",desc:"GPU 해금 (Act3)",rewardBanner:"발사 레시피"},a14:{id:"a14",title:"타워의 문서",desc:"발사대 연구(사실상 스타김치십)",rewardLog:"l08"},a15:{id:"a15",title:"최종 조립 매뉴얼",desc:"스타김치십 제작 가능",rewardLog:"l09"},a16:{id:"a16",title:"첫 발사",desc:"스타김치십 발사 1회",rewardLog:"l10",rewardAM:1},a17:{id:"a17",title:"두 번째 발사",desc:"발사 2회 달성",rewardLog:"l11"},a18:{id:"a18",title:"다섯 번째 발사",desc:"발사 5회 달성",rewardLog:"l12"},a19:{id:"a19",title:"공정 최적화",desc:"조건부 분류 활성화 + 모듈 제작",rewardMedal:"물류 장인"},a20:{id:"a20",title:"근본은 배추김치",desc:"발사 직전 배추김치 생산 유지",rewardMedal:"근본"}},$={l01:{id:"l01",title:"엄마의 냉장고",content:'서울의 생존은 늘 하나였다. 남기는 게 아니라, 쌓는 것. 거창한 계획은 없다. "엄마김치... 팔아볼까?"',condition:()=>!0},l02:{id:"l02",title:"부녀회 공동구매 전단지",content:"김치가 진짜로 팔리기 시작했다. 부녀회에서 장비를 같이 사자고 한다. 이건 장사가 될 것 같다.",condition:m=>m.hasAchievement("a03")},l03:{id:"l03",title:"시장 좌판의 규칙",content:'집 앞에서 팔던 김치가 시장으로 들어왔다. 이제는 "만드는 속도"보다 "파는 구조"가 중요해진다.',condition:m=>m.hasAchievement("a04")},l04:{id:"l04",title:"납품은 김치가 아니라 물류다",content:'식당에서 연락이 온다. 문제는 하나다. 김치가 아니라 "물류"가 너를 죽이기 시작한다.',condition:m=>m.hasAchievement("a05")},l05:{id:"l05",title:"발효실험실 기록 1호",content:"김치는 시간이 만든다. 그리고 시간은 연구할 수 있다. 실험실이 열렸고, 효소가 보이기 시작한다.",condition:m=>m.hasAchievement("a07")},l06:{id:"l06",title:"김치소스는 베이스다",content:"김치는 팔리는 음식이 아니라, 안정적인 금융상품이다. 김치소스가 그 증거다.",condition:m=>m.hasAchievement("a08")},l07:{id:"l07",title:"미래산업의 첫 재료",content:"누군가 김치 유산균으로 신소재를 만들 수 있다고 했다. 말도 안 되지만, 서울이니까 가능할지도 모른다.",condition:m=>m.hasAchievement("a11")},l08:{id:"l08",title:"서울타워 기술문서",content:"서울타워는 원래 통신탑이 아니었다. 그 구조는 처음부터 발사대를 염두에 두고 있었다.",condition:m=>m.hasAchievement("a14")},l09:{id:"l09",title:"스타김치십: 조립 매뉴얼",content:"이 우주선은 연료가 아니라 발효 가스로 움직인다. 농담 같지만 진짜다.",condition:m=>m.hasAchievement("a15")},l10:{id:"l10",title:"외계물질(AM) 회수 보고서",content:'스타김치십이 귀환했다. 외계물질 1을 확보했다. 연구 탭에서 "외계물질 연구소"를 열어보자.',condition:m=>m.hasAchievement("a16")},l11:{id:"l11",title:"두 번째 발사: 신호가 되돌아오다",content:"무언가가 답장을 보냈다. 단순한 반사가 아니다. 명백한 의도가 담긴 신호다.",condition:m=>m.hasAchievement("a17")},l12:{id:"l12",title:"다섯 번째 발사: 누군가 듣고 있다",content:"규칙을 바꾸는 자를... 누군가가 보고 있다. 이제 되돌릴 수 없다.",condition:m=>m.hasAchievement("a18")}};class A{constructor(){this.cash=0,this.enzyme=0,this.am=0,this.lines=[],this.productInventory={},this.itemInventory={},this.completedResearch=[],this.amUpgrades=[],this.completedAchievements=[],this.startBuffEndTime=0,this.isResetting=!1}init(){this.load(),this.lines.length===0&&this.initNewGame(),this.ensureStarterLine()}ensureStarterLine(){this.lines.length===0&&this.cash<this.getLineCost()&&(console.warn("Softlock detected: No lines and insufficient cash. Forcing starter line."),this.lines.push({id:Date.now(),productId:"kimchi_1",slots:{equipment:"eq_mom_fridge",worker:"wk_me",storage:"lg_box",transporter:"tr_hand",market:"mk_neighborhood",salesOrg:"so_solo"},logisticsDir:"keep",prodAccumulator:0,sellAccumulator:0}),this.productInventory.kimchi_1||(this.productInventory.kimchi_1={keep:0,sell:0,cap:100}),this.save(),alert("긴급 구조: 생산 라인이 유실되어 복구되었습니다."))}initNewGame(){this.cash=0,this.enzyme=0,this.completedResearch=[],this.productInventory={},this.itemInventory={},this.itemInventory.eq_mom_fridge=1,this.itemInventory.wk_me=1,this.itemInventory.lg_box=1,this.itemInventory.tr_hand=1,this.itemInventory.mk_neighborhood=1,this.itemInventory.so_solo=1,this.lines=[{id:Date.now(),productId:"kimchi_1",slots:{equipment:"eq_mom_fridge",worker:"wk_me",storage:"lg_box",transporter:"tr_hand",market:"mk_neighborhood",salesOrg:"so_solo"},logisticsDir:"keep",prodAccumulator:0,sellAccumulator:0}],this.productInventory.kimchi_1={keep:0,sell:0,cap:100},this.save()}save(){if(this.isResetting)return;const t={cash:this.cash,enzyme:this.enzyme,am:this.am,lines:this.lines,productInventory:this.productInventory,itemInventory:this.itemInventory,completedResearch:this.completedResearch,amUpgrades:this.amUpgrades,completedAchievements:this.completedAchievements,startBuffEndTime:this.startBuffEndTime};localStorage.setItem("kimchi_invasion_save_v1",JSON.stringify(t)),window.dispatchEvent(new CustomEvent("kimchi-saved"))}load(){let t=null;try{t=localStorage.getItem("kimchi_invasion_save_v1")}catch(i){console.error("Storage Access Error:",i)}if(t)try{const i=JSON.parse(t);this.cash=i.cash||0,this.enzyme=i.enzyme||0,this.am=i.am||0,this.lines=i.lines||[],this.lines.forEach(e=>{e.slots||(e.slots={}),e.slots.logistics&&!e.slots.transporter&&(e.slots.transporter=e.slots.logistics,delete e.slots.logistics),e.slots.equipment||(e.slots.equipment="eq_mom_fridge"),e.slots.worker||(e.slots.worker="wk_me"),e.slots.storage||(e.slots.storage="lg_box"),e.slots.transporter||(e.slots.transporter="tr_hand"),e.slots.market||(e.slots.market="mk_neighborhood"),e.slots.salesOrg||(e.slots.salesOrg="so_solo"),"logistics"in e.slots&&delete e.slots.logistics,e.id||(e.id=Date.now()+Math.random().toString(36).substr(2,5)),e.prodAccumulator===void 0&&(e.prodAccumulator=0),e.sellAccumulator===void 0&&(e.sellAccumulator=0)}),this.productInventory=i.productInventory||{},this.itemInventory=i.itemInventory||{},this.completedResearch=i.completedResearch||[],this.amUpgrades=i.amUpgrades||[],this.completedAchievements=i.completedAchievements||[],this.startBuffEndTime=i.startBuffEndTime||0}catch(i){console.error("Save File Corrupted:",i),localStorage.setItem(`kimchi_invasion_save_broken_${Date.now()}`,t),alert("저장된 데이터가 손상되어 초기화되었습니다. (백업 완료)"),this.initNewGame()}}tick(t){const i=this.getAMBuffs(),e=i.prodSpeedMult*i.startBuffVal;this.lines.forEach(s=>{const o=s.productId;if(!o)return;this.productInventory[o]||(this.productInventory[o]={keep:0,sell:0,cap:100});let a=100;s.slots.storage&&n[s.slots.storage],this.productInventory[o].cap=Math.floor(a*i.capMult),this.produceAuto(s,t*e,i),this.sellAuto(s,t*i.sellSpeedMult,i),this.moveAuto(s,t*i.moveSpeedMult)}),this.checkAchievements()}produceAuto(t,i,e){const s=t.productId,o=this.productInventory[s];let a=0;if(t.slots.worker&&n[t.slots.worker]&&(a=n[t.slots.worker].effects.prodSpeed||0),a<=0)return;const c=a*i;if(t.prodAccumulator+=c,t.prodAccumulator>=1){if(!this.checkRecipe(s,1,e)){t.prodAccumulator=1;return}let l=1;t.slots.equipment&&n[t.slots.equipment]&&(l+=n[t.slots.equipment].effects.batch||0);const d=o.keep+o.sell;let r=l;d+r>o.cap&&(r=o.cap-d),r>0?(this.consumeRecipe(s,1,e),s==="enzyme_vial"?this.enzyme+=r:o.keep+=r,t.prodAccumulator-=1):t.prodAccumulator=1}}sellAuto(t,i,e){const s=t.productId,o=this.productInventory[s];let a=0;if(t.slots.salesOrg&&n[t.slots.salesOrg]&&(a=n[t.slots.salesOrg].effects.sellSpeed||0),!(a<=0)&&(t.sellAccumulator+=a*i,t.sellAccumulator>=1)){let c=1;if(t.slots.market&&n[t.slots.market]&&(c+=n[t.slots.market].effects.sellAmount||0),o.sell>=c)o.sell-=c,this.cash+=this.getProductPrice(s)*c,t.sellAccumulator-=1;else if(o.sell>0){const l=o.sell;o.sell=0,this.cash+=this.getProductPrice(s)*l,t.sellAccumulator-=1}else t.sellAccumulator=1}}moveAuto(t,i){let e=0;t.slots.transporter&&n[t.slots.transporter]&&(e=n[t.slots.transporter].effects.moveSpeed||0);let s=1;t.slots.storage&&n[t.slots.storage]&&(s+=n[t.slots.storage].effects.moveBatch||0);const o=e*i*s;if(o<=0)return;const a=this.productInventory[t.productId];if(a)if(t.logisticsDir==="sell"){const c=Math.min(o,a.keep);c>0&&(a.keep-=c,a.sell+=c)}else{const c=Math.min(o,a.sell);c>0&&(a.sell-=c,a.keep+=c)}}produce(t){const i=this.lines.find(d=>d.id===t);if(!i)return 0;const e=i.productId,s=this.productInventory[e],o=this.getAMBuffs();if(!this.checkRecipe(e,1,o))return-1;let a=1;i.slots.equipment&&n[i.slots.equipment]&&(a+=n[i.slots.equipment].effects.batch||0);const c=s.keep+s.sell;let l=a;return c+l>s.cap&&(l=s.cap-c),l>0?(this.consumeRecipe(e,1,o),e==="enzyme_vial"?this.enzyme+=l:s.keep+=l,this.save(),l):0}sell(t){const i=this.lines.find(l=>l.id===t);if(!i)return 0;const e=i.productId,s=this.productInventory[e];let o=1;i.slots.market&&n[i.slots.market]&&(o+=n[i.slots.market].effects.sellAmount||0);const a=this.getProductPrice(e);let c=0;return s.sell>=o?(s.sell-=o,c=a*o):s.sell>0&&(c=a*s.sell,s.sell=0),c>0&&(this.cash+=c,this.save()),c}moveLogistics(t,i){const e=this.lines.find(a=>a.id===t);if(!e)return;let s=1;e.slots.storage&&n[e.slots.storage]&&(s+=n[e.slots.storage].effects.moveBatch||0),s*=5;const o=this.productInventory[e.productId];if(i==="sell"){const a=Math.min(s,o.keep);o.keep-=a,o.sell+=a}else{const a=Math.min(s,o.sell);o.sell-=a,o.keep+=a}this.save()}toggleLogisticsDir(t){const i=this.lines.find(e=>e.id===t);i&&(i.logisticsDir=i.logisticsDir==="keep"?"sell":"keep",this.save())}buyLine(){const t=this.getLineCost();if(this.cash>=t){this.cash-=t;const i=Date.now()+Math.floor(Math.random()*1e3);return this.lines.push({id:i,productId:null,slots:{equipment:"eq_mom_fridge",worker:"wk_me",storage:"lg_box",transporter:"tr_hand",market:"mk_neighborhood",salesOrg:"so_solo"},logisticsDir:"sell",prodAccumulator:0,sellAccumulator:0}),this.save(),!0}return!1}removeLine(t){const i=this.lines.findIndex(e=>e.id===t);if(i>-1){const e=this.lines.length,o=E.line_base_cost*Math.pow(E.line_cost_growth,e-1)*E.refund_rate;this.cash+=o,this.lines.splice(i,1),this.save()}}buyAMUpgrade(t){const i=I[t];return!i||this.amUpgrades.includes(t)?!1:this.am>=i.cost?(this.am-=i.cost,this.amUpgrades.push(t),this.save(),!0):!1}getLineCost(){return E.line_base_cost*Math.pow(E.line_cost_growth,this.lines.length)}getProductPrice(t){if(!b[t])return 0;const i=this.getAMBuffs();return b[t].price*i.priceMult}checkRecipe(t,i,e){const s=b[t].recipe;if(!s)return!0;for(const[o,a]of Object.entries(s)){const c=a*i*(1-e.costReduce);if(!this.productInventory[o]||this.productInventory[o].keep<c)return!1}return!0}consumeRecipe(t,i,e){const s=b[t].recipe;if(s)for(const[o,a]of Object.entries(s)){const c=a*i*(1-e.costReduce);this.productInventory[o]&&(this.productInventory[o].keep-=c)}}getAMBuffs(){const t={prodSpeedMult:1,costReduce:0,capMult:1,moveSpeedMult:1,sellSpeedMult:1,priceMult:1,researchEnzymeReduce:0,researchCashReduce:0,startCashMult:1,startBuffVal:1};return this.amUpgrades.forEach(i=>{const e=I[i];e&&e.effects&&(e.effects.prodSpeedMult&&(t.prodSpeedMult*=e.effects.prodSpeedMult),e.effects.costReduce&&(t.costReduce+=e.effects.costReduce),e.effects.capMult&&(t.capMult*=e.effects.capMult),e.effects.moveSpeedMult&&(t.moveSpeedMult*=e.effects.moveSpeedMult),e.effects.sellSpeedMult&&(t.sellSpeedMult*=e.effects.sellSpeedMult),e.effects.priceMult&&(t.priceMult*=e.effects.priceMult))}),this.startBuffEndTime>Date.now()&&(t.startBuffVal=1.25),t}checkAchievements(){Object.values(x).forEach(t=>{if(this.completedAchievements.includes(t.id))return;let i=!1;if(t.id==="a01"){const e=this.productInventory.kimchi_1;e&&(e.keep>0||e.sell>0)&&(i=!0)}t.id==="a02"&&this.cash>5e4&&(i=!0),i&&(this.completedAchievements.push(t.id),this.save(),window.dispatchEvent(new CustomEvent("achievement-unlocked",{detail:t})))})}hasAchievement(t){return this.completedAchievements.includes(t)}prestige(){this.am+=1,this.getAMBuffs(),this.cash=0,this.amUpgrades.includes("am_start_cash")&&(this.cash=1e6),this.enzyme=0,this.completedResearch=[],this.productInventory={},this.itemInventory={},this.amUpgrades.includes("am_start_buff")&&(this.startBuffEndTime=Date.now()+3e5),this.initNewGame(),alert("Prestige Successful! Earned 1 AM."),location.reload()}getEnterpriseValue(){return this.cash+this.getInventoryValue()+this.getAssetValue()}getInventoryValue(){return Object.entries(this.productInventory).reduce((t,[i,e])=>{var s;return t+(e.keep+e.sell)*(((s=b[i])==null?void 0:s.price)||0)},0)}getAssetValue(){return this.lines.length*1e5}}class C{constructor(t){var i,e;this.game=t,this.els={cash:document.getElementById("res-cash"),enzyme:document.getElementById("res-enzyme"),enzymeContainer:(i=document.getElementById("res-enzyme"))==null?void 0:i.parentElement,am:document.getElementById("res-am"),amContainer:(e=document.getElementById("res-am"))==null?void 0:e.parentElement,prodList:document.getElementById("prod-list"),logiList:document.getElementById("logi-list"),salesList:document.getElementById("sales-list"),researchList:document.getElementById("research-list"),statsList:document.getElementById("stats-list"),tabs:document.querySelectorAll(".tab-btn"),cols:document.querySelectorAll(".col")},this.setupTabs(),this.setupGlobalButtons(),this.setupAchievementListener(),this.displayCash=0}getImageUrl(t,i){var a,c,l,d,r,p;if(!i||!i.slots)return"src/assets/images/placeholder.png";let e=1,s=1,o="base";return t==="prod"?(e=((a=n[i.slots.equipment])==null?void 0:a.tier)||1,s=((c=n[i.slots.worker])==null?void 0:c.tier)||1,o="prod"):t==="logi"?(e=((l=n[i.slots.storage])==null?void 0:l.tier)||1,s=((d=n[i.slots.transporter])==null?void 0:d.tier)||1,o="logi"):t==="sales"&&(e=((r=n[i.slots.market])==null?void 0:r.tier)||1,s=((p=n[i.slots.salesOrg])==null?void 0:p.tier)||1,o="sales"),`src/assets/images/${o}/${o}_t${e}_t${s}.jpg`}init(){this.renderLines(),this.renderResearch(),this.renderStats(),this.update(),window.addEventListener("kimchi-saved",()=>this.showAutoSaveIndicator()),this.game.lines.length===1&&!this.game.completedAchievements.length&&this.game.lines[0].slots.worker===null&&(this.game.completedResearch.includes("unlock_kkakdugi")||this.showModal("START_GAME"))}setupTabs(){document.body.setAttribute("data-active-tab","prod"),this.els.tabs.forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.tab;this.els.tabs.forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.body.setAttribute("data-active-tab",i);const e={prod:"col-prod",logi:"col-logi",sales:"col-sales",research:"col-research",stats:"col-stats"};this.els.cols.forEach(s=>{s.classList.remove("active"),s.id===e[i]&&s.classList.add("active")})})})}setupGlobalButtons(){const t=document.getElementById("btn-add-line-global");t&&t.addEventListener("click",()=>{const l=this.game.getLineCost();confirm(`생산 라인을 추가하시겠습니까?
비용: ${l.toLocaleString()}원`)&&(this.game.buyLine()?(this.renderLines(),this.update()):alert("현금이 부족합니다."))});const i=document.getElementById("btn-settings");i&&i.addEventListener("click",()=>{this.showModal("SETTINGS")});const e=document.getElementById("btn-help");e&&e.addEventListener("click",()=>this.showModal("HELP"));const s=document.querySelector(".favorite-btn");s&&s.addEventListener("click",()=>alert("Ctrl+D를 눌러 즐겨찾기에 추가하세요!"));const o=document.querySelector(".share-btn");o&&o.addEventListener("click",async()=>{const l=location.href;try{if(navigator.share)await navigator.share({title:"Kimchi Invasion",text:"김치로 우주를 정복하라! Kimchi Invasion",url:l}),this.showToast("공유 창이 열렸습니다.");else throw new Error("No Share API")}catch{try{await navigator.clipboard.writeText(l),this.showToast("링크가 클립보드에 복사되었습니다!")}catch{prompt("URL을 복사하세요:",l)}}});const a=document.querySelector(".account-btn"),c=document.querySelector(".account-dropdown");a&&c&&(a.addEventListener("click",l=>{l.stopPropagation(),c.style.display=c.style.display==="block"?"none":"block"}),document.addEventListener("click",()=>c.style.display="none"),c.addEventListener("click",l=>l.stopPropagation()))}setupAchievementListener(){window.addEventListener("achievement-unlocked",t=>{const i=t.detail;this.showToast(`🏆 업적 달성: ${i.title}`),this.renderStats();const e=Object.values($).find(s=>s.condition(this.game)&&s.id===i.rewardLog);e&&(["l01","l10","l08"].includes(e.id)?this.showModal("LOGBOOK_ENTRY",e):this.showToast(`📖 로그북 기록됨: ${e.title}`),this.renderStats())})}renderLines(){try{this.els.prodList.innerHTML="",this.els.logiList.innerHTML="",this.els.salesList.innerHTML="",(this.game.lines||[]).forEach((e,s)=>{const o=this.renderProdCard(e,s);this.els.prodList.appendChild(o);const a=this.renderLogiCard(e,s);this.els.logiList.appendChild(a);const c=this.renderSalesCard(e,s);this.els.salesList.appendChild(c)});const i=this.createAddLineBtn();this.els.prodList.appendChild(i),this.update()}catch(t){console.error("RenderLines Error:",t),this.showToast("Render Error: "+t.message,"error")}}createAddLineBtn(){const t=document.createElement("button");t.className="btn btn-add-line-main",t.style.width="100%",t.style.marginTop="10px";const i=this.game.getLineCost();return t.innerHTML=`+ 새 라인 확보 (₩${i.toLocaleString()})`,t.onclick=()=>{this.game.buyLine()?(this.renderLines(),this.update()):this.showToast("자금이 부족합니다.","error")},t}renderCardShell({id:t,type:i,headTitle:e,headBadge:s,imageUrl:o,tierBadgeTR:a,tierBadgeBR:c,slotChipsHTML:l,ctaHTML:d,advancedHTML:r,footerHTML:p}){const h=document.createElement("div");h.className=`card-shell card--${i} animate-fade-in`,h.id=`card-${i}-${t}`,h.dataset.lineId=t;const u=a?`<div class="badge-tr">${a}</div>`:"",f=c?`<div class="badge-br">${c}</div>`:"";return h.innerHTML=`
            <div class="card-head">
                <div class="head-title">${e}</div>
                <div class="head-badge">${s}</div>
            </div>

            <div class="card-image">
                <img src="${o}" onerror="this.style.opacity='0.2'" alt="${e}">
                <div class="tier-badges">
                    ${u}
                    ${f}
                </div>
            </div>

            <div class="slot-chips">
                ${l}
            </div>

            <div class="cta-row">
                ${d}
            </div>

            <details class="advanced">
                <summary>ADVANCED OPTIONS ▼</summary>
                <div class="advanced-content">
                    ${r||""}
                </div>
            </details>
            
            <div class="card-footer">
                ${p||""}
            </div>
            
            <button class="btn-remove-line-top" style="top:4px; right:4px;">&times;</button>
        `,h.querySelector(".btn-remove-line-top").onclick=g=>{g.stopPropagation(),confirm("이 라인을 삭제하시겠습니까? (복구 불가)")&&(this.game.removeLine(t),this.update())},h}getTier(t,i){if(!t||!t.slots||!t.slots[i])return 1;const e=n[t.slots[i]];return e?e.tier:1}getMultiplier(t,i){let e=1;if(!t||!t.slots)return e;for(const[s,o]of Object.entries(t.slots))o&&n[o]&&n[o].effects&&(e+=n[o].effects[i]||0);return e}renderSlotHTML(t,i,e,s="Slot"){let o=`<span class="icon">➕</span> ${s}`,a='<span style="opacity:0.5;">Empty</span>',c="";if(e&&n[e]){const l=n[e];o=`<span class="icon">${this.getIconForType(i)}</span> ${l.name}`,a=`<span style="color:var(--accent-secondary);">T${l.tier}</span>`,c="active"}return`
            <div class="slot-item-wide btn-slot ${c}" data-line="${t}" data-type="${i}">
                <div class="slot-inner-left">${o}</div>
                <div class="slot-inner-right">${a}</div>
            </div>
        `}getIconForType(t){switch(t){case"equipment":return"🏭";case"worker":return"👷";case"storage":return"📦";case"transporter":return"🚚";case"market":return"🏪";case"salesOrg":return"🤝";default:return"🧩"}}renderProdCard(t){var p,h,u,f,g;const i=b[t.productId];if(!i){const v=document.createElement("div");return v.className="card card--prod card--empty",v.innerHTML=`
                <div class="card-empty-state">
                    <button class="btn-assign-product">생산 품목 선택</button>
                </div>
            `,v.querySelector(".btn-assign-product").onclick=y=>this.showProductPicker(y,t.id),v}this.game.lines.indexOf(t);const e=((p=n[t.slots.equipment])==null?void 0:p.tier)||1,s=((h=n[t.slots.worker])==null?void 0:h.tier)||1;let o=1;t.slots.equipment&&n[t.slots.equipment]&&(o+=n[t.slots.equipment].effects.batch||0);const a=this.game.getAMBuffs();let c=0;t.slots.worker&&n[t.slots.worker]&&(c=(n[t.slots.worker].effects.prodSpeed||0)*a.prodSpeedMult*a.startBuffVal);const l=Math.floor(((u=this.game.productInventory[t.productId])==null?void 0:u.keep)||0),d=document.createElement("div");d.className="card card--prod",d.dataset.lineId=t.id,d.innerHTML=`
            <div class="card-header">
                <span class="card-title">${i.name}</span>
                <span class="card-badge">T${Math.max(e,s)}</span>
            </div>
            
            <div class="card-image">
                <img src="${this.getImageUrl("prod",t)}" alt="${i.name}">
                <div class="badge-facility">T${e} 시설</div>
                <div class="badge-worker">W${s} 직원</div>
            </div>
            
            <div class="slot-row">
                <button class="slot-btn slot-facility" data-slot-type="equipment">
                    <span class="slot-icon">${this.getIconForType("equipment")}</span>
                    <span class="slot-name">${((f=n[t.slots.equipment])==null?void 0:f.name)||"없음"}</span>
                    <span class="slot-tier">T${e}</span>
                </button>
                <button class="slot-btn slot-worker" data-slot-type="worker">
                    <span class="slot-icon">${this.getIconForType("worker")}</span>
                    <span class="slot-name">${((g=n[t.slots.worker])==null?void 0:g.name)||"없음"}</span>
                    <span class="slot-tier">W${s}</span>
                </button>
            </div>
            
            <button class="cta-main cta--prod" data-btn-type="produce">
                ${i.emoji} 생산하기 +${o}
            </button>
            
            <div class="card-info">
                <div class="info-row">
                    <span>생산량: +${o} 클릭 / ${c.toFixed(1)}초당</span>
                </div>
                <div class="info-row">
                    <span>창고 재고: <strong>${l.toLocaleString()}</strong></span>
                </div>
            </div>
            
            <div class="card-toggle">
                <label class="toggle-label">
                    <input type="checkbox" class="toggle-auto">
                    <span class="toggle-text">🔁 토석 만상</span>
                </label>
            </div>
        `;const r=d.querySelector('[data-btn-type="produce"]');return r.onclick=()=>{this.game.produce(t.id),this.update()},this.bindSlotEvent(d,t.id,"equipment"),this.bindSlotEvent(d,t.id,"worker"),d}renderLogiCard(t,i){var u,f,g,v,y,k;if(!b[t.productId])return document.createElement("div");const s=((u=n[t.slots.storage])==null?void 0:u.tier)||1,o=((f=n[t.slots.transporter])==null?void 0:f.tier)||1;let a=1;t.slots.storage&&n[t.slots.storage]&&(a+=n[t.slots.storage].effects.moveBatch||0);const c=this.game.getAMBuffs();t.slots.transporter&&n[t.slots.transporter]&&(n[t.slots.transporter].effects.moveSpeed||0)*c.moveSpeedMult;const l=Math.floor(((g=this.game.productInventory[t.productId])==null?void 0:g.keep)||0),d=Math.floor(((v=this.game.productInventory[t.productId])==null?void 0:v.sell)||0),r=document.createElement("div");r.className="card card--logi",r.dataset.lineId=t.id,r.innerHTML=`
            <div class="card-header">
                <span class="card-title">물류 트레이션</span>
                <span class="card-badge">T${Math.max(s,o)}</span>
            </div>
            
            <div class="card-image">
                <img src="${this.getImageUrl("logi",t)}" alt="물류">
                <div class="badge-facility">T${s} 창고</div>
                <div class="badge-worker">W${o} 운송</div>
            </div>
            
            <div class="slot-row">
                <button class="slot-btn slot-facility" data-slot-type="storage">
                    <span class="slot-icon">${this.getIconForType("storage")}</span>
                    <span class="slot-name">${((y=n[t.slots.storage])==null?void 0:y.name)||"없음"}</span>
                    <span class="slot-tier">T${s}</span>
                </button>
                <button class="slot-btn slot-worker" data-slot-type="transporter">
                    <span class="slot-icon">${this.getIconForType("transporter")}</span>
                    <span class="slot-name">${((k=n[t.slots.transporter])==null?void 0:k.name)||"없음"}</span>
                    <span class="slot-tier">W${o}</span>
                </button>
            </div>
            
            <button class="cta-main cta--logi" data-btn-type="ship">
                🚚 출하하기 +${a}
            </button>
            
            <div class="card-info">
                <div class="info-row">
                    <span>창고 재고: <strong>${l.toLocaleString()}</strong></span>
                    <span>판매 재고: <strong>${d.toLocaleString()}</strong></span>
                </div>
            </div>
            
            <div class="card-toggle">
                <label class="toggle-label toggle-label--priority">
                    <button class="priority-btn ${t.logisticsDir==="keep"?"is-active":""}" data-mode="keep">🧭 창고 우선</button>
                    <button class="priority-btn ${t.logisticsDir!=="keep"?"is-active":""}" data-mode="sell">🧭 출하 우선</button>
                </label>
            </div>
        `;const p=r.querySelector('[data-btn-type="ship"]');return p.onclick=()=>{this.game.moveLogistics(t.id,"sell"),this.update()},r.querySelectorAll(".priority-btn").forEach(w=>{w.onclick=()=>{const L=w.dataset.mode;t.logisticsDir!==L&&(this.game.toggleLogisticsDir(t.id),this.renderLines())}}),this.bindSlotEvent(r,t.id,"storage"),this.bindSlotEvent(r,t.id,"transporter"),r}renderSalesCard(t,i){var u,f,g,v,y;if(!b[t.productId])return document.createElement("div");const s=this.game.getAMBuffs(),o=((u=n[t.slots.market])==null?void 0:u.tier)||1,a=((f=n[t.slots.salesOrg])==null?void 0:f.tier)||1;let c=1;t.slots.market&&n[t.slots.market]&&(c+=n[t.slots.market].effects.sellAmount||0);let l=0;t.slots.salesOrg&&n[t.slots.salesOrg]&&(l=(n[t.slots.salesOrg].effects.sellSpeed||0)*s.sellSpeedMult);const d=this.game.getProductPrice(t.productId),r=Math.floor(((g=this.game.productInventory[t.productId])==null?void 0:g.sell)||0),p=document.createElement("div");p.className="card card--sales",p.dataset.lineId=t.id,p.innerHTML=`
            <div class="card-header">
                <span class="card-title">판매</span>
                <span class="card-badge">T${Math.max(o,a)}</span>
            </div>
            
            <div class="card-image">
                <img src="${this.getImageUrl("sales",t)}" alt="판매">
                <div class="badge-facility">T${o} 마켓</div>
                <div class="badge-worker">W${a} 영업</div>
            </div>
            
            <div class="slot-row">
                <button class="slot-btn slot-facility" data-slot-type="market">
                    <span class="slot-icon">${this.getIconForType("market")}</span>
                    <span class="slot-name">${((v=n[t.slots.market])==null?void 0:v.name)||"없음"}</span>
                    <span class="slot-tier">T${o}</span>
                </button>
                <button class="slot-btn slot-worker" data-slot-type="salesOrg">
                    <span class="slot-icon">${this.getIconForType("salesOrg")}</span>
                    <span class="slot-name">${((y=n[t.slots.salesOrg])==null?void 0:y.name)||"없음"}</span>
                    <span class="slot-tier">W${a}</span>
                </button>
            </div>
            
            <button class="cta-main cta--sales" data-btn-type="sell">
                💰 판매하기 +${Math.floor(d*c).toLocaleString()}원
            </button>
            
            <div class="card-info">
                <div class="info-row">
                    <span>자동 판매: ${l.toFixed(1)}초당</span>
                    <span>단가: <strong>${Math.floor(d).toLocaleString()}원</strong></span>
                </div>
                <div class="info-row">
                    <span>판매 재고: <strong>${r.toLocaleString()}</strong></span>
                </div>
            </div>
            
            <div class="card-toggle">
                <label class="toggle-label">
                    <input type="checkbox" class="toggle-auto" checked disabled>
                    <span class="toggle-text">🔁 토석 만상</span>
                </label>
            </div>
        `;const h=p.querySelector('[data-btn-type="sell"]');return h.onclick=()=>{const k=this.game.sell(t.id);k>0?(this.createFloatingText(h.getBoundingClientRect().left+50,h.getBoundingClientRect().top,`+${Math.floor(k).toLocaleString()}원`,"cash"),this.update()):this.showToast("판매할 재고가 부족합니다.","error")},this.bindSlotEvent(p,t.id,"market"),this.bindSlotEvent(p,t.id,"salesOrg"),p}renderAchievements(){const t=document.getElementById("achievement-grid"),i=document.getElementById("achievement-detail");t&&Object.values(x).forEach(e=>{const s=this.game.completedAchievements.includes(e.id),o=document.createElement("div");o.className=`ach-icon ${s?"unlocked":"locked"}`,o.textContent=s?"🏆":"🔒",o.style.width="30px",o.style.height="30px",o.style.display="flex",o.style.alignItems="center",o.style.justifyContent="center",o.style.background=s?"var(--accent)":"#333",o.style.color=s?"#000":"#555",o.style.borderRadius="4px",o.style.cursor="pointer",o.addEventListener("mouseenter",()=>{i.innerHTML=`<span style="color:#fff">${e.title}</span><br>${e.desc}`}),o.addEventListener("mouseleave",()=>{i.innerHTML=""}),t.appendChild(o)})}renderLogbook(){const t=document.getElementById("logbook-list");t&&(t.innerHTML="",Object.values($).forEach(i=>{const e=i.condition(this.game),s=document.createElement("div");s.className="log-item animate-fade-in",s.style.borderLeftColor=e?"var(--accent)":"#333",s.style.opacity=e?"1":"0.5",s.style.cursor=e?"pointer":"default",e?s.innerHTML=`
                    <div class="log-title" style="color:var(--accent)">[해금] ${i.title}</div>
                    <div class="log-content">${i.content}</div>
                `:(s.classList.add("locked"),s.innerHTML=`
                    <div class="log-title" style="color:#555">🔒 잠김: ${i.title}</div>
                `),t.appendChild(s)}))}renderAMUpgrades(){const t=document.getElementById("am-upgrade-list");t&&(t.innerHTML="",Object.values(I).forEach(i=>{const e=this.game.amUpgrades.includes(i.id),s=document.createElement("div");s.className=`card res-card am-upg-card ${e?"completed":""}`,s.style.minHeight="auto",s.style.marginBottom="8px",s.style.borderColor=e?"var(--accent)":"var(--card-border)",s.innerHTML=`
                <div class="card-title" style="color:var(--accent); font-size:14px;">${i.name}</div>
                <div class="card-desc" style="font-size:11px;">${i.desc}</div>
                <div class="card-footer" style="margin-top:8px;">
                    <span class="res-cost" style="font-size:12px;">${e?"획득 완료":"⚛️ "+i.cost}</span>
                    ${e?"":`<button class="btn btn-xs btn-buy-am" data-id="${i.id}">획득</button>`}
                </div>
            `,e||s.querySelector(".btn-buy-am").addEventListener("click",()=>{this.game.buyAMUpgrade(i.id)?(this.renderAMUpgrades(),this.update()):alert("외계 물질(AM)이 부족합니다.")}),t.appendChild(s)}))}renderFlash(t){t.classList.add("flash"),setTimeout(()=>t.classList.remove("flash"),150)}createFloatingText(t,i,e,s="#fff"){const o=document.createElement("div");o.textContent=e,o.className="floating-text",["cash","item","err"].includes(s)?o.classList.add(s):o.style.color=s,o.style.left=t+"px",o.style.top=i+"px",document.body.appendChild(o),requestAnimationFrame(()=>{o.style.transform="translateY(-50px)",o.style.opacity="0",o.style.transition="all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"}),setTimeout(()=>o.remove(),800)}showToast(t,i="info"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container",document.body.appendChild(e));const s=document.createElement("div");s.className="toast",s.dataset.type=i;let o="ℹ️";i==="success"&&(o="✅"),i==="error"&&(o="⚠️"),s.innerHTML=`<span style="font-size:16px;">${o}</span> <span>${t}</span>`,e.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(-20px)",setTimeout(()=>s.remove(),300)},3e3)}showModal(t,i){const e=document.createElement("div");e.className="modal-overlay animate-fade-in",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100vh",e.style.background="rgba(0,0,0,0.9)",e.style.zIndex="10000",e.style.display="flex",e.style.alignItems="center",e.style.justifyContent="center";let s="";t==="START_GAME"?s=`
                <div class="modal-content" style="max-width:300px; text-align:center;">
                    <h2 style="color:var(--accent); margin-bottom:15px;">SEOUL 2033:<br>Kimchi Invasion</h2>
                    <p style="font-size:14px; line-height:1.6; color:#ccc; margin-bottom:20px;">
                        "엄마, 냉장고에 김치가 너무 많아..."<br><br>
                        서울의 생존은 늘 하나였습니다.<br>
                        남기는 게 아니라, 쌓는 것.<br>
                        이제 당신의 김치 제국이 시작됩니다.
                    </p>
                    <button class="btn btn-action" id="modal-close">판매 시작</button>
                </div>
             `:t==="LOGBOOK_ENTRY"?s=`
                <div class="modal-content" style="max-width:400px; text-align:left; border: 1px solid var(--accent); padding:20px; background:#111;">
                    <h3 style="color:var(--accent); font-size:16px; margin-bottom:10px;">${i.title}</h3>
                    <p style="font-size:14px; line-height:1.6; color:#ddd; white-space:pre-wrap;">${i.content}</p>
                    <div style="text-align:right; margin-top:20px;">
                        <button class="btn btn-sm" id="modal-close">확인</button>
                    </div>
                </div>
             `:t==="HELP"?s=`
                <div class="modal-content" style="max-width:500px; text-align:left; max-height:80vh; overflow-y:auto;">
                    <h2 style="color:var(--accent); border-bottom:1px solid #333; padding-bottom:10px;">게임 가이드</h2>
                    <div style="font-size:14px; line-height:1.6; color:#ddd; margin-top:10px;">
                        <p style="margin-bottom:10px;"><strong>1. 생산 (Production)</strong><br>
                        김치를 생산합니다. '장비'와 '작업자'를 업그레이드하여 속도와 배치 크기를 늘리세요.</p>
                        
                        <p style="margin-bottom:10px;"><strong>2. 물류 (Logistics)</strong><br>
                        생산된 김치는 일단 '보관'됩니다. 물류 카드의 밸브를 <span style="color:#f59e0b">📤 출하</span>로 돌려야 판매 단계로 넘어갑니다.<br>
                        <em>팁: 물류 효율이 낮으면 생산이 멈춥니다!</em></p>
                        
                        <p style="margin-bottom:10px;"><strong>3. 판매 (Sales)</strong><br>
                        출하된 김치를 시장에 팝니다. '마케팅'과 '영업조직'이 판매 속도를 결정합니다.</p>
                        
                        <p style="margin-bottom:10px;"><strong>4. 연구 & AM</strong><br>
                        '효소'를 모아 연구를 진행하고, 재설정(Prestige)을 통해 '외계 물질(AM)'을 획득하여 영구적인 강함을 얻으세요.</p>
                    </div>
                    <div style="text-align:right; margin-top:20px;">
                        <button class="btn btn-action" id="modal-close">닫기</button>
                    </div>
                </div>
             `:t==="SETTINGS"&&(s=`
                <div class="modal-content" style="max-width:320px; text-align:center;">
                    <h3 style="color:var(--text-main); font-size:18px; margin-bottom:20px; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">SETTINGS</h3>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button class="btn" id="btn-save-manual" style="width:100%; padding:12px;">💾 게임 저장 (Save)</button>
                        <!-- <button class="btn" id="btn-lang" style="width:100%; padding:12px;">🌐 Language: KO</button> -->
                        <div style="border-top:1px solid var(--glass-border); margin:10px 0;"></div>
                        <button class="btn" id="btn-hard-reset" style="width:100%; padding:12px; border-color:var(--accent); color:var(--accent);">⚠️ 데이터 초기화 (Hard Reset)</button>
                    </div>

                    <div style="margin-top:20px;">
                        <button class="btn btn-sm" id="modal-close">닫기</button>
                    </div>
                    
                    <div style="margin-top:20px; font-size:10px; color:var(--text-muted);">
                        Kimchi Invasion v0.68<br>
                        Powered by ClickSurvivor Universe
                    </div>
                </div>
             `),e.innerHTML=s,document.body.appendChild(e),t==="SETTINGS"&&(e.querySelector("#btn-save-manual").addEventListener("click",()=>{this.game.save(),this.showToast("✅ 게임이 저장되었습니다.")}),e.querySelector("#btn-hard-reset").addEventListener("click",()=>{confirm(`정말로 모든 데이터를 삭제하고 초기화하시겠습니까?
이 작업은 되돌릴 수 없습니다.`)&&confirm("진짜로 삭제합니까? 클라우드 저장이 없다면 복구가 불가능합니다.")&&(this.game.isResetting=!0,localStorage.removeItem("kimchi_invasion_save_v1"),localStorage.clear(),window.location.reload())})),e.querySelector("#modal-close").addEventListener("click",()=>{e.remove()})}update(){const t=this.game.cash-this.displayCash;if(Math.abs(t)<1?this.displayCash=this.game.cash:this.displayCash+=t*.15,this.els.cash.textContent=Math.floor(this.displayCash).toLocaleString()+"원",t>.1?this.els.cash.classList.add("gaining"):this.els.cash.classList.remove("gaining"),this.els.enzymeContainer&&(this.game.completedResearch.includes("fermentation_lab")||this.game.enzyme>0)?(this.els.enzymeContainer.style.display="flex",this.els.enzyme&&(this.els.enzyme.textContent=Math.floor(this.game.enzyme).toLocaleString())):this.els.enzymeContainer&&(this.els.enzymeContainer.style.display="none"),this.els.amContainer&&(this.game.am>0||this.game.amUpgrades.length>0)){this.els.amContainer.style.display="flex",this.els.am&&(this.els.am.textContent=Math.floor(this.game.am).toLocaleString());const s=document.getElementById("am-upgrades-container");s&&(s.style.display="block")}else this.els.amContainer&&(this.els.amContainer.style.display="none");this.els.nextLineCost&&(this.els.nextLineCost.textContent=`(비용: ${this.game.getLineCost().toLocaleString()}원)`);const i=document.getElementById("stat-ev");i&&(i.textContent=Math.floor(this.game.getEnterpriseValue()).toLocaleString()+"원",document.getElementById("stat-cash-val").textContent=Math.floor(this.game.cash).toLocaleString()+"원",document.getElementById("stat-inv-val").textContent=Math.floor(this.game.getInventoryValue()).toLocaleString()+"원",document.getElementById("stat-asset-val").textContent=Math.floor(this.game.getAssetValue()).toLocaleString()+"원");const e=Date.now();(!this.lastLogUpdate||e-this.lastLogUpdate>5e3)&&(this.renderLogbook(),this.lastLogUpdate=e),this.game.lines.forEach(s=>{if(!s.productId)return;const o=this.game.productInventory[s.productId],a=document.getElementById(`prog-fill-prod-${s.id}`);a&&s.prodAccumulator!==void 0&&(a.style.width=Math.min(s.prodAccumulator*100,100)+"%");const c=document.getElementById(`prog-fill-sell-${s.id}`);if(c&&s.sellAccumulator!==void 0&&(c.style.width=Math.min(s.sellAccumulator*100,100)+"%"),o){const l=o.keep||0,d=o.sell||0,r=o.cap||100,p=document.getElementById(`val-keep-status-${s.id}`),h=document.getElementById(`val-sell-logi-status-${s.id}`),u=document.getElementById(`val-sell-status-${s.id}`);p&&(p.textContent=Math.floor(l).toLocaleString()),h&&(h.textContent=Math.floor(d).toLocaleString()),u&&(u.textContent=Math.floor(d).toLocaleString());const f=document.getElementById(`val-keep-${s.id}`),g=document.getElementById(`val-sell-${s.id}`),v=document.getElementById(`val-sell-logi-${s.id}`);f&&(f.textContent=Math.floor(l).toLocaleString()),g&&(g.textContent=Math.floor(d).toLocaleString()),v&&(v.textContent=Math.floor(d).toLocaleString());const y=document.getElementById(`fill-keep-${s.id}`),k=document.getElementById(`fill-sell-${s.id}`),w=document.getElementById(`fill-sell-logi-${s.id}`);y&&(y.style.height=Math.min(l/r*100,100)+"%"),k&&(k.style.height=Math.min(d/r*100,100)+"%"),w&&(w.style.height=Math.min(d/r*100,100)+"%");const L=document.getElementById(`btn-ship-${s.id}`),S=document.getElementById(`btn-sell-${s.id}`);if(L&&(l>0?L.classList.add("cta-glow"):L.classList.remove("cta-glow")),S&&(d>0?S.classList.add("cta-glow"):S.classList.remove("cta-glow")),l+d>=r){const _=document.getElementById(`card-prod-${s.id}`);_&&!_.classList.contains("status-halted")&&_.classList.add("status-halted")}else{const _=document.getElementById(`card-prod-${s.id}`);_&&_.classList.remove("status-halted")}}})}renderSlotHTML(t,i,e){if(e&&n[e]){const s=n[e];return`<button class="btn btn-slot equipped ${`tier-${s.tier||1}`}" data-line="${t}" data-type="${i}">${s.name}</button>`}else return`<button class="btn btn-slot empty" data-line="${t}" data-type="${i}">✚</button>`}bindSlotEvent(t,i,e){t.querySelectorAll(".btn-slot").forEach(o=>{o.dataset.line==i&&o.dataset.type===e&&(o.onclick=a=>{a.stopPropagation(),this.showPopover(a,i,e)})})}showPopover(t,i,e){this.hidePopover();const s=document.createElement("div");s.className="popover animate-fade-in",s.id="active-popover";const a=this.game.lines.find(r=>r.id===i).slots[e];let c=`<div class="popover-title">${e} 아이템 관리 <button id="close-pop" style="float:right; background:none; border:none; color:#fff;">&times;</button></div>`;Object.values(n).filter(r=>r.type===e).forEach(r=>{const p=(this.game.itemInventory[r.id]||0)>0,h=a===r.id,u=this.game.cash>=r.cost,f=this.getEffectString(r);c+=`
                <div class="item-row ${h?"active":""}">
                    <div class="item-info">
                        <strong>${r.name}</strong> 
                        <span>Tier ${r.tier} - ${r.desc}</span>
                        <div style="font-size:11px; color:#10b981;">[효과] ${f}</div>
                        <div style="font-size:10px; color:#aaa; margin-top:2px;">
                            ${r.cost>0?r.cost.toLocaleString()+"원":"무료"} 
                            ${!p&&!u?"(자금 부족)":""}
                        </div>
                    </div>
                    <div class="item-actions">
                        ${h?`<button class="btn btn-xs btn-unequip" data-id="${r.id}" disabled>장착중</button>`:p?`<button class="btn btn-xs btn-equip" data-id="${r.id}">장착</button>`:`<button class="btn btn-xs btn-buy" data-id="${r.id}" ${u?"":"disabled"}>구매</button>`}
                    </div>
                </div>
            `}),s.innerHTML=c,document.body.appendChild(s);let l=t.clientX+10,d=t.clientY+10;l+300>window.innerWidth&&(l=window.innerWidth-300),d+400>window.innerHeight&&(d=window.innerHeight-400),s.style.left=l+"px",s.style.top=d+"px",s.querySelectorAll(".btn-buy").forEach(r=>r.addEventListener("click",p=>{p.stopPropagation();const h=r.dataset.id;this.game.buyItem(h)&&(this.showPopover(t,i,e),this.update())})),s.querySelectorAll(".btn-equip").forEach(r=>r.addEventListener("click",()=>{this.game.equipItem(i,e,r.dataset.id),this.hidePopover(),this.renderLines(),this.update()})),s.querySelector("#close-pop").addEventListener("click",()=>this.hidePopover()),setTimeout(()=>{const r=p=>{s.contains(p.target)||(this.hidePopover(),window.removeEventListener("click",r))};window.addEventListener("click",r)},100)}showProductPicker(t,i){this.hidePopover();const e=document.createElement("div");e.className="popover animate-fade-in",e.id="active-popover";let s='<div class="popover-title">생산 품목 선택</div>';Object.values(b).forEach(o=>{s+=`
                <div class="item-row">
                    <div class="item-info">
                        <strong>${o.name}</strong>
                        <span>${o.desc}</span>
                    </div>
                    <button class="btn btn-xs btn-buy" data-id="${o.id}">할당</button>
                </div>
            `}),s+='<button class="btn btn-sm btn-close-pop">닫기</button>',e.innerHTML=s,document.body.appendChild(e),e.style.left=Math.min(t.clientX,window.innerWidth-320)+"px",e.style.top=Math.min(t.clientY,window.innerHeight-350)+"px",e.querySelectorAll(".btn-buy").forEach(o=>o.addEventListener("click",()=>{this.game.assignProduct(i,o.dataset.id),this.hidePopover(),this.renderLines(),this.update()})),e.querySelector(".btn-close-pop").addEventListener("click",()=>this.hidePopover())}hidePopover(){const t=document.getElementById("active-popover");t&&t.remove()}showAutoSaveIndicator(){this.els.autoSave||(this.els.autoSave=document.createElement("div"),this.els.autoSave.id="auto-save-indicator",document.body.appendChild(this.els.autoSave)),this.els.autoSave.classList.add("saving"),setTimeout(()=>this.els.autoSave.classList.remove("saving"),1e3)}renderResearch(){const t=this.els.researchList;if(!t)return;t.innerHTML="",Object.values(M).forEach(s=>{const o=this.game.completedResearch.includes(s.id);if(!(!s.prereq||this.game.completedResearch.includes(s.prereq))&&!o)return;const c=document.createElement("div");c.className=`card res-card ${o?"completed":""}`;let l="";o||(s.cost&&(l+=`₩${s.cost.toLocaleString()} `),s.costItems&&(l+=Object.entries(s.costItems).map(([d,r])=>`${b[d].emoji}${r}`).join(", ")),s.costEnzyme&&(l+=`🧪${s.costEnzyme}`)),c.innerHTML=`
                <div class="card-comp-header">
                    <span class="card-comp-title">${s.name}</span>
                    <span class="card-comp-badge">${o?"COMPLETED":"RESEARCH"}</span>
                </div>
                <div class="card-body">
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">${s.desc}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:11px; color:var(--accent-primary);">${o?"기술 확보 완료":l}</span>
                        ${o?"":`<button class="btn btn-sm btn-research-buy" data-id="${s.id}">연구개시</button>`}
                    </div>
                </div>
            `,o||(c.querySelector(".btn-research-buy").onclick=()=>{this.game.buyResearch(s.id)?(this.renderResearch(),this.renderLines(),this.update()):this.showToast("자원이나 선행 연구가 부족합니다.","error")}),t.appendChild(c)});const i=document.createElement("h3");i.className="section-title",i.textContent="Extra-Terrestrial Lab",i.id="am-upgrades-container",i.style.display=this.game.am>0||this.game.amUpgrades.length>0?"block":"none",t.appendChild(i);const e=document.createElement("div");e.id="am-upgrade-list",t.appendChild(e),this.renderAMUpgrades()}renderStats(){const t=this.els.statsList;t&&(t.innerHTML=`
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-label">기업가치</span>
                    <span class="stat-val" id="stat-ev">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">보유현금</span>
                    <span class="stat-val" id="stat-cash-val">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">재고가치</span>
                    <span class="stat-val" id="stat-inv-val">0원</span>
                </div>
                <div class="stat-card">
                    <span class="stat-label">설비자산</span>
                    <span class="stat-val" id="stat-asset-val">0원</span>
                </div>
            </div>
            
            <h3 class="section-title">Achievements</h3>
            <div class="achievement-grid" id="achievement-grid" style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;"></div>
            <div id="achievement-detail" style="font-size:11px; color:var(--text-muted); margin-bottom:20px; min-height:30px;"></div>
            
            <h3 class="section-title">Logbook</h3>
            <div id="logbook-list" class="logbook-list"></div>
        `,this.renderAchievements(),this.renderLogbook())}getEffectString(t){if(!t||!t.effects)return"No Effect";const i=[];return t.effects.prodSpeed&&i.push(`생산속도 +${t.effects.prodSpeed}`),t.effects.batch&&i.push(`배치량 +${t.effects.batch}`),t.effects.moveSpeed&&i.push(`물류속도 +${t.effects.moveSpeed}`),t.effects.moveBatch&&i.push(`이송량 +${t.effects.moveBatch}`),t.effects.sellSpeed&&i.push(`판매속도 +${t.effects.sellSpeed}`),t.effects.sellAmount&&i.push(`판매량 +${t.effects.sellAmount}`),i.length>0?i.join(", "):"특수 효과"}spawnParticles(t,i,e){for(let s=0;s<8;s++){const o=document.createElement("div");o.className="particle",o.style.backgroundColor=e,o.style.left=t+"px",o.style.top=i+"px";const a=(Math.random()-.5)*100,c=(Math.random()-.5)*100;o.style.setProperty("--tx",`${a}px`),o.style.setProperty("--ty",`${c}px`),document.body.appendChild(o),setTimeout(()=>o.remove(),800)}}animateConveyor(t,i,e){const s=document.getElementById(`conveyor-${e}-${t}`);if(!s)return;const o=s.querySelector(".conveyor-track");if(!o)return;const a=document.createElement("div");a.className="conveyor-item",a.textContent=i,o.appendChild(a),setTimeout(()=>a.remove(),2e3)}}window.addEventListener("DOMContentLoaded",()=>{const m=new A,t=new C(m);window.game=m,window.ui=t,m.init(),t.init();let i=performance.now();function e(s){const o=(s-i)/1e3;if(i=s,m.tick(o),t.update(),m.hasAutomatedChanges){const a=Date.now();(!m.lastSaveTime||a-m.lastSaveTime>1e3)&&(m.save(),m.lastSaveTime=a,m.hasAutomatedChanges=!1)}requestAnimationFrame(e)}requestAnimationFrame(e)});
