import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import {signupValidateFields} from '../../../modules/validation.js';
import SignupView from './SignupView.js';
import SignupModel from './SignupModel.js';

export default class LoginController {
    #view: SignupView;
    #model: SignupModel;
    #parent = document.getElementById('App') as HTMLElement;

    constructor() {
        this.#model = new SignupModel();
        this.#view = new SignupView(this.#parent);
        this.#view.render();

        bus.on(Events.SubmitLogin, this.#makeValidation.bind(this));
    }

    #makeValidation = (inputsData: Map<string, { errors: string[], value: string }>): void => {
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
            bus.emit(Events.ValidationOk, inputsData);
            void this.#model.signup(inputsData);
        } else {
            bus.emit(Events.ValidationError, inputsData);
        }
    };
}
