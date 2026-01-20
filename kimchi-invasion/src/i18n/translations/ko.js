/**
 * KIMCHI INVASION - Korean Translations
 */

export default {
  // Game Title
  title: 'KIMCHI INVASION',
  subtitle: 'The Red Planet Protocol',

  // Loading Screen
  loading: {
    state: '게임 상태 초기화 중...',
    save: '저장된 게임 불러오는 중...',
    renderer: '렌더러 초기화 중...',
    systems: '게임 시스템 로딩 중...',
    ui: '인터페이스 설정 중...',
    input: '컨트롤 구성 중...',
    complete: '준비 완료!',
  },

  // Common UI
  ui: {
    buttons: {
      start: '시작',
      continue: '계속하기',
      newGame: '새 게임',
      settings: '설정',
      save: '저장',
      load: '불러오기',
      close: '닫기',
      confirm: '확인',
      cancel: '취소',
      back: '뒤로',
      build: '건설',
      research: '연구',
      export: '수출',
    },
    tabs: {
      production: '생산',
      logistics: '물류',
      research: '연구',
      export: '수출',
      stats: '통계',
    },
  },

  // Resources
  resources: {
    categories: {
      utility: '유틸리티',
      raw: '원자재',
      crop: '농작물',
      processed: '가공품',
      research: '연구 자원',
    },

    // Utility
    dollars: {
      name: '달러',
      desc: '화성 경제의 기본 화폐. 지구 수출로 획득합니다.',
    },
    energy: {
      name: '에너지',
      desc: '전력. 대부분의 건물 가동에 필요합니다.',
    },
    oxygen: {
      name: '산소',
      desc: '생명 유지 장치. 자동 보충됩니다.',
    },

    // Raw Materials
    iron: {
      name: '철광석',
      desc: '화성의 기본 광물. 건설과 제작에 필수적입니다.',
    },
    water: {
      name: '물',
      desc: '생명의 근원. 농업과 가공에 필수입니다.',
    },
    salt: {
      name: '소금',
      desc: '김치 절임의 핵심 재료. 물에서 추출합니다.',
    },
    ice: {
      name: '얼음',
      desc: '화성 극지의 얼음. 녹이면 물이 됩니다.',
    },
    regolith: {
      name: '풍화토',
      desc: '화성 표면의 흙. 농업에 활용됩니다.',
    },
    sand: {
      name: '모래',
      desc: '유리 제작과 건설에 사용됩니다.',
    },

    // Crops
    cabbage: {
      name: '배추',
      desc: '김치의 주재료. 온실에서 재배합니다.',
    },
    radish: {
      name: '무',
      desc: '깍두기의 주재료. 빠르게 자랍니다.',
    },
    garlic: {
      name: '마늘',
      desc: '김치 양념의 필수 재료입니다.',
    },
    ginger: {
      name: '생강',
      desc: '김치 양념. 독특한 향을 더합니다.',
    },
    scallion: {
      name: '파',
      desc: '파김치의 주재료. 빠른 생산이 가능합니다.',
    },
    cucumber: {
      name: '오이',
      desc: '오이소박이의 주재료. 프리미엄 김치용입니다.',
    },
    chilliPowder: {
      name: '고춧가루',
      desc: '김치의 매운맛과 붉은색을 만듭니다.',
    },

    // Processed (Kimchi)
    kimchi: {
      name: '배추김치',
      desc: '기본 김치. 대량 생산에 최적화되어 있습니다.',
    },
    kkakdugi: {
      name: '깍두기',
      desc: '무로 만든 김치. 빠른 생산이 가능합니다.',
    },
    paKimchi: {
      name: '파김치',
      desc: '파로 만든 김치. 초고속 생산이 특징입니다.',
    },
    oiSobagi: {
      name: '오이소박이',
      desc: '프리미엄 김치. 최고 가격으로 수출됩니다.',
    },
    premiumKimchi: {
      name: '묵은지',
      desc: '장기 숙성 김치. 높은 가치를 지닙니다.',
    },
    omegaKimchi: {
      name: '오메가 김치',
      desc: '오메가 종균으로 발효한 최고급 김치. 엔드게임 콘텐츠입니다.',
    },

    // Research Resources
    lactobacillusData: {
      name: '유산균 데이터',
      desc: 'Tier 1-2 기술 연구에 필요합니다. 김치 분석으로 획득합니다.',
    },
    fermentCulture: {
      name: '발효 배양액',
      desc: 'Tier 3-4 기술 연구에 필요합니다. 묵은지에서 추출합니다.',
    },
    omegaStarter: {
      name: '오메가 종균',
      desc: 'Tier 5 기술 연구에 필요합니다. 희귀 자원이 필요합니다.',
    },
  },

  // Buildings
  buildings: {
    categories: {
      mining: '채굴',
      agriculture: '농업',
      processing: '가공',
      storage: '저장',
      power: '발전',
      logistics: '물류',
    },
    names: {
      miner: '채굴기',
      iceExtractor: '얼음 추출기',
      greenhouse: '온실',
      fermentationTank: '발효 탱크',
      warehouse: '창고',
      solarPanel: '태양광 패널',
      conveyor: '컨베이어',
    },
  },

  // Research
  research: {
    title: '연구',
    tier: 'Tier {tier}',
    status: {
      locked: '잠김',
      available: '연구 가능',
      researching: '연구 중',
      completed: '완료',
    },
    actions: {
      start: '연구 시작',
      cancel: '취소',
    },
    cost: '비용',
    time: '연구 시간',
    effects: '효과',
    prerequisites: '선행 기술',
    progress: '진행률',
    remaining: '남은 시간',
    categories: {
      production: '생산 기술',
      efficiency: '효율성',
      automation: '자동화',
      quality: '품질',
    },
  },

  // Technologies
  technologies: {
    efficientDrills: {
      name: '효율적 채굴',
      desc: '채굴 장비 최적화로 채굴 속도가 20% 증가합니다.',
    },
    improvedFarming: {
      name: '개선된 농법',
      desc: '농업 기술 향상으로 작물 성장 속도가 20% 증가합니다.',
    },
    advancedFermentation: {
      name: '고급 발효 기술',
      desc: '발효 공정 최적화로 발효 속도가 30% 증가합니다.',
    },
    solarPanels: {
      name: '태양광 패널',
      desc: '태양광 패널 건설이 가능해집니다.',
    },
    waterRecycling: {
      name: '물 재활용',
      desc: '물 소비량이 25% 감소합니다.',
    },
    conveyorSpeed: {
      name: '컨베이어 속도 향상',
      desc: '컨베이어 속도가 50% 증가합니다.',
    },
    automatedHarvest: {
      name: '자동 수확',
      desc: '자동 수확이 가능해지고 농업 효율이 30% 증가합니다.',
    },
    batteryStorage: {
      name: '배터리 저장',
      desc: '에너지 저장 용량이 2배 증가합니다.',
    },
    premiumFermentation: {
      name: '프리미엄 발효',
      desc: '묵은지(프리미엄 김치) 생산이 가능해집니다.',
    },
    quantumStorage: {
      name: '양자 저장',
      desc: '저장 용량이 3배 증가합니다.',
    },
    efficientPower: {
      name: '효율적 전력',
      desc: '전력 소비량이 40% 감소합니다.',
    },
    omegaKimchi: {
      name: '오메가 김치',
      desc: '오메가 김치 생산이 가능해집니다.',
    },
    massProduction: {
      name: '대량 생산',
      desc: '모든 생산량이 100% 증가합니다.',
    },
    spaceLogistics: {
      name: '우주 물류',
      desc: '수출 효율이 200% 증가합니다.',
    },
    basicAutomation: {
      name: '기본 자동화',
      desc: '가공 속도가 25% 증가합니다.',
    },
  },

  // Prestige
  prestige: {
    title: '성간 이주',
    subtitle: '새로운 행성으로 떠나세요',
    loadout: 'Loadout 선택',
    slots: '{count}개 슬롯',
    planet: {
      preview: '행성 미리보기',
      regenerate: '다시 생성',
      depart: '출발!',
    },
    stats: {
      iron: '철광석',
      ice: '얼음',
      fertility: '비옥도',
      rare: '희귀 자원',
      terrain: '지형',
    },
    levels: {
      scarce: '희소',
      low: '낮음',
      normal: '보통',
      abundant: '풍부',
      rich: '매우 풍부',
    },
  },

  // Achievements
  achievements: {
    title: '업적',
    unlocked: '해금됨!',
  },

  // Settings
  settings: {
    title: '설정',
    language: '언어',
    sound: '효과음',
    music: '배경음악',
    notifications: '알림',
    autoSave: '자동 저장',
    reset: '게임 초기화',
    resetConfirm: '정말로 모든 진행 상황을 삭제하시겠습니까?',
    graphics: '그래픽',
    pixelEffect: '픽셀화 효과',
    particles: '파티클',
    volume: '볼륨',
    master: '마스터',
    sfx: '효과음',
    bgm: '배경음',
    tutorialReplay: '튜토리얼 다시 보기',
  },

  // Tutorial/Tips
  tutorial: {
    skip: '건너뛰기',
    skip_confirm: '정말 튜토리얼을 건너뛰시겠습니까?',
    continue: '계속',
    start_game: '게임 시작',
    rewards: '보상',

    // Prologue
    prologue: {
      title: 'KIMCHI INVASION',
      text1: '2087년, 인류의 화성 정착 2년차.',
      text2: '당신은 한국생명공학연구원 소속 바이오 엔지니어.',
      text3:
        '대원들의 면역력 저하 문제를 해결하기 위해 화성 최초의 김치 생산 시설을 건설해야 합니다.',
      text4:
        '화성의 혹독한 환경에서 살아남고, 언젠가는 지구에 김치를 역수출하는 것이 당신의 미션입니다.',
    },

    // Epilogue
    epilogue: {
      title: '튜토리얼 완료!',
      text1: '축하합니다! 화성에서 첫 김치 생산에 성공했습니다.',
      text2: '이제 자유롭게 생산 라인을 확장하고 화성 김치 제국을 건설하세요!',
    },

    // Step 1: 수동 자원 수집
    step1: {
      title: '수동 자원 수집',
      desc: '화면을 클릭하여 얼음 5개, 레골리스 5개를 수집하세요.',
    },

    // Step 2: 첫 건물 배치
    step2: {
      title: '첫 건물 배치',
      desc: '채굴기와 해동기를 각각 1개씩 배치하세요.',
    },

    // Step 3: 첫 작물 재배
    step3: {
      title: '첫 작물 재배',
      desc: '온실을 배치하고 배추 5개를 재배하세요.',
    },

    // Step 4: 물류 시스템
    step4: {
      title: '물류 시스템',
      desc: '컨베이어 벨트로 건물을 연결하세요.',
    },

    // Step 5: 첫 김치 생산
    step5: {
      title: '첫 김치 생산!',
      desc: '배추 → 절임소 → 발효탱크를 연결하여 김치를 생산하세요.',
    },

    // Legacy tips
    welcome: '화성에 오신 것을 환영합니다, 엔지니어님!',
    firstMiner: '채굴기를 설치하여 철광석을 수집하세요.',
    firstGreenhouse: '온실을 건설하여 배추를 재배하세요.',
    firstKimchi: '첫 번째 김치를 생산했습니다!',
    firstExport: '지구로 첫 수출을 시작하세요.',
  },

  // Errors
  errors: {
    saveFailed: '저장에 실패했습니다.',
    loadFailed: '불러오기에 실패했습니다.',
    unsupportedBrowser: '이 게임은 최신 브라우저에서 플레이해주세요.',
    notEnoughResources: '자원이 부족합니다.',
    cannotBuildHere: '여기에 건설할 수 없습니다.',
  },

  // Notifications
  notifications: {
    saved: '게임이 저장되었습니다.',
    achieved: '업적 달성: {name}',
    levelUp: '레벨 업!',
  },
}
