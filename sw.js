const CACHE_NAME = 'salah-times-v2.1';

self.addEventListener('install', function(event) {
    self.skipWaiting(); // Activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll([
                    './',
                    './index.html',
                    './manifest.json',
                    './css/style.css',
                    './css/fajr.css',
                    './css/sunrise.css',
                    './css/dhuhr.css',
                    './css/asr.css',
                    './css/maghrib.css',
                    './css/isha.css',
                    './js/app.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
                ]);
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim(); // Take control immediately
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch new
                return response || fetch(event.request);
            })
    );
});
