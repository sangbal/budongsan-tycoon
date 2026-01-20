/**
 * KIMCHI INVASION - PixiJS Application Wrapper
 *
 * @description PixiJS 8.x Application 초기화 및 관리
 * @see https://pixijs.com/8.x/guides
 */

import { Application, Container } from 'pixi.js'

/**
 * @typedef {Object} PixiAppConfig
 * @property {HTMLCanvasElement} [canvas] - 기존 캔버스 엘리먼트 (선택)
 * @property {number} [width] - 캔버스 너비 (기본: 창 크기)
 * @property {number} [height] - 캔버스 높이 (기본: 창 크기)
 * @property {number} [backgroundColor] - 배경색 (기본: 0x0D1117)
 * @property {boolean} [antialias] - 안티앨리어싱 (기본: true)
 * @property {boolean} [autoDensity] - 자동 픽셀 밀도 (기본: true)
 * @property {number} [resolution] - 해상도 (기본: devicePixelRatio)
 */

/** @type {Application | null} */
let app = null

/** @type {Container | null} */
let gameContainer = null

/** @type {Container | null} */
let uiContainer = null

/**
 * PixiJS Application 초기화
 * @param {PixiAppConfig} [config={}]
 * @returns {Promise<Application>}
 */
export async function initPixiApp(config = {}) {
  if (app) {
    console.warn('[PixiApp] Already initialized')
    return app
  }

  const {
    canvas,
    width = window.innerWidth,
    height = window.innerHeight,
    backgroundColor = 0x0d1117, // Space Black
    antialias = true,
    autoDensity = true,
    resolution = window.devicePixelRatio || 1,
  } = config

  // Create Application
  app = new Application()

  // Initialize with config
  await app.init({
    canvas,
    width,
    height,
    backgroundColor,
    antialias,
    autoDensity,
    resolution,
    preference: 'webgl', // WebGL 우선 (WebGPU 폴백)
  })

  // Create layer containers
  // Game layer: 타일맵, 건물, 자원, 이펙트
  gameContainer = new Container()
  gameContainer.label = 'game'
  app.stage.addChild(gameContainer)

  // UI layer: HUD, 메뉴, 툴팁 (항상 최상단)
  uiContainer = new Container()
  uiContainer.label = 'ui'
  app.stage.addChild(uiContainer)

  // Window resize handling
  const resizeHandler = () => {
    if (app) {
      app.renderer.resize(window.innerWidth, window.innerHeight)
    }
  }
  window.addEventListener('resize', resizeHandler)

  console.log(
    `[PixiApp] Initialized - ${width}x${height} @ ${resolution}x (WebGL ${app.renderer.type === 1 ? '2' : '1'})`
  )

  return app
}

/**
 * PixiJS Application 인스턴스 반환
 * @returns {Application | null}
 */
export function getApp() {
  return app
}

/**
 * 게임 레이어 컨테이너 반환
 * @returns {Container | null}
 */
export function getGameContainer() {
  return gameContainer
}

/**
 * UI 레이어 컨테이너 반환
 * @returns {Container | null}
 */
export function getUIContainer() {
  return uiContainer
}

/**
 * PixiJS Renderer 반환
 * @returns {import('pixi.js').Renderer | null}
 */
export function getRenderer() {
  return app?.renderer || null
}

/**
 * PixiJS Stage 반환
 * @returns {Container | null}
 */
export function getStage() {
  return app?.stage || null
}

/**
 * 화면 크기 반환
 * @returns {{ width: number, height: number }}
 */
export function getScreenSize() {
  if (!app) return { width: 0, height: 0 }
  return {
    width: app.screen.width,
    height: app.screen.height,
  }
}

/**
 * PixiJS Application 정리
 */
export function destroyPixiApp() {
  if (app) {
    app.destroy(true, { children: true, texture: true })
    app = null
    gameContainer = null
    uiContainer = null
    console.log('[PixiApp] Destroyed')
  }
}

/**
 * FPS 통계 표시 (개발용)
 * @param {boolean} show
 */
export function showStats(show = true) {
  if (!app) return

  // PixiJS 8은 별도 stats 모듈 필요
  // 개발 중에는 브라우저 DevTools 사용 권장
  if (show && import.meta.env.DEV) {
    console.log('[PixiApp] Use browser DevTools for performance stats')
  }
}
