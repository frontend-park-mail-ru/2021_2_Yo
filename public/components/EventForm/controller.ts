import Bus from '../../modules/eventbus/eventbus.js';
import Events from '../../modules/eventbus/events.js';
import EventFormView from './view.js';
import {EventData} from '../../types.js';
import EventFormModel from './model.js';

export default class EventFormController {
    #view: EventFormView;
    #model: EventFormModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventFormView(parent);
        this.#model = new EventFormModel();
    }

    enable() {
        Bus.on(Events.EventCreate, this.#eventHandle);
        Bus.on(Events.EventEditReq, this.#eventEditHandle);
        this.#view.render();
    }

    disable() {
        Bus.off(Events.EventCreate, this.#eventHandle);
        this.#view.disable();
    }

    #eventHandle = ((event: EventData) => {
        this.#model.createEvent(event);
    });

    #eventEditHandle = ((event: EventData) => {
        this.#view.render(event);
    });
}
