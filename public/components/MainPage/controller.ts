import MainPageModel from './model.js';
import MainPageView from './view.js';

export default class MainPageController {
    #model: MainPageModel;
    #view: MainPageView;

    constructor() {
        this.#model = new MainPageModel();
        const app = document.getElementById('App') as HTMLElement;
        this.#view = new MainPageView(app);
        this.#view.render();
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
