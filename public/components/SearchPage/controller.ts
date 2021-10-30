import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import SearchPageModel from './model.js';
import SearchPageView from './view.js';

export default class SearchPageController {
    #view: SearchPageView;
    #model: SearchPageModel;

    constructor(parent: HTMLElement) {
        this.#model = new SearchPageModel();
        this.#view = new SearchPageView(parent);
    }

    #parseParams() {
        const q = new URL(window.location.href).searchParams?.get('q');
        let query: undefined | string = undefined;
        if (q) {
            query = q;
        }
        const c = new URL(window.location.href).searchParams?.get('c');
        let category: undefined | number = undefined;
        if (c) {
            category = +c;
        }

        const t = new URL(window.location.href).searchParams?.get('t');
        let tags = new Array<string>();
        if (t) {
            tags = t.split('|');
        } 

        return {category: category, tags: tags, query: query};
    }

    enable() {
        const data = this.#parseParams();
        this.#model.enable(data);
        this.#view.render();
        this.#view.filter(data);
        Bus.emit(Events.EventsReq);
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
