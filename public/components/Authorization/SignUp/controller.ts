import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { signupValidateFields } from '@modules/validation';
import SignupView from '@signup/view';
import SignupModel from '@signup/model';

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

    #validationHandle = (inputsData: Map<string, { errors: string[], value: string }>) => {
        this.#makeValidation(inputsData);
    };

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
