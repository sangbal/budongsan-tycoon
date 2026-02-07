/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHeaderResponsiveManager } from '../headerResponsiveManager.js'

describe('headerResponsiveManager', () => {
  let manager

  beforeEach(() => {
    document.body.innerHTML = ''
    manager = createHeaderResponsiveManager()
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--header-h')
  })

  describe('syncHeaderHeight', () => {
    it('헤더가 없으면 아무것도 하지 않음', () => {
      manager.syncHeaderHeight()
      expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('')
    })

    it('헤더 높이를 CSS 변수로 설정', () => {
      const header = document.createElement('header')
      header.style.height = '60px'
      document.body.appendChild(header)

      // jsdom에서 getBoundingClientRect는 0을 반환하므로 모킹
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 60,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 60,
      })

      manager.syncHeaderHeight()
      expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('60px')
    })

    it('헤더 높이가 0이면 CSS 변수를 설정하지 않음', () => {
      const header = document.createElement('header')
      document.body.appendChild(header)

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 0,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 0,
      })

      manager.syncHeaderHeight()
      expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('')
    })

    it('소수점 높이를 올림 처리', () => {
      const header = document.createElement('header')
      document.body.appendChild(header)

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 60.5,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 60.5,
      })

      manager.syncHeaderHeight()
      expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('61px')
    })
  })

  describe('initResizeListeners', () => {
    it('resize 이벤트 리스너가 등록됨', () => {
      const header = document.createElement('header')
      document.body.appendChild(header)

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 50,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
      })

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      manager.initResizeListeners()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        expect.objectContaining({ passive: true })
      )
    })

    it('초기화 시 syncHeaderHeight가 호출됨', () => {
      const header = document.createElement('header')
      document.body.appendChild(header)

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 70,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 70,
      })

      manager.initResizeListeners()

      expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('70px')
    })
  })
})
