import { UserData } from "../types.js";

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

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

// export function getUser():UserData {
//     let user: Use
// }

