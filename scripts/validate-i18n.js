#!/usr/bin/env node

/**
 * i18n 번역 파일 검증 스크립트
 *
 * 검증 항목:
 * 1. 키 일치 검사 (ko.js 기준, en.js 비교)
 * 2. 중복 키 검출
 * 3. 파라미터 일치 검사 ({count}, {amount} 등)
 * 4. HTML data-i18n 검증
 * 5. JS t() 호출 검증
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
  blue: '\x1b[34m',
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

// 에러/경고 수집
const errors = []
const warnings = []

/**
 * 번역 파일 로드
 */
async function loadTranslations() {
  const translationDirs = [
    path.join(PROJECT_ROOT, 'shared/i18n/translations'),
    path.join(PROJECT_ROOT, 'seoulsurvival/src/i18n/translations'),
  ]

  const translations = {
    shared: {},
    seoulsurvival: {},
  }

  for (const dir of translationDirs) {
    const scope = dir.includes('shared') ? 'shared' : 'seoulsurvival'
    const koPath = path.join(dir, 'ko.js')
    const enPath = path.join(dir, 'en.js')

    if (fs.existsSync(koPath)) {
      const koModule = await import(`file:///${koPath.replace(/\\/g, '/')}`)
      translations[scope].ko = koModule.default
    }

    if (fs.existsSync(enPath)) {
      const enModule = await import(`file:///${enPath.replace(/\\/g, '/')}`)
      translations[scope].en = enModule.default
    }
  }

  return translations
}

/**
 * 객체를 flat한 키 목록으로 변환
 */
function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

/**
 * 파라미터 추출 (예: {count}, {amount})
 */
function extractParameters(text) {
  if (typeof text !== 'string') return []
  const matches = text.match(/\{(\w+)\}/g)
  return matches ? matches.map(m => m.slice(1, -1)) : []
}

/**
 * 1. 키 일치 검사
 */
function validateKeyMatches(translations) {
  log.info('\n🔍 Validating key matches...')

  for (const scope of ['shared', 'seoulsurvival']) {
    const { ko, en } = translations[scope]
    if (!ko || !en) continue

    const koKeys = flattenKeys(ko)
    const enKeys = flattenKeys(en)

    const missingInEn = koKeys.filter(k => !enKeys.includes(k))
    const extraInEn = enKeys.filter(k => !koKeys.includes(k))

    if (missingInEn.length > 0) {
      errors.push(`❌ Missing keys in ${scope}/en.js:\n  - ${missingInEn.join('\n  - ')}`)
    }

    if (extraInEn.length > 0) {
      warnings.push(
        `⚠️ Extra keys in ${scope}/en.js (not in ko.js):\n  - ${extraInEn.join('\n  - ')}`
      )
    }
  }
}

/**
 * 2. 중복 키 검출
 */
function validateDuplicateKeys(translations) {
  log.info('🔍 Checking for duplicate keys...')

  for (const scope of ['shared', 'seoulsurvival']) {
    for (const lang of ['ko', 'en']) {
      const translation = translations[scope][lang]
      if (!translation) continue

      const keys = flattenKeys(translation)
      const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i)

      if (duplicates.length > 0) {
        const uniqueDuplicates = [...new Set(duplicates)]
        errors.push(
          `❌ Duplicate keys in ${scope}/${lang}.js:\n  - ${uniqueDuplicates.join('\n  - ')}`
        )
      }
    }
  }
}

/**
 * 3. 파라미터 일치 검사
 */
function validateParameters(translations) {
  log.info('🔍 Validating parameter consistency...')

  for (const scope of ['shared', 'seoulsurvival']) {
    const { ko, en } = translations[scope]
    if (!ko || !en) continue

    const koKeys = flattenKeys(ko)

    for (const key of koKeys) {
      const koValue = getNestedValue(ko, key)
      const enValue = getNestedValue(en, key)

      if (typeof koValue !== 'string' || typeof enValue !== 'string') continue

      const koParams = extractParameters(koValue)
      const enParams = extractParameters(enValue)

      if (koParams.length !== enParams.length || !koParams.every(p => enParams.includes(p))) {
        warnings.push(
          `⚠️ Parameter mismatch for key '${key}' in ${scope}:\n` +
            `    - ko: ${koParams.length > 0 ? koParams.join(', ') : '(no parameters)'}\n` +
            `    - en: ${enParams.length > 0 ? enParams.join(', ') : '(no parameters)'}`
        )
      }
    }
  }
}

/**
 * 중첩된 객체에서 값 가져오기
 */
function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, k) => acc?.[k], obj)
}

/**
 * 4. HTML data-i18n 검증
 */
function validateHtmlReferences(translations) {
  log.info('🔍 Validating HTML data-i18n references...')

  const htmlPath = path.join(PROJECT_ROOT, 'seoulsurvival/index.html')
  if (!fs.existsSync(htmlPath)) {
    warnings.push('⚠️ HTML file not found: seoulsurvival/index.html')
    return
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
  const dataI18nPattern = /data-i18n="([^"]+)"/g
  const matches = [...htmlContent.matchAll(dataI18nPattern)]
  const htmlKeys = matches.map(m => m[1])

  // 모든 번역 키를 합침
  const allKeys = new Set()
  for (const scope of ['shared', 'seoulsurvival']) {
    if (translations[scope].ko) {
      flattenKeys(translations[scope].ko).forEach(k => allKeys.add(k))
    }
  }

  const missingKeys = htmlKeys.filter(k => !allKeys.has(k))

  if (missingKeys.length > 0) {
    errors.push(
      `❌ HTML references missing translation keys:\n  - ${missingKeys.join('\n  - ')}\n    (in seoulsurvival/index.html)`
    )
  }

  return htmlKeys.length
}

/**
 * 5. JS t() 호출 검증
 */
function validateJsReferences(translations) {
  log.info('🔍 Validating JS t() call references...')

  const srcDir = path.join(PROJECT_ROOT, 'seoulsurvival/src')
  const jsFiles = getAllJsFiles(srcDir)

  const tCallPattern = /\bt\(['"]([^'"]+)['"]\)/g
  const referencedKeys = new Map() // key -> file:line

  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      const matches = [...line.matchAll(tCallPattern)]
      matches.forEach(m => {
        const key = m[1]
        const relativePath = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/')
        referencedKeys.set(key, `${relativePath}:${index + 1}`)
      })
    })
  }

  // 모든 번역 키를 합침
  const allKeys = new Set()
  for (const scope of ['shared', 'seoulsurvival']) {
    if (translations[scope].ko) {
      flattenKeys(translations[scope].ko).forEach(k => allKeys.add(k))
    }
  }

  const missingKeys = []
  for (const [key, location] of referencedKeys.entries()) {
    if (!allKeys.has(key)) {
      missingKeys.push(`  - ${key} (in ${location})`)
    }
  }

  if (missingKeys.length > 0) {
    errors.push(`❌ JS code references missing translation keys:\n${missingKeys.join('\n')}`)
  }

  return referencedKeys.size
}

/**
 * 재귀적으로 모든 .js 파일 찾기
 */
function getAllJsFiles(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files

  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllJsFiles(fullPath))
    } else if (item.endsWith('.js') && !item.endsWith('.test.js')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * 통계 출력
 */
function printSummary(translations, htmlKeyCount, jsRefCount) {
  log.bold('\n' + '='.repeat(60))

  if (errors.length === 0 && warnings.length === 0) {
    log.success('\n✅ i18n validation passed!\n')
  } else {
    log.error('\n❌ i18n validation failed!\n')

    if (errors.length > 0) {
      log.error('Errors found:')
      errors.forEach(e => console.error(e + '\n'))
    }

    if (warnings.length > 0) {
      log.warning('Warnings found:')
      warnings.forEach(w => console.warn(w + '\n'))
    }
  }

  log.bold('Summary:')

  // 각 범위별 키 개수
  for (const scope of ['shared', 'seoulsurvival']) {
    const koKeys = translations[scope].ko ? flattenKeys(translations[scope].ko).length : 0
    const enKeys = translations[scope].en ? flattenKeys(translations[scope].en).length : 0
    console.log(`  - ${scope}: ${koKeys} keys (ko), ${enKeys} keys (en)`)
  }

  // 전체 합계
  const totalKo =
    (translations.shared.ko ? flattenKeys(translations.shared.ko).length : 0) +
    (translations.seoulsurvival.ko ? flattenKeys(translations.seoulsurvival.ko).length : 0)
  const totalEn =
    (translations.shared.en ? flattenKeys(translations.shared.en).length : 0) +
    (translations.seoulsurvival.en ? flattenKeys(translations.seoulsurvival.en).length : 0)

  console.log(`  - Total keys: ${totalKo} (ko), ${totalEn} (en)`)
  console.log(`  - Duplicate keys: ${errors.filter(e => e.includes('Duplicate')).length}`)
  console.log(`  - Missing keys: ${errors.filter(e => e.includes('Missing')).length}`)
  console.log(`  - Parameter mismatches: ${warnings.filter(w => w.includes('Parameter')).length}`)
  console.log(
    `  - HTML references: ${htmlKeyCount || 0} (${errors.filter(e => e.includes('HTML')).length > 0 ? 'some invalid' : 'all valid'})`
  )
  console.log(
    `  - JS t() calls: ${jsRefCount || 0} (${errors.filter(e => e.includes('JS code')).length > 0 ? 'some invalid' : 'all valid'})`
  )

  log.bold('='.repeat(60) + '\n')

  // Exit code
  if (errors.length > 0) {
    process.exit(1)
  }
}

/**
 * 메인 실행
 */
async function main() {
  log.bold('\n' + '='.repeat(60))
  log.bold('i18n Validation Script')
  log.bold('='.repeat(60))

  try {
    const translations = await loadTranslations()

    validateKeyMatches(translations)
    validateDuplicateKeys(translations)
    validateParameters(translations)
    const htmlKeyCount = validateHtmlReferences(translations)
    const jsRefCount = validateJsReferences(translations)

    printSummary(translations, htmlKeyCount, jsRefCount)
  } catch (error) {
    log.error(`\n❌ Fatal error: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
