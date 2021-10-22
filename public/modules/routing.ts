import { UrlPathnames } from '../types.js';
import Bus from './eventbus/eventbus.js';
import Events from './eventbus/events.js';

// Комменты для перехода на другую ветку, все выпилю обещаю
interface Controller {
    disable(): void;
    enable(): void;
}

class Router {
    #controllers: Map<UrlPathnames, Controller>;
    #path?: UrlPathnames;

    constructor() {
        this.#controllers = new Map<UrlPathnames, Controller>();

        window.onpopstate = () => {
            this.route();
        };
        window.addEventListener('click', this.#clickHandler);

        Bus.on(Events.RouteBack, this.#handleBack);
        Bus.on(Events.RouteUrl, this.#handleUrl);
    }

    #clickHandler = (e: MouseEvent) => {
        const target = e.target as EventTarget;
        if (target instanceof HTMLAnchorElement) {
            e.preventDefault();
            Bus.emit(Events.RouteUrl, target.href);
        }
    };

    #handleUrl = ((url: string) => {
        this.route(<UrlPathnames>url);
    }).bind(this);

    #handleBack = (() => {
        this.back();
    }).bind(this);

    add(path: UrlPathnames, controller: Controller) {
        this.#controllers.set(path, controller);
    }

    back() {
        if (window.history.length > 1) { 
            window.history.back();
        } else {
            this.route(UrlPathnames.Main);
        }
    }

    route(path?: UrlPathnames) {
        if (path) {
            window.history.pushState({}, '', path);
        }

        if (window.location.pathname == this.#path) return;

        if (this.#path) this.#controllers.get(this.#path)?.disable();
        
        this.#path = <UrlPathnames>window.location.pathname;
        if (!Object.values(UrlPathnames).includes(<UrlPathnames>window.location.pathname)) {
            this.#path = UrlPathnames.Error;
        }
        this.#controllers.get(this.#path)?.enable();
    }
}


export default new Router();
