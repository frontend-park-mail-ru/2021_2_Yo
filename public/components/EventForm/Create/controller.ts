import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import EventFormView from './view.js';
import {EventData} from '../../../types.js';
import EventFormModel from './model.js';
import {eventValidateFields} from '../../../modules/validation.js';
import UserStore from "../../../modules/userstore.js";

export default class EventFormController {
    #view: EventFormView;
    #model: EventFormModel;

    constructor(parent: HTMLElement) {
        this.#view = new EventFormView(parent);
        this.#model = new EventFormModel();
    }

    enable() {
        Bus.on(Events.EventCreateReq, this.#validationHandle);
        this.#view.subscribe();
        if (UserStore.get()?.id) {
            this.#view.render();
        } else {
            this.#view.renderError();
        }
    }

    disable() {
        Bus.off(Events.EventCreateReq, this.#validationHandle);
        this.#view.disable();
    }

    #validationHandle = (inputsData: Map<string, { errors: string[], value: string }>) => {
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
            this.#model.createEvent(inputsData);
        } else {
            Bus.emit(Events.ValidationError, null);
        }
    };

}
