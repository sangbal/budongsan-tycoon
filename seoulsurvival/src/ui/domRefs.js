/**
 * domRefs.js
 * DOM 요소 캐싱 모듈
 *
 * 모든 DOM 요소 참조를 한 곳에서 관리하여:
 * - 중복 getElementById 호출 방지
 * - DOM 요소 접근 일관성 보장
 * - 코드 줄수 감소 (main.js에서 90줄 제거)
 */

let _cachedRefs = null

/**
 * DOM 요소 참조 가져오기 (캐싱)
 * @returns {Object} DOM 요소 참조 객체
 */
export function getDomRefs() {
  if (_cachedRefs) return _cachedRefs

  _cachedRefs = {
    // ======= 상단 패널 =======
    elCash: document.getElementById('cash'),
    elFinancial: document.getElementById('financial'),
    elProperties: document.getElementById('properties'),
    elRps: document.getElementById('rps'),

    // ======= 노동 =======
    elWork: document.getElementById('workBtn'),
    elWorkArea: document.querySelector('.work'), // 노동 배경 영역
    elAutoWorkIndicator: document.getElementById('autoWorkIndicator'),
    elLog: document.getElementById('log'),
    elShareBtn: document.getElementById('shareBtn'),
    elFavoriteBtn: document.getElementById('favoriteBtn'), // 즐겨찾기 / 홈 화면 안내 버튼

    // ======= 노동/커리어 표시 =======
    elClickIncomeButton: document.getElementById('clickIncomeButton'),
    elClickIncomeLabel: document.getElementById('clickIncomeLabel'),
    elClickMultiplier: document.getElementById('clickMultiplier'),
    elRentMultiplier: document.getElementById('rentMultiplier'),

    // ======= 금융상품 =======
    // 예금
    elDepositCount: document.getElementById('depositCount'),
    elIncomePerDeposit: document.getElementById('incomePerDeposit'),
    elBuyDeposit: document.getElementById('buyDeposit'),
    elDepositCurrentPrice: document.getElementById('depositCurrentPrice'),

    // 적금
    elSavingsCount: document.getElementById('savingsCount'),
    elIncomePerSavings: document.getElementById('incomePerSavings'),
    elBuySavings: document.getElementById('buySavings'),
    elSavingsCurrentPrice: document.getElementById('savingsCurrentPrice'),

    // 채권
    elBondCount: document.getElementById('bondCount'),
    elIncomePerBond: document.getElementById('incomePerBond'),
    elBuyBond: document.getElementById('buyBond'),
    elBondCurrentPrice: document.getElementById('bondCurrentPrice'),

    // 미국주식
    elUsStockCount: document.getElementById('usStockCount'),
    elIncomePerUsStock: document.getElementById('incomePerUsStock'),
    elBuyUsStock: document.getElementById('buyUsStock'),
    elUsStockCurrentPrice: document.getElementById('usStockCurrentPrice'),

    // 코인
    elCryptoCount: document.getElementById('cryptoCount'),
    elIncomePerCrypto: document.getElementById('incomePerCrypto'),
    elBuyCrypto: document.getElementById('buyCrypto'),
    elCryptoCurrentPrice: document.getElementById('cryptoCurrentPrice'),

    // ======= 부동산 =======
    // 빌라
    elVillaCount: document.getElementById('villaCount'),
    elRentPerVilla: document.getElementById('rentPerVilla'),
    elBuyVilla: document.getElementById('buyVilla'),
    elVillaCurrentPrice: document.getElementById('villaCurrentPrice'),

    // 오피스텔
    elOfficetelCount: document.getElementById('officetelCount'),
    elRentPerOfficetel: document.getElementById('rentPerOfficetel'),
    elBuyOfficetel: document.getElementById('buyOfficetel'),
    elOfficetelCurrentPrice: document.getElementById('officetelCurrentPrice'),

    // 아파트
    elAptCount: document.getElementById('aptCount'),
    elRentPerApt: document.getElementById('rentPerApt'),
    elBuyApt: document.getElementById('buyApt'),
    elAptCurrentPrice: document.getElementById('aptCurrentPrice'),

    // 상가
    elShopCount: document.getElementById('shopCount'),
    elRentPerShop: document.getElementById('rentPerShop'),
    elBuyShop: document.getElementById('buyShop'),
    elShopCurrentPrice: document.getElementById('shopCurrentPrice'),

    // 빌딩
    elBuildingCount: document.getElementById('buildingCount'),
    elRentPerBuilding: document.getElementById('rentPerBuilding'),
    elBuyBuilding: document.getElementById('buyBuilding'),
    elBuildingCurrentPrice: document.getElementById('buildingCurrentPrice'),

    // 서울타워
    elTowerCountDisplay: document.getElementById('towerCountDisplay'),
    elTowerCountBadge: document.getElementById('towerCountBadge'),
    elTowerCurrentPrice: document.getElementById('towerCurrentPrice'),
    elBuyTower: document.getElementById('buyTower'),

    // ======= 모드/수량 =======
    elBuyMode: document.getElementById('buyMode'),
    elSellMode: document.getElementById('sellMode'),
    elQty1: document.getElementById('qty1'),
    elQty5: document.getElementById('qty5'),
    elQty10: document.getElementById('qty10'),

    // ======= 토글 =======
    elToggleUpgrades: document.getElementById('toggleUpgrades'),
    elToggleFinancial: document.getElementById('toggleFinancial'),
    elToggleProperties: document.getElementById('toggleProperties'),

    // ======= 저장/리셋 =======
    elSaveStatus: document.getElementById('saveStatus'),
    elResetBtn: document.getElementById('resetBtn'),

    // ======= 커리어 =======
    elCurrentCareer: document.getElementById('currentCareer'),
    elNextCareerDesc: document.getElementById('nextCareerDesc'),
    elCareerCost: document.getElementById('careerCost'),
    elCareerProgress: document.getElementById('careerProgress'),
    elCareerProgressText: document.getElementById('careerProgressText'),
    elCareerRemaining: document.getElementById('careerRemaining'),
  }

  return _cachedRefs
}

/**
 * DOM 캐시 초기화 (테스트용)
 */
export function resetDomCache() {
  _cachedRefs = null
}
