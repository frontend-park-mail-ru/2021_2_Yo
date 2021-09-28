declare global {
    interface Window {
        Handlebars: any;
    }
}

export type EventCardData = {
    imgUrl: string;
    viewed: number;
    name: string;
    description: string;
}

export type UserData = {
    id: number;
    name: string;
    geo: string;
}

export enum PageKeys {
    Login = 'login',
    Signup = 'signup',
}

export enum UrlPathnames {
    Main = '/',
    Login = '/login',
    Signup = '/signup',
}

export enum ApiUrls {
    User = '/user',
    Events = '/events',
    Login = '/login',
    Signup = '/signup',
}

export type FetchResponseData = {
    status: number;
    json: ApiResponseJson;
}

export type ApiResponseJson = {
    status: number;
    message: string;
    body: any;
}

export type ApiPostLoginData = {
    email: string;
    password: string;
}

export type ApiPostSignupData = {
    name: string;
    surname: string;
    email: string;
    password: string;
}
