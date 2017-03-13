var cacheName = 'cache_v13';
var cacheFiles = [
  './',
  './index.html',
  './sw.js',
  './dist/bundle.js',
  './src/assets/css/leaflet.awesome-markers.css',
  './src/assets/css/sweetalert.css',
  './src/assets/images/evento.svg',
  './src/assets/images/fixo.svg',
  './src/assets/images/markers-shadow.png',
  './src/assets/images/markers-shadow@2x.png',
  './src/assets/images/markers-soft.png',
  './src/assets/images/markers-soft@2x.png'
];

// ====

// Primeiro evento / acontece apenas uma vez
function Install(event) {
  console.info('Event: Install');

  event.waitUntil(
    caches
    .open(cacheName)
    .then(function(cache) {
      return cache.addAll(cacheFiles)
    })
    .then(function() {
      return self.skipWaiting()
    })
  );
}

// Deleta o cache mais antigo
function Activate(event) {
  console.info('Event: Activate');

  event.waitUntil(
    caches
    .keys()
    .then(function (keyList) {
      console.log(keyList);

      return Promise.all(keyList.map(function (key) {
        console.log(key);
        if (key !== cacheName) return caches.delete(key)
      }))
    })
  )

  return self.clients.claim();
}

// Trigger para todos os requests da aplicação
function Fetch(event) {
  console.info('Event: Fetch');

  event.respondWith(
    caches
    .match(event.request)
    .then(function(response) {
      return response || fetch(event.request)
    })
  );
}

// ====

self.addEventListener('install', Install);
self.addEventListener('activate', Activate);
self.addEventListener('fetch', Fetch);