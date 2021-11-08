/// <reference lib="WebWorker" />

import {response} from "express";

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

function offlineResponse() {
    return Promise.resolve(new Response(fallback, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    }));
}

function putInCache(event: FetchEvent, onlineResponse: Response) {
    if (event.request.method === 'GET' && onlineResponse.status === 200) {
        caches.open(CACHE_NAME)
            .then((cache) => {
                cache.put(event.request, onlineResponse);
                return onlineResponse;
            })
            .catch((err) => {
                throw Error('smth went wrong with caches.open: ' + err);
            })
    }

    return onlineResponse;
}

self.addEventListener('fetch', (event) => {
    if (event.request.url === '/sw.js') {
        return;
    }

    const staticReq = event.request.url.match('/^.*\\.(jpg|png|jpeg|woff|woff2)$/');

    if (staticReq) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    return cachedResponse;
                })
                .catch(() => fetch(event.request))
                .then((onlineResponse) => putInCache(event, <Response>onlineResponse))
                .catch(() => offlineResponse())
        )
    } else {
        event.respondWith(
            fetch(event.request)
                .then(onlineResponse => putInCache(event, onlineResponse))
                .catch(() => {
                    caches.match(event.request)
                        .then((cachedResponse) => {
                            return cachedResponse;
                        })
                    return offlineResponse();
                })
        )
    }
});
