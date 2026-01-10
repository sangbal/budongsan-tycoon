// 연결된 계정 페이지
import { renderHeader } from '../../shared/shell/header.js'
import { renderFooter } from '../../shared/shell/footer.js'
import { initHeaderAuth } from '../../shared/shell/headerAuth.js'

document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount')
  const footerMount = document.getElementById('footer-mount')

  if (headerMount) {
    renderHeader(headerMount)
    await initHeaderAuth({ scope: 'account-connected' })
  }

  if (footerMount) {
    renderFooter(footerMount)
  }

  // 연결된 계정 정보 표시
  const { getUser } = await import('../../shared/auth/core.js')
  const user = await getUser()
  const isLoggedIn = !!user

  const connectedAccountName = document.getElementById('connected-account-name')
  const connectedAccountStatus = document.getElementById('connected-account-status')

  if (!isLoggedIn) {
    if (connectedAccountStatus) {
      connectedAccountStatus.innerHTML =
        '<span class="status-badge status-inactive">연결 안 됨</span>'
    }
    return
  }

  const provider = user?.app_metadata?.provider || 'google'
  const providerName = provider === 'google' ? 'Google' : provider

  if (connectedAccountName) {
    connectedAccountName.textContent = providerName
  }

  if (connectedAccountStatus) {
    connectedAccountStatus.innerHTML = '<span class="status-badge status-active">연결됨</span>'
  }
})
