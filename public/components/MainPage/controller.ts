import { parseParams } from '@/modules/filter';
import MainPageModel from '@main-page/model';
import MainPageView from '@main-page/view';

export default class MainPageController {
    #model: MainPageModel;
    #view: MainPageView;

    constructor(parent: HTMLElement) {
        this.#model = new MainPageModel();
        this.#view = new MainPageView(parent);
    }

    enable() {
        this.#model.enable();
        const params = parseParams();
        this.#view.render(params);
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
