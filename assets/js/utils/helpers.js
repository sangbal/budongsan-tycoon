/**
 * 유틸리티 함수들
 */

/**
 * 숫자를 한국어 형식으로 포맷팅
 */
export function formatNumber(num) {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + '조';
  } else if (num >= 1e8) {
    return (num / 1e8).toFixed(1) + '억';
  } else if (num >= 1e4) {
    return (num / 1e4).toFixed(1) + '만';
  } else {
    return num.toLocaleString();
  }
}

/**
 * 시간을 한국어 형식으로 포맷팅
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else if (minutes > 0) {
    return `${minutes}분 ${secs}초`;
  } else {
    return `${secs}초`;
  }
}

/**
 * 수익률을 퍼센트로 포맷팅
 */
export function formatPercentage(value) {
  return (value * 100).toFixed(1) + '%';
}

/**
 * 랜덤 ID 생성
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 두 숫자 사이의 랜덤 정수 생성
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 배열에서 랜덤 요소 선택
 */
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 로컬 스토리지에 안전하게 저장
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('로컬 스토리지 저장 실패:', error);
    return false;
  }
}

/**
 * 로컬 스토리지에서 안전하게 불러오기
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('로컬 스토리지 불러오기 실패:', error);
    return defaultValue;
  }
}

/**
 * 디바운스 함수
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 스로틀 함수
 */
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/**
 * 클릭 이펙트 생성
 */
export function createClickEffect(x, y, text, color = '#34d399') {
  const effect = document.createElement('div');
  effect.className = 'income-increase';
  effect.textContent = text;
  effect.style.left = x + 'px';
  effect.style.top = y + 'px';
  effect.style.color = color;
  effect.style.fontSize = '16px';
  effect.style.fontWeight = '700';
  effect.style.pointerEvents = 'none';
  effect.style.position = 'fixed';
  effect.style.zIndex = '9999';
  
  document.body.appendChild(effect);
  
  setTimeout(() => {
    if (effect.parentNode) {
      effect.parentNode.removeChild(effect);
    }
  }, 2000);
}

/**
 * 파티클 효과 생성
 */
export function createParticle(x, y, emoji, color = '#5eead4') {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = emoji;
  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.color = color;
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 1500);
}

/**
 * 업그레이드 등급 계산
 */
export function getUpgradeRarity(cost) {
  if (cost >= 1e12) return 'legendary';
  if (cost >= 1e10) return 'epic';
  if (cost >= 1e8) return 'rare';
  if (cost >= 1e6) return 'uncommon';
  return 'common';
}

/**
 * 등급별 색상 반환
 */
export function getRarityColor(rarity) {
  const colors = {
    common: '#9ca3af',
    uncommon: '#34d399',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fbbf24'
  };
  return colors[rarity] || colors.common;
}

/**
 * 등급별 이름 반환
 */
export function getRarityName(rarity) {
  const names = {
    common: '일반',
    uncommon: '고급',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  };
  return names[rarity] || names.common;
}
