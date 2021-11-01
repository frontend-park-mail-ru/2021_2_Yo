import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import EventFormView from './view.js';
import {EventData} from '../../../types.js';
import EventFormModel from './model.js';
import {eventValidateFields} from '../../../modules/validation.js';
import UserStore from '../../../modules/userstore.js';

export default class EventFormController {
    #view: EventFormView;
    #model: EventFormModel;
    #userResSubscribe: boolean;

    constructor(parent: HTMLElement) {
        this.#view = new EventFormView(parent);
        this.#model = new EventFormModel();
        this.#userResSubscribe = false;
    }

    enable() {
        Bus.on(Events.EventCreateReq, this.#validationHandle);
        Bus.on(Events.UserLogout, this.#userErrorRenderHandle);

        this.#view.subscribe();

        const storedUser = UserStore.get();
        if (storedUser) {
            this.#view.render();
        } else {
            this.#userResSubscribe = true;
            Bus.on(Events.UserRes, this.#renderHandle);
            Bus.on(Events.UserError, this.#userErrorRenderHandle);
        }
    }

    #renderHandle = (() => {
        this.#view.render();
    });

    #userErrorRenderHandle = (() => {
        this.#view.renderError();
    });

    disable() {
        Bus.off(Events.EventCreateReq, this.#validationHandle);
        Bus.off(Events.UserLogout, this.#userErrorRenderHandle);

        if (this.#userResSubscribe) {
            Bus.off(Events.UserRes, this.#renderHandle);
            Bus.off(Events.UserError, this.#userErrorRenderHandle);
        }
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
