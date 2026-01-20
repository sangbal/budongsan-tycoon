#!/usr/bin/env node
/**
 * Edge Function (delete-account) 로컬 검증 스크립트
 *
 * 사용법:
 *   node tools/test-delete-account.js <FUNCTION_URL> [JWT_TOKEN]
 *
 * 예시:
 *   # 토큰 없는 요청 (401 확인)
 *   node tools/test-delete-account.js https://xxxx.supabase.co/functions/v1/delete-account
 *
 *   # 유효한 토큰으로 요청 (⚠️ 테스트 계정만 사용)
 *   node tools/test-delete-account.js https://xxxx.supabase.co/functions/v1/delete-account eyJ...
 */

const FUNCTION_URL = process.argv[2]
const JWT_TOKEN = process.argv[3]

if (!FUNCTION_URL) {
  console.error('❌ 사용법: node tools/test-delete-account.js <FUNCTION_URL> [JWT_TOKEN]')
  console.error('')
  console.error('예시:')
  console.error('  # OPTIONS 프리플라이트 확인')
  console.error(
    '  node tools/test-delete-account.js https://xxxx.supabase.co/functions/v1/delete-account --options'
  )
  console.error('')
  console.error('  # 토큰 없는 요청 (401 확인)')
  console.error(
    '  node tools/test-delete-account.js https://xxxx.supabase.co/functions/v1/delete-account'
  )
  console.error('')
  console.error('  # 유효한 토큰으로 요청 (⚠️ 테스트 계정만 사용)')
  console.error(
    '  node tools/test-delete-account.js https://xxxx.supabase.co/functions/v1/delete-account eyJ...'
  )
  process.exit(1)
}

async function testFunction() {
  const isOptions = process.argv.includes('--options')

  if (isOptions) {
    // OPTIONS 프리플라이트 테스트
    console.log('🔍 OPTIONS 프리플라이트 테스트...')
    console.log(`   URL: ${FUNCTION_URL}`)
    console.log('')

    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'OPTIONS',
        headers: {
          Origin: 'https://clicksurvivor.com',
          'Access-Control-Request-Method': 'POST',
        },
      })

      console.log(`✅ Status: ${response.status} ${response.statusText}`)
      console.log('📋 CORS Headers:')
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      }
      console.log(JSON.stringify(corsHeaders, null, 2))

      if (response.status === 200) {
        console.log('')
        console.log('✅ OPTIONS 프리플라이트 성공')
      } else {
        console.log('')
        console.log('❌ OPTIONS 프리플라이트 실패')
        process.exit(1)
      }
    } catch (error) {
      console.error('❌ 요청 실패:', error.message)
      process.exit(1)
    }
    return
  }

  // POST 요청 테스트
  const hasToken = !!JWT_TOKEN

  console.log('🔍 Edge Function 테스트...')
  console.log(`   URL: ${FUNCTION_URL}`)
  console.log(`   Method: POST`)
  console.log(`   Authorization: ${hasToken ? 'Bearer [TOKEN]' : '없음'}`)
  console.log('')

  const headers = {
    'Content-Type': 'application/json',
  }

  if (hasToken) {
    headers['Authorization'] = `Bearer ${JWT_TOKEN}`
  }

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers,
    })

    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { raw: responseText }
    }

    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log('📋 Response:')
    console.log(JSON.stringify(responseData, null, 2))
    console.log('')

    if (!hasToken) {
      // 토큰 없는 요청: 401 예상
      if (response.status === 401 && responseData.status === 'AUTH_FAILED') {
        console.log('✅ 토큰 없는 요청 → 401 AUTH_FAILED (예상대로 동작)')
      } else {
        console.log('❌ 예상과 다른 응답 (401 AUTH_FAILED 예상)')
        process.exit(1)
      }
    } else {
      // 토큰 있는 요청: 실제 삭제 수행 (⚠️ 테스트 계정만 사용)
      if (response.status === 200 && responseData.status === 'ALL_SUCCESS') {
        console.log('✅ 계정 삭제 성공')
        console.log('⚠️  주의: 실제 계정이 삭제되었습니다!')
      } else if (response.status === 401 && responseData.status === 'AUTH_FAILED') {
        console.log('❌ 인증 실패: 토큰이 유효하지 않거나 만료되었습니다')
        process.exit(1)
      } else {
        console.log('❌ 예상과 다른 응답')
        console.log(`   Status: ${response.status}`)
        console.log(`   Response Status: ${responseData.status}`)
        process.exit(1)
      }
    }
  } catch (error) {
    console.error('❌ 요청 실패:', error.message)
    process.exit(1)
  }
}

testFunction()
