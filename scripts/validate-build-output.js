#!/usr/bin/env node

/**
 * 빌드 산출물 검증 스크립트
 *
 * 검증 항목:
 * 1. 필수 파일 존재 여부
 * 2. 빈 파일 체크 (크기 > 0)
 * 3. 파일 크기 출력 (KB 단위)
 *
 * 사용 시점: npm run build 이후, GitHub Pages 배포 전
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// 색상 출력 (ANSI codes)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

const log = {
  error: msg => console.error(`${colors.red}${msg}${colors.reset}`),
  success: msg => console.log(`${colors.green}${msg}${colors.reset}`),
  warning: msg => console.warn(`${colors.yellow}${msg}${colors.reset}`),
  info: msg => console.log(`${colors.cyan}${msg}${colors.reset}`),
  bold: msg => console.log(`${colors.bold}${msg}${colors.reset}`),
}

/**
 * 필수 파일 목록
 * 배포 전 반드시 존재해야 하는 파일들
 */
const requiredFiles = [
  'dist/index.html', // 허브 페이지
  'dist/CNAME', // 도메인 설정 (GitHub Pages)
  'dist/seoulsurvival/index.html', // Seoul Survival 게임
  'dist/kimchi-invasion/index.html', // Kimchi Invasion 게임
]

/**
 * 파일 크기를 KB 단위로 포맷
 * @param {number} bytes - 파일 크기 (bytes)
 * @returns {string} - "12.34 KB" 형태의 문자열
 */
function formatFileSize(bytes) {
  const kb = bytes / 1024
  return kb.toFixed(2) + ' KB'
}

/**
 * 파일 존재 및 크기 검증
 * @param {string} relativePath - dist/ 기준 상대 경로
 * @returns {Object} - { exists: boolean, size: number, path: string }
 */
function validateFile(relativePath) {
  const fullPath = path.join(PROJECT_ROOT, relativePath)

  try {
    const stats = fs.statSync(fullPath)
    return {
      exists: true,
      size: stats.size,
      path: relativePath,
      isEmpty: stats.size === 0,
    }
  } catch (error) {
    return {
      exists: false,
      size: 0,
      path: relativePath,
      isEmpty: false,
    }
  }
}

/**
 * 모든 필수 파일 검증
 */
function validateAllFiles() {
  log.bold('\n' + '='.repeat(60))
  log.bold('Build Output Validation')
  log.bold('='.repeat(60) + '\n')

  const results = []
  let hasErrors = false

  for (const file of requiredFiles) {
    const result = validateFile(file)
    results.push(result)

    if (!result.exists) {
      log.error(`❌ ${file} not found`)
      hasErrors = true
    } else if (result.isEmpty) {
      log.error(`❌ ${file} is empty (0 bytes)`)
      hasErrors = true
    } else {
      log.success(`✅ ${file} exists (${formatFileSize(result.size)})`)
    }
  }

  // 요약
  log.bold('\n' + '='.repeat(60))

  if (hasErrors) {
    log.error('\n❌ Validation failed: Some required files are missing or empty\n')

    const missingFiles = results.filter(r => !r.exists || r.isEmpty)
    log.error('Failed files:')
    missingFiles.forEach(r => {
      if (!r.exists) {
        console.error(`  - ${r.path} (not found)`)
      } else if (r.isEmpty) {
        console.error(`  - ${r.path} (empty file)`)
      }
    })

    log.bold('\n' + '='.repeat(60) + '\n')
    process.exit(1)
  } else {
    log.success('\n✅ All required files present!\n')

    // 전체 크기 계산
    const totalSize = results.reduce((sum, r) => sum + r.size, 0)
    const totalSizeKB = (totalSize / 1024).toFixed(2)

    log.info('Summary:')
    console.log(`  - Total files: ${results.length}`)
    console.log(`  - Total size: ${totalSizeKB} KB`)

    log.bold('='.repeat(60) + '\n')
    process.exit(0)
  }
}

/**
 * 메인 실행
 */
function main() {
  validateAllFiles()
}

main()
