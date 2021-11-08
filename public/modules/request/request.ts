import { ApiResponseJson } from '@/types';
import CSRFStore from '@request/csrfstore';

const METHODS = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
};

const API = 'https://bmstusa.ru';
// const API = 'https://bmstusasa.herokuapp.com';
// const API = 'https://yobmstu.herokuapp.com';
// const API = 'https://95.163.212.36:8081';

export function fetchGet(url: string, callback?: (args?: any) => void, error?: (args?: any) => void) {
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
        const json = data as ApiResponseJson;
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

export function fetchDelete(url: string, callback?: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;

    return void fetch(API + url, {
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

interface PostData {
    json: any,
    file?: any,
}

export function fetchPost(url: string, data: PostData | any, callback: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;
    let headers: Headers;
    let formData = data;
    let CT = 'application/json;charset=utf-8';
    if (data.json) {
        CT = 'multipart/form-data';
        formData = new FormData();
        formData.append('json', JSON.stringify(data.json));
        if (data.file) formData.append('file', data.file);
    }

    return void fetch(API + url, {
        method: METHODS.POST,
        mode: 'cors',
        credentials: 'include',
        headers: {
            // 'Content-Type': 'application/json;charset=utf-8',
            // 'Content-Type': 'multipart/form-data',
            // 'Content-Type': CT,
            'X-CSRF-Token': CSRFStore.get() as string,
        },
        // body: JSON.stringify(body)
        body: formData
    }).then((response) => {
        HTTPStatus = response.status;
        headers = response.headers;
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
