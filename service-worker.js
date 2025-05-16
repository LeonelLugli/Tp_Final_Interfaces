importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log("✅ Workbox cargado correctamente");

  workbox.precaching.precacheAndRoute([
     { url: '/index.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/src/css/style.css', revision: '1' },
  { url: '/src/css/normalize.css', revision: '1' },
   { url :  '/calculadora_mr.html' , revision: '1'},
  ]);

  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'imagenes-cache'
    })
  );

  workbox.routing.registerRoute(
    ({request}) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'recursos-estaticos'
    })
  );

} else {
  console.log("❌ Error al cargar Workbox");
}
//asdnjasndjasndjnas//
