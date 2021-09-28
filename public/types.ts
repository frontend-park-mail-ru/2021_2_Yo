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
}
