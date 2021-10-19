import { UrlPathnames } from '../types.js';
import { mainPage, signupPage, loginPage, errorPage } from './pageloaders.js';

export default function route(path?: undefined | UrlPathnames) {
    if (path) {
        window.history.pushState({}, '', path);
    }
    switch (window.location.pathname) {
    case UrlPathnames.Main:
        mainPage();
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
