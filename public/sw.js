// sw.js — AlkindiX Service Worker
// ------------------------------------------------------------
// Safe starter: no caching/interception, just lifecycle handlers.
// Prevents 404s and gives you a hook to extend later.
// ------------------------------------------------------------

self.addEventListener("install", (event) => {
  // Activate immediately on install
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of open pages right away
  event.waitUntil(self.clients.claim());
});

// No fetch handler: network requests pass straight through.
// Add one here later if you want caching/offline support.
