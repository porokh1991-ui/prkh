const CACHE_NAME = 'prkh-v32';
const CACHE_FILES = [
  './',
  './index.html',
  './styles.css',
  './i18n.js',
  './app.js',
  './firebase.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
];

// Install: cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

// Activate: delete old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch:
//  - HTML / navigation  -> network-first (sempre a versão mais recente quando há net)
//  - resto dos assets   -> cache-first com fallback à net
self.addEventListener('fetch', event => {
  const req = event.request;
  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return response;
      }).catch(() =>
        caches.match(req).then(c => c || caches.match('./index.html'))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, responseClone));
        return response;
      });
    })
  );
});

// Push: show notification
self.addEventListener('push', event => {
  const body = event.data ? event.data.text() : 'Hora de treinar! 💪';
  event.waitUntil(
    self.registration.showNotification('PRKH', {
      body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'push-notification'
    })
  );
});

// Notification click: focus existing window or open new one
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
