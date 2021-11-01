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
        const queryParam = new URL(window.location.href).searchParams?.get('query');
        let query: undefined | string = undefined;
        if (queryParam) {
            query = queryParam;
        }
        const categoryParam = new URL(window.location.href).searchParams?.get('category');
        let category: undefined | number = undefined;
        if (categoryParam) {
            category = +categoryParam;
        }

        const tagsParam = new URL(window.location.href).searchParams?.get('tags');
        let tags = new Array<string>();
        if (tagsParam) {
            tags = tagsParam.split('+');
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
