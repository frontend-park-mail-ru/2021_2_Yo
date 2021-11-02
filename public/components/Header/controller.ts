import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import HeaderModel from '@header/model';
import HeaderView from '@header/view';

export default class HeaderController {
    #model: HeaderModel;
    #view: HeaderView;

    constructor(parent: HTMLElement) {
        this.#model = new HeaderModel();
        this.#view = new HeaderView(parent);
    }

    enable() {
        this.#model.enable();
        this.#view.subscribe();
        this.#view.render();
        Bus.emit(Events.UserReq);
    }

    disable() {
        this.#model.disable();
        this.#view.disable();
    }
}
