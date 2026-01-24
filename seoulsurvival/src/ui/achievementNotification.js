/**
 * achievementNotification.js - 업적 알림 UI 모듈
 * 업적 해금 시 화면 중앙 알림 표시
 */

/**
 * 업적 알림 표시
 * @param {Object} achievement - 업적 객체
 * @param {Function} t - 번역 함수
 */
export function showAchievementNotification(achievement, t) {
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

  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentElement) {
      notification.parentElement.removeChild(notification)
    }
  }, 3000)
}

/**
 * 업적 체크 및 알림 함수 생성
 * @param {Object} deps - 의존성 객체
 * @returns {Function} checkAchievements 함수
 */
export function createAchievementChecker(deps) {
  const { ACHIEVEMENTS, t, Diary } = deps

  return function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        showAchievementNotification(achievement, t)

        // 업적 번역 키가 없으면 원본 한글 사용 (fallback)
        const achievementName = t(`achievement.${achievement.id}.name`, {}, achievement.name)
        const achievementDesc = t(`achievement.${achievement.id}.desc`, {}, achievement.desc)
        Diary.addLog(t('msg.achievementUnlocked', { name: achievementName, desc: achievementDesc }))
      }
    })
  }
}
