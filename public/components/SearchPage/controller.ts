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
        this.#view.render();
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
