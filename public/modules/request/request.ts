import {ApiResponseJson, ApiUrls} from '../../types.js';
import CSRFStore from '../csrfstore.js';

const METHODS = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
};

// const API = 'https://bmstusasa.herokuapp.com';
// const API = 'https://yobmstu.herokuapp.com';
// const API = 'https://95.163.212.36:8081';
const API = 'https://bmstusa.ru';

export function fetchGet(url: string, callback?: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;

    return fetch(API + url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: 'include'
    }).then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
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

export function fetchDelete(url: string, callback?: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;

    return fetch(API + url, {
        method: METHODS.DELETE,
        mode: 'cors',
        credentials: 'include'
    }).then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
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

export function fetchPost(url: string, body: any, callback: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;
    let headers: Headers;

    return fetch(API + url, {
        method: METHODS.POST,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-Csrf-Token': CSRFStore.get() as string,
        },
        body: JSON.stringify(body)
    }).then((response) => {
        HTTPStatus = response.status;
        headers = response.headers;
        console.log(CSRFStore.get());
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
        callback({
            status: HTTPStatus,
            json: json,
            headers: headers,
        });
    }).catch(() => {
        if (error) error();
    });
}
