import { ApiPostLoginData, ApiPostSignupData, ApiResponseJson, 
    ApiUrls, FetchResponseData } from '../../types.js';

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

const API = 'https://bmstusasa.herokuapp.com';

async function handleFetch (responsePromise: Promise<Response>): Promise<FetchResponseData> {
    let HTTPStatus: number;
    return responsePromise.then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
        return {
            status: HTTPStatus,
            json,
        };
    });
}

async function postFetch(url: string, body: any) {
    const responsePromise = fetch(url, {
        method: METHODS.POST,
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body)
    });
    const res = await handleFetch(responsePromise);

    return res;
}

async function getFetch(url: string) {
    const responsePromise = fetch(url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: 'include'
    });
    const res = await handleFetch(responsePromise);

    return res;
}

/**
 * POST запрос отправки данных авторизации
 *
 * @param {ApiPostLoginData} postData - почта, пароль
 * @returns {EventCardData[] | undefined}
 */
export async function postLogin(postData: ApiPostLoginData): Promise<undefined | string> {
    const {status, json} = await postFetch(API + ApiUrls.Login, postData);
    if (status === 200) {
        if (json.status === 200) {
            return;
        } else {
            return json.message;
        }
    }
    return;
}

/**
 * POST запрос отправки данных регистрации
 *
 * @param {ApiPostSignupData} postData - имя, фамилия, email, пароль
 * @returns {EventCardData[] | undefined}
 */
export async function postSignup(postData: ApiPostSignupData): Promise<undefined | string> {
    const {status, json} = await postFetch(API + ApiUrls.Signup, postData);
    if (status === 200) {
        if (json.status === 200) {
            return;
        } else {
            return json.message;
        }
    }
    return;
}

export function fetchGet(url: ApiUrls, callback: (args?: any) => void, error?: (args?: any) => void) {
    let HTTPStatus: number;

    return fetch( API + url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: 'include'
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
