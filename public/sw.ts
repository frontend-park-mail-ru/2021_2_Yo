/// <reference lib="WebWorker" />

const CACHE_NAME = 'BMSTUSAcache';
const cacheUrls = [''];

export type {};
declare const self: ServiceWorkerGlobalScope;

const fallback = '' +
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Title</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '    <p>Интернет крякнул</p>\n' +
    '</body>\n' +
    '</html>';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(cacheUrls);
            })
            .catch((err) => {
                throw Error('smth went wrong with caches.open: ' + err);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }).then((response) => {
            return response;
        }).catch(() => {
            return Promise.resolve(new Response(fallback, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            }));
        }));
});
