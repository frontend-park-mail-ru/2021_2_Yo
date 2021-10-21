import MainPageController from '../components/MainPage/controller.js';
import { UrlPathnames } from '../types.js';

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

// Комменты для перехода на другую ветку, все выпилю обещаю
interface Controller {
    disable(): void;
    enable(): void;
}

// const app = <HTMLElement>document.getElementById('App');
// const m: Controller = new MainPageController(app);

class Router {
    #path: UrlPathnames;
    #controllers: Map<UrlPathnames, Controller>;

    constructor() {
        this.#path = UrlPathnames.Main;
        this.#controllers = new Map<UrlPathnames, Controller>();

        window.onpopstate = () => {
            this.route();
        };
    }

    add(path: UrlPathnames, controller: Controller) {
        this.#controllers.set(path, controller);
    }

    back() {
        window.history.back();
    }

    route(path?: UrlPathnames) {
        if (path) {
            window.history.pushState({}, '', path);
        }

        if (window.location.pathname == this.#path) return;

        this.#controllers.get(this.#path)?.disable();
        this.#path = <UrlPathnames>window.location.pathname;
        if (!Object.values(UrlPathnames).includes(<UrlPathnames>window.location.pathname)) {
            this.#path = UrlPathnames.Error;
        }
        this.#controllers.get(this.#path)?.enable();
        // switch (window.location.pathname) {
        // case UrlPathnames.Main:
        //     this.#controller?.disable();
        //     this.#controller = new MainPageController(this.#app);
        //     // mainPage();
        //     break;
        // case UrlPathnames.Login:
        //     loginPage();
        //     break;
        // case UrlPathnames.Signup:
        //     signupPage();
        //     break;
        // default:
        //     errorPage();
        // }
    }
}


export default new Router();
