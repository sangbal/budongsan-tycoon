#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import { join, basename, sep } from 'path'

// ANSI 색상 코드
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
}

const PROJECT_ROOT = process.cwd()
const SCAN_DIRS = ['seoulsurvival/src', 'kimchi-invasion/src', 'shared']
const ARCH_DOC = '.claude/docs/architecture.md'

// 허용된 중복 파일명
const ALLOWED_DUPLICATES = new Set([
  'index.js',
  'achievements.js',
  'financial.js',
  'property.js',
  'upgrades.js',
  'achievements.test.js', // data/ vs systems/ 테스트
  'en.js', // 각 게임별 번역 파일
  'ko.js', // 각 게임별 번역 파일
  'main.js', // 각 게임별 엔트리포인트
  'storage.js', // 각 게임별 스토리지
])

let errors = 0
let warnings = 0

/**
 * 디렉토리를 재귀적으로 순회하며 파일 경로를 yield
 * @param {string} dir - 시작 디렉토리
 * @yields {string} 파일 절대 경로
 */
async function* walkFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        // node_modules, .git 등 무시
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue
        }
        yield* walkFiles(fullPath)
      } else if (entry.isFile()) {
        yield fullPath
      }
    }
  } catch (err) {
    // 디렉토리가 없거나 권한 문제가 있을 수 있음
    console.warn(`${colors.yellow}⚠️  경고: ${dir} 스캔 실패 (${err.message})${colors.reset}`)
  }
}

/**
 * 검증 1: 테스트 파일이 __tests__/ 외부에 있는지 확인
 */
async function checkTestFileLocations() {
  console.log('\n[1/3] 테스트 파일 위치 검증')

  const misplacedTests = []

  for (const scanDir of SCAN_DIRS) {
    const fullDir = join(PROJECT_ROOT, scanDir)

    for await (const file of walkFiles(fullDir)) {
      if (file.endsWith('.test.js')) {
        const relativePath = file.replace(PROJECT_ROOT + sep, '')

        // __tests__ 폴더 안에 있지 않으면 에러
        if (!relativePath.includes(`${sep}__tests__${sep}`)) {
          misplacedTests.push(relativePath)
        }
      }
    }
  }

  if (misplacedTests.length > 0) {
    console.log(`  ${colors.red}❌ 테스트 파일이 __tests__/ 밖에 위치:${colors.reset}`)
    misplacedTests.forEach(file => {
      console.log(`     ${file}`)
    })
    errors += misplacedTests.length
    return false
  } else {
    console.log(`  ${colors.green}✅ 모든 테스트 파일이 __tests__/ 내에 위치${colors.reset}`)
    return true
  }
}

/**
 * 검증 2: 파일명 중복 확인 (허용 목록 제외)
 */
async function checkDuplicateFilenames() {
  console.log('\n[2/3] 파일명 중복 검증')

  const fileMap = new Map() // basename -> [paths]

  for (const scanDir of SCAN_DIRS) {
    const fullDir = join(PROJECT_ROOT, scanDir)

    for await (const file of walkFiles(fullDir)) {
      // .js 파일만 검사
      if (!file.endsWith('.js')) continue

      const base = basename(file)
      const relativePath = file.replace(PROJECT_ROOT + sep, '')

      if (!fileMap.has(base)) {
        fileMap.set(base, [])
      }
      fileMap.get(base).push(relativePath)
    }
  }

  const duplicates = []

  for (const [base, paths] of fileMap.entries()) {
    // 중복이고 허용 목록에 없으면 에러
    if (paths.length > 1 && !ALLOWED_DUPLICATES.has(base)) {
      duplicates.push({ base, paths })
    }
  }

  if (duplicates.length > 0) {
    console.log(`  ${colors.red}❌ 중복 파일명 발견:${colors.reset}`)
    duplicates.forEach(({ base, paths }) => {
      console.log(`     ${base}:`)
      paths.forEach(p => console.log(`       - ${p}`))
    })
    errors += duplicates.length
    return false
  } else {
    console.log(`  ${colors.green}✅ 중복 파일명 없음${colors.reset}`)
    return true
  }
}

/**
 * 검증 3: 디렉토리가 architecture.md에 문서화되어 있는지 확인
 */
async function checkDirectoryDocumentation() {
  console.log('\n[3/3] 디렉토리 문서화 검증')

  const sourceDir = join(PROJECT_ROOT, 'seoulsurvival', 'src')
  const archDocPath = join(PROJECT_ROOT, ARCH_DOC)

  let archContent
  try {
    archContent = await readFile(archDocPath, 'utf-8')
  } catch (err) {
    console.log(`  ${colors.yellow}⚠️  경고: ${ARCH_DOC} 읽기 실패 (${err.message})${colors.reset}`)
    warnings++
    return false
  }

  let dirs
  try {
    const entries = await readdir(sourceDir, { withFileTypes: true })
    dirs = entries
      .filter(e => e.isDirectory())
      .filter(e => !e.name.startsWith('.'))
      .map(e => e.name)
  } catch (err) {
    console.log(
      `  ${colors.yellow}⚠️  경고: seoulsurvival/src/ 스캔 실패 (${err.message})${colors.reset}`
    )
    warnings++
    return false
  }

  const undocumented = dirs.filter(dir => {
    // architecture.md에 디렉토리명이 언급되어 있는지 확인
    return !archContent.includes(dir)
  })

  if (undocumented.length > 0) {
    console.log(
      `  ${colors.yellow}⚠️  경고: 다음 디렉토리가 architecture.md에 미언급:${colors.reset}`
    )
    undocumented.forEach(dir => {
      console.log(`     - ${dir}`)
    })
    warnings += undocumented.length
    return false
  } else {
    console.log(`  ${colors.green}✅ 모든 주요 디렉토리가 문서화됨${colors.reset}`)
    return true
  }
}

/**
 * 메인 실행
 */
async function main() {
  console.log(`${colors.blue}🔍 코드 구조 검증 시작...${colors.reset}`)

  await checkTestFileLocations()
  await checkDuplicateFilenames()
  await checkDirectoryDocumentation()

  console.log('\n' + '='.repeat(50))

  if (errors > 0) {
    console.log(`${colors.red}❌ 구조 검증 실패! (에러 ${errors}, 경고 ${warnings})${colors.reset}`)
    process.exit(1)
  } else if (warnings > 0) {
    console.log(`${colors.yellow}⚠️  구조 검증 완료! (에러 0, 경고 ${warnings})${colors.reset}`)
    process.exit(0)
  } else {
    console.log(`${colors.green}✅ 구조 검증 완료! (에러 0, 경고 0)${colors.reset}`)
    process.exit(0)
  }
}

main().catch(err => {
  console.error(`${colors.red}❌ 치명적 오류: ${err.message}${colors.reset}`)
  console.error(err.stack)
  process.exit(1)
})
