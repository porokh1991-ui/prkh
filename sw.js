const CACHE_NAME = 'prkh-v22';
const CACHE_FILES = [
  './',
  './index.html',
  './styles.css',
  './i18n.js',
  './app.js',
  './firebase.js',
  './manifest.json'
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

// Fetch: cache-first with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
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
