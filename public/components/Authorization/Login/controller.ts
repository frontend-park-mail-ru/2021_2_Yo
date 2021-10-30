import Bus from '../../../modules/eventbus/eventbus';
import Events from '../../../modules/eventbus/events';
import {authValidateFields} from '../../../modules/validation';
import LoginView from './view';
import LoginModel from './model';

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;

    constructor(parent: HTMLElement) {
        this.#model = new LoginModel();
        this.#view = new LoginView(parent);

    }

    enable() {
        Bus.on(Events.SubmitLogin, this.#validationHandle);
        this.#view.subscribe();
        this.#view.render();
    }

    disable() {
        Bus.off(Events.SubmitLogin, this.#validationHandle);
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
            Bus.emit(Events.ValidationOk, null);
            this.#model.login(inputsData);
        } else {
            Bus.emit(Events.ValidationError, null);
        }
    }
}
