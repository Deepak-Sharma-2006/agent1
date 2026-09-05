/**
 * DealFlow360 - Enterprise Native Service Worker
 * Phase 9: Offline-First PWA Synchronization
 */

const SHELL_CACHE_NAME = 'dealflow360-shell-v1';
const API_CACHE_NAME = 'dealflow360-api-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install: Pre-cache static application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete cache versions & claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [SHELL_CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy dispatch
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-HTTP(S) and WebSocket requests
  if (!url.protocol.startsWith('http')) return;
  if (url.pathname === '/ws' || url.pathname.startsWith('/ws/')) return;

  // 1. API Requests (Read APIs: Network-first with Cache fallback)
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(async () => {
            // Offline fallback: check API cache
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                success: false,
                offline: true,
                error: 'Network connection unavailable. Data will sync upon reconnect.',
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          })
      );
    }
    // Mutations (POST, PUT, DELETE) pass directly to network; client OfflineContext queues them when offline
    return;
  }

  // 2. Navigation Requests (SPA fallback to cached index.html)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(async () => {
          const cachedIndex = await caches.match('/index.html');
          return cachedIndex || fetch(request);
        })
    );
    return;
  }

  // 3. Static Assets (CSS, JS bundles, fonts, icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(SHELL_CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
