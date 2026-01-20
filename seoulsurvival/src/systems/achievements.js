// 업적 시스템
import { t } from '../i18n/index.js'

/**
 * @param {Array<{unlocked:boolean, condition:Function, name:string, desc:string}>} achievements
 * @param {{notify:(achievement:any)=>void, addLog:(msg:string)=>void}} deps
 */
export function createAchievementsSystem(achievements, deps) {
  const { notify, addLog } = deps

  function checkAchievements() {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        notify(achievement)
        addLog(t('msg.achievementUnlocked', { name: achievement.name, desc: achievement.desc }))
      }
    })
  }

  return { checkAchievements }
}
