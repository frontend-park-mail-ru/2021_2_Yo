import {response} from "express";

const METHODS = {
    POST: 'POST',
    GET: 'GET',
};

export class Request {
    Get(args: object) {
        return this.#request({method: METHODS.GET, ...args});
    }

    Post(args: object) {
        return this.#request({method: METHODS.POST, ...args});
    }

    #request({
                 method = METHODS.GET, url = '/', body = {}, callback = (res: Response) => {
            // empty
        }
             }) {
        if (method === METHODS.GET) {
            fetch(url).then(res =>
                callback(res)
            )
        } else {
            fetch(url, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            }).then(res =>
                callback(res)
            )
        }
    }
}


