
//1. Nombgre del sw y los archivos a cachear

const CACHE_NAME = "mi-cache";
const BASE_PATH = "pwa-ejemplo1-Marina/";
const urlsToCache = [
    `${BASE_PATH}index.htlm`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}app.js`,
    `${BASE_PATH}offline.htlm`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,
];

//2. INSTALL -> se ejecuta al instalar el service worker
// se cachean(se meten a cache) los recuros base de la PWA
self.addEventListener("install", event => {
    console.log("Service Worker: Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Archivos cacheados");
            return cache.addAll(urlsToCache)
})
    );
});
 
// 3. ACTIVATE -> Se ejecuta al activarse el sw limpiar el cache viejo, 
// para mantener solo la version actual de la cache

self.addEventListener("activate", event => {
        event.waitUntil(
            caches.keys().then(keys =>
                Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
                )
            )
        );
});

// 4. FETCH -> Intercepta peticiones de la app
// Intercepta cada peticion de la PWA
// Busca primero en cachè y si no esta, busca en Internet
// En caso de falla, muestra la pagina offline.html.
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch (() => caches.match(`${BASE_PATH}offline.html`));
        })
    )
});

// 5. PUSH -> notificaciones en segundo plano Manejo de notificaciones
// push (opcional)

self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificaciòn sin texto"
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotificacion("Mi PWA", {body:data})
    );
});

