self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open('main').then(function (cache) {
      return cache.addAll(
        [
          '/',
          '/manifest.json',
          '/index.html',
          '/icon-omm.webp'
        ]
      );
    })
  );
});

/* Network first */
function networkFirst(event) {
  event.respondWith(
    fetchWithTimeout(event.request).then(function (response) {
      return caches.open('main').then(async function (cache) {
        cache.put(event.request, response.clone())
        return response;
      })
    }).catch(function () {
      return caches.match(event.request);
    })
  )
}
/* Remove old versions */
async function updateCache(cache, event, response){
  console.time(event.request.url)
  let keys = await cache.keys();
  let oldVersions = keys.filter((v) => v.url.includes(event.request.url.split('?')[0]))
  .filter((v) => v.url != event.request.url)
  await Promise.all(oldVersions.map((k) => {
    cache.delete(k);
    console.log(`Deleting ${k.url} due to newer version ${event.request.url}`)
  }));
  cache.put(event.request, response)
  console.timeEnd(event.request.url)
}

/* Cache first */
function cacheFirst(event) {
  event.respondWith(
    caches.open('main').then(async function (cache) {      
      return cache.match(event.request).then(function (cacheResponse) {
        if (cacheResponse){
          return cacheResponse
        }else return fetchWithTimeout(event.request).then(async function (networkResponse) {
          updateCache(cache, event, networkResponse.clone())
          return networkResponse
        })
      })
    })
  );
}

async function fetchWithTimeout(request, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => {console.log('Timeout'); controller.abort();}, timeout);
  const response = await fetch(request, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('resources')
    || event.request.url.includes('courses/espejo-renacer.webp')
    || event.request.url.includes('courses/llavero-amanecer-2.webp'))
    return cacheFirst(event);
  else if (event.request.url.includes('.mp4')) {
    return;
  } else
    return networkFirst(event);
});