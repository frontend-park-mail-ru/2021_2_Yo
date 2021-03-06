import MainPageModel from '@main-page/model';
import MainPageView from '@main-page/view';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';

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
        Bus.emit(Events.EventsReq);
    }

    disable() {
        this.#view.disable();
        this.#model.disable();
    }
}
