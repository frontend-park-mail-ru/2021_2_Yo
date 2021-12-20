/// <reference lib="WebWorker" />

const CACHE_NAME = 'BMSTUSAcache';
const cacheUrls = ['/'];

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
    '    <p>Нет подключения к интернету</p>\n' +
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
    if (event.request.method === 'GET' && (onlineResponse.status === 200 || onlineResponse.type == 'opaque')) {
        const responseClone = onlineResponse.clone();
        void caches.open(CACHE_NAME)
            .then((cache) => {
                if (cache) {
                    void cache.put(event.request, responseClone);
                }
            });
    }

    return onlineResponse;
}

self.addEventListener('fetch', (event) => {
    const staticReq = event.request.url.match('^.*\\.(jpg|png|jpeg|woff|ico|gif|webp|webm)$');

    if (staticReq) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    throw Error();
                })
                .catch(() => fetch(event.request)
                    .then((onlineResponse) => {
                        if (onlineResponse) {
                            return putInCache(event, onlineResponse);
                        }
                        throw Error();
                    })
                    .catch(() => offlineResponse())
                )
        );
    } else {
        event.respondWith(
            fetch(event.request)
                .then(onlineResponse => {
                    if (onlineResponse) {
                        putInCache(event, onlineResponse);
                        return onlineResponse;
                    } else {
                        throw Error();
                    }
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            throw Error();
                        })
                        .catch(() => offlineResponse());
                })
        );
    }
});
