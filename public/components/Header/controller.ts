import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import HeaderModel from './model.js';
import HeaderView from './view.js';

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
