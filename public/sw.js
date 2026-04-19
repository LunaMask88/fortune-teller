const CACHE = 'mystic-v1'
const STATIC = [
  '/',
  '/reading',
  '/result',
  '/match',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // API 请求 / 跨域：直接走网络，不缓存
  if (url.pathname.startsWith('/api/') || url.origin !== location.origin) {
    e.respondWith(fetch(request))
    return
  }

  // 页面和静态资源：网络优先，fallback 缓存
  e.respondWith(
    fetch(request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(request, clone))
        return res
      })
      .catch(() => caches.match(request))
  )
})
