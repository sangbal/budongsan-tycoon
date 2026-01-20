import './index.css'
import { SpriteBenchmark } from './benchmark/sprite-benchmark.ts'

// Simple Benchmark Runner Entry Point
async function run() {
  console.log('Initializing Technical Benchmark...')

  // Clear any existing DOM content
  const root = document.getElementById('root')
  if (root) root.innerHTML = ''
  const loading = document.getElementById('loading-screen')
  if (loading) loading.style.display = 'none'

  // Run Benchmark
  const benchmark = new SpriteBenchmark()
  await benchmark.init()

  // Auto-start suite
  await benchmark.runFullSuite()
}

run().catch(console.error)
