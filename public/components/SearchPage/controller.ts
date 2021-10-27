import SearchPageView from './view.js';

export default class SearchPageController {
    #view: SearchPageView;

    constructor(parent: HTMLElement) {
        this.#view = new SearchPageView(parent);
    }

    enable() {
        this.#view.render();
    }

    disable() {
        this.#view.disable();
    }
}
