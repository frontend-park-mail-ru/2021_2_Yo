import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import EventEditFormModel from './model.js';
import EventEditFormView from './view.js';
import {EventData} from '../../../types.js';
import {eventValidateFields} from '../../../modules/validation.js';

export default class EventEditFormController {
    #view: EventEditFormView;
    #model: EventEditFormModel;
    #eventId = '';

    constructor(parent: HTMLElement) {
        this.#view = new EventEditFormView(parent);
        this.#model = new EventEditFormModel();
    }

    enable(params?: URLSearchParams) {
        Bus.on(Events.EventEditReq, this.#editHandle);
        Bus.on(Events.EventRes, this.#eventHandle);
        this.#view.subscribe();
        this.#eventId = params?.get('id') as string;
        this.#model.getEvent(this.#eventId);
    }

    #editHandle = (inputsData: Map<string, { errors: string[], value: string }>) => {
        eventValidateFields(inputsData);

        let valid = true;

        inputsData.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            Bus.emit(Events.ValidationOk, null);
            this.#model.editEvent(inputsData, this.#eventId);
        } else {
            Bus.emit(Events.ValidationError, null);
        }
    };

    #eventHandle = (event: EventData) => {
        this.#view.render(event);
    };

    disable() {
        Bus.off(Events.EventEditReq, this.#editHandle);
        Bus.off(Events.EventRes, this.#eventHandle);
        this.#view.disable();
    }
}
