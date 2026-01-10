// 업그레이드 시스템(해금 체크)

/**
 * @param {Record<string, {unlocked:boolean, purchased:boolean, name:string, unlockCondition:Function}>} upgrades
 * @param {{addLog:(msg:string)=>void, onAnyUnlocked?:()=>void}} deps
 */
export function createUpgradeUnlockSystem(upgrades, deps) {
  const { addLog, onAnyUnlocked } = deps

  function checkUpgradeUnlocks() {
    let newUnlocks = 0

    for (const [id, upgrade] of Object.entries(upgrades)) {
      if (upgrade.purchased || upgrade.unlocked) continue

      try {
        if (upgrade.unlockCondition()) {
          upgrade.unlocked = true
          newUnlocks++
          addLog(`🎁 새 업그레이드 해금: ${upgrade.name}`)
        }
      } catch {
        // 해금 조건 평가 실패는 무시(게임 진행 유지)
        // 필요 시 추후 디버그 모드에서만 로깅
      }
    }

    if (newUnlocks > 0 && onAnyUnlocked) {
      onAnyUnlocked()
    }
  }

  return { checkUpgradeUnlocks }
}
