/**
 * notificationManager.js - 브라우저 알림 관리 모듈
 * 오프라인 수익 등 게임 이벤트를 브라우저 알림으로 표시
 */

export function createNotificationManager(deps = {}) {
  const { toastInfo } = deps

  const lastShownMap = new Map()
  const MIN_INTERVAL_MS = 5 * 60 * 1000 // 5분

  const ICON_PATH = '/seoulsurvival/assets/icons/icon-192x192.png'

  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported'
    try {
      return await Notification.requestPermission()
    } catch {
      return 'default'
    }
  }

  function canShow(tag) {
    if (!tag) return true
    const lastShown = lastShownMap.get(tag)
    if (!lastShown) return true
    return Date.now() - lastShown >= MIN_INTERVAL_MS
  }

  function showNotification(title, body, options = {}) {
    const { tag, icon } = options

    if (tag && !canShow(tag)) return

    if (tag) lastShownMap.set(tag, Date.now())

    // 권한 있음: 네이티브 브라우저 알림
    if (getPermissionStatus() === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: icon || ICON_PATH,
          tag: tag || undefined,
        })
        return
      } catch {
        // 네이티브 알림 실패 시 폴백으로 진행
      }
    }

    // 포그라운드 또는 권한 없을 때: 토스트 폴백
    if (toastInfo) toastInfo(`${title}: ${body}`)
  }

  function getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  }

  return {
    requestPermission,
    showNotification,
    canShow,
    getPermissionStatus,
  }
}
