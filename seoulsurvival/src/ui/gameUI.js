/**
 * Game UI Update Module
 * 게임 UI 전체 업데이트를 담당하는 팩토리 함수
 */

import { GAME_VERSION } from '../version.js'
import { FINANCIAL_INCOME, BASE_RENT } from '../state/gameState.js'
import { BASE_COSTS } from '../balance/index.js'
import * as NumberFormat from '../utils/numberFormat.js'
import { safeText, safeHTML } from './domUtils.js'
import { t, getLang } from '../i18n/index.js'
import { getDomRefs } from './domRefs.js'
import { getActiveTab } from './tabNavigation.js'

/**
 * createGameUI - Factory 패턴으로 UI 업데이트 시스템 생성
 * @param {Object} deps - 의존성 주입 객체
 * @returns {Object} - updateUI 함수를 포함한 객체
 */
export function createGameUI(deps) {
  const {
    // State getters
    getCash,
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
    getTowersRun,
    getTowersLifetime,
    getDepositsLifetime,
    getSavingsLifetime,
    getBondsLifetime,
    getUsStocksLifetime,
    getCryptosLifetime,
    getVillasLifetime,
    getOfficetelsLifetime,
    getApartmentsLifetime,
    getShopsLifetime,
    getBuildingsLifetime,
    getPurchaseMode,
    getPurchaseQuantity,
    getPlayerNickname,
    getTotalClicks,
    getCareerLevel,
    getClickMultiplier,
    getRentMultiplier,
    getMarketMultiplier,
    getSettings,
    getGameStartTime,
    getSessionStartTime,

    // State setters (for validation)
    setTotalClicks,
    setDeposits,
    setSavings,
    setBonds,

    // Helper functions
    getCareerName,
    getCurrentCareer,
    getNextCareer,
    getClickIncome,
    getRps,
    getTotalFinancialProducts,
    getTotalProperties,
    getTotalIncomeForContribution,
    getFinancialIncome,
    getPropertyIncome,
    getFinancialCost,
    getFinancialSellPrice,
    getPropertyCost,
    getPropertySellPrice,
    getProductName,

    // UI update functions
    updateInvestmentMarketImpactUI,
    updateButtonStates,
    updateBuildingItemStates,
    updateUpgradeAffordability,
    updateProductLockStates,
    updateStatsTab,
  } = deps

  // DOM 요소 직접 참조 (Phase 17: getDomRefs()를 모듈이 직접 import)
  const DOM = getDomRefs()
  const {
    elCurrentCareer,
    elClickIncomeButton,
    elWorkArea,
    elCareerProgress,
    elCareerProgressText,
    elCareerRemaining,
    elCash,
    elFinancial,
    elProperties,
    elRps,
    elClickMultiplier,
    elRentMultiplier,
    elDepositCount,
    elIncomePerDeposit,
    elDepositCurrentPrice,
    elSavingsCount,
    elIncomePerSavings,
    elSavingsCurrentPrice,
    elBondCount,
    elIncomePerBond,
    elBondCurrentPrice,
    elUsStockCount,
    elIncomePerUsStock,
    elUsStockCurrentPrice,
    elCryptoCount,
    elIncomePerCrypto,
    elCryptoCurrentPrice,
    elVillaCount,
    elRentPerVilla,
    elVillaCurrentPrice,
    elOfficetelCount,
    elRentPerOfficetel,
    elOfficetelCurrentPrice,
    elAptCount,
    elRentPerApt,
    elAptCurrentPrice,
    elShopCount,
    elRentPerShop,
    elShopCurrentPrice,
    elBuildingCount,
    elRentPerBuilding,
    elBuildingCurrentPrice,
    elTowerCountDisplay,
    elTowerCountBadge,
    elTowerCurrentPrice,
    elGameVersionDisplay,
    elDiaryHeaderMeta,
    elPlayerNicknameLabel,
    elNicknameInfoItem,
    elNicknameChangeButtonContainer,
    elNicknameConflictBanner,
    elFinancialChip,
    elPropertyChip,
    elTowerBadge,
    elTowerCountHeader,
    elRpsChip,
    elWorkTab,
    elShopTab,
    elStatsTab,
  } = DOM

  /**
   * updateUI - 게임 UI 전체 업데이트
   */
  function updateUI() {
    // 전체 함수를 try-catch로 감싸서 안전하게 처리
    try {
      // 활성 탭 기반 렌더링 최적화
      // PC에서는 모든 탭이 동시에 보이므로 실제 가시성 기반으로 판단
      const activeTab = getActiveTab()
      const shouldRenderWork = activeTab === 'workTab' || (elWorkTab && elWorkTab.offsetWidth > 0)
      const shouldRenderInvestment =
        activeTab === 'shopTab' || (elShopTab && elShopTab.offsetWidth > 0)
      const shouldRenderStats =
        activeTab === 'statsTab' || (elStatsTab && elStatsTab.offsetWidth > 0)

      // 게임 버전 표시 업데이트 (package.json 동기화)
      safeText(elGameVersionDisplay, `v${GAME_VERSION}`)

      // --- (A) 커리어 진행률 갱신 (노동 탭에서만) ---
      if (shouldRenderWork)
        try {
          // 닉네임 표시 업데이트
          const playerNickname = getPlayerNickname()
          safeText(elPlayerNicknameLabel, playerNickname || '-')
          if (elNicknameInfoItem) {
            if (playerNickname) {
              elNicknameInfoItem.style.visibility = 'visible'
              elNicknameInfoItem.style.display = 'flex'
              elNicknameInfoItem.style.position = 'relative'
              elNicknameInfoItem.style.pointerEvents = 'auto'
            } else {
              elNicknameInfoItem.style.visibility = 'hidden'
              elNicknameInfoItem.style.display = 'none'
              elNicknameInfoItem.style.position = 'absolute'
              elNicknameInfoItem.style.pointerEvents = 'none'
            }
          }
          // 닉네임 변경 버튼 표시/숨김
          if (elNicknameChangeButtonContainer) {
            if (playerNickname) {
              elNicknameChangeButtonContainer.style.visibility = 'visible'
              elNicknameChangeButtonContainer.style.display = 'block'
              elNicknameChangeButtonContainer.style.position = 'relative'
              elNicknameChangeButtonContainer.style.pointerEvents = 'auto'
            } else {
              elNicknameChangeButtonContainer.style.visibility = 'hidden'
              elNicknameChangeButtonContainer.style.display = 'none'
              elNicknameChangeButtonContainer.style.position = 'absolute'
              elNicknameChangeButtonContainer.style.pointerEvents = 'none'
            }
          }

          // 마이그레이션 충돌 배너 표시
          if (elNicknameConflictBanner) {
            try {
              const needsChange =
                localStorage.getItem('clicksurvivor_needsNicknameChange') === 'true'
              if (needsChange) {
                elNicknameConflictBanner.style.display = 'block'
                // 배너 내용 업데이트
                const bannerText = elNicknameConflictBanner.querySelector('span')
                if (bannerText) {
                  bannerText.textContent = t('settings.nickname.migrationConflict.message')
                }
              } else {
                elNicknameConflictBanner.style.display = 'none'
              }
            } catch (e) {
              elNicknameConflictBanner.style.display = 'none'
            }
          }

          // Supabase 진단 배지는 프로덕션에서는 표시하지 않음 (디버그 코드 제거)
          // totalClicks 값 유효성 검사
          let totalClicks = getTotalClicks()
          if (typeof totalClicks !== 'number' || totalClicks < 0) {
            console.warn('Invalid totalClicks value:', totalClicks, 'resetting to 0')
            totalClicks = 0
            setTotalClicks(0)
          }

          const currentCareer = getCurrentCareer()
          const nextCareer = getNextCareer()
          const careerLevel = getCareerLevel()

          if (!currentCareer) {
            console.error('getCurrentCareer() returned null/undefined')
            return
          }

          safeText(elCurrentCareer, getCareerName(careerLevel))
          safeText(elClickIncomeButton, NumberFormat.formatNumberForLang(getClickIncome()))

          // 직급별 배경 이미지 업데이트
          if (elWorkArea && currentCareer.bgImage) {
            elWorkArea.style.backgroundImage = `url('${currentCareer.bgImage}')`
          } else if (elWorkArea && !currentCareer.bgImage) {
            // 배경 이미지가 없으면 기본 그라데이션으로 복원
            elWorkArea.style.backgroundImage =
              'radial-gradient(1200px 400px at 50% -50%, rgba(94,234,212,.1), transparent 60%)'
          }

          if (nextCareer) {
            // 승진 진행률 계산 및 표시 (개선된 형식)
            const progress = Math.min((totalClicks / nextCareer.requiredClicks) * 100, 100)
            const remaining = Math.max(0, nextCareer.requiredClicks - totalClicks)

            if (elCareerProgress) {
              elCareerProgress.style.width = progress + '%'
              elCareerProgress.setAttribute('aria-valuenow', Math.round(progress))
            }

            // 간소화된 진행률 표시
            safeText(
              elCareerProgressText,
              `${Math.round(progress)}% (${totalClicks}/${nextCareer.requiredClicks})`
            )

            // 남은 클릭 수 표시
            if (elCareerRemaining) {
              if (remaining > 0) {
                // 천 단위 콤마 표기
                safeText(
                  elCareerRemaining,
                  t('ui.nextPromotion', { remaining: remaining.toLocaleString('ko-KR') })
                )
              } else {
                safeText(elCareerRemaining, t('ui.promotionAvailable'))
              }
            }
          } else {
            if (elCareerProgress) {
              elCareerProgress.style.width = '100%'
              elCareerProgress.setAttribute('aria-valuenow', 100)
            }
            safeText(elCareerProgressText, t('ui.careerCompleted'))
            if (elCareerRemaining) {
              safeText(elCareerRemaining, t('ui.careerMaxLevel'))
            }
          }
        } catch (e) {
          console.error('Career UI update failed:', e)
          console.error('Error details:', {
            totalClicks: getTotalClicks(),
            careerLevel: getCareerLevel(),
            currentCareer: getCurrentCareer(),
            nextCareer: getNextCareer(),
          })
        }

      // --- (B) 나머지 UI 갱신 (금융/부동산/업그레이드 등) ---
      // 일기장 헤더 메타(yyyy.mm.dd(N일차))는 로그가 없어도 항상 갱신
      if (elDiaryHeaderMeta) {
        const pad2 = n => String(n).padStart(2, '0')
        const now = new Date()
        const y = now.getFullYear()
        const m = pad2(now.getMonth() + 1)
        const d = pad2(now.getDate())
        const gameStartTime = getGameStartTime()
        const sessionStartTime = getSessionStartTime()
        const base =
          typeof gameStartTime !== 'undefined' && gameStartTime ? gameStartTime : sessionStartTime
        const days = Math.max(1, Math.floor((Date.now() - base) / 86400000) + 1)
        safeText(elDiaryHeaderMeta, `${y}.${m}.${d}(${t('ui.dayCount', { days })})`)
      }

      const cash = getCash()
      const settings = getSettings()
      safeText(elCash, NumberFormat.formatHeaderCash(cash, settings))

      // 금융상품 집계 및 툴팁
      const totalFinancial = getTotalFinancialProducts()
      safeText(elFinancial, NumberFormat.formatNumberForLang(totalFinancial))
      if (elFinancialChip) {
        const countUnit = t('ui.unit.count')
        const deposits = getDeposits()
        const savings = getSavings()
        const bonds = getBonds()
        const usStocks = getUsStocks()
        const cryptos = getCryptos()
        const tooltip = `${getProductName('deposit')}: ${deposits}${countUnit}\n${getProductName('savings')}: ${savings}${countUnit}\n${getProductName('bond')}: ${bonds}${countUnit}\n${getProductName('usStock')}: ${usStocks}${countUnit}\n${getProductName('crypto')}: ${cryptos}${countUnit}`
        elFinancialChip.setAttribute('title', tooltip)
      }

      // 부동산 집계 및 툴팁
      const totalProperties = getTotalProperties()
      safeText(elProperties, NumberFormat.formatNumberForLang(totalProperties))
      if (elPropertyChip) {
        const propertyUnit = t('ui.unit.property')
        const villas = getVillas()
        const officetels = getOfficetels()
        const apartments = getApartments()
        const shops = getShops()
        const buildings = getBuildings()
        const villaName = getProductName('villa')
        const officetelName = getProductName('officetel')
        const aptName = getProductName('apartment')
        const shopName = getProductName('shop')
        const buildingName = getProductName('building')
        const tooltip = `${villaName}: ${villas}${propertyUnit}\n${officetelName}: ${officetels}${propertyUnit}\n${aptName}: ${apartments}${propertyUnit}\n${shopName}: ${shops}${propertyUnit}\n${buildingName}: ${buildings}${propertyUnit}`
        elPropertyChip.setAttribute('title', tooltip)
      }

      // 타워 배지 표시/숨김
      const towers_lifetime = getTowersLifetime()
      if (elTowerBadge && elTowerCountHeader) {
        if (towers_lifetime > 0) {
          elTowerBadge.style.display = 'flex'
          safeText(elTowerCountHeader, towers_lifetime)
        } else {
          elTowerBadge.style.display = 'none'
        }
      }

      // 초당 수익 및 툴팁
      const rpsValue = getRps()
      safeText(elRps, NumberFormat.formatHeaderCash(rpsValue, settings))
      if (elRpsChip) {
        const deposits = getDeposits()
        const savings = getSavings()
        const bonds = getBonds()
        const villas = getVillas()
        const officetels = getOfficetels()
        const apartments = getApartments()
        const shops = getShops()
        const buildings = getBuildings()
        const rentMultiplier = getRentMultiplier()
        const marketMultiplier = getMarketMultiplier()

        const financialIncome =
          deposits * FINANCIAL_INCOME.deposit +
          savings * FINANCIAL_INCOME.savings +
          bonds * FINANCIAL_INCOME.bond
        const propertyIncome =
          (villas * BASE_RENT.villa +
            officetels * BASE_RENT.officetel +
            apartments * BASE_RENT.apartment +
            shops * BASE_RENT.shop +
            buildings * BASE_RENT.building) *
          rentMultiplier

        const financialIncomeFormatted =
          NumberFormat.formatNumberForLang(financialIncome) + t('ui.currency') + '/s'
        const propertyIncomeFormatted =
          NumberFormat.formatNumberForLang(propertyIncome) + t('ui.currency') + '/s'
        const tooltip = `${t('header.tooltip.financialIncome', { amount: financialIncomeFormatted })}\n${t('header.tooltip.propertyIncome', { amount: propertyIncomeFormatted })}\n${t('header.tooltip.marketMultiplier', { multiplier: marketMultiplier })}`
        elRpsChip.setAttribute('title', tooltip)
      }

      const clickMultiplier = getClickMultiplier()
      const rentMultiplier = getRentMultiplier()
      safeText(elClickMultiplier, clickMultiplier.toFixed(1))
      safeText(elRentMultiplier, rentMultiplier.toFixed(1))

      // === 투자 탭 전용 렌더링 (investmentTab이 보일 때만) ===
      if (shouldRenderInvestment) {
        // ======= [투자] 시장 이벤트 영향 배지/하이라이트 =======
        updateInvestmentMarketImpactUI()

        // 금융상품 UI 업데이트 (동적 가격 계산) - 안전장치 추가
        try {
          // 금융상품 변수 유효성 검사
          let deposits = getDeposits()
          let savings = getSavings()
          let bonds = getBonds()

          if (typeof deposits !== 'number' || deposits < 0) {
            console.warn('Invalid deposits value:', deposits, 'resetting to 0')
            deposits = 0
            setDeposits(0)
          }
          if (typeof savings !== 'number' || savings < 0) {
            console.warn('Invalid savings value:', savings, 'resetting to 0')
            savings = 0
            setSavings(0)
          }
          if (typeof bonds !== 'number' || bonds < 0) {
            console.warn('Invalid bonds value:', bonds, 'resetting to 0')
            bonds = 0
            setBonds(0)
          }

          const purchaseMode = getPurchaseMode()
          const purchaseQuantity = getPurchaseQuantity()

          // 퍼센트 표기는 실제 현재 수익 기준으로 계산 (시장 이벤트/배수 반영, 글로벌 marketMultiplier는 제외)
          const totalRps = getTotalIncomeForContribution()

          // 예금 업데이트
          updateFinancialProduct({
            type: 'deposit',
            count: deposits,
            lifetime: getDepositsLifetime(),
            countEl: elDepositCount,
            incomeEl: elIncomePerDeposit,
            priceEl: elDepositCurrentPrice,
            purchaseMode,
            purchaseQuantity,
            totalRps,
            settings,
          })

          // 적금 업데이트
          updateFinancialProduct({
            type: 'savings',
            count: savings,
            lifetime: getSavingsLifetime(),
            countEl: elSavingsCount,
            incomeEl: elIncomePerSavings,
            priceEl: elSavingsCurrentPrice,
            purchaseMode,
            purchaseQuantity,
            totalRps,
            settings,
          })

          // 주식 업데이트
          updateFinancialProduct({
            type: 'bond',
            count: bonds,
            lifetime: getBondsLifetime(),
            countEl: elBondCount,
            incomeEl: elIncomePerBond,
            priceEl: elBondCurrentPrice,
            purchaseMode,
            purchaseQuantity,
            totalRps,
            settings,
          })

          // 미국주식 업데이트
          const usStocks = getUsStocks()
          updateFinancialProduct({
            type: 'usStock',
            count: usStocks,
            lifetime: getUsStocksLifetime(),
            countEl: elUsStockCount,
            incomeEl: elIncomePerUsStock,
            priceEl: elUsStockCurrentPrice,
            purchaseMode,
            purchaseQuantity,
            totalRps,
            settings,
          })

          // 코인 업데이트
          const cryptos = getCryptos()
          updateFinancialProduct({
            type: 'crypto',
            count: cryptos,
            lifetime: getCryptosLifetime(),
            countEl: elCryptoCount,
            incomeEl: elIncomePerCrypto,
            priceEl: elCryptoCurrentPrice,
            purchaseMode,
            purchaseQuantity,
            totalRps,
            settings,
          })
        } catch (e) {
          console.error('Financial products UI update failed:', e)
          console.error('Error details:', {
            deposits: getDeposits(),
            savings: getSavings(),
            bonds: getBonds(),
          })
        }

        // 부동산 구입 UI 업데이트 (동적 가격 계산)
        const totalRps2 = getTotalIncomeForContribution() // 부동산용 RPS 계산
        const purchaseMode = getPurchaseMode()
        const purchaseQuantity = getPurchaseQuantity()

        // 빌라
        const villas = getVillas()
        updatePropertyProduct({
          type: 'villa',
          count: villas,
          lifetime: getVillasLifetime(),
          countEl: elVillaCount,
          incomeEl: elRentPerVilla,
          priceEl: elVillaCurrentPrice,
          purchaseMode,
          purchaseQuantity,
          totalRps: totalRps2,
          settings,
          rentMultiplier,
        })

        // 오피스텔
        const officetels = getOfficetels()
        updatePropertyProduct({
          type: 'officetel',
          count: officetels,
          lifetime: getOfficetelsLifetime(),
          countEl: elOfficetelCount,
          incomeEl: elRentPerOfficetel,
          priceEl: elOfficetelCurrentPrice,
          purchaseMode,
          purchaseQuantity,
          totalRps: totalRps2,
          settings,
          rentMultiplier,
        })

        // 아파트
        const apartments = getApartments()
        updatePropertyProduct({
          type: 'apartment',
          count: apartments,
          lifetime: getApartmentsLifetime(),
          countEl: elAptCount,
          incomeEl: elRentPerApt,
          priceEl: elAptCurrentPrice,
          purchaseMode,
          purchaseQuantity,
          totalRps: totalRps2,
          settings,
          rentMultiplier,
        })

        // 상가
        const shops = getShops()
        updatePropertyProduct({
          type: 'shop',
          count: shops,
          lifetime: getShopsLifetime(),
          countEl: elShopCount,
          incomeEl: elRentPerShop,
          priceEl: elShopCurrentPrice,
          purchaseMode,
          purchaseQuantity,
          totalRps: totalRps2,
          settings,
          rentMultiplier,
        })

        // 빌딩
        const buildings = getBuildings()
        updatePropertyProduct({
          type: 'building',
          count: buildings,
          lifetime: getBuildingsLifetime(),
          countEl: elBuildingCount,
          incomeEl: elRentPerBuilding,
          priceEl: elBuildingCurrentPrice,
          purchaseMode,
          purchaseQuantity,
          totalRps: totalRps2,
          settings,
          rentMultiplier,
        })

        // 서울타워 (프레스티지, 수익 없음)
        const towers_run = getTowersRun()
        const towerName = getProductName('tower')
        const towerPrice = NumberFormat.formatNumberForLang(BASE_COSTS.tower, getLang())

        // 상품 이름 업데이트
        const towerTitleEl = document.querySelector('#towerItem .title')
        if (towerTitleEl) towerTitleEl.textContent = `🗼 ${towerName}`

        // 설명 업데이트
        const towerDescEls = document.querySelectorAll('#towerItem .desc')
        if (towerDescEls.length >= 4) {
          safeHTML(towerDescEls[0], `• ${t('tower.desc.prestige')}`)
          safeHTML(towerDescEls[1], `• ${t('tower.desc.owned', { count: towers_run })}`)
          safeHTML(towerDescEls[2], `• ${t('tower.desc.leaderboard', { count: towers_lifetime })}`)
          safeHTML(towerDescEls[3], `${t('product.desc.currentPrice', { price: towerPrice })}`)
        }

        if (elTowerCountDisplay) elTowerCountDisplay.textContent = towers_lifetime
        if (elTowerCountBadge) elTowerCountBadge.textContent = towers_lifetime
        if (elTowerCurrentPrice) {
          elTowerCurrentPrice.textContent = towerPrice
        }

        // 버튼 상태 업데이트 (Cookie Clicker 스타일)
        updateButtonStates()

        // 건물 목록 색상 업데이트
        updateBuildingItemStates()

        // 업그레이드 구매 가능 여부만 업데이트 (DOM 재생성 안 함)
        updateUpgradeAffordability()

        // 순차 해금 시스템 - 잠금 상태 업데이트
        if (typeof updateProductLockStates === 'function') {
          updateProductLockStates()
        }
      } // end investmentTab

      // 통계 탭 업데이트 (statsTab이 보일 때만)
      if (shouldRenderStats) {
        updateStatsTab()
      }
    } catch (uiError) {
      console.error('❌ updateUI() 전체 실행 중 오류:', uiError)
      console.error('에러 스택:', uiError.stack)
      // UI 업데이트 실패해도 게임은 계속 진행 가능
    }
  }

  /**
   * updateFinancialProduct - 금융상품 UI 업데이트 헬퍼
   */
  function updateFinancialProduct({
    type,
    count,
    lifetime,
    countEl,
    incomeEl,
    priceEl,
    purchaseMode,
    purchaseQuantity,
    totalRps,
    settings,
  }) {
    const cost =
      purchaseMode === 'buy'
        ? getFinancialCost(type, count, purchaseQuantity)
        : getFinancialSellPrice(type, count, purchaseQuantity)
    const totalIncome = count * FINANCIAL_INCOME[type]
    const effectiveIncome = getFinancialIncome(type, count)
    const percent = totalRps > 0 ? ((effectiveIncome / totalRps) * 100).toFixed(1) : 0

    if (countEl) countEl.textContent = count
    const currency = t('ui.currency')
    const unit = t('ui.unit.count')
    const productName = getProductName(type)
    const perUnitAmount =
      Math.floor(FINANCIAL_INCOME[type]).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') +
      currency
    const totalAmount =
      Math.floor(totalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
    const lifetimeAmount = NumberFormat.formatCashDisplayFixed1(lifetime, settings)
    const price = NumberFormat.formatFinancialPrice(cost)

    // 상품 이름 업데이트
    const productMap = {
      deposit: '💰',
      savings: '🏦',
      bond: '📈',
      usStock: '🇺🇸',
      crypto: '₿',
    }
    const emoji = productMap[type] || ''
    const titleEl = document.querySelector(`#${type}Item .title`)
    if (titleEl) {
      const titleSpan = titleEl.querySelector(`span[data-i18n="product.${type}"]`)
      if (titleSpan) {
        titleSpan.textContent = productName
      } else {
        titleEl.textContent = `${emoji} ${productName}`
      }
    }

    // 설명 업데이트
    const descEls = document.querySelectorAll(`#${type}Item .desc`)
    if (descEls.length >= 4) {
      const perUnitText = t('product.desc.perUnit', {
        product: productName,
        amount: perUnitAmount,
      })
      safeHTML(descEls[0], `• ${perUnitText.replace(perUnitAmount, `<b>${perUnitAmount}</b>`)}`)

      const totalText = t('product.desc.total', {
        count,
        unit,
        product: productName,
        amount: totalAmount,
        percent,
      })
      safeHTML(
        descEls[1],
        `• ${totalText.replace(totalAmount, `<b>${totalAmount}</b>`).replace(percent + '%', `<b>${percent}%</b>`)}`
      )

      const lifetimeText = t('product.desc.lifetime', { amount: lifetimeAmount })
      safeHTML(descEls[2], `• ${lifetimeText.replace(lifetimeAmount, `<b>${lifetimeAmount}</b>`)}`)

      const currentPriceText = t('product.desc.currentPrice', { price })
      safeHTML(descEls[3], currentPriceText.replace(price, `<b>${price}</b>`))
    }

    // 기존 ID 요소들 업데이트 (하위 호환성)
    if (incomeEl) incomeEl.textContent = perUnitAmount
    const totalIncomeEl = document.getElementById(`${type}TotalIncome`)
    if (totalIncomeEl) totalIncomeEl.textContent = totalAmount
    const percentEl = document.getElementById(`${type}Percent`)
    if (percentEl) percentEl.textContent = percent + '%'
    const lifetimeEl =
      document.getElementById(`${type}LifetimeDisplay`) ||
      document.getElementById(`${type}Lifetime`)
    if (lifetimeEl) lifetimeEl.textContent = lifetimeAmount
    if (priceEl) priceEl.textContent = price
  }

  /**
   * updatePropertyProduct - 부동산 UI 업데이트 헬퍼
   */
  function updatePropertyProduct({
    type,
    count,
    lifetime,
    countEl,
    incomeEl,
    priceEl,
    purchaseMode,
    purchaseQuantity,
    totalRps,
    settings,
    rentMultiplier,
  }) {
    const cost =
      purchaseMode === 'buy'
        ? getPropertyCost(type, count, purchaseQuantity)
        : getPropertySellPrice(type, count, purchaseQuantity)
    const totalIncome = count * BASE_RENT[type]
    const effectiveIncome = getPropertyIncome(type, count) * rentMultiplier
    const percent = totalRps > 0 ? ((effectiveIncome / totalRps) * 100).toFixed(1) : 0

    if (countEl) countEl.textContent = count
    const currency = t('ui.currency')
    const unit = t('ui.unit.property')
    const productName = getProductName(type)
    const perUnitAmount =
      Math.floor(BASE_RENT[type]).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
    const totalAmount =
      Math.floor(totalIncome).toLocaleString(getLang() === 'en' ? 'en-US' : 'ko-KR') + currency
    const lifetimeAmount = NumberFormat.formatCashDisplayFixed1(lifetime, settings)
    const price = NumberFormat.formatPropertyPrice(cost)

    // 상품 이름 업데이트
    const productMap = {
      villa: '🏘️',
      officetel: '🏢',
      apartment: '🏬',
      shop: '🏪',
      building: '🏙️',
    }
    // HTML ID 매핑 (apartment는 aptItem으로 약칭 사용)
    const itemIdMap = {
      villa: 'villaItem',
      officetel: 'officetelItem',
      apartment: 'aptItem',
      shop: 'shopItem',
      building: 'buildingItem',
    }
    const emoji = productMap[type] || ''
    const itemId = itemIdMap[type] || `${type}Item`
    const titleEl = document.querySelector(`#${itemId} .title`)
    if (titleEl) titleEl.textContent = `${emoji} ${productName}`

    // 설명 업데이트
    const descEls = document.querySelectorAll(`#${itemId} .desc`)
    if (descEls.length >= 4) {
      const perUnitText = t('product.desc.perUnit', {
        product: productName,
        amount: perUnitAmount,
      })
      safeHTML(descEls[0], `• ${perUnitText.replace(perUnitAmount, `<b>${perUnitAmount}</b>`)}`)

      const totalText = t('product.desc.total', {
        count,
        unit,
        product: productName,
        amount: totalAmount,
        percent,
      })
      safeHTML(
        descEls[1],
        `• ${totalText.replace(totalAmount, `<b>${totalAmount}</b>`).replace(percent + '%', `<b>${percent}%</b>`)}`
      )

      const lifetimeText = t('product.desc.lifetime', { amount: lifetimeAmount })
      safeHTML(descEls[2], `• ${lifetimeText.replace(lifetimeAmount, `<b>${lifetimeAmount}</b>`)}`)

      const currentPriceText = t('product.desc.currentPrice', { price })
      safeHTML(descEls[3], currentPriceText.replace(price, `<b>${price}</b>`))
    }

    // 기존 ID 요소들 업데이트 (하위 호환성)
    if (incomeEl) incomeEl.textContent = perUnitAmount
    const totalIncomeEl = document.getElementById(`${type}TotalIncome`)
    if (totalIncomeEl) totalIncomeEl.textContent = totalAmount
    const percentEl = document.getElementById(`${type}Percent`)
    if (percentEl) percentEl.textContent = percent + '%'
    const lifetimeEl = document.getElementById(`${type}LifetimeDisplay`)
    if (lifetimeEl) lifetimeEl.textContent = lifetimeAmount
    if (priceEl) priceEl.textContent = price
  }

  return {
    updateUI,
  }
}
