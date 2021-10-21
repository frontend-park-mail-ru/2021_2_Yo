import MainPageModel from './model.js';
import MainPageView from './view.js';

export default class MainPageController {
    #model: MainPageModel;
    #view: MainPageView;

    constructor(parent: HTMLElement) {
        this.#model = new MainPageModel();
        this.#view = new MainPageView(parent);
    }

    enable() {
        this.#model.enable();
        this.#view.render();
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
