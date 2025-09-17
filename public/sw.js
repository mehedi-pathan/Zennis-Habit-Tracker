const CACHE_NAME = "zennis-habit-tracker-v1"
const urlsToCache = [
  "/",
  "/dashboard",
  "/habits",
  "/journal",
  "/analytics",
  "/about",
  "/contact",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
]

// Install event
self.addEventListener("install", (event) => {
  console.log("Service worker installing")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker activating")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
