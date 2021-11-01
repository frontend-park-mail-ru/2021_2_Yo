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
    id: string;
    name: string;
    surname: string;
    description: string;
    email: string;
    geo: string;
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
    authorid: string;
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
    Profile = '/user',
    Event = '/events',
    Create = '/create',
    Edit = '/edit',
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
    headers?: Headers;
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
