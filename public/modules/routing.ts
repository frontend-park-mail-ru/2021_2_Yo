import { UrlPathnames } from '../types.js';
import { mainPage, signupPage, loginPage, errorPage } from './pageloaders.js';

export default async function route(path?: undefined | UrlPathnames) {
    if (path) {
        window.history.pushState({}, '', path);
    }
    switch (window.location.pathname) {
    case UrlPathnames.Main:
        await mainPage();
        break;
    case UrlPathnames.Login:
        loginPage();
        break;
    case UrlPathnames.Signup:
        signupPage();
        break;
    default:
        errorPage();
    }
}
