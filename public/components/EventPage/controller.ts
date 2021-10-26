import EventPageView from './view.js';
import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import EventPageModel from './model.js';
import {EventData} from '../../types.js';

export default class EventPageController {
    #view: EventPageView;
    #model: EventPageModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventPageView(parent);
        this.#model = new EventPageModel();
    }

    enable(params?: URLSearchParams) {
        Bus.on(Events.EventRes, this.#eventHandle);
        this.#model.getEvent(params?.get('id') as string);
    }

    #eventHandle = ((event: EventData) => {
        this.#view.render(event);
    });

    disable() {
        Bus.off(Events.EventRes, this.#eventHandle);
        this.#view.disable();
    }
}
