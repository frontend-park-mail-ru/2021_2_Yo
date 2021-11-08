/// <reference lib="WebWorker" />

const CACHE_NAME = 'BMSTUSAcache';
const cacheUrls = ['/', '/events', '/user'];

export type {};
declare const self: ServiceWorkerGlobalScope;

const fallback = '' +
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Ошибка</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '    <p>Интернет крякнул</p>\n' +
    '</body>\n' +
    '</html>';

self.addEventListener('install', (event) => {
    void self.skipWaiting();
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

function offlineResponse() {
    return Promise.resolve(new Response(fallback, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    }));
}

function putInCache(event: FetchEvent, onlineResponse: Response) {
    console.log('кладу в кэш', event.request.url);
    if (event.request.method === 'GET' && onlineResponse.status === 200) {
        const responseClone = onlineResponse.clone();
        void caches.open(CACHE_NAME)
            .then((cache) => {
                void cache.put(event.request, responseClone);
            });
    }

    return onlineResponse;
}

self.addEventListener('fetch', (event) => {
    console.log(event.request.url);
    if (event.request.url === '/sw.js') {
        return;
    }

    const staticReq = event.request.url.match('^https?://\\S+(?:jpg|jpeg|png|ico|woff)$');

    if (staticReq) {
        console.log('запрос за статикой', event.request.url);
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    console.log('достал из кэша', event.request.url);
                    return cachedResponse;
                })
                .catch(() => {
                    console.log('ошибка');
                    void fetch(event.request);
                })
                .then((onlineResponse) => putInCache(event, <Response>onlineResponse))
                .catch(() => offlineResponse())
        );
        return;
    } else {
        console.log('запрос не за статикой', event.request.url);
        event.respondWith(
            fetch(event.request)
                .then(onlineResponse => putInCache(event, onlineResponse))
                .catch(() => {
                    void caches.match(event.request)
                        .then((cachedResponse) => {
                            console.log('достал из кэша', event.request.url);
                            return cachedResponse;
                        });
                    return offlineResponse();
                })
        );
    }
});
