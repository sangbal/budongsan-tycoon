/**
 * achievementNotification.js - 업적 알림 UI 모듈
 * 업적 해금 시 화면 중앙 알림 표시
 */

/**
 * 업적 알림 표시
 * @param {Object} achievement - 업적 객체
 * @param {Function} t - 번역 함수
 * @param {Function} shareCallback - 공유 콜백 함수 (선택)
 */
export function showAchievementNotification(achievement, t, shareCallback = null) {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    padding: 20px 30px;
    border-radius: 15px;
    font-weight: bold;
    z-index: 2000;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: achievementPop 1s ease-out;
  `

  // 번역 키가 없으면 fallback으로 한글 사용
  const achievementName = t(`achievement.${achievement.id}.name`)
  const achievementDesc = t(`achievement.${achievement.id}.desc`)

  // XSS 방지: innerHTML 대신 DOM API 사용
  const iconDiv = document.createElement('div')
  iconDiv.style.cssText = 'font-size: 24px; margin-bottom: 10px;'
  iconDiv.textContent = '🏆'

  const nameDiv = document.createElement('div')
  nameDiv.style.cssText = 'font-size: 18px; margin-bottom: 5px;'
  nameDiv.textContent = achievementName

  const descDiv = document.createElement('div')
  descDiv.style.cssText = 'font-size: 14px; opacity: 0.8;'
  descDiv.textContent = achievementDesc

  notification.appendChild(iconDiv)
  notification.appendChild(nameDiv)
  notification.appendChild(descDiv)

  // 공유 버튼 추가 (shareCallback 제공 시)
  if (shareCallback && typeof shareCallback === 'function') {
    const shareBtn = document.createElement('button')
    shareBtn.style.cssText = `
      margin-top: 10px;
      padding: 6px 12px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      font-weight: bold;
    `
    shareBtn.textContent = t('share.brag')

    // 호버 효과 (인라인 스타일로 처리)
    shareBtn.addEventListener('mouseenter', () => {
      shareBtn.style.background = 'rgba(255, 255, 255, 0.5)'
    })
    shareBtn.addEventListener('mouseleave', () => {
      shareBtn.style.background = 'rgba(255, 255, 255, 0.3)'
    })

    // 클릭 이벤트
    shareBtn.addEventListener('click', () => {
      shareCallback({
        type: 'achievement',
        name: achievementName,
        achievementId: achievement.id,
      })
    })

    notification.appendChild(shareBtn)
  }

  document.body.appendChild(notification)

  // 팝업 지속 시간: 3초 → 5초로 연장
  setTimeout(() => {
    if (notification.parentElement) {
      notification.parentElement.removeChild(notification)
    }
  }, 5000)
}

/**
 * 업적 체크 및 알림 함수 생성
 * @param {Object} deps - 의존성 객체
 * @returns {Function} checkAchievements 함수
 */
export function createAchievementChecker(deps) {
  const { ACHIEVEMENTS, t, Diary, shareCallback } = deps

  return function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        showAchievementNotification(achievement, t, shareCallback)

        // 업적 번역 키가 없으면 원본 한글 사용 (fallback)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }
}
