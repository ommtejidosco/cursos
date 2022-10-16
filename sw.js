self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
      caches.open('main').then(function(cache) {
        return cache.addAll(
          [
            '/',
            '/manifest.json',
            '/index.html',
            '/assets/favicon-196.png'
          ]
        );
      })
    );
});

/* Network first */
function networkFirst(event){
    event.respondWith(
        fetch(event.request).then(function(response){
          return caches.open('main').then(function(cache){
              cache.put(event.request, response.clone());
              return response;
          })
        }).catch(function() {
            return caches.match(event.request);
        })
    )
}
/* Cache first */
function cacheFirst(event){
  event.respondWith(
    caches.open('main').then(function(cache) {
      return cache.match(event.request).then(function(cacheResponse) {
        if(cacheResponse)
          return cacheResponse
        else
          return fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone())
              return networkResponse
          })
      })
    })
  );
}

self.addEventListener('fetch', function (event) {
    if(event.request.url.includes('resources'))
      return cacheFirst(event);
    if(event.request.url.includes('.mp4')){
      console.log('Video')
      return fetch(event.request)
    }else
      return networkFirst(event);
});