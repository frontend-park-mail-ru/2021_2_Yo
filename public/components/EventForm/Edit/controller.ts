import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import EventEditFormModel from './model.js';
import EventEditFormView from './view.js';
import {EventData} from '../../../types.js';

export default class EventEditFormController {
    #view: EventEditFormView;
    #model: EventEditFormModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventEditFormView(parent);
        this.#model = new EventEditFormModel();
    }

    enable(params?: URLSearchParams) {
        Bus.on(Events.EventEditReq, this.#editHandle);
        Bus.on(Events.EventRes, this.#eventHandle)
        this.#model.getEvent(params?.get('id') as string);
    }

    #editHandle = (event: EventData) => {
        this.#model.editEvent(event);
    };

    #eventHandle = (event: EventData) => {
        this.#view.render(event);
    }

    disable() {
        this.#view.disable();
    }
}
