declare global {
    interface Window {
        Handlebars: any;
    }
}

export type EventData = {
    id?: number;
    city: string;
    category: string;
    viewed?: number;
    title: string;
    description: string;
    tag: string[];
    text: string;
    date: string;
    geo: string;
}

export type EventCardData = {
    imgUrl: string;
    viewed: number;
    name: string;
    description: string;
}

export type UserData = {
    name: string;
    geo: string;
}

export enum PageKeys {
    Login = 'login',
    Signup = 'signup',
}

export enum UrlPathnames {
    Error = '/error',
    Main = '/',
    Login = '/login',
    Signup = '/signup',
    Search = '/search',
}

export enum ApiUrls {
    User = '/user',
    Events = '/events',
    Login = '/login',
    Signup = '/signup',
    Logout = '/logout',
}

export type FetchResponseData = {
    status: number;
    json: ApiResponseJson;
}

export type ApiResponseJson = {
    status: number;
    message: string;
    body?: any;
    // error?: string;
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
