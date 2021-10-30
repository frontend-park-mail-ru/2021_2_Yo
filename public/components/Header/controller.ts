import Bus from '../../modules/eventbus/eventbus';
import Events from '../../modules/eventbus/events';
import HeaderModel from './model';
import HeaderView from './view';

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
        Bus.emit(Events.UserReq);
    }

    disable() {
        this.#model.disable();
        this.#view.disable();
    }
}
