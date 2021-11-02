import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import EventFormView from '@event-create/view';
import EventFormModel from '@event-create/model';
import {eventValidateFields} from '@modules/validation';

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
        this.#view.render();
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
