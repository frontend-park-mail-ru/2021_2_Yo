import MainPageController from '../components/MainPage/controller.js';
import { UrlPathnames } from '../types.js';
import { signupPage, loginPage, errorPage } from './pageloaders.js';

// export default function route(path?: undefined | UrlPathnames) {
//     if (path) {
//         window.history.pushState({}, '', path);
//     }
//     switch (window.location.pathname) {
//     case UrlPathnames.Main:
//         mainPage();
//         break;
//     case UrlPathnames.Login:
//         loginPage();
//         break;
//     case UrlPathnames.Signup:
//         signupPage();
//         break;
//     default:
//         errorPage();
//     }
// }

interface Controller {
    disable(): void;
}

class Router {
    #app: HTMLElement;
    #path: string;
    #controller?: Controller;

    constructor(app: HTMLElement) {
        this.#app = app; 
        this.#path = UrlPathnames.Main;

        window.onpopstate = () => {
            this.route();
        };
    }

    route(path?: UrlPathnames) {
        if (path) {
            window.history.pushState({}, '', path);
        }

        if (window.location.pathname == this.#path) return;

        this.#path = window.location.pathname;
        switch (window.location.pathname) {
        case UrlPathnames.Main:
            this.#controller?.disable();
            this.#controller = new MainPageController(this.#app);
            // mainPage();
            break;
        case UrlPathnames.Login:
            loginPage();
            break;
        case UrlPathnames.Signup:
            signupPage();
            break;
        case UrlPathnames.Back:
            window.history.back();
            break;
        default:
            errorPage();
        }
    }
}

const app = document.getElementById('App') as HTMLElement;
export default new Router(app);
