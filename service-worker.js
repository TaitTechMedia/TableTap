// Update the cache name when the service worker changes.
const CACHE_NAME = 'my-cache-v1'; 
const urlsToCache = [
  '/'
];

// Build cache on local device with paths defined above
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Updates the cache for the boards directory as the rest of the app should not change, so we update cache for boards to save data
self.addEventListener('fetch', function(event) {
  // Check if the request is for the 'boards' directory or its subdirectories
  if (event.request.url.includes('boards')) {
    // Fetch the new data and cache it
    event.respondWith(
      fetch(event.request).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response for caching
        var responseToCache = response.clone();

        // Open the cache and store the new response
        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
    );
  } else {
    // Handle fetch events for URLs that aren't in the 'boards' directory or its subdirectories
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response for caching
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
      );
  }
});

self.addEventListener('activate', function(event) {
  // Define a list of the caches you want to keep.
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete the caches that aren't in your whitelist.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // After the activation and claiming is complete, force a page refresh.
      if (self.clients.claim) {
        self.clients.claim();
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.navigate(client.url))
        });
      }
    })
  );
});