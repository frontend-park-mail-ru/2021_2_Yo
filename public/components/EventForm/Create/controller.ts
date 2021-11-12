import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import EventFormView from '@event-create/view';
import EventFormModel from '@event-create/model';
import {eventValidateFields} from '@modules/validation';
import UserStore from '@modules/userstore';
import {UrlPathnames} from '@/types';

type MultipartData = {
    input: Map<string, { errors: string[], value: string }>;
    file?: File;
};

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

        if (UserStore.get()) {
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
        Bus.emit(Events.RouteUrl, UrlPathnames.Login);
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

    #validationHandle = (data: MultipartData) => {
        eventValidateFields(data.input, data.file);

        let valid = true;

        data.input.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            Bus.emit(Events.ValidationOk);
            this.#model.createEvent(data);
        } else {
            Bus.emit(Events.ValidationError);
        }
    };

}
