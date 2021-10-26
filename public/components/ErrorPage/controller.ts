import ErrorPageView from './view.js';

export default class ErrorPageController {
    #view: ErrorPageView;

    constructor(parent: HTMLElement) {
        this.#view = new ErrorPageView(parent);
    }

    enable() {
        this.#view.render();
    }

    disable() {
        this.#view.disable();
    }
}
