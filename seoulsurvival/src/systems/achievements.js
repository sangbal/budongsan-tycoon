// 업적 시스템
import { t } from '../i18n/index.js'

/**
 * @param {Array<{unlocked:boolean, condition:Function, name:string, desc:string}>} achievements
 * @param {{notify:(achievement:any)=>void, addLog:(msg:string)=>void, shareCallback?:(context:any)=>void}} deps
 */
export function createAchievementsSystem(achievements, deps) {
  const { notify, addLog, shareCallback } = deps

  function checkAchievements() {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        // shareCallback을 notify에 전달
        notify(achievement, shareCallback)
        addLog(t('msg.achievementUnlocked', { name: achievement.name, desc: achievement.desc }))
      }
    })
  }

  return { checkAchievements }
}
