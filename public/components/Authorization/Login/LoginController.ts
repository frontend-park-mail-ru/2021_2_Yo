import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import {authValidateFields} from '../../../modules/validation.js';
import LoginView from './LoginView.js';
import LoginModel from './LoginModel.js';

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;

    constructor() {
        bus.on(Events.SubmitLogin, this.#makeValidation.bind(this));
        this.#view = new LoginView(document.getElementById('App') as HTMLElement);
        this.#view.render();
        this.#model = new LoginModel();
    }

    #makeValidation = (inputsData: Map<string, { errors: string[], value: string }>): void => {
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
            void this.#model.login(inputsData);
        } else {
            bus.emit(Events.ValidationError, inputsData);
        }
    };
}
