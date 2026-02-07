/**
 * buttonStates.js
 * 버튼 및 아이템 상태 업데이트 모듈
 * main.js의 updateButtonStates, updateBuildingItemStates 함수 분리
 */

import { t } from '../i18n/index.js'
import { BASE_COSTS } from '../balance/index.js'
import { getDomRefs } from './domRefs.js'
import { formatKoreanNumber } from '../utils/numberFormat.js'

/**
 * createButtonStateManager
 * Factory 패턴으로 버튼 상태 관리자 생성
 *
 * @param {Object} deps - 의존성 객체
 * @returns {Object} { updateButtonStates, updateBuildingItemStates }
 */
export function createButtonStateManager(deps) {
  const {
    // State getters
    getCash,
    getPurchaseMode,
    getPurchaseQuantity,
    getDeposits,
    getSavings,
    getBonds,
    getUsStocks,
    getCryptos,
    getVillas,
    getOfficetels,
    getApartments,
    getShops,
    getBuildings,
    // Helper functions
    getFinancialCost,
    getPropertyCost,
    isProductUnlocked,
  } = deps

  // DOM 요소 직접 참조 (Phase 17: getDomRefs()를 모듈이 직접 import)
  const DOM = getDomRefs()
  const {
    elBuyDeposit,
    elBuySavings,
    elBuyBond,
    elBuyUsStock,
    elBuyCrypto,
    elBuyVilla,
    elBuyOfficetel,
    elBuyApt,
    elBuyShop,
    elBuyBuilding,
    elBuyTower,
  } = DOM

  /**
   * 버튼 상태 업데이트 함수 (Cookie Clicker 스타일)
   */
  function updateButtonStates() {
    const cash = getCash()
    const qty = getPurchaseQuantity()
    const isBuy = getPurchaseMode() === 'buy'
    const modeText = isBuy ? t('button.buy') : t('button.sell')
    const qtyText = qty > 1 ? ` x${qty}` : ''

    const deposits = getDeposits()
    const savings = getSavings()
    const bonds = getBonds()
    const usStocks = getUsStocks()
    const cryptos = getCryptos()
    const villas = getVillas()
    const officetels = getOfficetels()
    const apartments = getApartments()
    const shops = getShops()
    const buildings = getBuildings()

    // 금융상품 버튼 상태 계산
    const depositCanBuy = isBuy && cash >= getFinancialCost('deposit', deposits, qty)
    const depositCanSell = !isBuy && deposits >= qty
    const savingsCanBuy = isBuy && cash >= getFinancialCost('savings', savings, qty)
    const savingsCanSell = !isBuy && savings >= qty
    const bondCanBuy = isBuy && cash >= getFinancialCost('bond', bonds, qty)
    const bondCanSell = !isBuy && bonds >= qty
    const usStockCanBuy = isBuy && cash >= getFinancialCost('usStock', usStocks, qty)
    const usStockCanSell = !isBuy && usStocks >= qty
    const cryptoCanBuy = isBuy && cash >= getFinancialCost('crypto', cryptos, qty)
    const cryptoCanSell = !isBuy && cryptos >= qty

    // 버튼 텍스트 업데이트
    if (elBuyDeposit) elBuyDeposit.textContent = `${modeText}${qtyText}`
    if (elBuySavings) elBuySavings.textContent = `${modeText}${qtyText}`
    if (elBuyBond) elBuyBond.textContent = `${modeText}${qtyText}`
    if (elBuyUsStock) elBuyUsStock.textContent = `${modeText}${qtyText}`
    if (elBuyCrypto) elBuyCrypto.textContent = `${modeText}${qtyText}`

    // 버튼 상태 클래스 업데이트
    const affordableClass = isBuy ? 'affordable' : 'affordable-sell'
    const unaffordableClass = isBuy ? 'unaffordable' : 'unaffordable-sell'
    const allClasses = ['affordable', 'unaffordable', 'affordable-sell', 'unaffordable-sell']

    // 금융상품 버튼 클래스 및 aria-label 업데이트
    if (elBuyDeposit) {
      elBuyDeposit.classList.remove(...allClasses)
      const canAfford = depositCanBuy || depositCanSell
      elBuyDeposit.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getFinancialCost('deposit', deposits, qty)
          elBuyDeposit.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyDeposit.setAttribute('aria-label', `판매 불가: 보유량 ${deposits}개`)
        }
      } else {
        elBuyDeposit.removeAttribute('aria-label')
      }
    }

    if (elBuySavings) {
      elBuySavings.classList.remove(...allClasses)
      const canAfford = savingsCanBuy || savingsCanSell
      elBuySavings.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getFinancialCost('savings', savings, qty)
          elBuySavings.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuySavings.setAttribute('aria-label', `판매 불가: 보유량 ${savings}개`)
        }
      } else {
        elBuySavings.removeAttribute('aria-label')
      }
    }

    if (elBuyBond) {
      elBuyBond.classList.remove(...allClasses)
      const canAfford = bondCanBuy || bondCanSell
      elBuyBond.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getFinancialCost('bond', bonds, qty)
          elBuyBond.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyBond.setAttribute('aria-label', `판매 불가: 보유량 ${bonds}개`)
        }
      } else {
        elBuyBond.removeAttribute('aria-label')
      }
    }

    if (elBuyUsStock) {
      elBuyUsStock.classList.remove(...allClasses)
      const canAfford = usStockCanBuy || usStockCanSell
      elBuyUsStock.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getFinancialCost('usStock', usStocks, qty)
          elBuyUsStock.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyUsStock.setAttribute('aria-label', `판매 불가: 보유량 ${usStocks}개`)
        }
      } else {
        elBuyUsStock.removeAttribute('aria-label')
      }
    }

    if (elBuyCrypto) {
      elBuyCrypto.classList.remove(...allClasses)
      const canAfford = cryptoCanBuy || cryptoCanSell
      elBuyCrypto.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getFinancialCost('crypto', cryptos, qty)
          elBuyCrypto.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyCrypto.setAttribute('aria-label', `판매 불가: 보유량 ${cryptos}개`)
        }
      } else {
        elBuyCrypto.removeAttribute('aria-label')
      }
    }

    // 부동산 버튼 상태 계산
    const villaCanBuy = isBuy && cash >= getPropertyCost('villa', villas, qty)
    const villaCanSell = !isBuy && villas >= qty
    const officetelCanBuy = isBuy && cash >= getPropertyCost('officetel', officetels, qty)
    const officetelCanSell = !isBuy && officetels >= qty
    const aptCanBuy = isBuy && cash >= getPropertyCost('apartment', apartments, qty)
    const aptCanSell = !isBuy && apartments >= qty
    const shopCanBuy = isBuy && cash >= getPropertyCost('shop', shops, qty)
    const shopCanSell = !isBuy && shops >= qty
    const buildingCanBuy = isBuy && cash >= getPropertyCost('building', buildings, qty)
    const buildingCanSell = !isBuy && buildings >= qty

    // 부동산 버튼 텍스트 업데이트
    if (elBuyVilla) elBuyVilla.textContent = `${modeText}${qtyText}`
    if (elBuyOfficetel) elBuyOfficetel.textContent = `${modeText}${qtyText}`
    if (elBuyApt) elBuyApt.textContent = `${modeText}${qtyText}`
    if (elBuyShop) elBuyShop.textContent = `${modeText}${qtyText}`
    if (elBuyBuilding) elBuyBuilding.textContent = `${modeText}${qtyText}`

    // 부동산 버튼 클래스 및 aria-label 업데이트
    if (elBuyVilla) {
      elBuyVilla.classList.remove(...allClasses)
      const canAfford = villaCanBuy || villaCanSell
      elBuyVilla.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getPropertyCost('villa', villas, qty)
          elBuyVilla.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyVilla.setAttribute('aria-label', `판매 불가: 보유량 ${villas}채`)
        }
      } else {
        elBuyVilla.removeAttribute('aria-label')
      }
    }

    if (elBuyOfficetel) {
      elBuyOfficetel.classList.remove(...allClasses)
      const canAfford = officetelCanBuy || officetelCanSell
      elBuyOfficetel.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getPropertyCost('officetel', officetels, qty)
          elBuyOfficetel.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyOfficetel.setAttribute('aria-label', `판매 불가: 보유량 ${officetels}채`)
        }
      } else {
        elBuyOfficetel.removeAttribute('aria-label')
      }
    }

    if (elBuyApt) {
      elBuyApt.classList.remove(...allClasses)
      const canAfford = aptCanBuy || aptCanSell
      elBuyApt.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getPropertyCost('apartment', apartments, qty)
          elBuyApt.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyApt.setAttribute('aria-label', `판매 불가: 보유량 ${apartments}채`)
        }
      } else {
        elBuyApt.removeAttribute('aria-label')
      }
    }

    if (elBuyShop) {
      elBuyShop.classList.remove(...allClasses)
      const canAfford = shopCanBuy || shopCanSell
      elBuyShop.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getPropertyCost('shop', shops, qty)
          elBuyShop.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyShop.setAttribute('aria-label', `판매 불가: 보유량 ${shops}채`)
        }
      } else {
        elBuyShop.removeAttribute('aria-label')
      }
    }

    if (elBuyBuilding) {
      elBuyBuilding.classList.remove(...allClasses)
      const canAfford = buildingCanBuy || buildingCanSell
      elBuyBuilding.classList.add(canAfford ? affordableClass : unaffordableClass)

      if (!canAfford) {
        if (isBuy) {
          const cost = getPropertyCost('building', buildings, qty)
          elBuyBuilding.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(cost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyBuilding.setAttribute('aria-label', `판매 불가: 보유량 ${buildings}채`)
        }
      } else {
        elBuyBuilding.removeAttribute('aria-label')
      }
    }

    // 서울타워 버튼 상태 (구매만 가능, 판매 불가)
    if (elBuyTower) {
      const towerCost = BASE_COSTS.tower
      const towerUnlocked = isProductUnlocked('tower')
      const towerCanBuy = isBuy && cash >= towerCost && towerUnlocked
      elBuyTower.textContent = isBuy ? `${t('button.buy')}${qtyText}` : t('button.sell')
      elBuyTower.classList.toggle('affordable', towerCanBuy)
      elBuyTower.classList.toggle('unaffordable', isBuy && (!towerCanBuy || !towerUnlocked))
      elBuyTower.disabled = getPurchaseMode() === 'sell' || !towerUnlocked

      if (!towerCanBuy) {
        if (!towerUnlocked) {
          elBuyTower.setAttribute('aria-label', '잠금: 전제조건 미충족')
        } else if (isBuy) {
          elBuyTower.setAttribute(
            'aria-label',
            `구매 불가: 필요 금액 ${formatKoreanNumber(towerCost)}원, 보유 ${formatKoreanNumber(cash)}원`
          )
        } else {
          elBuyTower.setAttribute('aria-label', '판매 불가: 서울타워는 판매할 수 없습니다')
        }
      } else {
        elBuyTower.removeAttribute('aria-label')
      }
    }
  }

  /**
   * 건물 목록 색상 업데이트 함수
   */
  function updateBuildingItemStates() {
    const cash = getCash()
    const qty = getPurchaseQuantity()
    const isBuy = getPurchaseMode() === 'buy'
    const affordableClass = isBuy ? 'affordable' : 'affordable-sell'
    const unaffordableClass = isBuy ? 'unaffordable' : 'unaffordable-sell'
    const allClasses = ['affordable', 'unaffordable', 'affordable-sell', 'unaffordable-sell']

    const deposits = getDeposits()
    const savings = getSavings()
    const bonds = getBonds()
    const usStocks = getUsStocks()
    const cryptos = getCryptos()
    const villas = getVillas()
    const officetels = getOfficetels()
    const apartments = getApartments()
    const shops = getShops()
    const buildings = getBuildings()

    // 금융상품 아이템 상태 업데이트
    const depositItem = document.getElementById('depositItem')
    const savingsItem = document.getElementById('savingsItem')
    const bondItem = document.getElementById('bondItem')
    const usStockItem = document.getElementById('usStockItem')
    const cryptoItem = document.getElementById('cryptoItem')

    const depositCanBuy = cash >= getFinancialCost('deposit', deposits, qty)
    const depositCanSell = deposits >= qty
    const savingsCanBuy = cash >= getFinancialCost('savings', savings, qty)
    const savingsCanSell = savings >= qty
    const bondCanBuy = cash >= getFinancialCost('bond', bonds, qty)
    const bondCanSell = bonds >= qty
    const usStockCanBuy = cash >= getFinancialCost('usStock', usStocks, qty)
    const usStockCanSell = usStocks >= qty
    const cryptoCanBuy = cash >= getFinancialCost('crypto', cryptos, qty)
    const cryptoCanSell = cryptos >= qty

    if (depositItem) {
      depositItem.classList.remove(...allClasses)
      depositItem.classList.add(
        isBuy
          ? depositCanBuy
            ? affordableClass
            : unaffordableClass
          : depositCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (savingsItem) {
      savingsItem.classList.remove(...allClasses)
      savingsItem.classList.add(
        isBuy
          ? savingsCanBuy
            ? affordableClass
            : unaffordableClass
          : savingsCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (bondItem) {
      bondItem.classList.remove(...allClasses)
      bondItem.classList.add(
        isBuy
          ? bondCanBuy
            ? affordableClass
            : unaffordableClass
          : bondCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (usStockItem) {
      usStockItem.classList.remove(...allClasses)
      usStockItem.classList.add(
        isBuy
          ? usStockCanBuy
            ? affordableClass
            : unaffordableClass
          : usStockCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (cryptoItem) {
      cryptoItem.classList.remove(...allClasses)
      cryptoItem.classList.add(
        isBuy
          ? cryptoCanBuy
            ? affordableClass
            : unaffordableClass
          : cryptoCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    // 부동산 아이템 상태 업데이트
    const villaItem = document.getElementById('villaItem')
    const officetelItem = document.getElementById('officetelItem')
    const aptItem = document.getElementById('aptItem')
    const shopItem = document.getElementById('shopItem')
    const buildingItem = document.getElementById('buildingItem')

    const villaCanBuy = cash >= getPropertyCost('villa', villas, qty)
    const villaCanSell = villas >= qty
    const officetelCanBuy = cash >= getPropertyCost('officetel', officetels, qty)
    const officetelCanSell = officetels >= qty
    const aptCanBuy = cash >= getPropertyCost('apartment', apartments, qty)
    const aptCanSell = apartments >= qty
    const shopCanBuy = cash >= getPropertyCost('shop', shops, qty)
    const shopCanSell = shops >= qty
    const buildingCanBuy = cash >= getPropertyCost('building', buildings, qty)
    const buildingCanSell = buildings >= qty

    if (villaItem) {
      villaItem.classList.remove(...allClasses)
      villaItem.classList.add(
        isBuy
          ? villaCanBuy
            ? affordableClass
            : unaffordableClass
          : villaCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (officetelItem) {
      officetelItem.classList.remove(...allClasses)
      officetelItem.classList.add(
        isBuy
          ? officetelCanBuy
            ? affordableClass
            : unaffordableClass
          : officetelCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (aptItem) {
      aptItem.classList.remove(...allClasses)
      aptItem.classList.add(
        isBuy
          ? aptCanBuy
            ? affordableClass
            : unaffordableClass
          : aptCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (shopItem) {
      shopItem.classList.remove(...allClasses)
      shopItem.classList.add(
        isBuy
          ? shopCanBuy
            ? affordableClass
            : unaffordableClass
          : shopCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    if (buildingItem) {
      buildingItem.classList.remove(...allClasses)
      buildingItem.classList.add(
        isBuy
          ? buildingCanBuy
            ? affordableClass
            : unaffordableClass
          : buildingCanSell
            ? affordableClass
            : unaffordableClass
      )
    }

    // 서울타워 아이템 상태 (구매만 가능, 판매 불가)
    const towerItem = document.getElementById('towerItem')
    if (towerItem) {
      const towerCost = BASE_COSTS.tower
      const towerCanBuy = isBuy && cash >= towerCost && isProductUnlocked('tower')
      towerItem.classList.toggle('affordable', towerCanBuy)
      towerItem.classList.toggle(
        'unaffordable',
        isBuy && (!towerCanBuy || !isProductUnlocked('tower'))
      )
    }
  }

  return {
    updateButtonStates,
    updateBuildingItemStates,
  }
}
