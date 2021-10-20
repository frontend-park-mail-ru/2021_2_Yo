import bus from '../../../modules/eventbus/eventbus.js';
import Events from '../../../modules/eventbus/events.js';
import {authValidateFields} from '../../../modules/validation.js';
import LoginView from './LoginView.js';
import LoginModel from './LoginModel.js';

export default class LoginController {
    #view: LoginView;
    #model: LoginModel;
    #parent = document.getElementById('App') as HTMLElement;

    constructor() {
        this.#model = new LoginModel();
        this.#view = new LoginView(this.#parent);
        this.#view.render();

        bus.on(Events.SubmitLogin, this.#makeValidation.bind(this));
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
            bus.emit(Events.ValidationOk, inputsData);
            void this.#model.login(inputsData);
        } else {
            bus.emit(Events.ValidationError, inputsData);
        }
    };
}
