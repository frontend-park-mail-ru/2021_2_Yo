import MainPageController from '../components/MainPage/controller.js';
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

// Комменты для перехода на другую ветку, все выпилю обещаю
// interface Controller {
//     disable(): void;
// }

// class Router {
//     #path: string;
//     #controllers: Map<UrlPathnames, Controller>;

//     constructor(app: HTMLElement) {
//         this.#path = window.location.pathname;
//         this.#controllers = new Map<UrlPathnames, Controller>();

//         window.onpopstate = () => {
//             this.route();
//         };
//     }

//     route(path?: UrlPathnames) {
//         if (path) {
//             window.history.pushState({}, '', path);
//         }

//         if (window.location.pathname == this.#path) return;

//         this.#path = window.location.pathname;
//         switch (window.location.pathname) {
//         case UrlPathnames.Main:
//             this.#controller?.disable();
//             this.#controller = new MainPageController(this.#app);
//             // mainPage();
//             break;
//         case UrlPathnames.Login:
//             loginPage();
//             break;
//         case UrlPathnames.Signup:
//             signupPage();
//             break;
//         case UrlPathnames.Back:
//             window.history.back();
//             break;
//         default:
//             errorPage();
//         }
//     }
// }


// export default new Router();
