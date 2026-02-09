// shared/shell/headerLanguage.js
// 헤더 언어 선택 기능

import { applyLang, getActiveLang } from '../i18n/lang.js'

/**
 * 헤더 언어 선택 드롭다운을 초기화합니다.
 * @param {HTMLElement} container - 헤더 컨테이너
 */
export function initLanguageSelector(container) {
  if (!container) return

  const langSelect = container.querySelector('#headerLanguageSelect')
  if (!langSelect) return

  // 현재 언어 설정
  const currentLang = getActiveLang()
  langSelect.value = currentLang

  // 언어 변경 이벤트 핸들러
  const handleChange = e => {
    const newLang = e.target.value
    if (typeof newLang === 'string' && newLang) {
      applyLang(newLang)
    } else {
      console.warn('[headerLanguage] Invalid language value:', newLang)
    }
  }

  // 기존 이벤트 리스너 제거 (중복 방지)
  if (langSelect._languageChangeHandler) {
    langSelect.removeEventListener('change', langSelect._languageChangeHandler)
  }

  // 새 이벤트 리스너 등록
  langSelect.addEventListener('change', handleChange)
  langSelect._languageChangeHandler = handleChange // 참조 저장
}
