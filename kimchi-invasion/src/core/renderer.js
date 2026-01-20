/**
 * KIMCHI INVASION - Renderer Module
 *
 * Handles all rendering using Canvas 2D / WebGL.
 * Can be upgraded to PixiJS when needed.
 */

let canvas = null
let ctx = null
let renderer = null

// Render config
const config = {
  width: 0,
  height: 0,
  pixelRatio: 1,
  clearColor: '#1a1a2e',
}

/**
 * Initialize the renderer
 */
export async function initRenderer(canvasElement) {
  canvas = canvasElement

  if (!canvas) {
    throw new Error('Canvas element not found')
  }

  // Try WebGL2 first, fall back to 2D
  ctx = canvas.getContext('webgl2')

  if (!ctx) {
    console.log('[Renderer] WebGL2 not available, using Canvas 2D')
    ctx = canvas.getContext('2d')
    renderer = 'canvas2d'
  } else {
    renderer = 'webgl2'
  }

  // Setup resize handling
  setupResize()

  // Initial resize
  resize()

  console.log(`[Renderer] Initialized (${renderer})`)
  return { canvas, ctx, renderer }
}

/**
 * Setup resize handling
 */
function setupResize() {
  const resizeObserver = new ResizeObserver(() => {
    resize()
  })

  resizeObserver.observe(canvas.parentElement)

  // Also handle window resize
  window.addEventListener('resize', resize)
}

/**
 * Resize canvas to fit container
 */
function resize() {
  if (!canvas) return

  const parent = canvas.parentElement
  const rect = parent.getBoundingClientRect()

  config.pixelRatio = Math.min(window.devicePixelRatio, 2)
  config.width = rect.width
  config.height = rect.height

  canvas.width = config.width * config.pixelRatio
  canvas.height = config.height * config.pixelRatio
  canvas.style.width = `${config.width}px`
  canvas.style.height = `${config.height}px`

  if (renderer === 'canvas2d' && ctx) {
    ctx.scale(config.pixelRatio, config.pixelRatio)
  }

  console.log(`[Renderer] Resized to ${config.width}x${config.height}`)
}

/**
 * Clear the canvas
 */
export function clear() {
  if (!ctx) return

  if (renderer === 'canvas2d') {
    ctx.fillStyle = config.clearColor
    ctx.fillRect(0, 0, config.width, config.height)
  } else {
    // WebGL clear
    // ctx.clearColor(0.1, 0.1, 0.18, 1.0);
    // ctx.clear(ctx.COLOR_BUFFER_BIT);
  }
}

/**
 * Get canvas dimensions
 */
export function getDimensions() {
  return {
    width: config.width,
    height: config.height,
    pixelRatio: config.pixelRatio,
  }
}

/**
 * Get rendering context
 */
export function getContext() {
  return ctx
}

/**
 * Get renderer type
 */
export function getRendererType() {
  return renderer
}

/**
 * Draw a rectangle (2D only)
 */
export function drawRect(x, y, width, height, color) {
  if (renderer !== 'canvas2d' || !ctx) return

  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

/**
 * Draw text (2D only)
 */
export function drawText(text, x, y, options = {}) {
  if (renderer !== 'canvas2d' || !ctx) return

  const { color = '#ffffff', font = '16px Inter', align = 'left', baseline = 'top' } = options

  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.fillText(text, x, y)
}

/**
 * Draw a sprite/image (2D only)
 */
export function drawSprite(image, x, y, width, height) {
  if (renderer !== 'canvas2d' || !ctx) return

  ctx.drawImage(image, x, y, width, height)
}

/**
 * Begin a new render frame
 */
export function beginFrame() {
  clear()
}

/**
 * End the render frame
 */
export function endFrame() {
  // Placeholder for any end-of-frame operations
}
