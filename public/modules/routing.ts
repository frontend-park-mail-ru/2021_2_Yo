import {UrlPathnames} from '../types.js';
import Bus from './eventbus/eventbus.js';
import Events from './eventbus/events.js';

interface Controller {
    disable(): void;

    enable(params?: any): void;
}
type Controllers = {
    header?: Controller,
    content: Controller,
}

class Router {
    #controllers: Map<UrlPathnames, Controllers>;
    #path?: UrlPathnames;
    #params?: URLSearchParams;

    constructor() {
        this.#controllers = new Map<UrlPathnames, Controllers>();

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

    add(path: UrlPathnames, controllers: Controllers) {
        this.#controllers.set(path, controllers);
    }

    back() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.route(UrlPathnames.Main);
        }
    }

    #getValidPath(): UrlPathnames {
        if (Object.values(UrlPathnames).includes(<UrlPathnames>window.location.pathname)) {
            return <UrlPathnames>window.location.pathname;
        }
        return UrlPathnames.Error;
    }

    route(path?: UrlPathnames) {
        if (path) {
            window.history.pushState({}, '', path);
        }

        if (window.location.pathname == this.#path) return;

        this.#params = new URL(window.location.href).searchParams;

        const nextPath = this.#getValidPath();
        const nextControllers = <Controllers>this.#controllers.get(nextPath);

        if (!this.#path) {
            this.#path = nextPath;
            nextControllers.header?.enable();
            nextControllers.content.enable(this.#params);
            return;
        }

        const prevControllers = <Controllers>this.#controllers.get(this.#path);
        this.#path = nextPath;
        if (nextControllers.header !== prevControllers.header) {
            prevControllers.header?.disable();
            nextControllers.header?.enable();
        }
        prevControllers.content.disable();
        nextControllers.content.enable(this.#params);
    }
}


export default new Router();
