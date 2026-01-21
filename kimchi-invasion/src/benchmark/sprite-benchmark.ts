import * as PIXI from 'pixi.js'

export interface BenchmarkResult {
  scenario: string
  spriteCount: number
  avgFps: number
  minFps: number
  p1Fps: number
  heapUsedMB: number
  drawCalls: number
  passed: boolean
}

export class SpriteBenchmark {
  private app: PIXI.Application
  private sprites: PIXI.Sprite[] = []
  private fpsHistory: number[] = []
  private running = false

  constructor() {
    this.app = new PIXI.Application()
  }

  async init() {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a1a2e,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
    })
    document.body.appendChild(this.app.canvas as HTMLCanvasElement)
  }

  // Generate a simple texture programmatically to avoid loading external assets for now
  private createPlaceholderTexture(): PIXI.Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#4CAF50' // Green cabbage color
      ctx.fillRect(0, 0, 32, 32)
      ctx.fillStyle = '#81C784'
      ctx.fillRect(8, 8, 16, 16)
    }
    return PIXI.Texture.from(canvas)
  }

  async createSprites(count: number, moving: boolean = false): Promise<void> {
    // For the benchmark, we can primarily use a procedural texture to test raw rendering,
    // or try to load the generated asset if available.
    // Let's use the procedural one for absolute reliability in this script first.
    const texture = this.createPlaceholderTexture()

    for (let i = 0; i < count; i++) {
      const sprite = new PIXI.Sprite(texture)
      sprite.x = Math.random() * this.app.screen.width
      sprite.y = Math.random() * this.app.screen.height
      sprite.anchor.set(0.5)

      if (moving) {
        ;(sprite as any).vx = (Math.random() - 0.5) * 4
        ;(sprite as any).vy = (Math.random() - 0.5) * 4
      }

      this.app.stage.addChild(sprite)
      this.sprites.push(sprite)
    }
  }

  async runBenchmark(
    scenario: string,
    spriteCount: number,
    durationMs: number = 5000 // Shortened for quick feedback
  ): Promise<BenchmarkResult> {
    this.fpsHistory = []
    this.running = true

    const startTime = performance.now()

    // Use Pixi's ticker for consistent loop
    const tickerCallback = (ticker: PIXI.Ticker) => {
      if (!this.running) return

      const now = performance.now()

      // FPS recording (using ticker.FPS is easier but let's manual for accuracy per plan)
      this.fpsHistory.push(ticker.FPS)

      if (this.sprites.length > 0 && (this.sprites[0] as any).vx !== undefined) {
        for (const sprite of this.sprites) {
          sprite.x += (sprite as any).vx
          sprite.y += (sprite as any).vy

          if (sprite.x < 0 || sprite.x > this.app.screen.width) (sprite as any).vx *= -1
          if (sprite.y < 0 || sprite.y > this.app.screen.height) (sprite as any).vy *= -1
        }
      }

      if (now - startTime >= durationMs) {
        this.running = false
      }
    }

    this.app.ticker.add(tickerCallback)

    // Wait for duration
    await new Promise(resolve => setTimeout(resolve, durationMs + 100))

    this.app.ticker.remove(tickerCallback)

    // Calculate Results
    const sortedFps = [...this.fpsHistory].sort((a, b) => a - b)
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
    const minFps = sortedFps[0] || 0
    const p1Index = Math.floor(sortedFps.length * 0.01)
    const p1Fps = sortedFps[p1Index] || 0

    const memory = (performance as any).memory
    const heapUsedMB = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0

    const passed = avgFps >= 55 // Forgiving threshold for test

    return {
      scenario,
      spriteCount,
      avgFps: Math.round(avgFps * 10) / 10,
      minFps: Math.round(minFps * 10) / 10,
      p1Fps: Math.round(p1Fps * 10) / 10,
      heapUsedMB: Math.round(heapUsedMB),
      drawCalls: 0, // Difficult to get precisely in v8 without debug plugin
      passed,
    }
  }

  cleanup(): void {
    try {
      // Destroy sprites but keep texture to avoid reloading issues
      this.app.stage.removeChildren()
      this.sprites = []
    } catch (e) {
      console.error('Cleanup error', e)
    }
  }

  async runFullSuite(): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = []
    const counts = [1000, 3000, 5000, 10000]

    // Create UI overlay for status
    const statusDiv = document.createElement('div')
    statusDiv.style.position = 'absolute'
    statusDiv.style.top = '10px'
    statusDiv.style.left = '10px'
    statusDiv.style.color = 'white'
    statusDiv.style.background = 'rgba(0,0,0,0.7)'
    statusDiv.style.padding = '10px'
    statusDiv.style.fontFamily = 'monospace'
    document.body.appendChild(statusDiv)

    const log = (msg: string) => {
      console.log(msg)
      statusDiv.innerHTML += `<div>${msg}</div>`
    }

    log('=== STARTING BENCHMARK SUITE ===')

    for (const count of counts) {
      log(`Testing ${count} Moving Sprites...`)

      this.cleanup()
      await this.createSprites(count, true)

      const result = await this.runBenchmark(`moving_${count}`, count)
      results.push(result)

      const status = result.passed
        ? '<span style="color:lime">PASS</span>'
        : '<span style="color:red">FAIL</span>'
      log(`Result: ${result.avgFps} FPS - ${status}`)
    }

    log('=== BENCHMARK COMPLETE ===')

    // Summary Table
    let tableHtml =
      '<table border="1" style="border-collapse: collapse; margin-top: 10px;"><tr><th>Count</th><th>FPS</th><th>Result</th></tr>'
    results.forEach(r => {
      tableHtml += `<tr><td>${r.spriteCount}</td><td>${r.avgFps}</td><td>${r.passed ? 'PASS' : 'FAIL'}</td></tr>`
    })
    tableHtml += '</table>'
    statusDiv.innerHTML += tableHtml

    return results
  }
}
