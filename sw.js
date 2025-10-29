const CACHE_NAME = 'todo-pwa-cache-v1';
const urlsToCache = [
  '/', // Caches the root path
  '/index.html',
  '/manifest.json',
  // Icon URLs (since they are external, caching them is good for offline use)
  'http://googleusercontent.com/image_collection/image_retrieval/2048319554149166403_0',
  'http://googleusercontent.com/image_collection/image_retrieval/2048319554149166403_1'
];

// Install Event: caches the required assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event: serves assets from the cache first (Cache-First Strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        // No cache match - fetch from the network
        return fetch(event.request);
      })
  );
});

// Activate Event: cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});