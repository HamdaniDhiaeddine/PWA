const CACHE_NAME = 'animalcare-v1';
const RUNTIME_CACHE = 'animalcare-runtime';
const API_CACHE = 'animalcare-api';

const STATIC_ASSETS = [
  '/', 
  '/manifest.json',
  '/225.jpg',
  '/512.png',
  '/screenshot-mobile.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console. log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event. waitUntil(
    caches.keys().then(cacheNames => {
      return Promise. all(
        cacheNames. map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();

          caches.open(API_CACHE).then(cache => {
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static / runtime - Cache First
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then(networkResponse => {
        const responseClone = networkResponse.clone();

        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});


// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event. tag === 'sync-animals') {
    event.waitUntil(syncAnimalsData());
  }
  if (event.tag === 'sync-care') {
    event.waitUntil(syncCareData());
  }
});

async function syncAnimalsData() {
  try {
    const db = await openIndexedDB();
    const pendingAnimals = await getPendingAnimals(db);
    
    for (const animal of pendingAnimals) {
      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal)
      });
      
      if (response. ok) {
        await markAnimalSynced(db, animal.id);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncCareData() {
  try {
    const db = await openIndexedDB();
    const pendingCare = await getPendingCare(db);
    
    for (const care of pendingCare) {
      const response = await fetch('/api/care', {
        method: 'POST',
        headers: { 'Content-Type':  'application/json' },
        body: JSON.stringify(care)
      });
      
      if (response.ok) {
        await markCareSynced(db, care. id);
      }
    }
  } catch (error) {
    console.error('Care sync failed:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AnimalCareDB', 1);
    request. onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingAnimals(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('animals', 'readonly');
    const store = transaction.objectStore('animals');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result. filter(a => a.synced === false));
    request.onerror = () => reject(request.error);
  });
}

function getPendingCare(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('care', 'readonly');
    const store = transaction.objectStore('care');
    const request = store. getAll();
    request.onsuccess = () => resolve(request.result.filter(c => c.synced === false));
    request.onerror = () => reject(request.error);
  });
}

function markAnimalSynced(db, animalId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('animals', 'readwrite');
    const store = transaction.objectStore('animals');
    const request = store.get(animalId);
    request.onsuccess = () => {
      const animal = request.result;
      animal.synced = true;
      store.put(animal);
      resolve();
    };
    request. onerror = () => reject(request.error);
  });
}

function markCareSynced(db, careId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('care', 'readwrite');
    const store = transaction.objectStore('care');
    const request = store.get(careId);
    request.onsuccess = () => {
      const care = request.result;
      care. synced = true;
      store.put(care);
      resolve();
    };
    request. onerror = () => reject(request.error);
  });
}