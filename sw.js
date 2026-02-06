const CACHE_NAME='nmd-cache-v1';
const urlsToCache=[
    '/',
    '/index.html',
    '/assets/css/style-secure.css',
    '/assets/js/security.js',
    '/favicon.ico'
];

self.addEventListener('install',event=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache=>cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch',event=>{
    event.respondWith(
        caches.match(event.request)
        .then(response=>response||fetch(event.request))
    );
});
