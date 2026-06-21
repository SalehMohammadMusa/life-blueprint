self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(data.title || 'Life Blueprint 🗺️', {
    body: data.body || "Haven't checked in for 2 hours. How are your habits going?",
    icon: '/life-blueprint/icon-192.png',
    badge: '/life-blueprint/icon-192.png',
    tag: 'reminder',
    renotify: true,
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/life-blueprint/'));
});
