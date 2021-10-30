import Bus from '../../../modules/eventbus/eventbus';
import Events from '../../../modules/eventbus/events';
import EventEditFormModel from './model';
import EventEditFormView from './view';
import {EventData} from '../../../types';
import {eventValidateFields} from '../../../modules/validation';

export default class EventEditFormController {
    #view: EventEditFormView;
    #model: EventEditFormModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventEditFormView(parent);
        this.#model = new EventEditFormModel();
    }

    enable() {
        Bus.on(Events.EventEditReq, this.#editHandle);
        Bus.on(Events.EventRes, this.#eventHandle);

        this.#view.subscribe();

        const id = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getEvent(id);
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
            this.#model.editEvent(inputsData);
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
