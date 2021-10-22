import Bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import {signupValidateFields} from '../../../modules/validation.js';
import SignupView from './SignupView.js';
import SignupModel from './SignupModel.js';

export default class SignupController {
    #view: SignupView;
    #model: SignupModel;

    constructor(parent: HTMLElement) {
        this.#model = new SignupModel();
        this.#view = new SignupView(parent);
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
        signupValidateFields(inputsData);

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
            this.#model.signup(inputsData);
        } else {
            Bus.emit(Events.ValidationError, null);
        }
    }
}
