import { stat } from "fs";
import { UserData } from "../types.js";

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

const API = 'https://yobmstu.herokuapp.com';

export class Request {
    getFetch(url: string) {
        let statusCode: number;

        return fetch(url, {
            method: METHODS.GET,
            mode: 'cors',
            credentials: "include"
        }).then((response) => {
            statusCode = response.status;
            return response.json();
        }).then((parsedBody) => {
            return {
                status: statusCode,
                parsedBody
            };
        }).catch((error) => {
            return error
        })
    }

    postFetch(url: string, body: {}) {
        let statusCode: number;

        return fetch(url, {
            method: METHODS.POST,
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            statusCode = response.status;
            return response.json();
        }).then((parsedBody) => {
            return {
                status: statusCode,
                parsedBody
            };
        }).catch((error) => {
            return error
        })
    }
}

async function getFetch(url: string) {
        let HTTPStatus: number;

        const res = await fetch(url, {
            method: METHODS.GET,
            mode: 'cors',
            credentials: "include"
        }).then((response) => {
            HTTPStatus = response.status;
            return response.json();
        }).then(data => {
            return {
                status: HTTPStatus,
                body: data,
            };
        });

        console.log('HTTP status: ', res.status, '; json: ', res.body);
        return res;
    }

export async function getUser(): Promise<UserData | undefined> {
    const {status, body} = await getFetch(API + '/user');
    if (status === 200) {
        if (body.status === 200) {
            return {id: 1, name: body['name'], geo: 'Мытищи'};
        }
    }
    return undefined;
}

