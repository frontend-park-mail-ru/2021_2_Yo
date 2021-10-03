import { ApiPostLoginData, ApiPostSignupData, ApiResponseJson, ApiUrls, EventCardData, FetchResponseData, UserData } from '../types.js';

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
        }
    })
}

async function postFetch(url: string, body: {}) {
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
 * GET запрос пользователя
 *
 * @returns {UserData | undefined}
 */
export async function getUser(): Promise<UserData | undefined> {
    const {status, json} = await getFetch(API + ApiUrls.User);
    if (status === 200) {
        if (json.status === 200) {
            return {id: 1, name: json.body.name, geo: 'Мытищи'};
        }
    }
    return;
}

/**
 * GET запрос событий
 *
 * @returns {EventCardData[] | undefined}
 */
export async function getEvents(): Promise<EventCardData[]> {
    const {status, json} = await getFetch(API + ApiUrls.Events);
    if (status === 200) {
        if (json.status === 200) {
            return json.body.events as EventCardData[];
        }
    }
    return [];
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
            return json.message as string;
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
            return json.message as string;
        }
    }
    return;
}
