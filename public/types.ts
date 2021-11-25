export type UserData = {
    id: string;
    imgUrl?: string;
    name: string;
    surname: string;
    description: string;
    email: string;
    geo: string;
}

export type EventData = {
    id?: number;
    imgUrl?: string;
    city: string;
    category: string;
    viewed?: number;
    title: string;
    description: string;
    tag: string[];
    text: string;
    date: string;
    geo: string;
    address: string;
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
    Search = '/search',
    Profile = '/user',
    Event = '/events',
    Create = '/create',
    Edit = '/edit',
}

export enum ApiUrls {
    User = '/user',
    Events = '/events',
    Cities = '/events/cities',
    Login = '/auth/login',
    Signup = '/auth/signup',
    Logout = '/auth/logout',
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

export type FilterData = {
    query?: string,
    category?: number,
    tags?: string[],
    // date?: string[],
    date?: string,
    // cities?: string[],
    city?: string,
}

export type InputData = {
    errors: string[],
    value: string | string[],
}
