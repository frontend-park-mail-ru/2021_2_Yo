import { ApiResponseJson, ApiUrls } from '../../types.js';

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

const API = 'https://bmstusasa.herokuapp.com';

export function fetchGet(url: ApiUrls, callback?: (args?: any) => void, error?: (args?: any) => void, params?: string) {
    let HTTPStatus: number;
    if (!params) {
        params = '';
    }

    return fetch(API + url + params, {
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

export function fetchPost(url: ApiUrls, body: any, callback: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;

    return fetch(API + url, {
        method: METHODS.POST,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
        callback({
            status: HTTPStatus,
            json: json,
        });
    }).catch(() => {
        if (error) error();
    });
}
