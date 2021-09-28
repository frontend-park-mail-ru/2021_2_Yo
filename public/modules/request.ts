import { EventCardData, UserData } from "../types.js";

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

async function fetchHandle (responsePromise: Promise<Response>) {
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
    let HTTPStatus: number;
    const res = await fetch(url, {
        method: METHODS.POST,
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        HTTPStatus = response.status;
        return response.json();
    }).then(data => {
        return {
            status: HTTPStatus,
            json: data,
        }
    });

    console.log('HTTP status:', res.status, '; json:', res.json);
    return res;
}

async function getFetch(url: string) {
    const responsePromise = fetch(url, {
        method: METHODS.GET,
        mode: 'cors',
        credentials: "include"
    });
    const res = await fetchHandle(responsePromise);

    // let HTTPStatus: number;
    // const res = await fetch(url, {
    //     method: METHODS.GET,
    //     mode: 'cors',
    //     credentials: "include"
    // }).then((response) => {
    //     HTTPStatus = response.status;
    //     return response.json();
    // }).then(data => {
    //     return {
    //         status: HTTPStatus,
    //         json: data,
    //     };
    // });

    console.log('HTTP status:', res.status, '; json:', res.json);
    return res;
}

export async function getUser(): Promise<UserData | undefined> {
    const {status, json} = await getFetch(API + '/user');
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

// export async function postLogin() {

// }
// const req = new Request()
//                 req.postFetch('https://yobmstu.herokuapp.com/signin', {email, password})
//                     .then(({status, parsedBody}) => {
//                         console.log(status, " ", parsedBody)
//                         if (status === 200) {
//                             if (parsedBody.error) {
//                                 const error = parsedBody.error;
//                                 errorsBlock.innerHTML += window.Handlebars.compile(`<p class='errorP'>` + error + `</p>`)();
//                             } else {
//                                 route(UrlPathnames.Main);
//                             }
//                         }
//                     }
//                 )