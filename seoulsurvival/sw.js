/**
 * Seoul Survival - Service Worker
 * Cache-first strategy for static assets
 * Network-first strategy for API calls
 */

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `seoulsurvival-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `seoulsurvival-dynamic-${CACHE_VERSION}`
const API_CACHE = `seoulsurvival-api-${CACHE_VERSION}`

// Static assets to cache on install
const STATIC_ASSETS = [
  '/seoulsurvival/',
  '/seoulsurvival/index.html',
  '/seoulsurvival/manifest.json',
  '/shared/styles/uniform-core.css',
  '/shared/i18n/translations/ko.js',
  '/shared/i18n/translations/en.js',
]

// API endpoints that should use network-first strategy
const API_PATTERNS = ['/api/', 'supabase.co', 'googleapis.com']

// Install event - precache critical assets
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...')
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.warn('[SW] Some assets failed to cache:', error)
        })
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...')
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // API calls - Network first, fallback to cache
  if (isApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Static assets - Cache first, fallback to network
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // HTML pages - Network first with cache fallback
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Default: Cache first with network fallback
  event.respondWith(cacheFirstStrategy(request))
})

/**
 * Cache-first strategy: use cached version if available,
 * otherwise fetch from network and cache the response
 */
async function cacheFirstStrategy(request) {
  const cacheName = request.method === 'GET' ? STATIC_CACHE : DYNAMIC_CACHE
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)

    // Only cache successful responses
    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.warn('[SW] Fetch failed, returning offline fallback:', error)
    return getOfflineFallback(request)
  }
}

/**
 * Network-first strategy: try to fetch from network first,
 * fallback to cache if network fails
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(isApiRequest(new URL(request.url)) ? API_CACHE : DYNAMIC_CACHE)

  try {
    const response = await fetch(request)

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.warn('[SW] Network request failed, trying cache:', error)
    const cached = await cache.match(request)

    if (cached) {
      return cached
    }

    return getOfflineFallback(request)
  }
}

/**
 * Check if URL is an API request
 */
function isApiRequest(url) {
  return API_PATTERNS.some(pattern => url.href.includes(pattern))
}

/**
 * Check if URL is a static asset (image, script, style, font)
 */
function isStaticAsset(url) {
  const staticExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
  ]
  return staticExtensions.some(ext => url.pathname.endsWith(ext))
}

/**
 * Return offline fallback
 */
function getOfflineFallback(request) {
  // For HTML pages, return a simple offline page
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0b0f19;color:#fff}div{text-align:center}h1{margin:0 0 16px;font-size:24px}p{margin:0;font-size:14px;color:#999}</style></head><body><div><h1>오프라인 상태입니다</h1><p>인터넷 연결을 확인해주세요.</p></div></body></html>',
      {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
        status: 503,
      }
    )
  }

  // For other resources, return a generic error response
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
  })
}

/**
 * Handle messages from the client
 * Example: self.clients.matchAll().then(clients => clients.forEach(client => client.postMessage({type: 'SW_UPDATED'})))
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
    })
  }
})
