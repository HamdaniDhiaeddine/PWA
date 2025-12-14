const CACHE_NAME = 'animalcare-v1';
const RUNTIME_CACHE = 'animalcare-runtime';

// Assets to cache on install
const STATIC_ASSETS = ['/', '/index.html', '/index.css', '/manifest.json'];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    return cache.addAll(STATIC_ASSETS);
  }));
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE).map(name => caches.delete(name)));
  }));
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests, try network first
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      // Cache successful responses
      const responseClone = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.put(event.request, responseClone);
      });
      return response;
    }).catch(() => {
      // Fallback to cache
      return caches.match(event.request).then(cachedResponse => {
        return cachedResponse || caches.match('/');
      });
    }));
    return;
  }

  // For other requests, cache first
  event.respondWith(caches.match(event.request).then(cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    }
    return fetch(event.request).then(response => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }
      const responseClone = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => {
        cache.put(event.request, responseClone);
      });
      return response;
    });
  }));
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-animal-data') {
    event.waitUntil(syncAnimalData());
  }
});
async function syncAnimalData() {
  // This would sync offline data when connection is restored
  console.log('Syncing animal data...');
}