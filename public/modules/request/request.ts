import { ApiResponseJson, ApiUrls } from '../../types.js';

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

// const API = 'https://bmstusasa.herokuapp.com';
const API = 'https://95.163.212.36:8081';

export function fetchGet(url: ApiUrls, callback?: (args?: any) => void, error?: (args?: any) => void) {
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
