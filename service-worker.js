// service-worker.js

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'GlowUp AI';
  const options = {
    body: event.data.text(),
    icon: 'logo.svg',
    badge: 'logo.svg'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  // This could be extended to open the app
  event.waitUntil(
    clients.openWindow('/')
  );
});