import ErrorPageView from './view';

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
