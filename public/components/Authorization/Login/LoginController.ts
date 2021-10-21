import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import {authValidateFields} from '../../../modules/validation.js';
import LoginView from './LoginView.js';
import LoginModel from './LoginModel.js';

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;

    constructor(parent: HTMLElement) {
        this.#model = new LoginModel();
        this.#view = new LoginView(parent);

        bus.on(Events.SubmitLogin, this.#validationHandle);
    }

    enable() {
        this.#view.render();
    }

    disable() {
        this.#view.disable();
    }

    #validationHandle = ((inputsData: Map<string, { errors: string[], value: string }>) => {
        this.#makeValidation(inputsData);
    }).bind(this);


    #makeValidation(inputsData: Map<string, { errors: string[], value: string }>) {
        authValidateFields(inputsData);

        let valid = true;

        inputsData.forEach((item) => {
            item.errors.forEach(error => {
                if (error) {
                    valid = false;
                }
            });
        });

        if (valid) {
            bus.emit(Events.ValidationOk, null);
            this.#model.login(inputsData);
        } else {
            bus.emit(Events.ValidationError, null);
        }
    }
}
