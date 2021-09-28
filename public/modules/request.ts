import { ApiPostLoginData, ApiPostSignupData, ApiResponseJson, ApiUrls, EventCardData, FetchResponseData, UserData } from "../types.js";

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

const API = 'https://yobmstu.herokuapp.com';

async function handleFetch (responsePromise: Promise<Response>): Promise<FetchResponseData> {
    let HTTPStatus: number;
    return responsePromise.then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        const json = data as ApiResponseJson;
        return {
            status: HTTPStatus,
            json: json,
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

    console.log('HTTP status:', res.status, '; json:', res.json);
    return res;
}

async function getFetch(url: string) {
    const responsePromise = fetch(url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: "include"
    });
    const res = await handleFetch(responsePromise);

    console.log('HTTP status:', res.status, '; json:', res.json);
    return res;
}

export async function getUser(): Promise<UserData | undefined> {
    const {status, json} = await getFetch(API + ApiUrls.User);
    if (status === 200) {
        if (json.status === 200) {
            return {id: 1, name: json.body.name, geo: 'Мытищи'};
        }
    }
    return;
}

export async function getEvents(): Promise<EventCardData[]> {
    const {status, json} = await getFetch(API + ApiUrls.Events);
    if (status === 200) {
        if (json.status === 200) {
            return json.body.events as EventCardData[];
        }
    }
    return [];
}

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
