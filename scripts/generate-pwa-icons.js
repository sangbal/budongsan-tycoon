#!/usr/bin/env node

/**
 * PWA 아이콘 생성 스크립트
 * 원본: seoulsurvival/assets/images/logo.png
 * 출력: seoulsurvival/assets/icons/
 */

import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// 경로 설정
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')
const sourceLogo = path.join(projectRoot, 'seoulsurvival/assets/images/logo.png')
const outputDir = path.join(projectRoot, 'seoulsurvival/assets/icons')

// 아이콘 설정
const icons = [
  {
    name: 'icon-96x96.png',
    size: 96,
    maskable: false,
  },
  {
    name: 'icon-192x192.png',
    size: 192,
    maskable: false,
  },
  {
    name: 'icon-192x192-maskable.png',
    size: 192,
    maskable: true,
  },
  {
    name: 'icon-512x512.png',
    size: 512,
    maskable: false,
  },
  {
    name: 'icon-512x512-maskable.png',
    size: 512,
    maskable: true,
  },
]

// 배경색 설정 (manifest.json의 theme_color)
const BACKGROUND_COLOR = '#0b0f19'

async function generateIcons() {
  try {
    // 출력 디렉토리 생성
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
      console.log(`✓ 출력 디렉토리 생성: ${outputDir}`)
    }

    // 원본 이미지 확인
    if (!fs.existsSync(sourceLogo)) {
      throw new Error(`원본 로고 파일을 찾을 수 없습니다: ${sourceLogo}`)
    }
    console.log(`✓ 원본 로고 확인: ${sourceLogo}`)

    console.log('\n아이콘 생성 중...\n')

    for (const icon of icons) {
      const outputPath = path.join(outputDir, icon.name)

      if (icon.maskable) {
        // 마스커블 아이콘: 배경색 + 로고를 80% 크기로 중앙 배치
        const logoSize = Math.round(icon.size * 0.8)
        const padding = Math.round((icon.size - logoSize) / 2)

        // 1. 배경색 캔버스 생성
        const blankImage = Buffer.from(
          `<svg width="${icon.size}" height="${icon.size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${icon.size}" height="${icon.size}" fill="${BACKGROUND_COLOR}"/>
          </svg>`
        )

        // 2. 로고 리사이즈 후 합성
        await sharp(sourceLogo)
          .resize(logoSize, logoSize, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // 투명 배경
          })
          .toBuffer()
          .then(async resizedLogo => {
            // 3. 배경 + 리사이즈된 로고 합성
            await sharp(blankImage)
              .composite([
                {
                  input: resizedLogo,
                  top: padding,
                  left: padding,
                },
              ])
              .png()
              .toFile(outputPath)

            console.log(`✓ ${icon.name} (${icon.size}x${icon.size}, maskable)`)
          })
      } else {
        // 일반 아이콘: 단순 리사이즈
        await sharp(sourceLogo)
          .resize(icon.size, icon.size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // 투명 배경
          })
          .png()
          .toFile(outputPath)

        console.log(`✓ ${icon.name} (${icon.size}x${icon.size})`)
      }
    }

    console.log('\n✓ 모든 아이콘 생성 완료!\n')

    // 생성된 파일 목록 출력
    console.log('생성된 파일:')
    const files = fs.readdirSync(outputDir).sort()
    files.forEach(file => {
      if (file.startsWith('icon-')) {
        const filePath = path.join(outputDir, file)
        const stats = fs.statSync(filePath)
        const sizeKb = (stats.size / 1024).toFixed(2)
        console.log(`  • ${file} (${sizeKb} KB)`)
      }
    })
  } catch (error) {
    console.error('✗ 에러 발생:', error.message)
    process.exit(1)
  }
}

generateIcons()
