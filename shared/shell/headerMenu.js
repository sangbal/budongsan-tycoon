// shared/shell/headerMenu.js
// 헤더 모바일/데스크톱 메뉴 상호작용

/**
 * 헤더 계정 메뉴 이벤트를 초기화합니다.
 * @param {HTMLElement} container - 헤더가 렌더링된 컨테이너
 */
export function initHeaderMenu(container) {
  if (!container) return

  const accountMenu = container.querySelector('#headerAccountMenu')
  let dropdown = container.querySelector('#headerAccountDropdown')
  let overlay = container.querySelector('#headerAccountOverlay')
  const accountBtn = container.querySelector('#headerAccountBtn')

  if (!accountMenu || !dropdown) return

  // 모바일/데스크톱 감지 함수
  function isMobile() {
    return window.innerWidth <= 768
  }

  // 모바일에서 바텀시트와 오버레이를 body에 직접 렌더링
  function ensureMobileMenuInBody() {
    if (isMobile()) {
      if (dropdown && dropdown.parentElement === document.body) return
      if (dropdown && dropdown.parentElement !== document.body) {
        document.body.appendChild(dropdown)
      }
      if (overlay && overlay.parentElement !== document.body) {
        document.body.appendChild(overlay)
      }
    } else {
      if (dropdown && dropdown.parentElement === document.body && accountMenu) {
        accountMenu.appendChild(dropdown)
      }
      if (overlay && overlay.parentElement === document.body && accountMenu) {
        accountMenu.appendChild(overlay)
      }
    }
  }

  // 모바일 메뉴 열기
  function openMobileMenu() {
    ensureMobileMenuInBody()

    if (dropdown) {
      dropdown.style.display = 'block'
      dropdown.style.position = 'fixed'
      dropdown.style.bottom = '0'
      dropdown.style.left = '0'
      dropdown.style.right = '0'
      dropdown.style.top = 'auto'
      dropdown.style.zIndex = '10000'
      dropdown.style.margin = '0'
      dropdown.style.transform = 'translateY(100%)'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (dropdown) {
            dropdown.classList.add('show')
          }
        })
      })
    }
    if (overlay) {
      overlay.style.display = 'block'
      overlay.style.zIndex = '9999'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.right = '0'
      overlay.style.bottom = '0'
    }
    document.body.style.overflow = 'hidden'
  }

  // 모바일 메뉴 닫기
  function closeMobileMenu() {
    if (dropdown) {
      dropdown.classList.remove('show')
      dropdown.style.transform = 'translateY(100%)'
      setTimeout(() => {
        if (dropdown) {
          dropdown.style.display = 'none'
        }
      }, 300)
    }
    if (overlay) {
      overlay.style.display = 'none'
    }
    document.body.style.overflow = ''
  }

  // 초기 설정
  ensureMobileMenuInBody()

  // 초기 상태: 드롭다운 숨김
  if (dropdown) dropdown.style.display = 'none'
  if (overlay) overlay.style.display = 'none'

  // 창 크기 변경 시 재설정
  window.addEventListener('resize', () => {
    ensureMobileMenuInBody()
    if (!isMobile() && dropdown.style.display === 'block') {
      closeMobileMenu()
    }
  })

  // 계정 버튼 클릭 이벤트
  if (accountBtn) {
    accountBtn.addEventListener('click', e => {
      e.stopPropagation()
      if (isMobile()) {
        if (dropdown.style.display === 'block') {
          closeMobileMenu()
        } else {
          openMobileMenu()
        }
      } else {
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none'
        } else {
          dropdown.style.display = 'block'
        }
      }
    })
  }

  // 모바일: 오버레이 클릭 시 메뉴 닫기
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (isMobile()) {
        closeMobileMenu()
      }
    })
  }

  // 모바일: 메뉴 항목 클릭 시 메뉴 닫기
  const menuItems = dropdown.querySelectorAll('.account-menu-item')
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isMobile()) {
        setTimeout(() => closeMobileMenu(), 100)
      }
    })
  })
}
