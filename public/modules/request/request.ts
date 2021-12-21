import { ApiResponseJson } from '@/types';
import CSRFStore from '@request/csrfstore';

type Callback = (args?: any) => void;

const METHODS = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
};

const API = 'https://bmstusa.ru/api';
export const WS = 'https://bmstusa.ru/ws';
// const API = 'https://bmstusasa.herokuapp.com';
// const API = 'https://yobmstu.herokuapp.com';
// const API = 'https://95.163.212.36:8081';

export function fetchGet(url: string, callback?: Callback, error?: Callback) {
    url = url.trim();
    let HTTPStatus: number;
    let headers: Headers;

    return void fetch(API + url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: 'include'
    }).then((response) => {
        HTTPStatus = response.status;
        headers = response.headers;
        return response.json();
    }).then(data => {
        const json = <ApiResponseJson>data;
        if (callback) {
            callback({
                status: HTTPStatus,
                json: json,
                headers: headers,
            });
        }
    }).catch(() => {
        if (error) error();
    });
}

export function fetchDelete(url: string, callback?: Callback, error?: Callback) {
    let HTTPStatus: number;

    return void fetch(API + url, {
        method: METHODS.DELETE,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'X-CSRF-Token': <string>CSRFStore.get(),
        }
    }).then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = <ApiResponseJson>data;
        if (callback) {
            callback({
                status: HTTPStatus,
                json: json,
            });
        }
    }).catch(() => {
        if (error) error();
    });
}

export function fetchPost(url: string, body: any, callback: Callback, error?: Callback) {
    let HTTPStatus: number;
    let headers: Headers;

    return void fetch(API + url, {
        method: METHODS.POST,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRF-Token': <string>CSRFStore.get(),
        },
        body: JSON.stringify(body)
    }).then((response) => {
        HTTPStatus = response.status;
        headers = response.headers;
        return response.json();
    }).then(data => {
        const json = <ApiResponseJson>data;
        callback({
            status: HTTPStatus,
            json: json,
            headers: headers,
        });
    }).catch(() => {
        if (error) error();
    });
}

type MultipartData = {
    json: any;
    file?: any;
};

export function fetchPostMultipart(url: string, data: MultipartData, callback: Callback, error?: Callback) {
    let HTTPStatus: number;
    let headers: Headers;
    const formData = new FormData();
    formData.append('json', JSON.stringify(data['json']));
    formData.append('file', data['file']);

    return void fetch(API + url, {
        method: METHODS.POST,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'X-CSRF-Token': <string>CSRFStore.get(),
        },
        body: formData
    }).then((response) => {
        HTTPStatus = response.status;
        headers = response.headers;
        return response.json();
    }).then(data => {
        const json = <ApiResponseJson>data;
        callback({
            status: HTTPStatus,
            json: json,
            headers: headers,
        });
    }).catch(() => {
        if (error) error();
    });
}
