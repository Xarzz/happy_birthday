const CACHE_NAME = 'marsya-birthday-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './assets/1.webp',
    './assets/2.webp',
    './assets/3.webp',
    './assets/4.webp',
    './assets/5.webp',
    './assets/6.webp',
    './assets/7.webp',
    './assets/8.webp',
    './assets/9.webp',
    './assets/10.webp',
    './assets/11.webp',
    './assets/12.webp',
    './assets/13.webp',
    './assets/14.webp',
    './assets/lovestory.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - kembalikan response dari cache
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
