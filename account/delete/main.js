// Account Delete 페이지 메인 진입점
import { renderHeader } from '../../shared/shell/header.js'
import { renderFooter } from '../../shared/shell/footer.js'
import { initHeaderAuth } from '../../shared/shell/headerAuth.js'

document.addEventListener('DOMContentLoaded', async () => {
  const headerMount = document.getElementById('header-mount')
  const footerMount = document.getElementById('footer-mount')

  if (headerMount) {
    renderHeader(headerMount)
    await initHeaderAuth({ scope: 'account-delete' })
  }

  if (footerMount) {
    renderFooter(footerMount)
  }

  // 계정 삭제 버튼 활성화 로직
  initDeleteButtonLogic()
})

// 계정 삭제 버튼 활성화 로직
function initDeleteButtonLogic() {
  const deleteCheckbox = document.getElementById('delete-confirm-checkbox')
  const deleteInput = document.getElementById('delete-confirm-input')
  const deleteBtn = document.getElementById('delete-account-btn')

  if (!deleteCheckbox || !deleteInput || !deleteBtn) return

  function updateDeleteButtonState() {
    const isChecked = deleteCheckbox.checked
    const inputValue = deleteInput.value.trim()

    // 체크박스가 체크되고 입력값이 "DELETE"일 때만 활성화
    if (isChecked && inputValue === 'DELETE') {
      deleteBtn.disabled = false
    } else {
      deleteBtn.disabled = true
    }
  }

  // 이벤트 리스너 등록
  deleteCheckbox.addEventListener('change', updateDeleteButtonState)
  deleteInput.addEventListener('input', updateDeleteButtonState)

  // 초기 상태 설정
  updateDeleteButtonState()
}
