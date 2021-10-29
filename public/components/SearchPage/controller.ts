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

    enable() {
        this.#model.enable();
        const c = new URL(window.location.href).searchParams?.get('c');
        let category: undefined | number = undefined;
        if (c) {
            category = +c;
        }
        const t = new URL(window.location.href).searchParams?.get('t');
        let tags: undefined | Array<string> = undefined;
        if (t) {
            tags = t.split('|');
        } else {
            tags = new Array<string>();
        }
        this.#view.render();
        const data = {category: category, tags: tags};
        this.#view.filter(data);
        Bus.emit(Events.EventsReq, data);
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
