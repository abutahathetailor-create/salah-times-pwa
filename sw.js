const CACHE_NAME = 'salah-times-v1.3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Handle relative paths for GitHub Pages
  let requestUrl = event.request.url;
  let baseUrl = self.location.origin + self.location.pathname.replace(/\/[^\/]*$/, '');
  
  // If it's a relative path request, reconstruct the full URL
  if (requestUrl.startsWith(baseUrl + '/salah-times-pwa/')) {
    // This is a GitHub Pages deployment
    const relativePath = requestUrl.replace(baseUrl, '');
    event.respondWith(
      caches.match('./' + relativePath.split('/').pop())
        .then(function(response) {
          return response || fetch(event.request);
        })
    );
  } else {
    // Normal caching logic
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
    );
  }
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
    })
  );
});
