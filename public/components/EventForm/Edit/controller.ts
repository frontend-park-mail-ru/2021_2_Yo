import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import EventEditFormModel from './model.js';
import EventEditFormView from './view.js';
import {EventData} from '../../../types.js';
import {eventValidateFields} from '../../../modules/validation.js';
import UserStore from '../../../modules/userstore.js';

export default class EventEditFormController {
    #view: EventEditFormView;
    #model: EventEditFormModel;
    #userResSubscribe: boolean;

    constructor(parent: HTMLElement) {
        this.#view = new EventEditFormView(parent);
        this.#model = new EventEditFormModel();
        this.#userResSubscribe = false;
    }

    enable() {
        Bus.on(Events.EventEditReq, this.#editHandle);
        Bus.on(Events.EventRes, this.#eventHandle);
        Bus.on(Events.UserLogout, this.#userErrorRenderHandle);

        this.#view.subscribe();

        if (UserStore.get()) {
            const id = new URL(window.location.href).searchParams?.get('id') as string;
            this.#model.getEvent(id);
        } else {
            this.#userResSubscribe = true;
            Bus.on(Events.UserRes, this.#getEventHandle);
            Bus.on(Events.UserError, this.#userErrorRenderHandle);
        }
    }

    #getEventHandle = (() => {
        const id = new URL(window.location.href).searchParams?.get('id') as string;
        this.#model.getEvent(id);
    });

    #userErrorRenderHandle = (() => {
        this.#view.renderError();
    });

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
        if (UserStore.get()?.id === event.authorid) {
            this.#view.render(event);
        } else {
            this.#view.renderError();
        }
    };

    disable() {
        Bus.off(Events.EventEditReq, this.#editHandle);
        Bus.off(Events.EventRes, this.#eventHandle);
        Bus.off(Events.UserLogout, this.#userErrorRenderHandle);

        if (this.#userResSubscribe) {
            Bus.off(Events.UserRes, this.#getEventHandle);
            Bus.off(Events.UserError, this.#userErrorRenderHandle);
        }

        this.#view.disable();
    }
}
