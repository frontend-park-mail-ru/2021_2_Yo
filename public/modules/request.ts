import { ApiPostLoginData, ApiPostSignupData, ApiUrls, EventCardData, UserData } from "../types.js";

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

const API = 'https://yobmstu.herokuapp.com';

async function handleFetch (responsePromise: Promise<Response>) {
    let HTTPStatus: number;
    return responsePromise.then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        return {
            status: HTTPStatus,
            json: data,
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
    return undefined;
}

export async function getEvents(): Promise<EventCardData[]> {
    const {status, json} = await getFetch(API + '/events');
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
        if (json['status'] === 200) {
            return undefined;
        } else {
            return json['message'] as string;
        }
    }
    return undefined; 
}

export async function postSignup(postData: ApiPostSignupData): Promise<undefined | string> {
    const {status, json} = await postFetch(API + ApiUrls.Signup, postData);
    if (status === 200) {
        if (json['status'] === 200) {
            return undefined;
        } else {
            return json['message'] as string;
        }
    }
    return undefined; 
}